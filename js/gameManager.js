// window.onload = function() {

    var grid = new gameGrid('6', 6);

    var tiger = new animal(2, 2, 1, 2, grid);

    grid.fillCell(4, 2);

    console.log(tiger.move('1'));

    console.log(grid);
    
// };