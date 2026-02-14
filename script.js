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
    return {getBoard, checkCell, checkWin, isFull};
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
    let gameOver = false;
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
        if (gameOver === true) {
            return null;
        }
        if (gameboard.checkCell(chosenRow,chosenColumn,currentPlayer.mark) === false) {
            return false;
        };

        let result = gameboard.checkWin(currentPlayer.mark);
        if (result === true) {
            currentPlayer.incrementScore()
            gameOver = true;
            return "win";
        }
        
        if (gameboard.isFull() === true) {
            return "draw";
        };
        switchPlayerTurn();
        return null;
    };
    return {playRound, getCurrentPlayer, getBoard: gameboard.getBoard, getPlayers: () => activePlayers};
};

function screenController () {
      const game = gameController(playerOne,playerTwo);
      const playerTurnH1 = document.querySelector('.turn');
      const boardDiv = document.querySelector('.board');
      const resultDiv = document.querySelector(".result");

      const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getCurrentPlayer();
        playerTurnH1.textContent = `${activePlayer.playerName}'s turn...`;
        
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
      }

      function clickHandler(event) {
        let selectedCell = event.target;
        if (!selectedCell.classList.contains("cell")) {return};
        const chosenRow = selectedCell.dataset.row;
        const chosenColumn = selectedCell.dataset.column;
        const message = game.playRound(chosenRow, chosenColumn);

        if (message == "draw") {
            resultDiv.textContent = "It's a draw because the board has been filled!";
        } else if (message == "win") {
            const winner = game.getCurrentPlayer();
            resultDiv.textContent = `${winner.playerName} has won this round!`;
        }

        updateScreen();
     };

     boardDiv.addEventListener("click", clickHandler);
     updateScreen();
};

screenController();