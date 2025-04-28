let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
let userName = JSON.parse(sessionStorage.getItem('currentUser')).name;
let numOfWins = parseInt(currentUser.numOfWins);
let numOfGame = parseInt(currentUser.numOfGame);
let timer = (currentUser.timer);
let sound = true;
document.querySelector('.name-label').innerHTML = `Name: <br>${userName}`;
document.querySelector('.num-of-game-label').innerHTML = `Number Of Games Played: <br>${numOfGame}`;
document.querySelector('.num-of-win-label').innerHTML = `Number Of Games Won: <br>${numOfWins}`;
if (timer == "0") {
    document.querySelector('.short-time-label').innerHTML = `Shortest Game Time: <br>${"00:00"}`;
} else {
    document.querySelector('.short-time-label').innerHTML = `Shortest Game Time: <br>${timer}`;
}

let turns = ['red', 'blue', 'green', 'purple'];
let coloredRings = [[["brown", "brown", "brown"], ["brown", "brown", "brown"], ["brown", "brown", "brown"]], [["brown", "brown", "brown"], ["brown", "brown", "brown"], ["brown", "brown", "brown"]], [["brown", "brown", "brown"], ["brown", "brown", "brown"], ["brown", "brown", "brown"]]]
let victory;
let profile = false;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
let numPlayers = JSON.parse(sessionStorage.getItem('numPlayers')) + 1;
let i = 0, numRing = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], myTurn = true;
var totalSeconds = 0;
let winner = 0;
//initiates all eventlisteners.
function init() {
    let allLarge = document.querySelectorAll('.large');
    let allMedium = document.querySelectorAll('.medium');
    let allSmall = document.querySelectorAll('.small');
    for (let i = 0; i < allLarge.length; i++) {
        allLarge[i].addEventListener('click', changeColorOnClick);
        allMedium[i].addEventListener('click', changeColorOnClick);
        allSmall[i].addEventListener('click', changeColorOnClick);
    }
    document.getElementById('new-game').addEventListener('click', newGame);
    document.querySelector('.fa-volume-xmark').addEventListener('click', noSound)
}

function openModal() {

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
function numberOfPlayers(numPlayers) {
    incrementGamesPlayed();

    if (numPlayers == 2) {
        turns = ['red', 'blue'];
        createOtrioBoard(numPlayers);
    } else if (numPlayers == 3) {
        turns = ['red', 'blue', 'green'];
        createOtrioBoard(numPlayers);
    } else if (numPlayers == 4) {
        turns = ['red', 'blue', 'green', 'purple'];
        createOtrioBoard(numPlayers);
    }
}

function createRing(type, size, i, j) {
    const ring = document.createElement("div");
    ring.classList.add(type, type + 'i' + i, type + 'j' + j);
    return ring;
}

function createOtrioGridDiv(i) {
    const gridDiv = document.createElement("div");
    gridDiv.classList.add('container' + i);
    return gridDiv;
}

function createOtrioBoard(num) {
    const boardDiv = document.getElementById('game-board');
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const gridDiv = createOtrioGridDiv(i);

            const largeRing = createRing('large', 'large', i, j);
            const mediumRing = createRing('medium', 'medium', i, j);
            const smallRing = createRing('small', 'small', i, j);

            mediumRing.appendChild(smallRing);
            largeRing.appendChild(mediumRing);
            gridDiv.appendChild(largeRing);
            boardDiv.appendChild(gridDiv);

            const isNotPart = (i == 0 && (j == 0 || j == 4) || i == 4 && (j == 0 || j == 4) ||
                (i == 0 && (num == 3 || num == 2)) || (i == 4 && num == 2));

            if (isNotPart) {
                largeRing.classList.add('not-part');
                smallRing.classList.add('not-part');
                mediumRing.classList.add('not-part');
            }
        }
    }
}
//sends to the function that changes the color of the rings.
function changeColorOnClick(e) {
    if (e.target !== this) {
        return false;
    }
    changeColor(this);
}
//finds the size of the ring clicked and returns a string.
function findSizeString(el) {
    if (el.classList.contains('large')) {
        return 'large';
    }
    else if (el.classList.contains('medium')) {
        return 'medium';
    }
    else if (el.classList.contains('small')) {
        return 'small';
    }
}
//finds the size of the ring clicked and returns an int.
function findSizeInt(size) {
    let sizeString = ['large', 'medium', 'small'];
    return sizeString.indexOf(size);
}
//adds the color clicked to the matrix, chages the color of the players ring to brown.
function addClassColor(i, size, sizering, rowColumn) {
    let rings;
    let place = (i == 0) ? 'j4' : (i == 1) ? 'j0' : (i == 2) ? 'i4' : 'i0';
    rings = document.querySelectorAll('.' + size + place);
    rings[numRing[i][sizering]].classList.add('brown');
    numRing[i][sizering]++;
    coloredRings[parseInt(rowColumn[0]) - 1][parseInt(rowColumn[1]) - 1][sizering] = turns[i];

}
//check if the place clicked is invalid.
function checkIfNotToClick(el) {
    if (myTurn === false) {
        return true;
    }
    else if (el.classList.contains('red') || el.classList.contains('green') || el.classList.contains('blue') || el.classList.contains('purple')) {
        return true;
    }
    else if (el.classList.contains('largei0') || el.classList.contains('largei4') || el.classList.contains('largej0') || el.classList.contains('largej4')) {
        return true;
    }
    else if (el.classList.contains('mediumi0') || el.classList.contains('mediumi4') || el.classList.contains('mediumj0') || el.classList.contains('mediumj4')) {
        return true;
    }
    else if (el.classList.contains('smalli0') || el.classList.contains('smalli4') || el.classList.contains('smallj0') || el.classList.contains('smallj4')) {
        return true;
    }

}
//changes the color of the ring to the players color and checks if there is a posible win.
function changeColor(el) {
    if (checkIfNotToClick(el)) {
        return 0;
    }
    let size, sizering = 3;
    size = findSizeString(el);
    sizering = findSizeInt(size);
    if (numRing[i][sizering] > 3) {
        return;
    }
    el.classList.add(turns[i]);
    let rowColumn = [];
    rowColumn = findRowAndColumn(size, el);
    addClassColor(i, size, sizering, rowColumn);
    i++;
    if (i == numPlayers) {
        i = 0;
    }
    let didWin = checkForVictory(coloredRings);
    if (didWin == true) {
        alertfunction(victory);
    }
    if (i === 1) {
        myTurn = false;
        setTimeout(computerTurn, 1000);
    }
}
//finds the row a colmn of the ring clicked.
function findRowAndColumn(size, theDiv) {
    for (let row = 1; row <= 3; row++) {
        if (theDiv.classList.contains(size + 'i' + row)) {
            for (let column = 1; column <= 3; column++) {
                if (theDiv.classList.contains(size + 'j' + column)) {
                    return [row, column];
                }
            }
        }
    }

}
//checks if the is a posible win.
function checkForVictory(matrix) {
    if (checkDiagonal(matrix)) {
        return true;
    }
    else if (checkCircle(matrix)) {
        return true;
    }
    else if (checkColumn(matrix)) {
        return true;
    }
    else if (checkRow(matrix)) {
        return true;
    }
    else if (checkColumnsBMS(matrix)) {
        return true;
    }
    else if (checkRegularDiagonal(matrix)) {
        return true;
    }
    else if (checkRowsBMS(matrix)) {
        return true;
    }
    else if (noWinner()) {
        return true;
    }
}
//checks if all pieces where use without a win.
function noWinner() {
    if (numRing[1][0] == 3 && numRing[1][1] == 3 && numRing[1][2] == 3) {
        victory = 'blue';
        return true;
    }
}
//checks the diagonaly placed rings all big, all small , or all medium.
function checkRegularDiagonal(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let q = 0; q < 2; q++) {
            if
                (matrix[0][(q == 0) ? 0 : 2][i] === matrix[1][1][i] && matrix[1][1][i] === matrix[2][(q == 0) ? 2 : 0][i] && matrix[1][1][i] !== 'brown') {
                victory = matrix[1][1][i];
                return true;
            }
        }

    }
}
// check the rings placed in a row -big medium small.
function checkRowsBMS(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let q = 0; q < 2; q++) {
            if (matrix[i][0][(q == 0) ? 0 : 2] === matrix[i][1][1] && matrix[i][1][1] === matrix[i][2][(q == 0) ? 2 : 0] && matrix[i][1][1] !== 'brown') {
                victory = matrix[i][1][1];

                return true;
            }
        }

    }
}
// check the rings placed in a column -big medium small.
function checkColumnsBMS(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let q = 0; q < 2; q++) {
            if (matrix[0][i][(q == 0) ? 0 : 2] === matrix[1][i][1] && matrix[1][i][1] === matrix[2][i][(q == 0) ? 2 : 0] && matrix[1][i][1] !== 'brown') {
                victory = matrix[1][i][1];

                return true;
            }
        }

    }
}
// check the rings placed in a diagonal -big medium small.
function checkDiagonal(matrix) {
    for (let j = 0, x = 2; j < 3; j = j + 2, x = x - 2) {
        for (let i = 0, k = 2; i < 3; i = i + 2, k = k - 2) {
            if (matrix[0][j][i] === matrix[1][1][1] && matrix[1][1][1] === matrix[2][x][k] && matrix[0][j][i] !== 'brown') {
                victory = matrix[0][j][i];
                return true;
            }
        }
    }
}
//checks the rows for a win - all big all small or all medium.
function checkRow(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (
                (matrix[j][0][i] === matrix[j][1][i] && matrix[j][1][i] === matrix[j][2][i] && matrix[j][0][i] !== 'brown')) {
                victory = matrix[j][1][i];
                return true;
            }
        }
    }
}
//checks the columns for a win - all big all small or all medium.
function checkColumn(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (
                (matrix[0][j][i] === matrix[1][j][i] && matrix[1][j][i] === matrix[2][j][i] && matrix[0][j][i] !== 'brown')) {
                victory = matrix[0][j][i];
                return true;
            }
        }
    }
}
//checks if the is a win -big medium , small one inside the other.
function checkCircle(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (
                (matrix[j][i][0] === matrix[j][i][1] && matrix[j][i][1] === matrix[j][i][2] && matrix[j][i][0] !== 'brown')) {
                victory = matrix[j][i][0];
                return true;
            }
        }
    }

}
//if teh is a win it declares so.
function alertfunction(victory) {
    if (victory === 'red' && winner == 0) {
        winner++;
        incrementWins();
        updateMinTime(totalSeconds);
        setCurrentUser(currentUser);
        return;
    }
    if (victory === 'red') {
        document.querySelector('.winner-name').innerHTML = `${JSON.parse(sessionStorage.getItem('currentUser')).name} won the game!!`;
        var audio = new Audio('../audio/claps-44774.mp3');
    }
    else if (victory === "blue") {
        document.querySelector('.winner-name').innerHTML = 'Fail :(';
        var audio = new Audio('../audio/lose-audio.mp3');
    }
    else {
        document.querySelector('.winner-name').innerHTML = 'A guest won :(';
        var audio = new Audio('../audio/lose-audio.mp3');
    }
    document.querySelector('.win-gif').classList.remove('hide');
    if (sound == true) {
        audio.play();
    }
}

function noSound() {
    sound = false;
}

//checks what size ring the coputer chose.
function computerChoice(size) {
    if (size == 0) {
        return 'large';
    }
    if (size == 1) {
        return 'medium';
    }
    if (size == 2) {
        return 'small';
    }
}
// the computer playes its turn.
function computerTurn() {
    //checks if can win 

    let win = checkIfCanWin(turns[i]);
    if (win != false && numRing[1][win[2]] <= 3) {

        {
            let stringSize = computerChoice(win[2]);
            let divClick = document.querySelector(`.${stringSize}.${stringSize}i${win[0] + 1}.${stringSize}j${win[1] + 1}`);
            myTurn = true;
            changeColor(divClick);
        }
        return;
    }
    //checks if other color can win. if so places a ring to block its opponent.
    else {
        let color = i + 1;
        let otherColorCanWin = [];
        for (let q = 0; q < 3; q++) {
            if (color > 3) {
                color = 0;
            }
            otherColorCanWin = checkIfCanWin(turns[color]);
            if (otherColorCanWin != false && numRing[1][otherColorCanWin[2] <= 3]) {
                break;
            }
            color++;
        }
        if (otherColorCanWin != false) {
            let stringSize = computerChoice(otherColorCanWin[2]);
            let divClick = document.querySelector(`.${stringSize}.${stringSize}i${otherColorCanWin[0] + 1}.${stringSize}j${otherColorCanWin[1] + 1}`);
            myTurn = true;
            changeColor(divClick);
            return;
        }
    }
    //if no player can win the computer places its ring in the next spot avilable.
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            for (let size = 0; size < 3; size++) {
                if (coloredRings[row][col][size] === 'brown') {
                    let stringSize = computerChoice(size);
                    let divClick = document.querySelector(`.${stringSize}.${stringSize}i${row + 1}.${stringSize}j${col + 1}`);
                    myTurn = true;
                    changeColor(divClick);
                    return;
                }
            }
        }
    }

}
//checks if there is a posible win by the color recived.
function checkIfCanWin(color) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            for (let size = 0; size < 3; size++) {
                if (coloredRings[row][col][size] === 'brown') {
                    coloredRings[row][col][size] = color;
                    let win = checkForVictory(coloredRings);
                    if (win === true) {
                        let where = [row, col, size];
                        coloredRings[row][col][size] = 'brown';
                        return where;
                    }
                    coloredRings[row][col][size] = 'brown';

                }
            }
        }
    }
    return false;
}
//sets the time on the screen.
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
//adds a 0 if the number is a one digit number.
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
//when new game is clicked the page reloads.
function newGame() {
    location.reload();
}

// פונקציה של מספר ניצחונות
function incrementWins() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    currentUser.numOfWins += 1;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.querySelector('.num-of-win-label').innerHTML = `Number Of Games Won: <br>${currentUser.numOfWins}`;
}
// פונקציה לעדכון של זמן מינימלי
function updateMinTime(totalSeconds) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    timer = convertTimeToSeconds(timer);
    if (timer) {
        if (totalSeconds < timer) {
            currentUser.timer = formatSecondsToTime(totalSeconds);
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.querySelector('.short-time-label').innerHTML = `Shortest Game Time: <br>${currentUser.timer}`;
        }
    } else {
        currentUser.timer = formatSecondsToTime(totalSeconds);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.querySelector('.short-time-label').innerHTML = `Shortest Game Time: <br>${currentUser.timer}`;
    }
}
// פונקציה של מספר משחקים
function incrementGamesPlayed() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    currentUser.numOfGame += 1;

    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.querySelector('.num-of-game-label').innerHTML = `Number Of Games Played: <br>${currentUser.numOfGame}`;
}
// פונקציה שהופכת שניות לשעון
function formatSecondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
// פונקציה שהופכת שעון לשניות
function convertTimeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    if (((minutes * 60) + seconds)) {
        return ((minutes * 60) + seconds)
    }
    return 0;
}
// פונקציה שמכניסה את המערך ללוקל
function setCurrentUser() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem("users"));
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === currentUser.email && users[i].password === currentUser.password) {
            users[i].numOfWins = currentUser.numOfWins;
            users[i].timer = currentUser.timer;
            users[i].numOfGame = currentUser.numOfGame;
            localStorage.setItem('users', JSON.stringify(users));
            return;
        }
    }
}

setInterval(setTime, 1000);
openModal();
numberOfPlayers(numPlayers);
init();