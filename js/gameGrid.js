/*
 * gameGrid.js for Safari Rush
 * http://team23.site88.net
 *
 */

// Runs in self-invoking anonymous function to
// hide variables from global space
(function(_window) {

var newGameGrid = function(rows, cols) {

    // ----------------------------------------------
    // Parameter error checking
    
    // Ensure rows & cols are integers > 0
    if (!isInt(rows) || !isInt(cols) || rows <= 0 || cols <= 0) {
        return error(
            'Failed grid initiation. Invalid rows/cols. '
            + 'row: ' + rows + ', col: ' + cols
        );
    }

    // ----------------------------------------------
    // Private data

    var

        // Number of rows and columns
        // Commented out as it var already exist
        // rows = rows,
        // cols = cols,

        // 2D array storing grid cells
        cells = [],

        // Initiate/reset grid
        init = function() {
            for (var row = 0; row < rows; row++) {
                cells[row] = [];
                for (var col = 0; col < cols; col++) {
                    cells[row][col] = false;
                }
            }
        };

    // ----------------------------------------------
    // Initiate grid

    init();

    // ----------------------------------------------
    // Public data

    return {

        // Cell exists?
        cellExists: function (row, col) {
            return (row in cells) && (col in cells[row]);
        },

        // Cell empty?
        // Returns false if non-existent
        cellEmpty: function (row, col) {
            return this.cellExists(row, col) ? !cells[row][col] : false;
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
            return this.cellExists(row, col) ? cells[row][col] : false;
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
        fillCell: function (row, col) {
            if (this.cellExists(row, col) && this.cellEmpty(row, col)) {
                cells[row][col] = true;
                return true;
            }
            return false;
        },

        // Fill some cells
        fillCells: function (arr) {
            return this.cellsEmpty(arr) ?
                arr.every(function (elem) {
                    return (this.fillCell(elem[0], elem[1]));
                }, this) : false;
        },

        // Unfill a cell
        unfillCell: function (row, col) {
            if (this.cellExists(row, col) && this.cellOccupied(row, col)) {
                cells[row][col] = false;
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
// Shared across all grids (think static)

var

    // Determines whether an array containing row-col pairs are valid
    validCellArr = function(arr) {
        return isArr(arr) &&
            arr.every(function(elem) {
                return  isArr(elem) && elem.length === 2 &&
                    isInt(elem[0]) && isInt(elem[1]);
            });
    },

    // Reference to error function
    error = _window.sr.error,

    // Reference to other useful functions
    isArr = Array.isArray,
    isInt = Number.isInteger;

// ----------------------------------------------

// Register global variable
_window.newGameGrid = newGameGrid;

})(window);
