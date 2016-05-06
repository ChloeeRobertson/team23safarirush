// Initializes animal and fills grid cells
var animal = function(row, col, w, h, grid) {

    this.x  = +col;  // col #
    this.y  = +row;  // row #
    this.w  = +w;    // width span (1, 2, 3)
    this.h  = +h;    // height span (1, 2, 3)
    
    this.grid = grid;

    this.xMovable = (w > 1);
    this.yMovable = (h > 1);

    if ((this.xMovable && this.yMovable) || (!this.xMovable && !this.yMovable)) {
        console.log("ERROR: Incorrect animal sizing. " + w + "x" + h);
    }

    this.fillGrid();
};

animal.prototype = {

    // Move animal
    // (movement = 1, -1)
    move: function(movement) {
        if (!this.canMove(movement)) {
            console.log("ERROR: Can't make invalid move.");
            return;
        }

        // unfill cells occupied by current animal position
        this.fillGrid(true);

        // set new animal position
        if (this.xMovable) {
            this.x += +movement;
        } else {
            this.y += +movement;
        }

        // fill cells with new position
        this.fillGrid();
    },

    // Can animal make this move?
    // (movement = 1, -1)
    canMove: function(movement) {
        if (movement != 1 && movement != -1) {
            console.log("ERROR: Invalid animal movement. " + movement);
            return false;
        }

        var max = (this.yMovable) ? this.h : this.w;
        var row = (this.yMovable) ? this.y + movement : this.y;
        var col = (this.xMovable) ? this.x + movement : this.x;

        for (var count = 0; count < max; count++) {
            if (this.yMovable) {
                row = this.y + +movement + count;
            } else {
                col = this.x + +movement + count;
            }

            if (!this.grid.cellEmpty(row, col) && !this.occupyingCell(row, col)) {
                return false;
            }
        }

        return true;
    },

    // Animal currently occupying this cell?
    occupyingCell: function(row, col) {
        return  this.y <= row && row <= (this.y + this.h - 1) &&
                this.x <= col && col <= (this.x + this.w - 1);
    },

    // Fill initial positions on grid
    fillGrid: function(unfill) {
        var max = (this.yMovable) ? this.h : this.w;
        var row = this.y;
        var col = this.x;

        for (var count = 0; count < max; count++) {
            if (this.yMovable) {
                row = this.y + count;
            } else {
                col = this.x + count;
            }

            if (unfill) {
                this.grid.unfillCell(row, col);
            } else if (this.grid.cellEmpty(row, col)) {
                this.grid.fillCell(row, col);
            } else {
                console.log("ERROR: Animal occupying non-empty or out-of-bound cell. " + row + ", " + col);
            }
        }
    }
    
};