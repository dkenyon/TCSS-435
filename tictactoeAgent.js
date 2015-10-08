/* 
 * Completed by Reid Thompson & Josh Rueschenberg
 * For Dr. Chris Marriott
 * TCSS 435 - Fall '15
 * HW #1 - Tic Tac Toe AI Agent
 */

var Agent = function () {
	
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
 * Helper method - returns a winning, if possible.
 * Otherwise, if winning isn't an option, it returns -1.
 */
Agent.prototype.getWinningMove = function(freeCells) {
	var returnedMoveIdx = -1; // assume you can't win unless a move is found
	if (freeCells.length >= 8) { // neither player can win on first turn
		return returnedMoveIdx;
	} else {
		for (var i = 0; i < freeCells.length; i++) {
		var indvCell = freeCells[i];
		// check if it's a corner

	}
	}
}

//---------------VARIOUS AGENT AI ALGORITHMS---------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
// 
Agent.prototype.selectMove = function(board) {
	// Step 1: Figure out which cells are free to play on in gameboard
	var freeCells = getFreeCells(board);
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
	var freeCells = getFreeCells(board);

	// Rule 1 - Win, if possible.
	var winningMovesIdx = getWinningMove();
	if (winningMovesIdx != -1) {
		return winningMovesIdx;
	}
} 