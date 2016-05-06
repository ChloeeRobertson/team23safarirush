// Initializes empty cells with boolean "false"
// (Can think of it as: row = y, col = x)
var gameGrid = function(numRows, numCols) {

    if (!+numRows || !+numCols || numRows <= 0 || numCols <= 0) {
        console.log('Can not initialize grid. Invalid rows or cols.');
    }

    this.cells = [];
    for (var row = 0; row < numRows; row++) {
        this.cells[row] = [];
        for (var col = 0; col < numCols; col++) {
            this.cells[row][col] = false;
        }
    }

};

gameGrid.prototype = {

    // Fill cell
    fillCell: function(row, col) {
        if (this.cellExists(row, col)) {
            this.cells[row][col] = true;
        }
    },
    
    // Unfill cell (becomes empty)
    unfillCell: function(row, col) {
        if (this.cellExists(row, col)) {
            this.cells[row][col] = false;
        }
    },

    // Is cell empty?
    // Also returns false if non-existent.
    cellEmpty: function(row, col) {
        if (!this.cellExists(row, col)) {
            return false;
        }
        return !this.cells[row][col];
    },
    
    // Cell exist in array?
    cellExists: function(row, col) {
        return  0 <= row && row < this.cells.length &&
                0 <= col && col < this.cells[row].length;
    }

};