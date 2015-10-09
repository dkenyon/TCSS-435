/*
 * Completed by Reid Thompson & Josh Rueschenberg
 * For Dr. Chris Marriott
 * TCSS 435 - Fall '15
 * HW #1 - Tic Tac Toe AI Agent
 */

var Agent = function () {

};

//---------------HELPER METHODS---------------

/*
 * Helper method - returns all free cells on gameboard.
 */
var getFreeCells = function(board) {
    var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) freeCells.push(i);
    }
    return freeCells;
};

/*
 * Helper method - determines which player's turn it is currently.
 * Returns a 1 for P1 (Xs) and a 2 for P2 (Os).
 */
var getCurrPlyr = function(board) {
    var p1Moves = board.X; // remember! - X's always go first
    var p2Moves = board.O;
    var currPlyrsIdx = -1; // initial invalid value (for error handling)
    if (p1Moves.length > p2Moves.length) {
        currPlyrsIdx = 2; // O's turn
    } else { // p1Moves.length == p2Moves.length
        currPlyrsIdx = 1; // X's turn'
    }
    return currPlyrsIdx;
};

/*
 * When less than 4 moves have been made total (2 by each player),
 * the next move can be selected pseudo-randomly with some guidance
 */
var getInitialMoves = function(freeCells, currPlyr, board) {
    var p1Moves = board.X;
    var p2Moves = board.O;
    //random number between 1 and 4 to choose a starting corner if we're player 1
    var randCorner = Math.floor(Math.random() * 4) + 1;

    if (p1Moves.length <= 2 || p2Moves.length <= 2) {
        if (currPlyr === 2 && p1Moves.indexOf(5) < 0) {
            return 5;
        } else {
            if (randCorner === 1 && freeCells.indexOf(8) >= 0) {
                return 8;
            } else if (randCorner === 2 && freeCells.indexOf(6) >= 0) {
                return 6;
            } else if (randCorner === 3 && freeCells.indexOf(4) >= 0) {
                return 4;
            } else {
                return 2;
            }
        }
    }
};

/*
 * Helper method - returns a winning, if possible.
 * Otherwise, if winning isn't an option, it returns -1.
 */
var getWinningMove = function(freeCells, currPlyr, board) {
    var returnedMoveIdx = -1; // assume you can't win unless a move is found
    for (var i = 0; i < freeCells.length; i++) {
        var indvCell = freeCells[i];
        // check if winning move could be a corner cell
        if (indvCell == 8 || indvCell == 6 || indvCell == 4 || indvCell == 2) {
            var cornerMoveWins = winningCornerMoveCheck(indvCell, currPlyr, board);
            if (cornerMoveWins) {
                return indvCell;
            }
        }
    }
};

/*
 * Helper method - returns true if indvCell is a winning move and false otherwise.
 */
var winningCornerMoveCheck = function(indvCell, currPlyr, board) {
    var isWinningMove = false;
    if (indvCell == 8) { // top left
        if (currPlyr == 1) { // X's move

        } else { // currPlyr == 2 (O's move)

        }
    } else if (indvCell == 6) { // top right
        if (currPlyr == 1) { // X's move

        } else { // currPlyr == 2 (O's move)

        }
    } else if (indvCell == 4) { // bottom left
        if (currPlyr == 1) { // X's move

        } else { // currPlyr == 2 (O's move)

        }
    } else { // indvCell == 2 (bottom right)
        if (currPlyr == 1) { // X's move

        } else { // currPlyr == 2 (O's move)

        }
    }
};

//---------------VARIOUS AGENT AI ALGORITHMS---------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
//
Agent.prototype.selectMove = function(board) {
    // Step 1: Figure out which cells are free to play on in gameboard
    var freeCells = getFreeCells(board);
    var p1Moves = board.X;
    var p2Moves = board.O;

    //True A.I. automation doesn't really need to happen until at least 3 moves have been made (2 for X, 1 for O)
    if (p1Moves.length <= 2 || p2Moves.length < 2) {
        return getInitialMoves(freeCells, getCurrPlyr(board), board);
    }

};

/*
 * Original provided solution.
 * Description: chooses a cell at random to play for each turn.
 */
Agent.prototype.selectMoveAtRandom = function(board) {
    var freeCells = getFreeCells(board);
    return freeCells[Math.floor(Math.random() * freeCells.length)];
};

/*
 * Algorithm based on TicTacToe rules discussed in class.
 */
Agent.prototype.selectMoveWithRules = function(board) {
    // get all free cells on gameboard
    var freeCells = getFreeCells(board);

    // determine which player's turn it is
    var currPlyr = getCurrPlyr(board);

    // Rule 1 - Win, if possible.
    var winningMovesIdx = -1;
    if (freeCells.length <= 5) { // then it's possible to have a winning move
        winningMovesIdx = getWinningMove(freeCells, currPlyr, board);
    }
    if (winningMovesIdx != -1) {
        return winningMovesIdx;
    }

    // Rule 2 - ...
};



































///**
// * Completed by Reid Thompson & Josh Rueschenberg
// * For Dr. Chris Marriott
// * TCSS 435 - Fall '15
// * HW #1 - Tic Tac Toe
// */
//
//
//var Agent = function () {
//
//};
//
////------------------------------------DIFFERENT AGENT ALGORITHMS---------------------------------------
//
//// OUR BEST SOLUTION...
//Agent.prototype.selectMove = function(board) {
//	// get all free cells
//    var freeCells = getFreeCells(board);
//
//    // get previous move indices for X and O
//    var xMoves = board.X;
//    var oMoves = board.O;
//
//    if (xMoves.length === 0 && oMoves.length === 0) {
//        return 5;
//    }
//
//    //return null;
//    //if (freeCells.indexOf(5) > -1) {
//    //    return pickCenter();
//    //} else {
//    //    return pickCorner(freeCells);
//    //}
//
//};
//
///*
//
//// ORIGINAL PROVIDED SOLUTION...
///!** Description: chooses a cell at random to play for each turn. *!/
//Agent.prototype.selectMoveAtRandom = function(board) {
//	var freeCells = [];
//    for (var i = 1; i < 10; i++) {
//        if (board.cellFree(i)) freeCells.push(i);
//    }
//
//    return freeCells[Math.floor(Math.random() * freeCells.length)];
//};
//
//*/
//
//var getFreeCells = function(board) {
//    var freeCells = [];
//    for (var i = 1; i < 10; i++) {
//        if (board.cellFree(i)) freeCells.push(i);
//    }
//    return freeCells;
//};
//
//var getXMoves = function(board) {
//    return board.X;
//};
//
//var getOMoves = function(board) {
//    return board.O;
//};
//
//var letsWin = function(board) {
//
//};
//
//var pickCenter = function() {
//  return 5;
//};
//
//var pickCorner = function(freeCells) {
//    var result = 0;
//    if (freeCells.indexOf(8) > -1) {
//        result = 8;
//    } else if (freeCells.indexOf(6) > -1) {
//        result = 6;
//    } else if (freeCells.indexOf(4) > -1) {
//        result = 4;
//    } else if (freeCells.indexOf(2) > -1) {
//        result = 2;
//    }
//    return result;
//};
//
//var blockMove = function(board, enemyMoves) {
//    //start with invalid index, implying no move to block
//    result = -1;
//
//};

