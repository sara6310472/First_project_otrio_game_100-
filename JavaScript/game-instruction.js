let playButton = document.querySelector("#button")
playButton.addEventListener('click', openGame);
//opens the game page.
function openGame() {
    location.assign("../html/game-intro.html");
}