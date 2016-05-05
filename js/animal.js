var animal = function(row, col, rowSpan, colSpan, grid) {
    
    this.row        = row;
    this.col        = col;
    this.rowSpan    = rowSpan;
    this.colSpan    = colSpan;

    this.grid       = grid;

    this.rowMovable = (rowSpan > 1);
    this.colMovable = (colSpan > 1);

    for (var rowCount = 0; rowCount < this.rowSpan; rowCount++) {
        if (this.grid.cellEmpty(row + rowCount, col)) {
            this.grid.fillCell(row + rowCount, col);
        }
    }

    for (var colCount = 0; colCount < this.colSpan; colCount++) {
        if (this.grid.cellEmpty(row, col + colCount)) {
            this.grid.fillCell(row, col + colCount);
        }
    }
    
};

animal.prototype = {

    canMoveRow: function(increment) {
        if (!this.rowMovable || !+increment) {
            return false;
        }

        return this.canMoveTo(increment, 0);

    },

    // Animal can move ...
    canMoveTo: function(rowIncrement, colIncrement) {
        var row = this.row + rowIncrement;
        var col = this.col + colIncrement;

        for (var rowCount = 0; rowCount < this.rowSpan; rowCount++) {
            if (!this.grid.cellEmpty(row + rowCount, col)) {
                
                return false;
            }
        }

        for (var colCount = 0; colCount < this.colSpan; colCount++) {
            if (!this.grid.cellEmpty(row, col + colCount)) {
                
                return false;
            }
        }

        return true;
    },

    // Animal currently occupying this cell?
    isOnCell: function(row, col) {
        return  this.row <= row && row <= this.row + this.rowSpan &&
                this.col <= col && col <= this.col + this.colSpan;
    }
    
};