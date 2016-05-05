window.onload = resizeGameArea;
window.onresize = resizeGameArea;

function resizeGameArea() {
    var ele = document.getElementById('gameArea');
    var min = Math.min(window.innerWidth, window.innerHeight);

    ele.style.width = '100%';
    ele.style.height = min + 'px';

}
