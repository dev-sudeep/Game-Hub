// Auth state
let isLoggedIn = false;
let currentUser = null;

// Current game
let currentGame = null;

// === TIC TAC TOE STATE ===
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

const WIN_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
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
let lastMove = null;
let castlingRights = { wK: true, wQ: true, bK: true, bQ: true };

const PIECE_UNICODE = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

// DOM elements
const loginPage = document.getElementById('loginPage');
const gameSelectionPage = document.getElementById('gameSelectionPage');
const tictactoeGamePage = document.getElementById('tictactoeGamePage');
const chessGamePage = document.getElementById('chessGamePage');

const tictactoeCard = document.getElementById('tictactoeCard');
const chessCard = document.getElementById('chessCard');

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

const guestLoginBtn = document.getElementById('guestLoginBtn');
const guestNameInput = document.getElementById('guestName');
const themeToggleBtn = document.getElementById('themeToggle');
const whiteMovesList = document.getElementById('whiteMovesList');
const blackMovesList = document.getElementById('blackMovesList');
const THEME_STORAGE_KEY = 'gamehub-theme';

if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', function() {
        const name = guestNameInput.value.trim() || 'Guest Player';
        isLoggedIn = true;
        currentUser = { name: name, isGuest: true };
        loginPage.classList.add('hidden');
        gameSelectionPage.classList.remove('hidden');
    });
}

function handleCredentialResponse(response) {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    currentUser = JSON.parse(jsonPayload);
    isLoggedIn = true;
    loginPage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    currentGame = null;
    loginPage.classList.remove('hidden');
    gameSelectionPage.classList.add('hidden');
    tictactoeGamePage.classList.add('hidden');
    chessGamePage.classList.add('hidden');
    if (window.google) google.accounts.id.disableAutoSelect();
}

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
    if (board[index] !== '' || !gameActive) return;

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

    if (board.every(cell => cell !== '')) {
        gameActive = false;
        statusDisplay.textContent = 'Draw';
        disableBoard();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    for (let condition of WIN_CONDITIONS) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c];
    }
    return null;
}

function highlightWinningCells(indices) {
    indices.forEach(i => cells[i].classList.add('winner'));
}

function disableBoard() {
    cells.forEach(cell => cell.classList.add('disabled'));
}

function resetTictactoe() { initializeTictactoe(); }

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
    lastMove = null;
    castlingRights = { wK: true, wQ: true, bK: true, bQ: true };
    renderChessBoard();
    updateChessStatus();
    renderMoveTrackers();
}

function displayToBoardCoordinates(displayRow, displayCol) {
    return [7 - displayCol, displayRow];
}

function renderChessBoard() {
    const boardEl = document.getElementById('chessBoard');
    boardEl.innerHTML = '';
    for (let displayRow = 0; displayRow < 8; displayRow++) {
        for (let displayCol = 0; displayCol < 8; displayCol++) {
            const [row, col] = displayToBoardCoordinates(displayRow, displayCol);
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            const piece = chessBoard[row][col];
            if (piece !== '.') {
                const pieceEl = document.createElement('span');
                pieceEl.className = 'chess-piece';
                if (piece === piece.toLowerCase()) pieceEl.classList.add('black-piece');
                pieceEl.textContent = PIECE_UNICODE[piece] || piece;
                square.appendChild(pieceEl);
            }
            if (chessSelectedSquare && chessSelectedSquare[0] === row && chessSelectedSquare[1] === col) {
                square.classList.add('selected');
            }
            square.addEventListener('click', () => handleChessClick(row, col));
            boardEl.appendChild(square);
        }
    }
}

function isPathClear(fromR, fromC, toR, toC) {
    const rDir = toR === fromR ? 0 : (toR > fromR ? 1 : -1);
    const cDir = toC === fromC ? 0 : (toC > fromC ? 1 : -1);
    let r = fromR + rDir, c = fromC + cDir;
    while (r !== toR || c !== toC) {
        if (chessBoard[r][c] !== '.') return false;
        r += rDir; c += cDir;
    }
    return true;
}

function isValidPawnMove(fromR, fromC, toR, toC, piece) {
    const isWhite = piece === piece.toUpperCase();
    const dir = isWhite ? -1 : 1;
    const target = chessBoard[toR][toC];
    
    if (toC === fromC && target === '.') {
        if (toR === fromR + dir) return true;
        if (fromR === (isWhite ? 6 : 1) && toR === fromR + 2 * dir) return isPathClear(fromR, fromC, toR, toC);
    }
    
    if (Math.abs(toC - fromC) === 1 && toR === fromR + dir) {
        if (target !== '.' && (target === target.toUpperCase() !== isWhite)) return true;
        if (target === '.' && lastMove && lastMove.piece.toLowerCase() === 'p') {
            const wasJump = Math.abs(lastMove.fromRow - lastMove.toRow) === 2;
            const isBeside = lastMove.toRow === fromR && lastMove.toCol === toC;
            if (wasJump && isBeside) return true;
        }
    }
    return false;
}

function isValidChessMove(fR, fC, tR, tC) {
    const piece = chessBoard[fR][fC].toLowerCase();
    const isWhite = chessBoard[fR][fC] === chessBoard[fR][fC].toUpperCase();
    const rDiff = Math.abs(tR - fR), cDiff = Math.abs(tC - fC);

    switch (piece) {
        case 'p': return isValidPawnMove(fR, fC, tR, tC, chessBoard[fR][fC]);
        case 'n': return (rDiff === 2 && cDiff === 1) || (rDiff === 1 && cDiff === 2);
        case 'b': return rDiff === cDiff && isPathClear(fR, fC, tR, tC);
        case 'r': return (fR === tR || fC === tC) && isPathClear(fR, fC, tR, tC);
        case 'q': return (rDiff === cDiff || fR === tR || fC === tC) && isPathClear(fR, fC, tR, tC);
        case 'k': 
            if (rDiff <= 1 && cDiff <= 1) return true;
            if (fR === tR && cDiff === 2) {
                const row = isWhite ? 7 : 0;
                if (fR !== row || fC !== 4) return false;
                const isKingside = tC > fC;
                if (isWhite ? (isKingside ? !castlingRights.wK : !castlingRights.wQ) : (isKingside ? !castlingRights.bK : !castlingRights.bQ)) return false;
                const path = isKingside ? [5, 6] : [1, 2, 3];
                if (path.some(c => chessBoard[row][c] !== '.')) return false;
                return !isSquareAttackedByColor(row, 4, !isWhite) && !isSquareAttackedByColor(row, isKingside ? 5 : 3, !isWhite);
            }
            return false;
        default: return false;
    }
}

function isPieceAttackingSquare(fR, fC, tR, tC) {
    const piece = chessBoard[fR][fC];
    if (piece === '.') return false;

    const lower = piece.toLowerCase();
    const isWhite = piece === piece.toUpperCase();
    const rDiff = Math.abs(tR - fR), cDiff = Math.abs(tC - fC);
    const rDir = tR - fR, cDir = tC - fC;

    switch (lower) {
        case 'p': {
            const dir = isWhite ? -1 : 1;
            return rDir === dir && cDiff === 1;
        }
        case 'n':
            return (rDiff === 2 && cDiff === 1) || (rDiff === 1 && cDiff === 2);
        case 'b':
            return rDiff === cDiff && isPathClear(fR, fC, tR, tC);
        case 'r':
            return (fR === tR || fC === tC) && isPathClear(fR, fC, tR, tC);
        case 'q':
            return (rDiff === cDiff || fR === tR || fC === tC) && isPathClear(fR, fC, tR, tC);
        case 'k':
            return rDiff <= 1 && cDiff <= 1;
        default:
            return false;
    }
}

function isSquareAttackedByColor(row, col, byWhite) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = chessBoard[r][c];
            if (p !== '.' && (p === p.toUpperCase()) === byWhite) {
                if (isPieceAttackingSquare(r, c, row, col)) return true;
            }
        }
    }
    return false;
}

function findKingPosition(isWhite) {
    const king = isWhite ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (chessBoard[r][c] === king) return [r, c];
        }
    }
    return null;
}

function isKingInCheck(isWhite) {
    const kingPos = findKingPosition(isWhite);
    if (!kingPos) return false;
    return isSquareAttackedByColor(kingPos[0], kingPos[1], !isWhite);
}

function hasAnyLegalMove(isWhiteTurn) {
    for (let fR = 0; fR < 8; fR++) {
        for (let fC = 0; fC < 8; fC++) {
            const piece = chessBoard[fR][fC];
            if (piece === '.' || (piece === piece.toUpperCase()) !== isWhiteTurn) continue;

            for (let tR = 0; tR < 8; tR++) {
                for (let tC = 0; tC < 8; tC++) {
                    if (fR === tR && fC === tC) continue;
                    const target = chessBoard[tR][tC];
                    if (target !== '.' && (target === target.toUpperCase()) === isWhiteTurn) continue;
                    if (isValidChessMove(fR, fC, tR, tC) && isMoveLegal(fR, fC, tR, tC)) return true;
                }
            }
        }
    }
    return false;
}

function getChessGameState(isWhiteTurn) {
    const inCheck = isKingInCheck(isWhiteTurn);
    const hasLegalMove = hasAnyLegalMove(isWhiteTurn);
    if (inCheck && !hasLegalMove) return 'checkmate';
    if (!inCheck && !hasLegalMove) return 'stalemate';
    if (inCheck) return 'check';
    return 'normal';
}

function isMoveLegal(fR, fC, tR, tC) {
    const original = chessBoard[tR][tC], moving = chessBoard[fR][fC];
    chessBoard[tR][tC] = moving; chessBoard[fR][fC] = '.';
    const isWhite = moving === moving.toUpperCase();
    const kingPos = findKingPosition(isWhite);
    if (!kingPos) { chessBoard[fR][fC] = moving; chessBoard[tR][tC] = original; return true; }
    const inCheck = isSquareAttackedByColor(kingPos[0], kingPos[1], !isWhite);
    chessBoard[fR][fC] = moving; chessBoard[tR][tC] = original;
    return !inCheck;
}

function handleChessClick(row, col) {
    const gameState = getChessGameState(chessWhiteToMove);
    if (gameState === 'checkmate' || gameState === 'stalemate') return;

    if (chessSelectedSquare) {
        const [fR, fC] = chessSelectedSquare;
        const p = chessBoard[fR][fC], target = chessBoard[row][col];
        const isWhite = p === p.toUpperCase();

        if (fR === row && fC === col) { chessSelectedSquare = null; renderChessBoard(); return; }
        if (chessWhiteToMove !== isWhite || (target !== '.' && (target === target.toUpperCase()) === isWhite)) {
            chessSelectedSquare = null; renderChessBoard(); return;
        }

        if (isValidChessMove(fR, fC, row, col) && isMoveLegal(fR, fC, row, col)) {
            const isEnPassant = p.toLowerCase() === 'p' && fC !== col && target === '.';
            const isCastling = p.toLowerCase() === 'k' && Math.abs(col - fC) === 2;

            chessBoard[row][col] = p; chessBoard[fR][fC] = '.';
            if (isEnPassant) chessBoard[fR][col] = '.';
            if (isCastling) {
                const rookC = col > fC ? 7 : 0, nextC = col > fC ? col - 1 : col + 1;
                chessBoard[row][nextC] = chessBoard[row][rookC]; chessBoard[row][rookC] = '.';
            }

            // --- PAWN PROMOTION ---
            if (p.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                let choice = prompt("Pawn Promotion! Enter Q for Queen, R for Rook, B for Bishop, or N for Knight:");
                if (choice) choice = choice.toUpperCase();
                if (!['Q', 'R', 'B', 'N'].includes(choice)) choice = 'Q'; // Default to Queen
                chessBoard[row][col] = isWhite ? choice : choice.toLowerCase();
            }

            // Update Rights
            if (p === 'K') { castlingRights.wK = false; castlingRights.wQ = false; }
            if (p === 'k') { castlingRights.bK = false; castlingRights.bQ = false; }
            if (p === 'R') { if (fC === 0) castlingRights.wQ = false; if (fC === 7) castlingRights.wK = false; }
            if (p === 'r') { if (fC === 0) castlingRights.bQ = false; if (fC === 7) castlingRights.bK = false; }

            // Log Move
            const moveText = `${String.fromCharCode(97 + fC)}${8 - fR} to ${String.fromCharCode(97 + col)}${8 - row}`;
            if (isWhite) {
                if (chessMoves.length > 0 && chessMoves[chessMoves.length - 1].white === null) {
                    chessMoves[chessMoves.length - 1].white = moveText;
                } else {
                    chessMoves.push({ white: moveText, black: null });
                }
            } else {
                if (chessMoves.length === 0 || chessMoves[chessMoves.length - 1].black !== null) {
                    chessMoves.push({ white: null, black: moveText });
                } else {
                    chessMoves[chessMoves.length - 1].black = moveText;
                }
            }
            lastMove = { fromRow: fR, fromCol: fC, toRow: row, toCol: col, piece: p };
            chessWhiteToMove = !chessWhiteToMove;
            chessSelectedSquare = null;
            updateChessStatus();
            renderChessBoard();
            renderMoveTrackers();
        } else {
            chessSelectedSquare = null; renderChessBoard();
        }
    } else {
        const p = chessBoard[row][col];
        if (p !== '.' && (p === p.toUpperCase()) === chessWhiteToMove) {
            chessSelectedSquare = [row, col];
            renderChessBoard();
        }
    }
}

function updateChessStatus() {
    const state = getChessGameState(chessWhiteToMove);
    const side = chessWhiteToMove ? 'White' : 'Black';
    const winner = chessWhiteToMove ? 'Black' : 'White';

    if (state === 'checkmate') {
        chessStatusDisplay.textContent = `♚ Checkmate! ${winner} wins`;
    } else if (state === 'stalemate') {
        chessStatusDisplay.textContent = 'Draw by stalemate';
    } else if (state === 'check') {
        chessStatusDisplay.textContent = `${chessWhiteToMove ? '♔' : '♚'} ${side} is in check`;
    } else {
        chessStatusDisplay.textContent = `${chessWhiteToMove ? '♔' : '♚'} ${side}'s Turn`;
    }

    if (chessMoves.length > 0) {
        const latestRound = chessMoves[chessMoves.length - 1];
        const latestMove = latestRound.black || latestRound.white;
        chessMoveLog.textContent = `Last move: ${latestMove}`;
    } else {
        chessMoveLog.textContent = '';
    }
}

function renderMoveTrackers() {
    if (!whiteMovesList || !blackMovesList) return;
    whiteMovesList.innerHTML = '';
    blackMovesList.innerHTML = '';

    chessMoves.forEach((round, index) => {
        if (round.white !== null) {
            const whiteItem = document.createElement('div');
            whiteItem.className = 'move-item';
            whiteItem.textContent = `${index + 1}. ${round.white}`;
            whiteMovesList.appendChild(whiteItem);
        }

        if (round.black) {
            const blackItem = document.createElement('div');
            blackItem.className = 'move-item';
            blackItem.textContent = `${index + 1}. ${round.black}`;
            blackMovesList.appendChild(blackItem);
        }
    });

    whiteMovesList.scrollTop = whiteMovesList.scrollHeight;
    blackMovesList.scrollTop = blackMovesList.scrollHeight;
}

function resetChess() { initializeChess(); }

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggleBtn) themeToggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

function initializeTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    applyTheme(storedTheme);
}

function toggleTheme() {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
}

tictactoeResetBtn.addEventListener('click', resetTictactoe);
chessResetBtn.addEventListener('click', resetChess);
backFromTictactoeBtn.addEventListener('click', () => { tictactoeGamePage.classList.add('hidden'); gameSelectionPage.classList.remove('hidden'); });
backFromChessBtn.addEventListener('click', () => { chessGamePage.classList.add('hidden'); gameSelectionPage.classList.remove('hidden'); });
logoutBtn2.addEventListener('click', handleLogout);
logoutBtn3.addEventListener('click', handleLogout);
logoutBtn4.addEventListener('click', handleLogout);
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

window.onload = function() {
    initializeTheme();
    if (window.google) {
        google.accounts.id.initialize({
            client_id: '275823790253-l5skr26eicv7091ntu8g3g35i07jn93n.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(document.querySelector('.g_id_signin'), { theme: 'outline', size: 'large' });
    }
};
