/*
 * Dennis Kenyon
 * Tic Tac Toe Agent
 * 15 OCT 2015
 * TCSS 435
 */

// instantiates the Agent object
var Agent = function () {

}

/*
 * Plays the perfect move; an agent continually calling this method wins or draws every game.
 * Follows the 8-step Model of Expert Performance by Crowley and Siegler
 *      (Cognitive Science Journal, Volume 17, Issue 4, page 536)
 * @param {type} board the board the agent is playing on
 * @returns {Number} the perfect move for the agent to play
 */
Agent.prototype.selectMove = function(board) {
    //----START BOARD STATE RECREATION----//
    //instantiates a copy of the board to get its current state
    var theBoard = board.clone();
    //create copy arrays to fill from board clone 
    var freeCells = [];
    var XFilledCells = [];
    var OFilledCells = [];

    //loop through board clone to populate arrays; board's state now updated
    for (var i = 1; i < 10; i++) { //populate freeCells array
        if (board.cellFree(i)) freeCells.push(i); //pushes all empty cells to freeCells array
    }   
    for (var i = 0; i < theBoard.X.length; i++) { //populate x-filled cells array from board clone
        XFilledCells.push(theBoard.X[i]);
    }
    for (var i = 0; i < theBoard.O.length; i++) {
        OFilledCells.push(theBoard.O[i]);
    }
    //-----END BOARD STATE RECREATION-----//
    
    /*
     * ----WIN----
     * "if there is a row, column, or diagonal with two of my pieces and a blank space,
     * then play the blank space"
     */
    if (XFilledCells.length > 1 && theBoard.playerOne) { //x winning move
        for (var i = 0; i < freeCells.length; i++) {
            for (var j = 0; j < XFilledCells.length - 1; j++) {
                for (var k = j + 1; k < XFilledCells.length; k++) {
                    if (freeCells[i] + XFilledCells[j] + XFilledCells[k] === 15) {
                        alert("x winning move");
                        return freeCells[i];
                    }
                }
            }
        }
    }
    if (OFilledCells.length > 1 && !theBoard.playerOne) { //o winning move
        for (var i = 0; i < freeCells.length; i++) {
            for (var j = 0; j < OFilledCells.length - 1; j++) {
                for (var k = j + 1; k < OFilledCells.length; k++) {
                    if (freeCells[i] + OFilledCells[j] + OFilledCells[k] === 15) {
                        alert("o winning move");
                        return freeCells[i];
                    }
                }
            }
        }
    }
    //-------END WIN-------//
   
    /*
     * ----BLOCK----
     * "if there is a row/col/diag with two of my opponent's pieces and a blank space
     * then play the blank space (thus blocking a potential win for my opponent)"
     */
    if (OFilledCells.length > 1 && theBoard.playerOne) { //x blocking o
        for (var i = 0; i < freeCells.length; i++) {
            for (var j = 0; j < OFilledCells.length - 1; j++) {
                for (var k = j + 1; k < OFilledCells.length; k++) {
                    if (freeCells[i] + OFilledCells[j] + OFilledCells[k] === 15) {
                        alert("x making block");
                        return freeCells[i];
                    }
                }
            }
        }
    } else if (XFilledCells.length > 1 && !theBoard.playerOne) { //o blocking x
        for (var i = 0; i < freeCells.length; i++) {
            for (var j = 0; j < XFilledCells.length - 1; j++) {
                for (var k = j + 1; k < XFilledCells.length; k++) {
                    if (freeCells[i] + XFilledCells[j] + XFilledCells[k] === 15) {
                        alert("o making block");
                        return freeCells[i];
                    }
                }
            }
        }
    }
    //----END BLOCK----//
    
    /*
     * ----FORK----
     * "if there are two intersecting row/col/diag with one of my pieces and two blanks, and
     * if the intersecting space is empty,
     * then move to the intersecting space (creating two ways to win on my next turn)"
     */
    var counterFork = 0;
    if (theBoard.playerOne) { //player X makes a fork
        for (var i = 0; i < freeCells.length; i++) {
            counterFork = 0;
            for (var j = 0; j < XFilledCells.length; j++) {
                for (var k = 0; k < freeCells.length; k++) {
                    if (freeCells[k] + freeCells[i] + XFilledCells[j] === 15) {
                        counterFork++;
                        if (counterFork === 2) {
                            alert("x fork at " + freeCells[i]);
                            return freeCells[i];
                        }
                    }
                }
            }
        }
    } else if (!theBoard.playerOne) { //player O makes a fork
        for (var i = 0; i < freeCells.length; i++) {
            counterFork = 0;
            for (var j = 0; j < OFilledCells.length; j++) {
                for (var k = 0; k < freeCells.length; k++) {
                    if (freeCells[k] + freeCells[i] + OFilledCells[j] === 15) {
                        counterFork++;
                        if (counterFork === 2) {
                            alert("o fork at " + freeCells[i]);
                            return freeCells[i];
                        }
                    }
                }
            }
        }
    }
    //----END FORK----//
    
    /*
     * ----BLOCK FORK----
     * "if there are two intersecting row/col/diag with one of my pieces and two blanks, and
     * if the intersecting space is empty,
     * then
     *      if there is an empty location that creates a two-in-a-row for me
     *      (^forcing opponenet to block rather than fork)
     *      then move to the location.
     *      else move to the intersection space (thus occupying the location that
     *      my opponent could use to fork)"
     */
    var counterBlockFork = 0;
    var enemyForkPosition = 0;
    if (theBoard.playerOne) { //x blocking an o fork
        for (var i = 0; i < freeCells.length; i++) {
            counterBlockFork = 0;
            for (var j = 0; j < OFilledCells.length; j++) {
                for (var k = 0; k < freeCells.length; k++) {
                    if (freeCells[k] + freeCells[i] + OFilledCells[j] === 15) {
                        counterBlockFork++;
                        if (counterBlockFork === 2) {
                            enemyForkPosition = freeCells[i];
                            alert("x blocking o fork position at " + freeCells[i]);
                            for (var a = 0; a < OFilledCells.length; a++) {
                                for (var b = 0; b < freeCells.length - 1; b++) {
                                    for (var c = b + 1; c < freeCells.length; c++) {
                                        if (OFilledCells[a] + freeCells[b] + freeCells[c] === 15) {
                                            if (freeCells[b] % 2 === 0 && freeCells[b] !== enemyForkPosition) {
                                                return freeCells[b];
                                            } else if (freeCells[c] % 2 === 0 && freeCells[c] !== enemyForkPosition){
                                                return freeCells[c];
                                            }
                                        }
                                    }
                                }
                                return enemyForkPosition;
                            }
                        }
                    }
                }
            }
        }
    }
    if (!theBoard.playerOne) { //o blocking an x fork
        for (var i = 0; i < freeCells.length; i++) {
            counterBlockFork = 0;
            for (var j = 0; j < XFilledCells.length; j++) {
                for (var k = 0; k < freeCells.length; k++) {
                    if (freeCells[k] + freeCells[i] + XFilledCells[j] === 15) {
                        counterBlockFork++;
                        if (counterBlockFork === 2) {
                            enemyForkPosition = freeCells[i];
                            alert("o blocking x fork position at " + freeCells[i]);
                            for (var a = 0; a < XFilledCells.length; a++) {
                                for (var b = 0; b < freeCells.length - 1; b++) {
                                    for (var c = b + 1; c < freeCells.length; c++) {
                                        if (XFilledCells[a] + freeCells[b] + freeCells[c] === 15) {
                                            if (freeCells[b] % 2 === 0 && freeCells[b] !== enemyForkPosition) {
                                                return freeCells[b];
                                            } else if (freeCells[c] % 2 === 0 && freeCells[c] !== enemyForkPosition){
                                                return freeCells[c];
                                            }
                                        }
                                    }
                                }
                                return enemyForkPosition;
                            }
                        }
                    }
                }
            }
        }
    }
    //----END BLOCK FORK----//
    
    /*
     * ----PLAY CENTER----
     * "if the center is blank,
     * then play the center"
     */
    var openCenter = false;
    for (var i = 0; i < freeCells.length; i++) {
        if (freeCells[i] === 5) {
            openCenter = true;
        }
    }
    if (openCenter) {
        if (theBoard.playerOne) alert("x taking center");
        if (!theBoard.playerOne) alert("o taking center");
        return 5;
    }
    //----END PLAY CENTER----//
    
    /*
     * ----PLAY OPPOSITE CORNER----
     * "if my opponent is in a corner, and
     * if the opposite corner is empty,
     * then play the opposite corner"
     */
    if (theBoard.playerOne) { //x makes opposite corner move
        for (var i = 0; i < OFilledCells.length; i++) {
            if (OFilledCells[i] === 8) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 2) {
                        alert("x taking opposite corner of O's top left");
                        return 2;
                    }
                }
            } else if (OFilledCells[i] === 2) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 8) {
                        alert("x taking opposite corner of O's bottom right");
                        return 8;
                    }
                }
            } else if (OFilledCells[i] === 6) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 4) {
                        alert("x taking opposite corner of O's top right");
                        return 4;
                    }
                }
            } else if (OFilledCells[i] === 4) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 6) {
                        alert("x taking opposite corner of O's bottom left");
                        return 6;
                    }
                }
            }
        }
    } else if (!theBoard.playerOne) { // o makes opposite corner move
        for (var i = 0; i < XFilledCells.length; i++) {
            if (XFilledCells[i] === 8) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 2) {
                        alert("o taking opposite corner of x's top left");
                        return 2;
                    }
                }
            } else if (XFilledCells[i] === 2) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 8) {
                        alert("o taking opposite corner of x's bottom right");
                        return 8;
                    }
                }
            } else if (XFilledCells[i] === 6) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 4) {
                        alert("o taking opposite corner of x's top right");
                        return 4;
                    }
                }
            } else if (XFilledCells[i] === 4) {
                for (var j = 0; j < freeCells.length; j++) {
                    if (freeCells[j] === 6) {
                        alert("o taking opposite corner of x's bottom left");
                        return 6;
                    }
                }
            }
        }
    }
    //----END PLAY OPPOSITE CORNER----
    
    /*
     * ----PLAY EMPTY CORNER----
     * "if there is an empty corner,
     * then move to an empty corner"
     */
    var emptyCorners = []; //create holding array that keeps track of empty corners
    for (var i = 0; i < freeCells.length; i++) { 
        if (freeCells[i] % 2 === 0) { //any empty corner will be divisible by 2
            emptyCorners.push(freeCells[i]);
        }
    }
    if (emptyCorners.length !== 0) {
        var rand = emptyCorners[Math.floor(Math.random()*emptyCorners.length)]; //randomly select any empty corner
        if (theBoard.playerOne) {
            alert("x selecting random corner at position " + rand + " from available corners " + emptyCorners);
        } else if (!theBoard.playerOne) {
            alert("o selecting random corner at position " + rand + " from available corners " + emptyCorners);
        }
        return rand;
    }
    
    //----END PLAY EMPTY CORNER----//
    
    /*
     * ----PLAY EMPTY SIDE----
     * "if there is an empty side,
     * then move to an empty side"
     */
    var emptyEdges = []; //create holding array that keeps track of empty edges
    for (var i = 0; i < freeCells.length; i++) { 
        //any empty edges will not be divisible by 2 or be the center (position 5)
        if (freeCells[i] % 2 !== 0 && freeCells[i] !== 5) { 
            emptyEdges.push(freeCells[i]);
        }
    }
    if (emptyEdges.length !== 0) {
        var rand = emptyEdges[Math.floor(Math.random()*emptyEdges.length)]; //randomly select any empty corner
        if (theBoard.playerOne) {
            alert("x selecting random edge at position " + rand + " from available edges " + emptyEdges);
        } else if (!theBoard.playerOne) {
            alert("o selecting random edge at position " + rand + " from available edges " + emptyEdges);
        }
        return rand;
    }
    //----END PLAY EMPTY SIDE----
//    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

//old, shitty hard code for selecting a corner
//    for (var i = 0; i < freeCells.length; i++) {
//        if (freeCells[i] === 8 && theBoard.playerOne) {
//            alert("x taking corner - top left");
//            return 8;
//        } else if (freeCells[i] === 6 && theBoard.playerOne) {
//            alert("x taking corner - top right");
//            return 6;
//        } else if (freeCells[i] === 4 && theBoard.playerOne) {
//            alert("x taking corner - bottom left");
//            return 4;
//        } else if (freeCells[i] === 2 && theBoard.playerOne) {
//            alert("x taking corner - bottom right");
//            return 2;
//        } else if (freeCells[i] === 8 && !theBoard.playerOne) {
//            alert("o taking corner - top left");
//            return 8;
//        } else if (freeCells[i] === 6 && !theBoard.playerOne) {
//            alert("o taking corner - top right");
//            return 6;
//        } else if (freeCells[i] === 4 && !theBoard.playerOne) {
//            alert("o taking corner - bottom left");
//            return 4;
//        } else if (freeCells[i] === 2 && !theBoard.playerOne) {
//            alert("o taking corner - bottom right");
//            return 2;
//        }
//    }
    //end old, shitty hardcode for selecting a corner

//    //old, shitty code for selecting a random edge
//    for (var i = 0; i < freeCells.length; i++) {
//        if (freeCells[i] === 1 && theBoard.playerOne) {
//            alert("x taking side - top middle");
//            return 1;
//        } else if (freeCells[i] === 7 && theBoard.playerOne) {
//            alert("x taking side - right middle");
//            return 7;
//        } else if (freeCells[i] === 3 && theBoard.playerOne) {
//            alert("x taking side - left middle");
//            return 3;
//        } else if (freeCells[i] === 9 && theBoard.playerOne) {
//            alert("x taking side - bottom middle");
//            return 9;
//        } else if (freeCells[i] === 1 && !theBoard.playerOne) {
//            alert("o taking side - top middle");
//            return 1;
//        } else if (freeCells[i] === 7 && !theBoard.playerOne) {
//            alert("o taking side - right middle");
//            return 7;
//        } else if (freeCells[i] === 3 && !theBoard.playerOne) {
//            alert("o taking side - left middle");
//            return 3;
//        } else if (freeCells[i] === 9 && !theBoard.playerOne) {
//            alert("o taking side - bottom middle");
//            return 9;
//        }
//    }
//    //end old, shitty code for random edge
