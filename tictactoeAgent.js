/* 
 * Completed by Reid Thompson & Josh Rueschenberg
 * For Dr. Chris Marriott
 * TCSS 435 - Fall '15
 * HW #1 - Tic Tac Toe AI Agent
 */

/*
 * Declaration of Agent 'class'.
 */ 
var Agent = function() {
	
}

//---------------HELPER METHODS---------------

/*
 * Helper method - returns all free cells on gameboard.
 */
getFreeCells = function(board) {
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
getCurrPlyr = function(board) {
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
getCurrPlyrsPrevMoves = function(currPlyr, board) {
	var currPlyrsPrevMoves = [];
	if (currPlyr === 1) { // X's move
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
determineWhetherMoveWinsGame = function(currPlyrsPrevMoves, firstCell, secondCell) {
	var controlsFirstCell= false;
	var controlsSecondCell = false; 
	for (var i = 0; i < currPlyrsPrevMoves.length; i++) {
		var currMove = currPlyrsPrevMoves[i];
		if (currMove === firstCell) {
			controlsFirstCell = true;
		} else if (currMove === secondCell) {
			controlsSecondCell= true;
		}
	}
	return controlsFirstCell && controlsSecondCell;
} 

/*
 * Helper method - returns true if indvCell (corner cell) is a winning move and false otherwise.
 */
winningCornerMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromCornerMove = false; // assume game's not won yet
	if (indvCell === 8) { // top left
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 6); // check right
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 4); // check down
	} else if (indvCell === 6) { // top right
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 8) // check left
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 7, 2); // check down
	} else if (indvCell === 4) { // bottom left
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 9, 2) // check right
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 8); // check up
	} else { // indvCell === 2 (bottom right)
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 9, 4) // check left
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 7, 6); // check up
	}

	return threeInARowFromCornerMove;
}

/*
 * Helper method - returns true if indvCell (side middle) is a winning move and false otherwise.
 */
winningSideMiddleMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromMiddleMove = false; // assume game's not won yet

	if (indvCell === 1) { // top center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 6); // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 5, 9); // check vertical
	} else if (indvCell === 7) { // right center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 5) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 6, 2); // check vertical
	} else if (indvCell === 9) { // bottom center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 4, 2) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 5); // check vertical
	} else { // indvCell === 3 (left center)
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 5, 7) // check horizontal
									|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 4); // check vertical
	}

	return threeInARowFromMiddleMove;
} 

/*
 * Helper method - returns true if indvCell (center) is a winning move and false otherwise.
 */
winningCenterMoveCheck = function(indvCell, currPlyr, board) {
	var isWinningMove = false;

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	return determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 9) // checks vertical
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 7) // checks horizontal
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 2) // checks top left to bottom right
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 6, 4); // checks top right to bottom left
} 

/*
 * Helper method - returns a winning move's index, if possible.
 * Otherwise, if winning isn't an option, it returns -1.
 */
getWinningMove = function(freeCells, currPlyr, board) {
	var returnedMoveIdx = -1; // assume you can't win unless a move is found
	for (var i = 0; i < freeCells.length; i++) {
		var indvCell = freeCells[i];
		// check if winning move could be a corner cell
		if (indvCell === 8 || indvCell === 6 || indvCell === 4 || indvCell === 2) {
			var cornerMoveWins = winningCornerMoveCheck(indvCell, currPlyr, board);
			if (cornerMoveWins) {
				returnedMoveIdx = indvCell;
			}
		// check if winning move could be a 'side middle' cell	
		} else if (indvCell === 1 || indvCell === 3 || indvCell === 7 || indvCell === 9) {
			var sideMiddleMoveWins = winningSideMiddleMoveCheck(indvCell, currPlyr, board);
			if (sideMiddleMoveWins) {
				returnedMoveIdx = indvCell;
			}
		// check if winning move could be center cell	
		} else { // indvCell === 5
			var centerMoveWins = winningCenterMoveCheck(indvCell, currPlyr, board);
			if (centerMoveWins) {
				returnedMoveIdx = indvCell;
			}	
		}
	}
	return returnedMoveIdx;
}

/*
 * Helper method - returns true if opposing player has a twoInARow that needs blocking and false otherwise.
 */
determineWhetherOpponentNeedsToBeBlocked = function(currPlyrsPrevMoves, oppPlyrsPrevMoves, twoInARowsNeededToBeBlockedArr) {
	var oppNeedsToBeBlocked = false; // assume that currPlyr doesn't need to block opponent unless necessary

	for (var i = 0; i < twoInARowsNeededToBeBlockedArr.length; i++) {
		var currTwoInARow = twoInARowsNeededToBeBlockedArr[i];

		if (currPlyrsPrevMoves.includes(currTwoInARow[0])
				&& currPlyrsPrevMoves.includes(currTwoInARow[1])) {
			oppNeedsToBeBlocked = true;
			break;
		}
	}

	return oppNeedsToBeBlocked;
} 

/*
 * Helper method - returns the cell index of a random cell from freeCells
 */
randomlyGeneratedValidFreeCellIdx = function(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves) {
 	var returnedCellIdx = -1;

 	while (returnedCellIdx === -1 || currPlyrsPrevMoves.includes(returnedCellIdx) 
 			|| oppPlyrsPrevMoves.includes(returnedCellIdx)) {
 		if (freeCells.includes(returnedCellIdx)) {
 			returnedCellIdx = Math.ceil(Math.random() * freeCells.length);
 		}
 	}

 	return returnedCellIdx;
 }

/*
 * Helper method - returns the cell index that the current player needs to fill in order to block their opponent.
 */
getCellIdxToBlockOpponent = function(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves, twoInARowsNeededToBeBlockedArr) {
	// start with a VALID random cell idx from freeCells
	var blockingMovesIdx = randomlyGeneratedValidFreeCellIdx(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves);

	// indexes of these moves correspond with indexes of twoInARowsNeededToBeBlockedArr
	var allBlockingMoveOptions = [4, 9, 2, 8, 1, 6, 6, 8, 7, 3, 2, 4];

	for (var i = 0; i < twoInARowsNeededToBeBlockedArr.length; i++) {
		var currTwoInARow = twoInARowsNeededToBeBlockedArr[i];
		if (oppPlyrsPrevMoves.includes(currTwoInARow[0]) && oppPlyrsPrevMoves.includes(currTwoInARow[1]) {
			blockingMovesIdx = allBlockingMoveOptions[i];
		}
	}

	return blockingMovesIdx;
} 

/*
 * Helper method - returns a blocking move's index, if necessary (meaning opponent has a twoInARow).
 * Otherwise, it returns -1.
 */
getBlockingMove = function(freeCells, currPlyrsIdx, oppPlyrsIdx, board)  {
	var blockingMovesIdx = -1; // assume not blocking move is necessary unless one is found

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyrsIdx, board);
	var oppPlyrsPrevMoves = getCurrPlyrsPrevMoves(oppPlyrsIdx, board);

	var twoInARowsNeededToBeBlockedArr = [[8,3], [1,5], [6,7], [4,3],[5,9],[7,2], // all vertical twoInARows
										[8,1], [1,6], [3,5], [5,7], [4,9], [9,2]; // all horiz twoInARows

	var needToBlockOpponent = determineWhetherOpponentNeedsToBeBlocked(currPlyrsPrevMoves, oppPlyrsPrevMoves,
								twoInARowsNeededToBeBlockedArr);

	if (needToBlockOpponent) {
		blockingMovesIdx = getCellIdxToBlockOpponent(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves,
								twoInARowsNeededToBeBlockedArr);
	}

	return blockingMovesIdx;
}

//---------------VARIOUS AGENT AI ALGORITHMS---------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
// Reid: I think steps 1 & 2 are necessary.
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
 * Algorithm based on TicTacToe rules discussed in class and from the TicTacToe Wikipedia article.
 * That article can be found here: https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy .
 */
Agent.prototype.selectMoveWithRules = function(board) {
	var optimalMovesIdx = -1;

	// get all free cells on gameboard
	var freeCells = getFreeCells(board);

	// determine which player's turn it is
	var currPlyr = getCurrPlyr(board);

	// START OF RULE-BASED ALGORITHM!

	// TODO: ***still need to handle edge cases (ie. 1st, 2nd, 3rd, & 4th moves)***

	// Rule 0 - handle edge cases
	// ...

	// Rule 1 - Win, if possible.
	var winningMovesIdx;
	if (freeCells.length <= 5) { // then it's possible to have a winning move
		winningMovesIdx = getWinningMove(freeCells, currPlyr, board);
	}
	if (winningMovesIdx != -1) {
		optimalMovesIdx = winningMovesIdx;
	}

	// Rule 2 - Block opponent if they have a twoInARow.
	var blockingMovesIdx;
	var oppPlyrsIdx = currPlyr == 1 ? 2 : 1;
	if (freeCells.length <= 5) {
		blockingMovesIdx = getBlockingMove(freeCells, currPlyrsIdx, oppPlyrsIdx, board);
	}
	if (blockingMovesIdx != -1) {
		optimalMovesIdx = blockingMovesIdx;
	}

	// Rule 3 - ...

	return optimalMovesIdx;
} 