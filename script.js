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
let ludoNumPlayers = 2;
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
    ],
    player3: [
        { id: 9, position: -1, finished: false },
        { id: 10, position: -1, finished: false },
        { id: 11, position: -1, finished: false },
        { id: 12, position: -1, finished: false }
    ],
    player4: [
        { id: 13, position: -1, finished: false },
        { id: 14, position: -1, finished: false },
        { id: 15, position: -1, finished: false },
        { id: 16, position: -1, finished: false }
    ]
};

const PLAYER_COLORS = ['blue', 'red', 'yellow', 'green'];
const PLAYER_NAMES = ['Blue', 'Red', 'Yellow', 'Green'];

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
const diceDisplay = document.getElementById('diceDisplay');
const ludoResetBtn = document.getElementById('ludoResetBtn');

const backFromTictactoeBtn = document.getElementById('backFromTictactoe');
const backFromLudoBtn = document.getElementById('backFromLudo');
const backFromLudoSetupBtn = document.getElementById('backFromLudoSetup');

const logoutBtn2 = document.getElementById('logoutBtn2');
const logoutBtn3 = document.getElementById('logoutBtn3');
const logoutBtn4 = document.getElementById('logoutBtn4');

const ludoSetupPage = document.getElementById('ludoSetupPage');

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
    ludoSetupPage.classList.remove('hidden');
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
        ],
        player3: [
            { id: 9, position: -1, finished: false },
            { id: 10, position: -1, finished: false },
            { id: 11, position: -1, finished: false },
            { id: 12, position: -1, finished: false }
        ],
        player4: [
            { id: 13, position: -1, finished: false },
            { id: 14, position: -1, finished: false },
            { id: 15, position: -1, finished: false },
            { id: 16, position: -1, finished: false }
        ]
    };
    
    renderLudoBoard();
    renderLudoPieces();
    updateLudoStatus();
    diceBtnElement.disabled = false;
}

function renderLudoBoard() {
    const board = document.getElementById('ludoBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.className = 'board-square';
        if (i % 8 === 0 || i % 8 === 7) {
            square.classList.add('home');
        }
        board.appendChild(square);
    }
}

function renderLudoPieces() {
    for (let p = 1; p <= 4; p++) {
        const containerId = `player${p}Container`;
        const piecesId = `player${p}Pieces`;
        const playerKey = `player${p}`;
        
        const container = document.getElementById(containerId);
        const piecesContainer = document.getElementById(piecesId);
        
        if (p <= ludoNumPlayers) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
            continue;
        }
        
        piecesContainer.innerHTML = '';
        
        ludoPieces[playerKey].forEach(piece => {
            const pieceEl = document.createElement('div');
            pieceEl.className = `piece ${PLAYER_COLORS[p - 1]} ${piece.finished ? 'finished' : ''}`;
            pieceEl.textContent = piece.id;
            pieceEl.addEventListener('click', () => selectLudoPiece(playerKey, piece.id));
            piecesContainer.appendChild(pieceEl);
        });
    }
}

function drawDice(value) {
    const diceEl = document.getElementById('dice');
    diceEl.innerHTML = '';
    
    const faceEl = document.createElement('div');
    faceEl.className = 'dice-face';
    
    // Dice dot positions for each number (1-6)
    const dotPositions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 1, 2, 6, 7, 8]
    };
    
    const positions = dotPositions[value] || [];
    
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.className = 'dice-dot';
        if (!positions.includes(i)) {
            dot.classList.add('hidden');
        }
        faceEl.appendChild(dot);
    }
    
    diceEl.appendChild(faceEl);
}

function rollDice() {
    diceBtnElement.disabled = true;
    ludoLastDice = Math.floor(Math.random() * 6) + 1;
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        drawDice(Math.floor(Math.random() * 6) + 1);
        rollCount++;
        if (rollCount > 10) {
            clearInterval(rollInterval);
            drawDice(ludoLastDice);
            updateLudoStatus();
            diceBtnElement.disabled = false;
        }
    }, 50);
}

function selectLudoPiece(playerKey, pieceId) {
    const playerNum = parseInt(playerKey.replace('player', ''));
    
    if (playerNum !== ludoCurrentPlayer || ludoLastDice === 0) return;
    
    const piece = ludoPieces[playerKey].find(p => p.id === pieceId);
    
    if (piece.finished) return;
    
    // Move logic
    if (piece.position === -1 && ludoLastDice === 6) {
        piece.position = 0;
    } else if (piece.position !== -1 && ludoLastDice === 6) {
        piece.position += ludoLastDice;
        if (piece.position >= 52) {
            piece.finished = true;
            piece.position = 52;
        }
    } else if (piece.position !== -1) {
        piece.position += ludoLastDice;
        if (piece.position >= 52) {
            piece.finished = true;
            piece.position = 52;
        }
    }
    
    // Check if player finished
    const playerPieces = ludoPieces[playerKey];
    const allFinished = playerPieces.every(p => p.finished);
    
    if (allFinished) {
        ludoStatusDisplay.textContent = `🎉 Player ${playerNum} (${PLAYER_NAMES[playerNum - 1]}) wins! 🎉`;
        ludoGameActive = false;
        diceBtnElement.disabled = true;
    } else {
        // Switch player
        ludoCurrentPlayer = ludoCurrentPlayer === ludoNumPlayers ? 1 : ludoCurrentPlayer + 1;
        ludoLastDice = 0;
        updateLudoStatus();
    }
    
    renderLudoPieces();
}

function updateLudoStatus() {
    if (!ludoGameActive) return;
    ludoStatusDisplay.textContent = `Player ${ludoCurrentPlayer} (${PLAYER_NAMES[ludoCurrentPlayer - 1]}) - Roll the dice!`;
    drawDice(ludoLastDice);
}

function resetLudo() {
    initializeLudo();
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

backFromLudoSetupBtn.addEventListener('click', function() {
    currentGame = null;
    ludoSetupPage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

// Player selection for Ludo
document.querySelectorAll('.player-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        ludoNumPlayers = parseInt(this.dataset.players);
        ludoSetupPage.classList.add('hidden');
        ludoGamePage.classList.remove('hidden');
        initializeLudo();
    });
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
