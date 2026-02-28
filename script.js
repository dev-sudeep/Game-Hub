// Auth state
let isLoggedIn = false;
let currentUser = null;

// Current game
let currentGame = null;

// === TIC TAC TOE STATE ===
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

// Win combinations
const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// === LUDO STATE ===
let ludoGameActive = false;
let ludoCurrentPlayer = 1;
let ludoLastDice = 0;
let ludoPieces = {
    player1: [
        { id: 1, position: -1, finished: false },
        { id: 2, position: -1, finished: false },
        { id: 3, position: -1, finished: false },
        { id: 4, position: -1, finished: false }
    ],
    player2: [
        { id: 5, position: -1, finished: false },
        { id: 6, position: -1, finished: false },
        { id: 7, position: -1, finished: false },
        { id: 8, position: -1, finished: false }
    ]
};

// DOM elements
const loginPage = document.getElementById('loginPage');
const gameSelectionPage = document.getElementById('gameSelectionPage');
const tictactoeGamePage = document.getElementById('tictactoeGamePage');
const ludoGamePage = document.getElementById('ludoGamePage');

const tictactoeCard = document.getElementById('tictactoeCard');
const ludoCard = document.getElementById('ludoCard');

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('tictactoeStatus');
const tictactoeResetBtn = document.getElementById('tictactoeResetBtn');

const ludoStatusDisplay = document.getElementById('ludoStatus');
const diceBtnElement = document.getElementById('diceBtn');
const diceResultDisplay = document.getElementById('diceResult');
const ludoResetBtn = document.getElementById('ludoResetBtn');

const backFromTictactoeBtn = document.getElementById('backFromTictactoe');
const backFromLudoBtn = document.getElementById('backFromLudo');

const logoutBtn2 = document.getElementById('logoutBtn2');
const logoutBtn3 = document.getElementById('logoutBtn3');
const logoutBtn4 = document.getElementById('logoutBtn4');

// Google Sign-In callback
function handleCredentialResponse(response) {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const userInfo = JSON.parse(jsonPayload);
    
    isLoggedIn = true;
    currentUser = userInfo;
    
    loginPage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
}

// Logout handler
function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    currentGame = null;
    
    loginPage.classList.remove('hidden');
    gameSelectionPage.classList.add('hidden');
    tictactoeGamePage.classList.add('hidden');
    ludoGamePage.classList.add('hidden');
    
    google.accounts.id.disableAutoSelect();
}

// === GAME SELECTION ===
tictactoeCard.addEventListener('click', function() {
    currentGame = 'tictactoe';
    gameSelectionPage.classList.add('hidden');
    tictactoeGamePage.classList.remove('hidden');
    initializeTictactoe();
});

ludoCard.addEventListener('click', function() {
    currentGame = 'ludo';
    gameSelectionPage.classList.add('hidden');
    ludoGamePage.classList.remove('hidden');
    initializeLudo();
});

// === TIC TAC TOE FUNCTIONS ===
function initializeTictactoe() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner', 'disabled');
        cell.addEventListener('click', handleCellClick);
    });
    
    statusDisplay.textContent = `Player X's turn`;
}

function handleCellClick(e) {
    if (!isLoggedIn || currentGame !== 'tictactoe') return;
    
    const cell = e.target;
    const index = cell.dataset.index;

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    const winResult = checkWin();
    if (winResult) {
        gameActive = false;
        highlightWinningCells(winResult);
        statusDisplay.textContent = `Player ${currentPlayer} wins`;
        disableBoard();
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        statusDisplay.textContent = 'Draw';
        disableBoard();
        return;
    }

    switchPlayer();
}

function checkWin() {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
        const [a, b, c] = WIN_CONDITIONS[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(winIndices) {
    winIndices.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function disableBoard() {
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });
}

function resetTictactoe() {
    initializeTictactoe();
}

// === LUDO FUNCTIONS ===
function initializeLudo() {
    ludoGameActive = true;
    ludoCurrentPlayer = 1;
    ludoLastDice = 0;
    ludoPieces = {
        player1: [
            { id: 1, position: -1, finished: false },
            { id: 2, position: -1, finished: false },
            { id: 3, position: -1, finished: false },
            { id: 4, position: -1, finished: false }
        ],
        player2: [
            { id: 5, position: -1, finished: false },
            { id: 6, position: -1, finished: false },
            { id: 7, position: -1, finished: false },
            { id: 8, position: -1, finished: false }
        ]
    };
    
    renderLudoBoard();
    renderLudoPieces();
    ludoStatusDisplay.textContent = 'Player 1 (Blue) - Roll the dice!';
    diceResultDisplay.textContent = '';
}

function renderLudoBoard() {
    const board = document.getElementById('ludoBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 36; i++) {
        const square = document.createElement('div');
        square.className = 'board-square';
        square.textContent = i + 1;
        board.appendChild(square);
    }
}

function renderLudoPieces() {
    const player1Pieces = document.getElementById('player1Pieces');
    const player2Pieces = document.getElementById('player2Pieces');
    
    player1Pieces.innerHTML = '';
    player2Pieces.innerHTML = '';
    
    ludoPieces.player1.forEach(piece => {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece blue ${piece.finished ? 'finished' : ''}`;
        pieceEl.textContent = piece.id;
        pieceEl.addEventListener('click', () => selectLudoPiece('player1', piece.id));
        player1Pieces.appendChild(pieceEl);
    });
    
    ludoPieces.player2.forEach(piece => {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece red ${piece.finished ? 'finished' : ''}`;
        pieceEl.textContent = piece.id;
        pieceEl.addEventListener('click', () => selectLudoPiece('player2', piece.id));
        player2Pieces.appendChild(pieceEl);
    });
}

function rollDice() {
    ludoLastDice = Math.floor(Math.random() * 6) + 1;
    diceResultDisplay.textContent = `Dice: ${ludoLastDice}`;
    
    ludoStatusDisplay.textContent = `Player ${ludoCurrentPlayer} rolled ${ludoLastDice}. Select a piece to move!`;
}

function selectLudoPiece(player, pieceId) {
    const playerKey = player === 'player1' ? 'player1' : 'player2';
    const playerNum = player === 'player1' ? 1 : 2;
    
    if (playerNum !== ludoCurrentPlayer || ludoLastDice === 0) return;
    
    const piece = ludoPieces[playerKey].find(p => p.id === pieceId);
    
    if (piece.finished) return;
    
    // Move logic
    if (piece.position === -1 && ludoLastDice === 6) {
        piece.position = 0;
    } else if (piece.position !== -1) {
        piece.position += ludoLastDice;
        if (piece.position >= 36) {
            piece.finished = true;
            piece.position = 36;
        }
    }
    
    // Check if player 1 or 2 finished
    const playerPieces = ludoPieces[playerKey];
    const allFinished = playerPieces.every(p => p.finished);
    
    if (allFinished) {
        ludoStatusDisplay.textContent = `Player ${playerNum} (${playerNum === 1 ? 'Blue' : 'Red'}) wins!`;
        ludoGameActive = false;
        diceBtnElement.disabled = true;
    } else {
        // Switch player
        ludoCurrentPlayer = ludoCurrentPlayer === 1 ? 2 : 1;
        ludoLastDice = 0;
        diceResultDisplay.textContent = '';
        ludoStatusDisplay.textContent = `Player ${ludoCurrentPlayer} (${ludoCurrentPlayer === 1 ? 'Blue' : 'Red'}) - Roll the dice!`;
    }
    
    renderLudoPieces();
}

function resetLudo() {
    initializeLudo();
    diceBtnElement.disabled = false;
}
tictactoeResetBtn.addEventListener('click', resetTictactoe);
ludoResetBtn.addEventListener('click', resetLudo);

diceBtnElement.addEventListener('click', rollDice);

backFromTictactoeBtn.addEventListener('click', function() {
    currentGame = null;
    tictactoeGamePage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

backFromLudoBtn.addEventListener('click', function() {
    currentGame = null;
    ludoGamePage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

logoutBtn2.addEventListener('click', handleLogout);
logoutBtn3.addEventListener('click', handleLogout);
logoutBtn4.addEventListener('click', handleLogout);

// Initialize Google Sign-In
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '275823790253-l5skr26eicv7091ntu8g3g35i07jn93n.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
    );
};
