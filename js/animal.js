// Creates and returns a new animal object if parameters are valid
// and animal position cells exists in grid and is empty
var newAnimal = function(row, col, w, h, grid) {

    if (!Number.isInteger(+row) ||
        !Number.isInteger(+col) ||
        !Number.isInteger(+w) ||
        !Number.isInteger(+h) ||
        !grid) {

        console.log("ERROR: Invalid animal parameters.");
        return false;
    } else if (!grid.cellExists(row, col)) {
        console.log("ERROR: Animal position out of bounds. " + row + ", " + col);
        return false;
    } else if (w == h || w < 1 || h < 1 || (w != 1 && h != 1)) {
        console.log("ERROR: Incorrect animal sizing. " + w + "x" + h);
        return false;
    }

    // Determine if animal position cells exist and is empty
    var yMovable = (h > 1);
    var max = (yMovable) ? +h : +w;
    var r = row;
    var c = col;
    for (var count = 0; count < max; count++) {
        // Determine movement axis (x or y)
        if (yMovable) {
            r = row + count;
        } else {
            c = col + count;
        }

        if (!grid.cellExists(r, c) || !grid.cellEmpty(r, c)) {
            console.log("ERROR: Invalid animal position cell. " + r + ", " + c);
            return false;
        }
    }

    return new animal(+row, +col, +w, +h, grid);

};

// Initializes animal and fills grid cells
var animal = function(row, col, w, h, grid) {

    this.x  = col;  // col #
    this.y  = row;  // row #
    this.w  = w;    // width span (1, 2, 3)
    this.h  = h;    // height span (1, 2, 3)
    
    this.grid = grid;

    this.xMovable = (w > 1);
    this.yMovable = (h > 1);

    this.fillGrid();
    
};

animal.prototype = {

    // Move animal
    // (movement = 1, -1)
    move: function(movement) {
        if (!this.canMove(movement)) {
            console.log("ERROR: Can't make invalid move.");
            return false;
        }

        // unfill cells occupied by current animal position
        if (!this.unfillGrid()) {
            return false;
        }

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
            // Determine movement axis (x or y)
            if (this.yMovable) {
                row = this.y + +movement + count;
            } else {
                col = this.x + +movement + count;
            }

            // Cell not empty and not occupied by this animal
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

    // Fill current positions on grid
    fillGrid: function(unfill) {
        var max = (this.yMovable) ? this.h : this.w;
        var row = this.y;
        var col = this.x;

        for (var count = 0; count < max; count++) {
            // Determine movement axis (x or y)
            if (this.yMovable) {
                row = this.y + count;
            } else {
                col = this.x + count;
            }

            if (unfill) {
                // Unfill cell
                if (!this.grid.unfillCell(row, col)) {
                    return false;
                }
            } else if (this.grid.cellEmpty(row, col)) {
                // Fill cell
                if (!this.grid.fillCell(row, col)) {
                    return false;
                }
            } else {
                // Cell is out of bounds
                console.log("ERROR: Animal occupying non-empty or out-of-bound cell. " + row + ", " + col);
                return false;
            }
        }

        return true;
    },

    // Unfill current positions on grid
    unfillGrid: function() {
        return this.fillGrid(true);
    }
    
};