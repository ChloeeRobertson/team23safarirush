/*
 * gameGrid.js for Safari Rush
 * http://team23.site88.net
 *
 * To Do:
 *    - fillCell() & fillCells() needs to check for valid Id
 */

// Runs in self-invoking anonymous function to
// hide variables from global space
(function(_window) {

var newGameGrid = function(rows, cols, canvas) {

    // ----------------------------------------------
    // PARAMETER ERROR CHECKING
    // ----------------------------------------------
    
    // Ensure rows & cols are integers > 0
    if (!isInt(rows) || !isInt(cols) || rows <= 0 || cols <= 0) {
        return sr.error(
            'Failed grid initiation. Invalid rows/cols. '
            + 'row: ' + rows + ', col: ' + cols
        );
    }

    // // Ensure canvas is a real canvas
    // if (!canvas || canvas.tagName !== 'canvas') {
    //     return sr.error('Canvas non-existent or of wrong type.');
    // }

    // ----------------------------------------------
    // PRIVATE DATA
    // ----------------------------------------------

    var
        // Canvas 2D Context
        ctx = canvas.getContext('2d'),

        // 2D array storing grid cells
        cells = [],

        // Cell width and height in pixels
        cellW = 0,
        cellH = 0;

    // ----------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------

    // Create cells
    for (var row = 0; row < rows; row++) {
        cells[row] = [];
        for (var col = 0; col < cols; col++) {
            cells[row][col] = sr.NAY;
        }
    }

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientWidth;

    // Set cell width & height in pixels
    cellW = canvas.width / cols;
    cellH = canvas.height / rows;

    // ----------------------------------------------
    // PUBLIC DATA
    // ----------------------------------------------

    return {

        drawPiece: function(img, x, y, w, h) {
            w *= cellW;
            h *= cellH;
            coord = sr.xyToCoord(x, y, cellW, cellH);
            ctx.drawImage(img, coord[0], coord[1], w, h);
        },

        undrawPiece: function(x, y, w, h) {
            var xy = sr.xyToCoord(x, y, cellW, cellH);
            w *= cellW;
            h *= cellH;
            ctx.clearRect(xy[0], xy[1], w, h);
        },

        getCell: function(row, col) {
            return this.cellExists(row, col) ? cells[row][col] : sr.NAY;
        },

        // Cell exists?
        cellExists: function (row, col) {
            return (row in cells) && (col in cells[row]);
        },

        // Cell empty?
        // Returns false if non-existent
        cellEmpty: function (row, col) {
            return this.cellExists(row, col) ? cells[row][col] == sr.NAY : false;
        },

        // Multiple cells empty?
        // Returns false if invalid array or 1+ cell non-existent
        cellsEmpty: function (arr) {
            return validCellArr(arr) ?
                arr.every(function (elem) {
                    return this.cellEmpty(elem[0], elem[1]);
                }, this) : false;
        },

        // Cell occupied?
        // Returns false if non-existent
        cellOccupied: function (row, col) {
            return this.cellExists(row, col) ? cells[row][col] > sr.NAY : false;
        },

        // Multiple cells occupied?
        // Returns false if invalid array or 1+ cell non-existent
        cellsOccupied: function (arr) {
            return validCellArr(arr) ?
                arr.every(function (elem) {
                    return this.cellOccupied(elem[0], elem[1]);
                }, this) : false;
        },

        // Fill a cell
        fillCell: function (row, col, id) {
            // Still need to check for valid ID
            if (this.cellExists(row, col) && this.cellEmpty(row, col)) {
                cells[row][col] = typeof id !== 'undefined' ? id : sr.YAY;
                return true;
            }
            return false;
        },

        // Fill some cells
        fillCells: function (arr, id) {
            return this.cellsEmpty(arr) ?
                arr.every(function (elem) {
                    return (this.fillCell(elem[0], elem[1], id));
                }, this) : false;
        },

        // Unfill a cell
        unfillCell: function (row, col) {
            if (this.cellExists(row, col) && this.cellOccupied(row, col)) {
                cells[row][col] = sr.NAY;
                return true;
            }
            return false;
        },

        // Unfill some cells
        unfillCells: function (arr) {
            return this.cellsOccupied(arr) ?
                arr.every(function (elem) {
                    return (this.unfillCell(elem[0], elem[1]));
                }, this) : false;
        },

        // Unfill every cell in grid
        unfillAll: function () {
            init();
        },

        // Number of rows
        numRows: function () {
            return rows;
        },

        // Number of columns
        numCols: function () {
            return cols;
        }
    }
};

// ----------------------------------------------
// SHARED DATA
// ----------------------------------------------

var
    // Determines whether an array containing row-col pairs are valid
    validCellArr = function(arr) {
        return isArr(arr) &&
            arr.every(function(elem) {
                return  isArr(elem) && elem.length === 2 &&
                    isInt(elem[0]) && isInt(elem[1]);
            });
    },

    // Reference to other useful functions
    isArr = Array.isArray,
    isInt = Number.isInteger;

// ----------------------------------------------
// MISCELLANEOUS
// ----------------------------------------------

// Register global variable
_window.newGameGrid = newGameGrid;

})(window);
