(function(_window) {

var newSafariRush = function(canvasId, level) {

	var
		// Canvas element
		canvas = document.getElementById(canvasId),

		// Set default level if not specified
		level = level || defaultLevel;

	// Canvas element non-existent
	if (canvas === null) {
		return sr.error('Canvas "' + canvasId + '" does not exist.');
	}

	// Return new Safari Rush object
	return new safariRush(canvas, level);
};

// Safari Rush class
var safariRush = function(canvas, level) {

	// ----------------------------------------------
	// PRIVATE DATA
	// ----------------------------------------------

	var
		// Game Grid
		grid = newGameGrid(level.gridHeight, level.gridWidth, canvas),

		// Cell width and height in px
		cellW = canvas.width / level.gridWidth,
		cellH = canvas.height / level.gridHeight,

		// Game Pieces
		pieces = [],

		// Active Piece (currently moving)
		activeId = sr.NAY,
		activeMovesX = sr.NAY,
		activeX = sr.NAY,
		activeY = sr.NAY,
		activeXCoord = sr.NAY,
		activeYCoord = sr.NAY;

	// ----------------------------------------------
	// PRIVATE FUNCTIONS
	// ----------------------------------------------

	var
		// Mouse held down
		mousedown = function(e) {
			var
				xyCoord = getXyCoord(e, canvas),
				xy = sr.coordToXy(xyCoord[0], xyCoord[1], cellW, cellH);

			activeXCoord = xyCoord[0];
			activeYCoord = xyCoord[1];
			activeX = xy[0];
			activeY = xy[1];
			activeId = grid.getCell(activeY, activeX);

			console.log(activeId);
		},

		// Mouse let go
		mouseup = function(e) {
			activeId = sr.NAY;
			activeX = sr.NAY;
			activeY = sr.NAY;
			activeXCoord = sr.NAY;
			activeYCoord = sr.NAY;
		},

		// Mouse moved
		mousemove = function(e) {
			if (activeId == sr.NAY) {
				return;
			}

			var
				xyCoord = getXyCoord(e, canvas),
				xy = sr.coordToXy(xyCoord[0], xyCoord[1], cellW, cellH);
				
			activeXCoord = xyCoord[0];
			activeYCoord = xyCoord[1];
			activeX = xy[0];
			activeY = xy[1];

			if (pieces[activeId].canMoveX()) {
				if (pieces[activeId].canMove(activeX)) {
					pieces[activeId].move(activeX);
				}
			} else {
				if (pieces[activeId].canMove(activeY)) {
					pieces[activeId].move(activeY);
				}
			}
		}

		// Draw piece after images loaded
		pieceLoaded = function(id) {
			pieces[id].draw();
		},

		getCell = function(e) {
			var xy = getXyCoord(e, canvas);
			return [
				roundDown(xy[0] / cellW),
				roundDown(xy[1] / cellH)
			];
		};

	// ----------------------------------------------
	// INITIALIZATION
	// ----------------------------------------------

	// Initiate all pieces
	pieces = initPieces(level.pieces, grid, pieceLoaded);

	// Add event listeners
	canvas.addEventListener('mousedown', mousedown);
	canvas.addEventListener('mouseup', mouseup);
	canvas.addEventListener('mousemove', mousemove);
};

// ----------------------------------------------
// SHARED DATA
// ----------------------------------------------

var
	// Initiate and returns pieces
	initPieces = function(pieces, grid, callback) {
		var allPieces = [];

		pieces.forEach(function(piece, id) {

			var
				x = piece[0],
				y = piece[1],
				w = piece[2],
				h = piece[3],
				isJeep = piece[4];

			allPieces[id] = newPiece(
				x, y, w, h, grid, id, isJeep, callback
			);
		});

		return allPieces;
	},

	// Get XY coordinates from mouse event
	// where [0,0] is top-left corner of canvas element
	getXyCoord = function(e, canvas) {
		var canvasInfo = canvas.getBoundingClientRect();
		return [
			e.clientX - canvasInfo.left,
			e.clientY - canvasInfo.top
		];
	},

	// Default level
	defaultLevel = {
		gridWidth: 6,
		gridHeight: 6,

		goalX: 5,
		goalY: 2,

		pieces: [
			// x, y, w, h, isJeep
			[0,0,1,3,false],
			[0,5,3,1,false],
			[1,2,2,1,true],
			[1,3,1,2,false],
			[2,0,1,2,false],
			[2,4,2,1,false],
			[3,0,3,1,false],
			[3,1,1,3,false],
			[4,2,1,3,false],
			[5,1,1,2,false],
			[5,3,1,2,false]
		]
	},

	// Reference to useful functions
	roundDown = Math.floor;

// ----------------------------------------------

// Register global variable
_window.newSafariRush = newSafariRush;

})(window);
