document.addEventListener('DOMContentLoaded', () => {
  // Panggil fungsi inisialisasi

  let board = [];
  let currentScore = 0;
  const grid = document.querySelector('.grid');
  const size = 4;
  const currentScoreElem = document.getElementById('current-score');

  // Get the high score from local storage or set it to 0 if not found
  let highScore = localStorage.getItem('2048-highScore') || 0;
  const highScoreElem = document.getElementById('high-score');
  highScoreElem.textContent = highScore;

  let winStatus = false;
  const winMessageElem = document.getElementById('win-message');
  const gameOverElem = document.getElementById('game-over-message');

  // Function to update the score
  function updateScore(value) {
    currentScore += value;
    currentScoreElem.textContent = currentScore;
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreElem.textContent = highScore;
      localStorage.setItem('2048-highScore', highScore);
    }
  }

  // Function to restart the game
  function restartGame() {
    currentScore = 0;
    currentScoreElem.textContent = '0';
    winMessageElem.style.display = 'none';
    gameOverElem.style.display = 'none';
    initializeGame();
  }

  // Function to initialize the game
  function initializeGame() {
    board = [...Array(size)].map((e) => Array(size).fill(0));
    winStatus = false;
    placeRandom();
    placeRandom();
    renderBoard();
  }

  // Function to render the game board on the UI
  function renderBoard() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        const prevValue = cell.dataset.value;
        const currentValue = board[i][j];
        if (currentValue !== 0) {
          cell.dataset.value = currentValue;
          cell.textContent = currentValue;
          // Animation handling
          if (
            currentValue !== parseInt(prevValue) &&
            !cell.classList.contains('new-tile')
          ) {
            cell.classList.add('merged-tile');
          }
        } else {
          cell.textContent = '';
          delete cell.dataset.value;
          cell.classList.remove('merged-tile', 'new-tile');
        }
      }
    }

    // Cleanup animation classes
    setTimeout(() => {
      const cells = document.querySelectorAll('.grid-cell');
      cells.forEach((cell) => {
        cell.classList.remove('merged-tile', 'new-tile');
      });
    }, 300);
  }

  // Function to place a random tile on the board
  function placeRandom() {
    const available = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          available.push({ x: i, y: j });
        }
      }
    }

    if (available.length > 0) {
      const randomCell =
        available[Math.floor(Math.random() * available.length)];
      board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 512;
      const cell = document.querySelector(
        `[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`
      );
      cell.classList.add('new-tile'); // Animation for new tiles
    }
  }

  let touchStartX, touchStartY;

  // Function to handle touch input
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  // Function to handle scrolling during touch switching
  function handleTouchMove(event) {
    event.preventDefault();
  }

  // Function to move the tiles based on touch input
  function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        move('ArrowRight');
      } else {
        move('ArrowLeft');
      }
    } else {
      if (deltaY > 0) {
        move('ArrowDown');
      } else {
        move('ArrowUp');
      }
    }
  }

  // Function to move the tiles based on arrow key input
  function move(direction) {
    if (winStatus) {
      // If player has won, do not allow further moves or score increment
      return;
    }
    let hasChanged = false;
    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
      for (let j = 0; j < size; j++) {
        const column = [...Array(size)].map((_, i) => board[i][j]);
        const newColumn = transform(column, direction === 'ArrowUp');
        for (let i = 0; i < size; i++) {
          if (board[i][j] !== newColumn[i]) {
            hasChanged = true;
            board[i][j] = newColumn[i];
          }
        }
      }
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
      for (let i = 0; i < size; i++) {
        const row = board[i];
        const newRow = transform(row, direction === 'ArrowLeft');
        if (row.join(',') !== newRow.join(',')) {
          hasChanged = true;
          board[i] = newRow;
        }
      }
    }
    if (hasChanged) {
      placeRandom();
      renderBoard();
      gameWon();
      gameOver();
    }
  }

  // Function to transform a line (row or column) based on move direction
  function transform(line, moveTowardsStart) {
    let newLine = line.filter((cell) => cell !== 0);
    if (!moveTowardsStart) {
      newLine.reverse();
    }
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1] && newLine[i] < 2048) {
        newLine[i] *= 2;
        updateScore(newLine[i]); // Update score when tiles merged
        newLine.splice(i + 1, 1);
      }
    }
    while (newLine.length < size) {
      newLine.push(0);
    }
    if (!moveTowardsStart) {
      newLine.reverse();
    }
    return newLine;
  }

  function gameWon() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 2048) {
          winMessageElem.style.display = 'flex';
          winStatus = true;
          return; // There is an empty cell, so game not over
        }
      }
    }
    // If we reach here, no moves are possible
  }

  function gameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          return; // There is an empty cell, so game not over
        }
        if (j < size - 1 && board[i][j] === board[i][j + 1]) {
          return; // There are horizontally adjacent equal cells, so a move is possible
        }
        if (i < size - 1 && board[i][j] === board[i + 1][j]) {
          return; // There are vertically adjacent equal cells, so a move is possible
        }
      }
    }
    // If we reach here, no moves are possible
    gameOverElem.style.display = 'flex';
  }
  // Function to check if the player has won or the game is over

  // Event listeners
  document.addEventListener('keydown', (event) => {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      move(event.key);
    }
  });

  document.getElementById('new-game').addEventListener('click', restartGame);
  document.getElementById('play-again').addEventListener('click', restartGame);
  document
    .getElementById('restart-game')
    .addEventListener('click', restartGame);

  grid.addEventListener('touchstart', handleTouchStart);
  grid.addEventListener('touchmove', handleTouchMove);
  grid.addEventListener('touchend', handleTouchEnd);

  initializeGame();
});
