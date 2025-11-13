const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const pvpBtn = document.getElementById('pvp');
const pvcBtn = document.getElementById('pvc');
const startGameBtn = document.getElementById('startGame');
const nameInputDiv = document.getElementById('nameInput');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const modeSelect = document.getElementById('modeSelect');

let cells = [];
let currentPlayer = 'X';
let gameActive = false;
let mode = '';
let player1Name = '';
let player2Name = '';

pvpBtn.addEventListener('click', () => selectMode('pvp'));
pvcBtn.addEventListener('click', () => selectMode('pvc'));
startGameBtn.addEventListener('click', initializeGame);
resetBtn.addEventListener('click', resetGame);

function selectMode(selectedMode) {
  mode = selectedMode;
  modeSelect.style.display = 'none';
  nameInputDiv.style.display = 'block';
  player1Input.value = '';
  player2Input.value = '';
  if (mode === 'pvc') {
    player2Input.style.display = 'none';
  } else {
    player2Input.style.display = 'inline-block';
  }
}

function initializeGame() {
  player1Name = player1Input.value.trim() || 'Player 1';
  player2Name = mode === 'pvc' ? 'Computer' : (player2Input.value.trim() || 'Player 2');
  nameInputDiv.style.display = 'none';
  startBoard();
}

function startBoard() {
  board.innerHTML = '';
  cells = Array(9).fill('');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleClick(i));
    board.appendChild(cell);
  }
  currentPlayer = 'X';
  gameActive = true;
  board.style.display = 'grid';
  statusText.style.display = 'block';
  resetBtn.style.display = 'inline-block';
  statusText.textContent = `${player1Name}'s turn`;
}

function handleClick(index) {
  if (!gameActive || cells[index] !== '') return;
  cells[index] = currentPlayer;
  board.children[index].textContent = currentPlayer;

  if (checkWinner()) {
    const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
    statusText.textContent = `${winnerName} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!cells.includes('')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  const currentName = currentPlayer === 'X' ? player1Name : player2Name;
  statusText.textContent = `${currentName}'s turn`;

  if (mode === 'pvc' && currentPlayer === 'O' && gameActive) computerMove();
}

function computerMove() {
  let emptyCells = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  setTimeout(() => handleClick(move), 500);
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of wins) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      board.children[a].classList.add('winning');
      board.children[b].classList.add('winning');
      board.children[c].classList.add('winning');
      return true;
    }
  }
  return false;
}

function resetGame() {
  modeSelect.style.display = 'block';
  nameInputDiv.style.display = 'none';
  board.style.display = 'none';
  statusText.style.display = 'none';
  resetBtn.style.display = 'none';
  board.innerHTML = '';
  statusText.textContent = '';
  gameActive = false;
}
