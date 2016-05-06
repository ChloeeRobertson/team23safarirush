window.onload = resizeGameArea;
window.onresize = resizeGameArea;

function resizeGameArea() {
    var ele = document.getElementById('gameArea');

    ele.style.width = window.innerWidth + "px";
    ele.style.height = window.innerWidth + "px";
}
