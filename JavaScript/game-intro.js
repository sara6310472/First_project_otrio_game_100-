let numPlayers;
let buttonOne = document.getElementById('one');
let buttonTwo = document.getElementById('two');
let buttonThree = document.getElementById('three');

let FourPlayers = document.querySelector('.Four-Players');
let ThreePlayers = document.querySelector('.Three-Players');
function init() {
    buttonOne.addEventListener('click', function () { instructionPopUp(buttonOne); });
    buttonTwo.addEventListener('click', function () { instructionPopUp(buttonTwo); });
    buttonThree.addEventListener('click', function () { instructionPopUp(buttonThree); });
}
// להוסיף זמן שרואים את הערה
function instructionPopUp(button) {
    if (button.id === 'one') {
        numPlayers = 1;
    } else if (button.id === 'two') {
        ThreePlayers.style.display = "block";
        numPlayers = 2;
    } else if (button.id === 'three') {
        FourPlayers.style.display = "block";
        numPlayers = 3;
    }
    sessionStorage.setItem('numPlayers', numPlayers);
    setTimeout( setGame,1000);
    // location.assign("../html/otrio-game.html");
}
function setGame()
{ location.assign("../html/otrio-game.html");

}

init();