const gameboard = (function CreateGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    function initialiseCell() {
        let value = null;
        const addMark = (mark) => {
            value = mark;
        };
        const getValue = () => value;
        return {addMark, getValue};
    };

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = initialiseCell();
        };
    };
    const printBoard = () => { // remove when integration with DOM
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        for (const row of boardWithCellValues) {
            console.log(row);
        };
        console.log("-----------------------------------------");
    };

    const getBoard = () => board;
    const checkCell = function (row, col, playerMark) {
        const cell = board[row][col];
        if (cell.getValue() === null) {
            cell.addMark(playerMark);
            return true;
        } else {
            return false;
        }
    }
    
    const checkWin = function(playerMark) {
      for (let k = 0; k < 3; k++) { // check wins with 3 in a row
        if (board[k][0].getValue() === playerMark && board[k][1].getValue() === playerMark && board[k][2].getValue() === playerMark) {
            return true;
        }
      }
      
      for (let l = 0; l < 3; l++) { // check wins with 3 in a column
        if (board[0][l].getValue() === playerMark && board[1][l].getValue() === playerMark && board[2][l].getValue() === playerMark) {
          return true;
        }
      }
      
      // check wins with diagonals
      if (board[0][0].getValue() === playerMark && board[1][1].getValue() === playerMark && board[2][2].getValue() === playerMark) {
        return true;
      }
      
      if (board[0][2].getValue() === playerMark && board[1][1].getValue() === playerMark && board[2][0].getValue() === playerMark) {
        return true;
      }

      return false;
    }; 
    
    const isFull = function() {
        for (let m = 0; m < 3; m++) {
            for (let n = 0; n < 3; n++) {
                if (board[m][n].getValue() === null) {
                    return false;
                }
            }
        }
        return true;
    }
    return {getBoard, checkCell, checkWin, isFull, printBoard};
})();

function createPlayer(name) {
    const playerName = name;

    let score = 0;
    const getScore = () => score;
    const incrementScore = () => {score++; };

    return {playerName, getScore, incrementScore};
};

const playerOne = createPlayer("Player 1");
const playerTwo = createPlayer("Player 2");

function gameController(playerOne, playerTwo) {
    playerOne.mark = "O";
    playerTwo.mark = "X";
    const activePlayers = [playerOne, playerTwo];

    let currentPlayer = activePlayers[0];
    const switchPlayerTurn = () => {
        if (currentPlayer === activePlayers[0]) {
            currentPlayer = activePlayers[1];
        } else {
            currentPlayer = activePlayers[0];
        };
    };
    const getCurrentPlayer = () => currentPlayer;

    function playRound(chosenRow,chosenColumn) {
        if (gameboard.checkCell(chosenRow,chosenColumn,currentPlayer.mark) === false) {
            console.log("Try again!");
            return false;
        };

        let result = gameboard.checkWin(currentPlayer.mark);
        if (result === true) {
            currentPlayer.incrementScore()
            console.log(currentPlayer.playerName, "received a point!");
        }
        
        if (gameboard.isFull() === true) {
            gameboard.printBoard();
            if (activePlayers[0].getScore() === activePlayers[1].getScore()) {
                console.log("It's a draw!");
            } else if (activePlayers[0].getScore() > activePlayers[1].getScore()) {
                console.log(activePlayers[0].playerName, "wins!");
            } else {
                console.log(activePlayers[1].playerName, "wins!");
            };

            return "Finished";
        };
        switchPlayerTurn();
        gameboard.printBoard();
        return true;
    };
    return {playRound};
};

const game = gameController(playerOne, playerTwo);

// test cases to ensure functionality
game.playRound(0,0);
game.playRound(0,1);
game.playRound(0,2);
game.playRound(1,0);
game.playRound(1,1);
game.playRound(1,2);
game.playRound(2,0);
game.playRound(2,0);
game.playRound(2,2);
game.playRound(2,1);