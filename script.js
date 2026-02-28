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

// === CHESS STATE ===
let chessBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let chessWhiteToMove = true;
let chessSelectedSquare = null;
let chessMoves = [];

const PIECE_UNICODE = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
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

const chessStatusDisplay = document.getElementById('chessStatus');
const chessResetBtn = document.getElementById('chessResetBtn');
const chessMoveLog = document.getElementById('chessMoveLog');

const backFromTictactoeBtn = document.getElementById('backFromTictactoe');
const backFromChessBtn = document.getElementById('backFromChess');

const logoutBtn2 = document.getElementById('logoutBtn2');
const logoutBtn3 = document.getElementById('logoutBtn3');
const logoutBtn4 = document.getElementById('logoutBtn4');

const chessGamePage = document.getElementById('chessGamePage');

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
const ludoCard = document.getElementById('chessCard');
const chessCard = document.getElementById('chessCard');

tictactoeCard.addEventListener('click', function() {
    currentGame = 'tictactoe';
    gameSelectionPage.classList.add('hidden');
    tictactoeGamePage.classList.remove('hidden');
    initializeTictactoe();
});

chessCard.addEventListener('click', function() {
    currentGame = 'chess';
    gameSelectionPage.classList.add('hidden');
    chessGamePage.classList.remove('hidden');
    initializeChess();
});

ludoCard.addEventListener('click', function() {
    currentGame = 'chess';
    gameSelectionPage.classList.add('hidden');
    chessGamePage.classList.remove('hidden');
    initializeChess();
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

// === CHESS FUNCTIONS ===
function initializeChess() {
    chessBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    chessWhiteToMove = true;
    chessSelectedSquare = null;
    chessMoves = [];
    renderChessBoard();
    updateChessStatus();
}

function renderChessBoard() {
    const board = document.getElementById('chessBoard');
    board.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            square.className = `chess-square ${isLight ? 'light' : 'dark'}`;
            
            const piece = chessBoard[row][col];
            if (piece !== '.') {
                square.textContent = PIECE_UNICODE[piece] || piece;
            }
            
            square.addEventListener('click', () => handleChessClick(row, col));
            board.appendChild(square);
        }
    }
}

function handleChessClick(row, col) {
    if (chessSelectedSquare) {
        const [fromRow, fromCol] = chessSelectedSquare;
        const piece = chessBoard[fromRow][fromCol];
        const targetPiece = chessBoard[row][col];
        
        // Check if it's a valid move
        if (fromRow === row && fromCol === col) {
            chessSelectedSquare = null;
            renderChessBoard();
            return;
        }
        
        // Simple move validation (same color capture check)
        const isWhitePiece = piece === piece.toUpperCase();
        const isTargetWhite = targetPiece !== '.' && targetPiece === targetPiece.toUpperCase();
        
        if (chessWhiteToMove !== isWhitePiece) {
            chessSelectedSquare = null;
            renderChessBoard();
            return;
        }
        
        if (targetPiece !== '.' && isWhitePiece === isTargetWhite) {
            chessSelectedSquare = null;
            renderChessBoard();
            return;
        }
        
        // Make the move
        chessBoard[row][col] = piece;
        chessBoard[fromRow][fromCol] = '.';
        chessWhiteToMove = !chessWhiteToMove;
        chessSelectedSquare = null;
        
        chessMoves.push(`${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`);
        updateChessStatus();
        renderChessBoard();
    } else {
        const piece = chessBoard[row][col];
        if (piece !== '.') {
            const isWhitePiece = piece === piece.toUpperCase();
            if (chessWhiteToMove === isWhitePiece) {
                chessSelectedSquare = [row, col];
                renderChessBoard();
                highlightSelectedSquare();
            }
        }
    }
}

function highlightSelectedSquare() {
    if (!chessSelectedSquare) return;
    const [row, col] = chessSelectedSquare;
    const index = row * 8 + col;
    const squares = document.querySelectorAll('.chess-square');
    squares[index].classList.add('selected');
}

function updateChessStatus() {
    chessStatusDisplay.textContent = chessWhiteToMove ? '♔ White\'s Turn' : '♚ Black\'s Turn';
    if (chessMoves.length > 0) {
        chessMoveLog.textContent = `Last move: ${chessMoves[chessMoves.length - 1]}`;
    }
}

function resetChess() {
    initializeChess();
}
// Event listeners
tictactoeResetBtn.addEventListener('click', resetTictactoe);
chessResetBtn.addEventListener('click', resetChess);

backFromTictactoeBtn.addEventListener('click', function() {
    currentGame = null;
    tictactoeGamePage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

backFromChessBtn.addEventListener('click', function() {
    currentGame = null;
    chessGamePage.classList.add('hidden');
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
