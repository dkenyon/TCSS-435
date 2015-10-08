/* 
 * Completed by Reid Thompson & Josh Rueschenberg
 * For Dr. Chris Marriott
 * TCSS 435 - Fall '15
 * HW #1 - Tic Tac Toe AI Agent
 */

var Agent = function () {
	
}

//------------------------------------DIFFERENT AGENT ALGORITHMS---------------------------------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
Agent.prototype.selectMove = function(board) {
	
}

// ORIGINAL PROVIDED SOLUTION...
/* Description: chooses a cell at random to play for each turn. */
Agent.prototype.selectMoveAtRandom = function(board) {
	var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) freeCells.push(i);
    }

    return freeCells[Math.floor(Math.random() * freeCells.length)];
}
