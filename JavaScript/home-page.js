let modal = document.getElementById("myModal");

let btn1 = document.getElementById("card-button-1") || 0;
let btn3 = document.getElementById("card-button-3") || 0;
let btn4 = document.getElementById("card-button-4") || 0;
let btn;

let span = document.getElementsByClassName("close")[0];

let CreateAcount = document.querySelector(".Create-acount").addEventListener('click', openformsignin);
let login = document.querySelector(".login").addEventListener('click', openformlogin);
let playnow = document.querySelector("#card-button-2").addEventListener('click', opengame);

let user = document.getElementById('hello');
//starts the page.
function openModal() {
    if (btn1) {
        btn1.onclick = function () {
            modal.style.display = "block";
        };
    }

    if (btn3) {
        btn3.onclick = function () {
            modal.style.display = "block";
        };
    }

    if (btn4) {
        btn4.onclick = function () {
            modal.style.display = "block";
        };
    }

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
//opens create account form.
function openformsignin() {
    sessionStorage.setItem('activeButton', 'signin');
    location.assign("../html/registration-form.html");
}
//opens the login form.
function openformlogin(params) {
    sessionStorage.setItem('activeButton', 'login');
    location.assign("../html/registration-form.html");
}
//opens instrutions for the otrio game.
function opengame() {
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
        location.assign("../html/game-instructions.html");
    } else {
        location.assign("../html/registration-form.html");
    }
}
//welcome the user.
function welcomeUser() {
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
        let userNow = JSON.parse(sessionStorage.getItem('currentUser')).name;
        user.innerText = `welcome ${userNow}`;
    }
}
welcomeUser();
openModal();