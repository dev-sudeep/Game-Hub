// Auth state
let isLoggedIn = false;
let currentUser = null;

// Game state
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

// DOM elements
const loginPage = document.getElementById('loginPage');
const gamePage = document.getElementById('gamePage');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userNameDisplay = document.getElementById('userName');
const boardElement = document.getElementById('board');

// Google Sign-In callback
function handleCredentialResponse(response) {
    // Decode JWT token to get user info
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const userInfo = JSON.parse(jsonPayload);
    
    // Set logged in state
    isLoggedIn = true;
    currentUser = userInfo;
    
    // Update UI
    userNameDisplay.textContent = `Hello, ${userInfo.name}`;
    loginPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    
    // Initialize game
    initializeGame();
}

// Logout handler
function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    
    // Reset game
    resetGame();
    
    // Update UI
    loginPage.classList.remove('hidden');
    gamePage.classList.add('hidden');
    userNameDisplay.textContent = '';
    
    // Clear Google sign-in
    google.accounts.id.disableAutoSelect();
}

// Initialize game event listeners
function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellClick(e) {
    if (!isLoggedIn) return;
    
    const cell = e.target;
    const index = cell.dataset.index;

    // Check if cell is empty and game is active
    if (board[index] !== '' || !gameActive) {
        return;
    }

    // Place mark
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Check win condition
    const winResult = checkWin();
    if (winResult) {
        gameActive = false;
        highlightWinningCells(winResult);
        statusDisplay.textContent = `Player ${currentPlayer} wins`;
        disableBoard();
        return;
    }

    // Check draw condition
    if (checkDraw()) {
        gameActive = false;
        statusDisplay.textContent = 'Draw';
        disableBoard();
        return;
    }

    // Switch player
    switchPlayer();
}

function checkWin() {
    // Check each win combination
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

function resetGame() {
    // Clear state
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;

    // Reset DOM
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner', 'disabled');
    });

    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Event listeners
resetBtn.addEventListener('click', resetGame);
logoutBtn.addEventListener('click', handleLogout);

// Initialize Google Sign-In
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '949628622191-4r5f5j5d5d5d5d5d5d5d5d5d5d5d5d5d.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
    );
};
