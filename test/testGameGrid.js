
/************************************************************
 * gameGrid.js
 */

 describe('Test Game Grid', function() {
	it('Initiate different sized square grids: (-1, -1) to (2, 2)', function() {

		// Test negative and zero grid sizes
		var grid1 = newGameGrid(-1, -1);
		var grid2 = newGameGrid(0, 0);
		unitjs
			.bool(grid1).isFalse()
			.bool(grid2).isFalse();

		// Test grid sizes 1 to 2
		for (var size = 1; size <= 2; size++) {
			var grid = newGameGrid(size, size);

			unitjs
				.array(grid.cells)
					.matchEach(function(it) {
						for (var i = 0; i < size; i++) {
							if (it[i] != false) {
								return false;
							}
						}

						return true;
					});
		}

	});

	it('Initialize constructor parameters with diff types (string, int, double)', function() {

		var grid1 = newGameGrid(2, 2);
		var grid2 = newGameGrid('2', '2');
		var grid3 = newGameGrid(2.0, 2.0);
		var grid4 = newGameGrid('x', 2.0);
		var grid5 = newGameGrid('2x', 2);
		var grid6 = newGameGrid(2.5, 2);

		unitjs
			.array(grid1.cells)
				.hasLength(2)
			.array(grid2.cells)
				.hasLength(2)
			.array(grid3.cells)
				.hasLength(2)
			.bool(grid4).isFalse()
			.bool(grid5).isFalse()
			.bool(grid6).isFalse();

	});

	it('Test grid functions (fillCell, unfillCell, cellEmpty, cellExists)', function() {

		var size = 3;
		var grid = newGameGrid(size, size);

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
		unitjs.bool(grid.cellExists(size, size - 1)).isFalse();
		unitjs.bool(grid.cellExists(size - 1, size)).isFalse();
		unitjs.bool(grid.cellExists(-1, 0)).isFalse();
		unitjs.bool(grid.cellExists(0, -1)).isFalse();

		// Test zeroes
		unitjs.bool(grid.cellExists(0, 0)).isTrue();

		// Unfill cell and test if empty
		grid.unfillCell(0, 1);
		grid.unfillCell(1, 1);
		grid.unfillCell(2, 1);
		unitjs.bool(grid.cellEmpty(0, 1)).isTrue();
		unitjs.bool(grid.cellEmpty(1, 1)).isTrue();
		unitjs.bool(grid.cellEmpty(2, 1)).isTrue();

	});
});