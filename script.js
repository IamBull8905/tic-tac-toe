const gameboard = (function CreateGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = null;
        };
    };

    const getBoard = () => board;
    return {getBoard};
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