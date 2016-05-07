window.onload = resizeGameArea;
window.onresize = resizeGameArea;

function resizeGameArea() {
    var ele = document.getElementById('gameArea');

    ele.style.width = "100%";
    ele.style.height = window.innerWidth + "px";
}
