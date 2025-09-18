// Gameboard Module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller
const GameController = (() => {
  let player1, player2, currentPlayer, gameOver = false;

  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    Gameboard.resetBoard();
    gameOver = false;
    DisplayController.render();
    DisplayController.setMessage(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.setMessage(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
  };

  const playRound = (index) => {
    if (gameOver) return;

    if (Gameboard.setMark(index, currentPlayer.marker)) {
      DisplayController.render();
      if (checkWinner()) {
        DisplayController.setMessage(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (isTie()) {
        DisplayController.setMessage("It's a tie!");
        gameOver = true;
      } else {
        switchPlayer();
      }
    }
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern =>
      board[pattern[0]] &&
      board[pattern[0]] === board[pattern[1]] &&
      board[pattern[1]] === board[pattern[2]]
    );
  };

  const isTie = () => Gameboard.getBoard().every(cell => cell !== "");

  return { startGame, playRound };
})();

// Display Controller
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const resultDiv = document.querySelector("#result");
  const startBtn = document.querySelector("#start");
  const restartBtn = document.querySelector("#restart");
  const player1Input = document.querySelector("#player1");
  const player2Input = document.querySelector("#player2");

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const setMessage = (message) => {
    resultDiv.textContent = message;
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      GameController.playRound(index);
    });
  });

  startBtn.addEventListener("click", () => {
    GameController.startGame(player1Input.value, player2Input.value);
  });

  restartBtn.addEventListener("click", () => {
    GameController.startGame(player1Input.value, player2Input.value);
  });

  return { render, setMessage };
})();
