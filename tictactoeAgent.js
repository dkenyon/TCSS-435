// Tic Tac Toe

var boardValues = [[8, 1, 6],
                   [3, 5, 7],
                   [4, 9, 2]];

var winningCombos = [[8, 1, 6], [3, 5, 7], [4, 9, 2], [8, 3, 4], [1, 5, 9], [6, 7, 2], [8, 5, 2], [4, 5, 6]];

var Agent = function () {

};

var getFreeCells = function(board) {
    var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) {
            freeCells.push(i);

        }
    }
    return freeCells;
};

/*Make move into space next two concurrent moves by the same player (wins the game) */
var win = function() {

};

/*Block a player's two concurrent moves (prevent them from winning) */
var block = function() {

};

/*If we see a potential fork, make it (increases our chance of winning) */
var fork = function() {

};

/*Block an opponents fork if we find one */
var blockFork = function() {

};

/*Take the center cell if it is available */
var moveCenter = function() {

};

/*Take a corner opposite to the corner chosen by our opponent */
var blockCorner = function() {

};

/*Pick an empty corner at 'random' */
var moveCorner = function() {

};

/*Pick an empty middle side at 'random' */
var moveSideMiddle = function() {

};

Agent.prototype.selectMove = function(board) {

};

