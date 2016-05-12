 describe('Game Grid (tests only square grids)', function() {

    it('CONSTRUCTOR: Fails for sizes 0 to -2. Initiates for sizes 1 to 3, cells defaults to boolean "false".', function() {

        // Test size 0 to -2
        var grid1 = newGameGrid( 0,  0),
            grid2 = newGameGrid(-1, -1),
            grid3 = newGameGrid(-2, -2);
        unitjs.bool(grid1).isFalse()
              .bool(grid2).isFalse()
              .bool(grid3).isFalse();

        // Test size 1 to 3
        for (var size = 1; size <= 3; size++) {
            var grid = newGameGrid(size, size);

            for (var r = 0; r < size; r++) {
            	for (var c = 0; c < size; c++) {
            		unitjs.bool(grid.cellEmpty(r, c)).isTrue();
            	}
            }
        }
    });

    it('CONSTRUCTOR: 2 (int), 2.0 (float) || 2.5 (float), "2" (string) does not.', function() {

        var size = 2;

        var grid1 = newGameGrid(size, size),
            grid2 = newGameGrid(2.0, 2.0),
            grid3 = newGameGrid('2', '2'),
            grid4 = newGameGrid('x', 2.0),
            grid5 = newGameGrid('2x', 2),
            grid6 = newGameGrid(2.5, 2);

        unitjs.number(grid1.numRows()).is(size)
              .number(grid1.numCols()).is(size)

              .number(grid2.numRows()).is(size)
              .number(grid2.numCols()).is(size)

              .bool(grid3).isFalse()
              .bool(grid4).isFalse()
              .bool(grid5).isFalse()
              .bool(grid6).isFalse();
    });

    it('METHODS: Works as expected even when out-of-bound cells are used as parameters.', function() {

        var size = 3;
        var grid = newGameGrid(size, size);

        // Col & Row #s
        unitjs.number(grid.numRows()).is(size)
              .number(grid.numCols()).is(size);

        // Col 1 will all be filled
        grid.fillCell(0, 1);
        grid.fillCell(1, 1);
        grid.fillCell(2, 1);

        // Test all cells if empty
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                // Tests if cell exists
                unitjs.bool(grid.cellExists(row, col)).isTrue();

                // Tests if cell empty
                if (col == 1) {
                    unitjs.bool(grid.cellEmpty(row, col)).isFalse();
                } else {
                    unitjs.bool(grid.cellEmpty(row, col)).isTrue();
                }
            }
        }

        // Out of bound scenarios
        unitjs.bool(grid.cellExists(size, size - 1)).isFalse()
              .bool(grid.cellExists(size - 1, size)).isFalse()
              .bool(grid.cellExists(-1, 0))         .isFalse()
              .bool(grid.cellExists(0, -1))         .isFalse();

        // Edge scenarios
        unitjs.bool(grid.cellExists(0, 0)).isTrue()
              .bool(grid.cellExists(size - 1, size - 1)).isTrue();

        // Unfill col 1 and test if empty
        grid.unfillCell(0, 1);
        grid.unfillCell(1, 1);
        grid.unfillCell(2, 1);
        unitjs.bool(grid.cellEmpty(0, 1)).isTrue()
              .bool(grid.cellEmpty(1, 1)).isTrue()
              .bool(grid.cellEmpty(2, 1)).isTrue();
    });

    it('METHODS: unfillAll resets each cell to boolean "false".', function() {

        var size = 3;
        var grid = newGameGrid(3, 3);

        // Fill cells and check if empty
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                grid.fillCell(row, col);
                unitjs.bool(grid.cellEmpty(row, col)).isFalse();
            }
        }

        // Unfill all cells and check if empty
        grid.unfillAll();
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                unitjs.bool(grid.cellEmpty(row, col)).isTrue();
            }
        }

        // Correct # of rows & cols
        unitjs.number(grid.numCols()).is(size)
        	  .number(grid.numRows()).is(size);
    });

    it('METHODS: Multiple cells using row-col pair arrays', function() {

    	var size = 3,
    		grid = newGameGrid(size, size),

    		// 2 cells in grid
    		cells1 = [[0,0], [0,1]],

    		// other cells in grid - minus cells1
    		cells2 = [[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];

    	// cells1 & cells2 (entire grid) empty
    	unitjs.bool(grid.cellsEmpty(cells1)).isTrue()
    		  .bool(grid.cellsEmpty(cells2)).isTrue();

    	// fill cells1 then check individual cells & cells array
    	grid.fillCells(cells1);
    	unitjs.bool(grid.cellEmpty(0,0)).isFalse()
    		  .bool(grid.cellEmpty(0,1)).isFalse()
    		  .bool(grid.cellsEmpty(cells1)).isFalse()
    		  .bool(grid.cellsEmpty(cells2)).isTrue()
    		  .bool(grid.cellsOccupied(cells1)).isTrue();

    	// unfill cells1 then check individual cells & cells array
    	grid.unfillCells(cells1);
    	unitjs.bool(grid.cellEmpty(0,0)).isTrue()
    		  .bool(grid.cellEmpty(0,1)).isTrue()
    		  .bool(grid.cellsEmpty(cells1)).isTrue()
    		  .bool(grid.cellsEmpty(cells2)).isTrue();
    });

    it('Test multiple different-sized grids at once', function() {

    	var grid1 = newGameGrid(2, 2);
    	var grid2 = newGameGrid(3, 3);

    	unitjs.number(grid1.numRows()).is(2)
    		  .number(grid2.numRows()).is(3);

		grid1.unfillAll();
		grid2.unfillAll();

		unitjs.number(grid1.numCols()).is(2)
			  .number(grid2.numCols()).is(3);
    });
});

