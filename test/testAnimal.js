
describe('Test Animal', function() {

	it('Load grid with more than one animal', function() {

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

		for (var i in animalParameters) {
			var arg = animalParameters[i];
			var animal = newAnimal(arg[0], arg[1], arg[2], arg[3], grid);

			if (i < 4) {
				unitjs.object(animal);
			} else {
				unitjs.bool(animal).isFalse();
			}
		}

	});

	it('Test different sized animals and starting positions on grid', function() {

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
			var animal = newAnimal(arg[0], arg[1], arg[2], arg[3], grid);

			if (i < 4) {
				unitjs.object(animal);
				animal.unfillGrid();
			} else {
				unitjs.bool(animal).isFalse();
			}
		}

	});
});
