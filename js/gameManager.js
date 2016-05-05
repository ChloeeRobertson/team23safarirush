window.onload = function() {

    var grid = new gameGrid(6, 6);

    var tiger = new animal(4, 4, 1, 2, grid);

    grid.fillCell(5, 4);

    console.log(tiger.canMoveTo(1, 0));

    if (grid.cellEmpty(4,4)) {
        console.log('empty')
    } else {
        console.log('not empty');
    }

    console.log(grid);
    
};