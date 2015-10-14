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
	
};

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
};

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
};

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
};

/*
 * Helper method - handles sub-rule #2 for p2's (O's) first move.
 * Returns the cell index for p2's first move depending on p1's first move.
 */
getPlyrTwosFirstMove = function(oppPlyrsPrevMoves) {
    var p2sFirstMove;

    var cornerCellIdxs = [2,4,6,8];
    var edgeCellIdxs = [1,3,7,9];
    var p1sFirstMove = oppPlyrsPrevMoves[0];

    // if p1 played a corner cell or edge cell, p2 plays center
    if (cornerCellIdxs.indexOf(p1sFirstMove) !== -1
            || edgeCellIdxs.indexOf(p1sFirstMove) !== -1) { // p1 played corner cell or edge cell
        p2sFirstMove = 5; // p2 plays center
    // if p1 played center, p2 plays a corner
    } else { // p1sFirstMove === 5 (p1 played center)
        p2sFirstMove = (Math.floor(Math.random() * 4) + 1) * 2; // p2 randomly chooses corner
    }

    return p2sFirstMove;
};

/*
 * Helper method - if p2 chose the center cell as their first move, this returns a
 * cell index for p1's second move given either a corner or edge first move for p1.
 */
givenPTwoCenterGetP1SecondMove = function(cornerCellIdxs, p1sFirstMove) {
    var p1sSecondMove;

    if (cornerCellIdxs.indexOf(p1sFirstMove) !== -1) { // p1 chose a corner cell first
        if (p1sFirstMove === 2) {
            p1sSecondMove = 8;
        } else if (p1sFirstMove === 4) {
            p1sSecondMove = 6;
        } else if (p1sFirstMove === 6) {
            p1sSecondMove = 4;
        } else { // p1sFirstMove === 8
            p1sSecondMove = 2;
        }
    } else { // edgeCellIdxs.indexOf(p1sFirstMove) !== -1 (p1 chose an edge cell first)
        var neighborCellChooser = Math.floor(Math.random() * 2) + 1;
        if (p1sFirstMove === 1) {
            if (neighborCellChooser === 1) {
                p1sSecondMove = 8;
            } else { // neighborCellChooser === 2
                p1sSecondMove = 6;
            }
        } else if (p1sFirstMove === 3) {
            if (neighborCellChooser === 1) {
                p1sSecondMove = 8;
            } else { // neighborCellChooser === 2
                p1sSecondMove = 4;
            }
        } else if (p1sFirstMove === 7) {
            if (neighborCellChooser === 1) {
                p1sSecondMove = 6;
            } else { // neighborCellChooser === 2
                p1sSecondMove = 2;
            }
        } else { // p1sFirstMove === 9
            if (neighborCellChooser === 1) {
                p1sSecondMove = 4;
            } else { // neighborCellChooser === 2
                p1sSecondMove = 2;
            }
        }
    }

    return p1sSecondMove;
};

/*
 * Helper method - if p2 chose an edge cell as their first move, this returns a
 * cell index for p1's second move given a corner, edge, or center first move for p1.
 */
givenPTwoEdgeGetP1SecondMove = function(cornerCellIdxs, p1sFirstMove, p2sFirstMove) {
    var p1sSecondMove;

    if (cornerCellIdxs.indexOf(p1sFirstMove) !== -1) { // if p1 chose a corner cell first
        // p1 should choose the corner cell on the opposing side to their first move
        if (p1sFirstMove === 2) {
            p1sSecondMove = 8;
        } else if (p1sFirstMove === 4) {
            p1sSecondMove = 6;
        } else if (p1sFirstMove === 6) {
            p1sSecondMove = 4;
        } else { // p1sFirstMove === 8
            p1sSecondMove = 2;
        }
    } else if (p1sFirstMove === 5) { // if p1 chose the center cell first
        // p1 should choose a corner cell for their second move
        // but, which corner(s) they choose depends on which edge cell p2 chose first
        var opposingCornerChooser = Math.floor(Math.random() * 2) + 1;
        if (p2sFirstMove === 1) {
            if (opposingCornerChooser === 1) {
                p1sSecondMove = 4;
            } else { // opposingCornerChooser === 2
                p1sSecondMove = 2;
            }
        } else if (p2sFirstMove === 3) {
            if (opposingCornerChooser === 1) {
                p1sSecondMove = 6;
            } else { // opposingCornerChooser === 2
                p1sSecondMove = 2;
            }
        } else if (p2sFirstMove === 7) {
            if (opposingCornerChooser === 1) {
                p1sSecondMove = 8;
            } else { // opposingCornerChooser === 2
                p1sSecondMove = 4;
            }
        } else { // p2sFirstMove === 9
            if (opposingCornerChooser === 1) {
                p1sSecondMove = 8;
            } else { // opposingCornerChooser === 2
                p1sSecondMove = 6;
            }
        }
    } else { // edgeCellIdxs.indexOf(p1sFirstMove) !== -1 (if p1 chose an edge cell first)
        var edgeMovesAcrossFromEachOther = (p1sFirstMove === 3 && p2sFirstMove === 7)
                || (p1sFirstMove === 7 && p2sFirstMove === 3) || (p1sFirstMove === 1 && p2sFirstMove === 9)
                || (p1sFirstMove === 9 && p2sFirstMove === 1);

        if (edgeMovesAcrossFromEachOther) {
            var neighborCellChooser = Math.floor(Math.random() * 2) + 1;
            if (p1sFirstMove === 1) {
                if (neighborCellChooser === 1) {
                    p1sSecondMove = 8;
                } else { // neighborCellChooser === 2
                    p1sSecondMove = 6;
                }
            } else if (p1sFirstMove === 3) {
                if (neighborCellChooser === 1) {
                    p1sSecondMove = 8;
                } else { // neighborCellChooser === 2
                    p1sSecondMove = 4;
                }
            } else if (p1sFirstMove === 7) {
                if (neighborCellChooser === 1) {
                    p1sSecondMove = 6;
                } else { // neighborCellChooser === 2
                    p1sSecondMove = 2;
                }
            } else { // p1sFirstMove === 9
                if (neighborCellChooser === 1) {
                    p1sSecondMove = 4;
                } else { // neighborCellChooser === 2
                    p1sSecondMove = 2;
                }
            }
        } else { // p1 and p2's edge moves are not across from one another
            p1sSecondMove = 5; // choose center
        }
    }

    return p1sSecondMove;
};

/*
 * Helper method - if p2 chose a corner cell as their first move, this returns a
 * cell index for p1's second move given a center, corner, or edge first move for p1.
 */
givenPTwoCornerGetP1SecondMove = function(edgeCellIdxs, p1sFirstMove, p2sFirstMove) {
    var p1sSecondMove;

    var cornerCellChooser = Math.floor(Math.random() * 2) + 1;
    if (edgeCellIdxs.indexOf(p1sFirstMove) !== -1) { // if p1's first move was an edge cell
        // whether p1 and p2's first moves are on the same side of the board or not, by choosing
        // the center cell, p1 both blocks p2 and creates a twoInARow
        p1sSecondMove = 5;
    } else if (p1sFirstMove === 5) { // if p1's first move was the center cell
        if (p2sFirstMove === 4) {
            if (cornerCellChooser === 1) {
                p1sSecondMove = 8;
            } else { // cornerCellChooser === 2
                p1sSecondMove = 2;
            }
        } else if (p2sFirstMove === 8) {
            if (cornerCellChooser === 1) {
                p1sSecondMove = 4;
            } else { // cornerCellChooser === 2
                p1sSecondMove = 6;
            }
        } else if (p2sFirstMove === 6) {
            if (cornerCellChooser === 1) {
                p1sSecondMove = 8;
            } else { // cornerCellChooser === 2
                p1sSecondMove = 2;
            }
        } else { // p2sFirstMove === 2
            if (cornerCellChooser === 1) {
                p1sSecondMove = 4;
            } else { // cornerCellChooser === 2
                p1sSecondMove = 6;
            }
        }
    } else { // if p1's first move was a corner cell
        var firstMovesAreOppositeCorners = (p1sFirstMove === 4 && p2sFirstMove === 6)
                || (p1sFirstMove === 6 && p2sFirstMove === 4) || (p1sFirstMove === 8 && p2sFirstMove === 2)
                || (p1sFirstMove === 2 && p2sFirstMove === 8);

        if (firstMovesAreOppositeCorners) { // then p1 should pick any other corner for their second move
            if (p1sFirstMove === 4 || p1sFirstMove === 6) {
                if (cornerCellChooser === 1) {
                    p1sSecondMove = 8;
                } else { // cornerCellChooser === 2
                    p1sSecondMove = 2;
                }
            } else { // (p1sFirstMove === 8 || p1sFirstMove === 2)
                if (cornerCellChooser === 1) {
                    p1sSecondMove = 4;
                } else { // cornerCellChooser === 2
                    p1sSecondMove = 6;
                }
            }
        } else { // then p1 must pick the opposite corner to p2's first move
            if (p2sFirstMove === 4) {
                p1sSecondMove = 6;
            } else if (p2sFirstMove === 8) {
                p1sSecondMove = 2;
            } else if (p2sFirstMove === 6) {
                p1sSecondMove = 4;
            } else { // p2sFirstMove === 2
                p1sSecondMove = 8;
            }
        }
    }

    return p1sSecondMove;
};

/*
 * Helper method - returns the cell index for p2's second move, given the first moves of
 * p1 and p2.
 */
getPlyrOnesSecondMove = function(p1sFirstMove, p2sFirstMove) {
    var p1sSecondMove;

    var cornerCellIdxs = [2,4,6,8];
    var edgeCellIdxs = [1,3,7,9];

    if (p2sFirstMove === 5) { // if p2 chose a center cell first
        p1sSecondMove = givenPTwoCenterGetP1SecondMove(cornerCellIdxs, p1sFirstMove);
    } else if (edgeCellIdxs.indexOf(p2sFirstMove) !== -1) { // if p2 chose an edge cell first
        p1sSecondMove = givenPTwoEdgeGetP1SecondMove(cornerCellIdxs, p1sFirstMove, p2sFirstMove);
    } else { // cornerCellIdxs.indexOf(p2sFirstMove) !== -1 (if p2 chose a corner cell first)
        p1sSecondMove = givenPTwoCornerGetP1SecondMove(edgeCellIdxs, p1sFirstMove, p2sFirstMove);
    }

    return p1sSecondMove;
};

/*
 * Helper method - Depending on currPlyr, it returns the index of an initial move
 * for p1 or p2 (assuming some basic strategy tenets from the TicTacToe Wikipedia article).
 */
getAnInitialMove = function(freeCells, currPlyr, board) {
    var initialMovesIdx;

    var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);
    var oppPlyr = currPlyr === 1 ? 2 : 1;
    var oppPlyrsPrevMoves = getCurrPlyrsPrevMoves(oppPlyr, board);

    // Sub-rule 1: playing the corner gives the opponent the smallest choice of squares which
    // must be played to avoid losing
    if (freeCells.length === 9) { // no more has yet been made, p1's turn
        // random number between 1 and 4 (turned into a corner cell's index)
        initialMovesIdx = (Math.floor(Math.random() * 4) + 1) * 2;
    // Sub-rule 2: O's opening mark must be played in such a way as to avoid the forced win by X
    } else if (freeCells.length === 8) {
        initialMovesIdx = getPlyrTwosFirstMove(oppPlyrsPrevMoves);
    // Sule-rule 3: X's second move (if their first move was a corner cell) should be the opposing
    // corner cell on the board. All other combinations of p1 and p2's first moves are accounted for.
    } else { // freeCells.length === 7
        var p1sFirstMove = currPlyrsPrevMoves[0];
        var p2sFirstMove = oppPlyrsPrevMoves[0];
        initialMovesIdx = getPlyrOnesSecondMove(p1sFirstMove, p2sFirstMove);
    }

    return initialMovesIdx;
};

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
};

/*
 * Helper method - returns true if indvCell (corner cell) is a winning move and false otherwise.
 */
winningCornerMoveCheck = function(indvCell, currPlyr, board) {
	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromCornerMove = false; // assume game's not won yet
	if (indvCell === 8) { // top left
		threeInARowFromCornerMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 6) // check right
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
};

/*
 * Helper method - returns true if indvCell (side middle) is a winning move and false otherwise.
 */
winningSideMiddleMoveCheck = function(indvCell, currPlyr, board) {
	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	var threeInARowFromMiddleMove = false; // assume game's not won yet

	if (indvCell === 1) { // top center
		threeInARowFromMiddleMove = determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 6) // check horizontal
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
};

/*
 * Helper method - returns true if indvCell (center) is a winning move and false otherwise.
 */
winningCenterMoveCheck = function(indvCell, currPlyr, board) {
	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyr, board);

	return determineWhetherMoveWinsGame(currPlyrsPrevMoves, 1, 9) // checks vertical
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 3, 7) // checks horizontal
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 8, 2) // checks top left to bottom right
			|| determineWhetherMoveWinsGame(currPlyrsPrevMoves, 6, 4); // checks top right to bottom left
};

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
};

/*
 * Helper method - returns true if opposing player has a twoInARow that needs blocking and false otherwise.
 */
determineWhetherOpponentNeedsToBeBlocked = function(currPlyrsPrevMoves, oppPlyrsPrevMoves,
                                                    twoInARowsNeededToBeBlockedArr) {
	var oppNeedsToBeBlocked = false; // assume that currPlyr doesn't need to block opponent unless necessary

	for (var i = 0; i < twoInARowsNeededToBeBlockedArr.length; i++) {
		var currTwoInARow = twoInARowsNeededToBeBlockedArr[i];

		if (currPlyrsPrevMoves.indexOf(currTwoInARow[0] !== -1)
				&& currPlyrsPrevMoves.indexOf(currTwoInARow[1]) !== -1) {
			oppNeedsToBeBlocked = true;
			break;
		}
	}

	return oppNeedsToBeBlocked;
};

/*
 * Helper method - returns the cell index that the current player needs to fill in order to block their opponent.
 */
getCellIdxToBlockOpponent = function(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves,
                                     twoInARowsNeededToBeBlockedArr) {
	var blockingMovesIdx;

	// indexes of these moves correspond with indexes of twoInARowsNeededToBeBlockedArr
	var allBlockingMoveOptions = [4, 9, 2, 8, 1, 6, 6, 8, 7, 3, 2, 4, 2, 8, 6, 4];

	for (var i = 0; i < twoInARowsNeededToBeBlockedArr.length; i++) {
		var currTwoInARow = twoInARowsNeededToBeBlockedArr[i];
		if (oppPlyrsPrevMoves.indexOf(currTwoInARow[0]) !== -1 && oppPlyrsPrevMoves.indexOf(currTwoInARow[1]) !== -1) {
			blockingMovesIdx = allBlockingMoveOptions[i];
		}
	}

	return blockingMovesIdx;
};

/*
 * Helper method - returns a blocking move's index, if necessary (meaning opponent has a twoInARow).
 * Otherwise, it returns -1.
 */
getBlockingMove = function(freeCells, currPlyrsIdx, oppPlyrsIdx, board)  {
	var blockingMovesIdx = -1; // assume not blocking move is necessary unless one is found

	var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyrsIdx, board);
	var oppPlyrsPrevMoves = getCurrPlyrsPrevMoves(oppPlyrsIdx, board);

	var twoInARowsNeededToBeBlockedArr = [[8,3], [1,5], [6,7], [4,3],[5,9],[7,2],  // all vertical twoInARows
										[8,1], [1,6], [3,5], [5,7], [4,9], [9,2], // all horiz twoInARows
                                        [8,5], [5,2], [4,5], [5,6]];                // all diag twoInARows

	var needToBlockOpponent = determineWhetherOpponentNeedsToBeBlocked(currPlyrsPrevMoves, oppPlyrsPrevMoves,
								twoInARowsNeededToBeBlockedArr);

	if (needToBlockOpponent) {
		blockingMovesIdx = getCellIdxToBlockOpponent(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves,
								twoInARowsNeededToBeBlockedArr);
	}

	return blockingMovesIdx;
};

/*
 * Helper method - returns true if there exists a move that can create a fork opportunity for the
 * current player and false otherwise.
 */
determineWhetherForkCanBeCreated = function(freeCells, currPlyrsPrevMoves, allPossibleSetupsToCreateAFork) {
    var forkCanBeCreated = false; // assume that a fork cannot be created unless an opportunity is found

    for (var i = 0; i < allPossibleSetupsToCreateAFork.length; i++) {
        var currSetup = allPossibleSetupsToCreateAFork[i];

        if (currPlyrsPrevMoves.indexOf(currSetup[0]) !== -1 && currPlyrsPrevMoves.indexOf(currSetup[1]) !== -1) {
            forkCanBeCreated = true;
            break;
        }
    }

    return forkCanBeCreated;
};

/*
 * Helper method - returns a cell index creating a fork opportunity for the current player.
 */
getCellIdxThatCreatesAFork = function(freeCells, currPlyrsPrevMoves, allPossibleSetupsToCreateAFork) {
    var forkingMovesIdx;

    // the indexes of these moves correspond to the indexes in the allPossibleSetupsToCreateAFork array
    var allForkingMovesOptionPairs = [[8,2],[6,2],[8,6],[4,2],[4,6],[4,8]];

    for (var i = 0; i < allPossibleSetupsToCreateAFork.length; i++) {
        var currSetup = allPossibleSetupsToCreateAFork[i];
        if (currPlyrsPrevMoves.indexOf(currSetup[0]) !== -1 && currPlyrsPrevMoves.indexOf(currSetup[1]) !== -1) {
            var currForkOptionPair = allForkingMovesOptionPairs[i];
            if (freeCells.indexOf(currForkOptionPair[0]) !== -1) {
                forkingMovesIdx = currForkOptionPair[0];
                break;
            } else if (freeCells.indexOf(currForkOptionPair[1]) !== -1) {
                forkingMovesIdx = currForkOptionPair[1];
                break;
            }
        }
    }

    return forkingMovesIdx;
};

/*
 * Helper method - returns a forking move's index (meaning setting up 2 potential twoInARows)
 * and -1 otherwise.
 */
getForkingMove=  function(freeCells, currPlyrsIdx, board) {
    var forkingMovesIdx = -1;

    var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyrsIdx, board);

    var allPossibleSetupsToCreateAFork = [[4,6],[4,8],[4,2],[8,6],[8,2],[6,2]];

    var possibleToCreateAFork = determineWhetherForkCanBeCreated(freeCells, currPlyrsPrevMoves,
                                    allPossibleSetupsToCreateAFork);

    if (possibleToCreateAFork) {
        forkingMovesIdx = getCellIdxThatCreatesAFork(freeCells, currPlyrsPrevMoves,
                            allPossibleSetupsToCreateAFork);
    }

    return forkingMovesIdx;
};

/*
 * Helper method - returns true if a twoInARow can be created and false otherwise.
 */
determineWhetherStrategicTwoInARowCanBeCreated = function(freeCells, currPlyrsPrevMoves) {
    var twoInARowCanBeCreated = false; // assume twoInARow cannot be created unless otherwise shown

    var allStrategicTwoInARows = [[3,5],[1,5],[5,7],[5,9]]; // none of the twoInARows can include a corner cell

    for (var i = 0; i < allStrategicTwoInARows.length; i++) {
        var currTwoInARow = allStrategicTwoInARows[i];

        // one of the cells in currTwoInARow is free and the other was a previous move of the current player,
        // meaning that it is possible for the current player to create a twoInARow
        if ((freeCells.indexOf(currTwoInARow[0]) !== -1 && currPlyrsPrevMoves.indexOf(currTwoInARow[1]) !== -1)
                || (freeCells.indexOf(currTwoInARow[1]) !== -1 && currPlyrsPrevMoves.indexOf(currTwoInARow[0]) !== -1))
        {
            twoInARowCanBeCreated = true;
            break;
        }
    }

    return twoInARowCanBeCreated;
};

/*
 * Helper method - return the index of the cell that will create a twoInARow for the current player.
 */
getCellIdxCreatingAStrategicTwoInARow = function(freeCells, currPlyrsPrevMoves) {
    var cellIdxCreatingATwoInARow;

    var allStrategicTwoInARows = [[3,5],[1,5],[5,7],[5,9]]; // none of the twoInARows can include a corner cell

    for (var i = 0; i < allStrategicTwoInARows.length; i++) {
        var currTwoInARow = allStrategicTwoInARows[i];

        if ((freeCells.indexOf(currTwoInARow[0]) !== -1 && currPlyrsPrevMoves.indexOf(currTwoInARow[1]) !== -1)
            || (freeCells.indexOf(currTwoInARow[1]) !== -1 && currPlyrsPrevMoves.indexOf(currTwoInARow[0]) !== -1))
        {
            if (freeCells.indexOf(currTwoInARow[0]) !== -1) { // first cell in currTwoInARow is free
                cellIdxCreatingATwoInARow = currTwoInARow[0];
            } else { // freeCells.indexOf(currTwoInARow[1]) !== -1 (second cell in currTwoInARow is free)
                cellIdxCreatingATwoInARow = currTwoInARow[1];
            }
            break;
        }
    }

    return cellIdxCreatingATwoInARow;
};

/*
 * Helper method - returns the opponent's specific fork setup (pair of cell indexes).
 */
determineOpponentsSpecificForkSetup = function(oppPlyrsPrevMoves, allPossibleSetupsToCreateAFork) {
    var opponentsForkSetup;

    for (var i = 0; i < allPossibleSetupsToCreateAFork.length; i++) {
        var currForkSetup = allPossibleSetupsToCreateAFork[i];
        if (oppPlyrsPrevMoves.indexOf(currForkSetup[0]) !== -1 && oppPlyrsPrevMoves.indexOf(currForkSetup[1]) !== -1) {
            opponentsForkSetup = currForkSetup;
            break;
        }
    }

    return opponentsForkSetup;
};

/*
 * Helper method - returns true if the configuration of the opponentsForkSetup is same side and false otherwise.
 */
determineWhetherOpponentsForkIsSameSideConfiguration = function(opponentsForkSetup) {
    var oppHasSameSideForkSetup = false;

    var allSameSideForkSetups = [[4,8],[4,2],[8,6],[6,2]];
    for (var i = 0; i < allSameSideForkSetups.length; i++) {
        var currSameSideForkSetup = allSameSideForkSetups[i];
        if (opponentsForkSetup.indexOf(currSameSideForkSetup[0]) !== -1
                && opponentsForkSetup.indexOf(currSameSideForkSetup[1]) !== -1) {
            oppHasSameSideForkSetup = true;
            break;
        }
    }

    return oppHasSameSideForkSetup;
};

/*
 * Helper method - returns the 'most strategic' cell's index to block a potential opponent's fork.
 */
determineStrategicForkBlockingCellsIdx = function(oppHasOpposingSideForkSetup, freeCells, opponentsForkSetup) {
    var strategicForkBlockingCellIdx;

    var centerCellIdx = 5;
    var edgeCellIdxs = [1,3,7,9];
    if (oppHasOpposingSideForkSetup) { // general strategy: choose center first, or an edge cell second
        if (freeCells.indexOf(centerCellIdx) !== -1) { // if center cell is free, pick it!
            strategicForkBlockingCellIdx = centerCellIdx;
        } else { // if center cell is occupied, then choose any edge cell
            for (var i = 0; i < edgeCellIdxs.length; i++) {
                var currEdgeCell = edgeCellIdxs[i];
                if (freeCells.indexOf(currEdgeCell) !== -1) { // if currEdgeCell is free, take it!
                    strategicForkBlockingCellIdx = currEdgeCell;
                    break;
                }
            }
        }
    } else { // oppHasSameSideForkSetup = true
        if (opponentsForkSetup.indexOf(8) !== -1 && opponentsForkSetup.indexOf(4) !== -1) {
            // first, block potential win (if necessary)
            if (freeCells.indexOf(3) !== -1) {
                strategicForkBlockingCellIdx = 3;
            } else { // second, take center (if possible)
                strategicForkBlockingCellIdx = 5;
            }
        } else if (opponentsForkSetup.indexOf(8) !== -1 && opponentsForkSetup.indexOf(6) !== -1) {
            // first, block potential win (if necessary)
            if (freeCells.indexOf(1) !== -1) {
                strategicForkBlockingCellIdx = 1;
            } else { // second, take center (if possible)
                strategicForkBlockingCellIdx = 5;
            }
        } else if (opponentsForkSetup.indexOf(6) !== -1 && opponentsForkSetup.indexOf(2) !== -1) {
            // first, block potential win (if necessary)
            if (freeCells.indexOf(7) !== -1) {
                strategicForkBlockingCellIdx = 7;
            } else { // second, take center (if possible)
                strategicForkBlockingCellIdx = 5;
            }
        } else { // opponentsForkSetup.indexOf(2) !== -1 && opponentsForkSetup.indexOf(4) !== -1
            // first, block potential win (if necessary)
            if (freeCells.indexOf(9) !== -1) {
                strategicForkBlockingCellIdx = 9;
            } else { // second, take center (if possible)
                strategicForkBlockingCellIdx = 5;
            }
        }
    }

    return strategicForkBlockingCellIdx;
};

/*
 * Helper method - returns the cell index required for the current player's current move in order to block
 * an opponent's opportunity to create a fork.
 */
getCellIdxThatStrategicallyBlocksOpponentsFork = function(freeCells, currPlyrsPrevMoves, oppPlyrsPrevMoves,
                                                          allPossibleSetupsToCreateAFork) {
    var strategicForkBlockingCellIdx;

    // determine opponent's specific fork setup from their previous moves
    var opponentsForkSetup = determineOpponentsSpecificForkSetup(oppPlyrsPrevMoves, allPossibleSetupsToCreateAFork);

    // determine specific configuration of opponentsForkSetup - opposing side or same side
    var oppHasSameSideForkSetup = determineWhetherOpponentsForkIsSameSideConfiguration(opponentsForkSetup);
    var oppHasOpposingSideForkSetup;
    if (!oppHasSameSideForkSetup) {
        oppHasOpposingSideForkSetup = true;
    }

    // determine strategic move for blocking opponent's fork based on its configuration
    strategicForkBlockingCellIdx = determineStrategicForkBlockingCellsIdx(oppHasOpposingSideForkSetup, freeCells,
                                                                            opponentsForkSetup);

    return strategicForkBlockingCellIdx;
};

/*
 * Helper method - returns a cell's index that blocks a potential fork of the opponent and -1 otherwise.
 */
getForkBlockingMove = function(freeCells, currPlyrsIdx, board) {
    var forkBlockingMovesIdx = -1;

    var oppPlyrsIdx = currPlyrsIdx === 1 ? 2 : 1;
    var currPlyrsPrevMoves = getCurrPlyrsPrevMoves(currPlyrsIdx, board);
    var oppPlyrsPrevMoves = getCurrPlyrsPrevMoves(oppPlyrsIdx, board);

    var allPossibleSetupsToCreateAFork = [[4,6],[4,8],[4,2],[8,6],[8,2],[6,2]]; // must involve corner cells

    var possibleToCreateAFork = determineWhetherForkCanBeCreated(freeCells, oppPlyrsPrevMoves,
                                    allPossibleSetupsToCreateAFork);

    // if it's possible for the opposing player to make a fork on their next move, then the current player
    // should either play a twoInARow (option 1) or block the opposing player's fork (option 2)
    if (possibleToCreateAFork) {
        // ***Prefer option 1 over option 2***

        var twoInARowCanBeCreated = determineWhetherStrategicTwoInARowCanBeCreated(freeCells, currPlyrsPrevMoves);

        // Option 1 impact - opponent has to defend rather than fork
        if (twoInARowCanBeCreated) { // prefer option 1
            forkBlockingMovesIdx = getCellIdxCreatingAStrategicTwoInARow(freeCells, currPlyrsPrevMoves);
        // Option 2 impact - opponent can no longer fork
        } else { // resort to option 2
            forkBlockingMovesIdx = getCellIdxThatStrategicallyBlocksOpponentsFork(freeCells, currPlyrsPrevMoves,
                                    oppPlyrsPrevMoves, allPossibleSetupsToCreateAFork);
        }
    }

    return forkBlockingMovesIdx;
};

/*
 * Helper method - returns the index of the free cell opposing an opponent's corner move and
 * returns -1 if such a cell doesn't exist.
 */
getOpposingCornerMovesIdx = function(freeCells, currPlyrsIdx, board) {
    var opposingCornerMovesIdx = -1;

    var oppPlyrsIdx = currPlyrsIdx === 1 ? 2 : 1;
    var oppPlyrsPrevMoves = getCurrPlyrsPrevMoves(oppPlyrsIdx, board);

    if (oppPlyrsPrevMoves.indexOf(4) !== -1) {
        if (freeCells.indexOf(6) !== -1) {
            opposingCornerMovesIdx = 6;
        }
    } else if (oppPlyrsPrevMoves.indexOf(8) !== -1) {
        if (freeCells.indexOf(2) !== -1) {
            opposingCornerMovesIdx = 2;
        }
    } else if (oppPlyrsPrevMoves.indexOf(6) !== -1) {
        if (freeCells.indexOf(4) !== -1) {
            opposingCornerMovesIdx = 4;
        }
    } else { // oppPlyrsPrevMoves.indexOf(2) !== -1
        if (freeCells.indexOf(8) !== -1) {
            opposingCornerMovesIdx = 8;
        }
    }

    return opposingCornerMovesIdx;
};

//---------------VARIOUS AGENT AI ALGORITHMS---------------

// OUR BEST SOLUTION...LEAVE BLANK UNTIL ALL OPTIONS HAVE BEEN CONSIDERED
// Reid: I think steps 1 & 2 are necessary.
Agent.prototype.selectMove = function(board) {
	// Step 1: Figure out which cells are free to play on in gameboard
	var freeCells = getFreeCells(board);

	// Step 2: Determine which player's turn it is
	var currPlyr = getCurrPlyr(board);
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
 * Algorithm based on TicTacToe rules discussed in class and from the TicTacToe Wikipedia article.
 * That article can be found here: https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy .
 */
Agent.prototype.selectMoveWithRules = function(board) {
	var optimalMovesIdx = -1;
    var optimalMoveFound = false; // assume no found until solution cell is discovered

	// get all free cells on gameboard
	var freeCells = getFreeCells(board);

	// determine which player's turn it is and which player is the opponent
	var currPlyrsIdx = getCurrPlyr(board);

	// START OF RULE-BASED ALGORITHM!

	// Rule 0 - handle edge cases (moves 1 - 3)
    if (freeCells.length > 6) { // first 3 moves are 'edge cases'
        optimalMovesIdx = getAnInitialMove(freeCells, currPlyrsIdx, board);
        optimalMoveFound = true;
    }

	// Rule 1 - Win, if possible.
	var winningMovesIdx;
	if (!optimalMoveFound && freeCells.length <= 5) { // then it's possible for p1 to have a winning move
		winningMovesIdx = getWinningMove(freeCells, currPlyrsIdx, board);
        if (winningMovesIdx != -1) {
            optimalMovesIdx = winningMovesIdx;
            optimalMoveFound = true;
        }
	}

	// Rule 2 - Block opponent if they have a twoInARow.
	var blockingMovesIdx;
    var oppPlyrsIdx = currPlyrsIdx === 1 ? 2 : 1;
	if (!optimalMoveFound && freeCells.length <= 6) { // then it's possible for p2 to have a blocking move
		blockingMovesIdx = getBlockingMove(freeCells, currPlyrsIdx, oppPlyrsIdx, board);
        if (blockingMovesIdx !== -1) {
            optimalMovesIdx = blockingMovesIdx;
            optimalMoveFound = true;
        }
	}

	// Rule 3 - Create a fork when possible
	var forkingMovesIdx;
    if (!optimalMoveFound && freeCells.length <= 5) { // then it's possible for p1 to have a forking move
        forkingMovesIdx = getForkingMove(freeCells, currPlyrsIdx, board);
        if (forkingMovesIdx !== -1) {
            optimalMovesIdx = forkingMovesIdx;
            optimalMoveFound = true;
        }
    }

    // Rule 4 - Block an opponent's potential fork
    var forkBlockingMovesIdx;
    if (!optimalMoveFound && freeCells.length <= 6) {
        forkBlockingMovesIdx = getForkBlockingMove(freeCells, currPlyrsIdx, board);
        if (forkBlockingMovesIdx !== -1) {
            optimalMovesIdx = forkBlockingMovesIdx;
            optimalMoveFound = true;
        }
    }

    // Rule 5 - Play center
    var centerCellIdx = 5;
    if (!optimalMoveFound && freeCells.indexOf(centerCellIdx) !== -1) {
        optimalMovesIdx = 5; // pick center
        optimalMoveFound = true;
    }

    // Rule 6 - If the opponent played in one corner, play in the opposing corner
    var opposingCornerMovesIdx;
    if (!optimalMoveFound) {
        opposingCornerMovesIdx = getOpposingCornerMovesIdx(freeCells, currPlyrsIdx, board);
        if (opposingCornerMovesIdx !== -1) {
            optimalMovesIdx = opposingCornerMovesIdx;
            optimalMoveFound = true;
        }
    }

    // TODO: Rule 7 - Play in an empty corner cell
    var cornerCellIdxs = [];

    // TODO: Rule 8 - Play in an empty edge cell
    var edgeCellIdxs = [];

	return optimalMovesIdx;
};