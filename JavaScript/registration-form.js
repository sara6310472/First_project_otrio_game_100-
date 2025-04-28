let container = document.querySelector('.container');
let activeButton = sessionStorage.getItem('activeButton');

let loginalert = document.querySelector('.Signinalert');
let users = JSON.parse(localStorage.getItem('users'));

let Signinalert = document.querySelector('.loginalert');

let signUp = document.querySelector(".signup-link").addEventListener("click", toggleContainer);
let login = document.querySelector(".login-link").addEventListener("click", toggleContainer);

let pwShowHide = document.querySelectorAll("#showHidePw");
let pwFields = document.querySelectorAll(".password");

function inStart() {
    toggleContainerClass()
    document.getElementById('signup').addEventListener("submit", saveSignUp);
    document.getElementById('login').addEventListener("submit", saveLogIn);

    if (localStorage.getItem('users') == null) {
        localStorage.setItem('users', '[]');
    }
}

function toggleContainerClass() {
    if (activeButton == 'signin') {
        container.classList.add('active');
    }
}

function saveSignUp(e) {
    e.preventDefault();

    let saveSignupName = document.getElementById('nameSignup').value;
    let saveSignupEmail = document.getElementById('emailSignup').value;
    let saveSignupPassword = document.getElementById('passwordSignup').value;
    let didTheUserSignUp = true;
    if (users.length != 0) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === saveSignupEmail) {
                didTheUserSignUp = false;
                loginalert.style.display = "block";
            }
        }
    }

    if (didTheUserSignUp) {
        let user = {
            name: saveSignupName,
            email: saveSignupEmail,
            password: saveSignupPassword,
            numOfWins: 0,
            timer: "0",
            numOfGame: 0,
        }

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        location.assign("../html/home-page.html");
    }
}

function saveLogIn(e) {
    let saveEmail = document.getElementById('emailS').value;
    let savePassword = document.getElementById('passwordS').value;
    e.preventDefault();

    let didTheUserSignUp = false;
    if (!users.length) {
        Signinalert.style.display = "block";
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === saveEmail && users[i].password === savePassword) {
            sessionStorage.setItem('currentUser', JSON.stringify(users[i]));
            didTheUserSignUp = true;
            location.assign("../html/home-page.html");
        }
    }

    if (didTheUserSignUp === false) {
        Signinalert.style.display = "block";
    }
}

function ShowHidePassword(pwShowHide, pwFields) {
    pwShowHide.forEach(eyeIcon => {
        eyeIcon.addEventListener("click", () => {
            pwFields.forEach(pwField => {
                if (pwField.type === "password") {
                    pwField.type = "text";
                } else {
                    pwField.type = "password";
                }
            })
        })
    });
}

function toggleContainer() {
    container.classList.toggle("active");
}

inStart();
ShowHidePassword(pwShowHide, pwFields);