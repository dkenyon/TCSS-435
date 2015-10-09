/* 
 * Completed by Reid Thompson & Josh Rueschenberg
 * For Dr. Chris Marriott
 * TCSS 435 - Fall '15
 * HW #1 - Tic Tac Toe AI Agent
 */

var Agent = function() {
	
}

//---------------HELPER METHODS---------------

/*
 * Helper method - returns all free cells on gameboard.
 */
Agent.prototype.getFreeCells = function(board) {
	var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) freeCells.push(i);
    }
    return freeCells;
} 

/*
 * Helper method - determines which player's turn it is currently.
 * Returns a 1 for P1 (Xs) and a 2 for P2 (Os).
 */
Agent.prototype.getCurrPlyr = function(board) {
	var p1Moves = board.X; // remember! - X's always go first
	var p2Moves = board.O;
	var currPlyrsIdx = -1; // initial invalid value (for error handling)
	if (p1Moves.length > p2Moves.length) {
		currPlyrsIdx = 2; // O's turn
	} else { // p1Moves.length == p2Moves.length
		currPlyrsIdx = 1; // X's turn'
	}
	return currPlyrsIdx;
}

/*
 * Helper method - returns the current player's list of moves as an array of integers.
 */
Agent.prototype.getCurrPlyrsPrevMoves = function(currPlyr, board) {
	var currPlyrsPrevMoves = [];
	if (currPlyr == 1) { // X's move
		currPlyrsPrevMoves = board.X;
	} else { // currPlyr == 2 (O's move)
		currPlyrsPrevMoves = board.O;
	}

	return currPlyrsPrevMoves;
}

/*
 * Helper method - returns true if given move choice creates a threeInARow.
 * Returns false otherwise.
 */
Agent.prototype.determineWhetherMoveWinsGame = function(currPlyrsPrevMoves, firstCell, secondCell) {
	var controlsFirstCell= false;
	var controlsSecondCell = false; 
	for (var i = 0; i < currPlyrsPrevMoves.length; i++) {
		var currMove = currPlyrsPrevMoves[i];
		if (currMove == firstCell) {
			controlsFirstCell = true;
		} else if (currMove == secondCell) {
			controlsSecondCell= true;
		}
	}
	return controlsFirstCell && controlsSecondCell;
} 

/*
 * Helper method - returns true if indvCell (corner cell) is a winning move and false otherwise.
 */
Agent.prototype.winningCornerMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromCornerMove = false; // assume game's not won yet
	if (indvCell == 8) { // top left
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 6); // check right
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 4); // check down
	} else if (indvCell == 6) { // top right
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 8) // check left
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 7, 2); // check down
	} else if (indvCell == 4) { // bottom left
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 9, 2) // check right
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 8); // check up
	} else { // indvCell == 2 (bottom right)
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 9, 4) // check left
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 7, 6); // check up
	}

	return threeInARowFromCornerMove;
}

/*
 * Helper method - returns true if indvCell (side middle) is a winning move and false otherwise.
 */
Agent.prototype.winningSideMiddleMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromMiddleMove = false; // assume game's not won yet

	if (indvCell == 1) { // top center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 6); // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 5, 9); // check vertical
	} else if (indvCell == 7) { // right center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 5) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 6, 2); // check vertical
	} else if (indvCell == 9) { // bottom center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 4, 2) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 5); // check vertical
	} else { // indvCell == 3 (left center)
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 5, 7) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 4); // check vertical
	}

	return threeInARowFromMiddleMove;
} 

/*
 * Helper method - returns true if indvCell (center) is a winning move and false otherwise.
 */
Agent.prototype.winningCenterMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	return determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 9) // checks vertical
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 7) // checks horizontal
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 2) // checks top left to bottom right
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 6, 4); // checks top right to bottom left
} 

/*
 * Helper method - returns a winning, if possible.
 * Otherwise, if winning isn't an option, it returns -1.
 */
Agent.prototype.getWinningMove = function(freeCells, currPlyr, board) {
	var returnedMoveIdx = -1; // assume you can't win unless a move is found
	for (var i = 0; i < freeCells.length; i++) {
		var indvCell = freeCells[i];
		// check if winning move could be a corner cell
		if (indvCell == 8 || indvCell == 6 || indvCell == 4 || indvCell == 2) {
			var cornerMoveWins = winningCornerMoveCheck(indvCell, currPlyr, board);
			if (cornerMoveWins) {
				returnedMoveIdx = indvCell;
			}
		// check if winning move could be a 'side middle' cell	
		} else if (indvCell == 1 || indvCell == 3 || indvCell == 7 || indvCell == 9) {
			var sideMiddleMoveWins = winningSideMiddleMoveCheck(indvCell, currPlyr, board);
			if (sideMiddleMoveWins) {
				returnedMoveIdx = indvCell;
			}
		// check if winning move could be center cell	
		} else { // indvCell = 5
			var centerMoveWins = winningCenterMoveCheck(indvCell, currPlyr, board);
			if (centerMoveWins) {
				returnedMoveIdx = indvCell;
			}	
		}
	}
	return returnedMoveIdx;
}

//---------------VARIOUS AGENT AI ALGORITHMS---------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
// 
Agent.prototype.selectMove = function(board) {
	// Step 1: Figure out which cells are free to play on in gameboard
	var freeCells = getFreeCells(board);

	// Step 2: Determine which player's turn it is
	var currPlyr = getCurrPlyr(board);
}

/* 
 * Original provided solution.
 * Description: chooses a cell at random to play for each turn. 
 */
Agent.prototype.selectMoveAtRandom = function(board) {
	var freeCells = getFreeCells(board);
    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

/*
 * Algorithm based on TicTacToe rules discussed in class.
 */
Agent.prototype.selectMoveWithRules = function(board) {
	// get all free cells on gameboard
	var freeCells = getFreeCells(board);

	// determine which player's turn it is
	var currPlyr = getCurrPlyr(board);

	// START OF RULE-BASED ALGORITHM!

	// Rule 1 - Win, if possible.
	var winningMovesIdx = -1;
	if (freeCells.length <= 5) { // then it's possible to have a winning move
		winningMovesIdx = getWinningMove(freeCells, currPlyr, board);
	}
	if (winningMovesIdx != -1) {
		return winningMovesIdx;
	}

	// Rule 2 - ...
} 