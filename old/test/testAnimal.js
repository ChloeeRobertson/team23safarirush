
var id = 1;

describe('Test Animal', function() {

	it('CONSTRUCTOR: 2 (int), 2.0 (float), "2" (string) works. || 1.2 (float), "3x" (string) does not.', function() {

		var grid = newGameGrid(3, 3);
		var animalParameters = [
			// row, col, w, h
			// should work
			[1.0, 0.0, 1.0, 2.0],
			[2, 1, 2, 1],

			// should not work
			['0', '0', '1', '2'],
			['1x', '2y', '1w', '2h'],
			[0.1, 1.2, 1, 2]
		];

		for (var i in animalParameters) {
			var arg = animalParameters[i];
			var animal = newPiece(arg[1], arg[0], arg[2], arg[3], grid, id);

			if (i < 2) {
				unitjs.object(animal);
				animal.unfillGrid();
			} else {
				unitjs.bool(animal).isFalse();
			}
		}

	});

	it('CONSTRUCTOR: Different sized animals and starting positions on empty grid.', function() {

		var grid = newGameGrid(3, 3);
		var animalParameters = [
			// row, col, w, h
			// should work
			[ 1,  1,  1,  2],
			[ 0,  0,  2,  1],
			[ 2,  0,  2,  1],
			[ 0,  2,  1,  3],

			// should not work
			[-1,  0,  1,  2],	// negative row
			[ 0, -1,  1,  2],	// negative col
			[ 3,  0,  1,  2],	// out of bound row
			[ 0,  3,  1,  2],	// out of bound col

			[ 1,  1,  1,  1],	// size 1x1
			[ 1,  1,  2,  2],	// size 2x2
			[ 1,  1,  3,  3],	// size 3x3
			[ 0,  0,  2,  3],	// size (2x3)

			[ 0,  2,  1,  4],	// height too tall (1x4 animal on a 3x3 grid)
			[ 2,  0,  1,  3],	// out of bound - height
			[ 0,  2,  3,  1]	// out of bound - width
		];

		for (var i in animalParameters) {
			var arg = animalParameters[i];
			var animal = newPiece(arg[1], arg[0], arg[2], arg[3], grid, id);

			if (i < 4) {
				unitjs.object(animal);
				animal.unfillGrid();
			} else {
				unitjs.bool(animal).isFalse();
			}
		}

	});

	it('CONSTRUCTOR: Load one grid with more than one animal. Fails on invalid grid.', function() {

		var grid = newGameGrid(3, 3);
		var animalParameters = [
			// row, col, w, h
			// should work
			[0, 0, 1, 2],
			[0, 1, 2, 1],
			[1, 1, 2, 1],
			[2, 0, 3, 1],

			// should not work, since all cells are filled up
			[0, 0, 1, 2],
			[0, 0, 2, 1],
			[1, 1, 1, 2]
		];

		// Invalid grid
		var animal1 = newPiece(0, 0, 1, 2, 'x', id);
		unitjs.bool(animal1).isFalse();

		for (var i in animalParameters) {
			var arg = animalParameters[i];
			var animal = newPiece(arg[1], arg[0], arg[2], arg[3], grid, id);

			if (i < 4) {
				unitjs.object(animal);
			} else {
				unitjs.bool(animal).isFalse();
			}
		}

	});
});
