/*
 * gameGrid.js for Safari Rush
 * http://team23.site88.net
 *
 */

(function(_window) {

var

    // Returns new game grid or false if invalid rows or columns
    newGameGrid = function(rows, cols) {
        if (!isInt(rows) || !isInt(cols) || rows <= 0 || cols <= 0) {
            return error(
                'Failed grid initiation. Invalid rows/cols. '
                + 'row: ' + rows + ', col: ' + cols
            );
        }
        return new gameGrid(rows, cols);
    },

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

var gameGrid = function(rows, cols) {

    var

        // Number of rows and columns
        rows = rows,
        cols = cols,

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

    var

        // Cell exists?
        cellExists = this.cellExists = function(row, col) {
            return (row in cells) && (col in cells[row]);
        },

        // Cell empty?
        // Returns false if non-existent
        cellEmpty = this.cellEmpty = function(row, col) {
            return cellExists(row, col) ? !cells[row][col] : false;
        },
        
        // Cell occupied?
        // Returns false if non-existent
        cellOccupied = this.cellOccupied = function(row, col) {
            return cellExists(row, col) ? cells[row][col] : false;
        },

        // Multiple cells empty?
        // Returns false if invalid array or 1+ cell non-existent
        cellsEmpty = this.cellsEmpty = function(arr) {
            return validCellArr(arr) ?
                arr.every(function(elem) {
                    return cellEmpty(elem[0], elem[1]);
                }) : false;
        },

        // Multiple cells occupied?
        // Returns false if invalid array or 1+ cell non-existent
        cellsOccupied = this.cellsOccupied = function(arr) {
            return validCellArr(arr) ?
                arr.every(function(elem) {
                    return cellOccupied(elem[0], elem[1]);
                }) : false;
        },

        // Fill a cell
        fillCell = this.fillCell = function(row, col, unfill) {
            if (cellExists(row, col) && cellEmpty(row, col)) {
                cells[row][col] = true;
                return true;
            }
            return false;
        },

        // Fill some cells
        fillCells = this.fillCells = function(arr) {
            return cellsEmpty(arr) ?
                arr.every(function(elem) {
                    return (fillCell(elem[0], elem[1]));
                }) : false;
        },
    
        // Unfill a cell
        unfillCell = this.unfillCell = function(row, col) {
            if (cellExists(row, col) && cellOccupied(row, col)) {
                cells[row][col] = false;
                return true;
            }
            return false;
        },

        // Unfill some cells
        unfillCells = this.unfillCells = function(arr) {
            return cellsOccupied(arr) ?
                arr.every(function(elem) {
                    return (unfillCell(elem[0], elem[1]));
                }) : false;
        },

        // Unfill every cell in grid
        unfillAll = this.unfillAll = function() {
            init();
        },

        // Number of rows
        numRows = this.numRows = function() {
            return rows;
        },

        // Number of columns
        numCols = this.numCols = function() {
            return cols;
        };

    // Initiate grid
    init();
};

// Register global variable
_window.newGameGrid = newGameGrid;

})(window);
