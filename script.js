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

// === LUDO STATE ===
const LUDO_COLOR_ORDER = ['red', 'green', 'yellow', 'blue'];
const LUDO_PLAYER_META = {
    red: { startIndex: 0, label: 'Red' },
    green: { startIndex: 13, label: 'Green' },
    yellow: { startIndex: 26, label: 'Yellow' },
    blue: { startIndex: 39, label: 'Blue' }
};

const LUDO_MAIN_PATH = [
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
    [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]
];

const LUDO_HOME_LANES = {
    red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
    blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

const LUDO_BASE_SLOTS = {
    red: [[2, 2], [2, 4], [4, 2], [4, 4]],
    green: [[2, 10], [2, 12], [4, 10], [4, 12]],
    yellow: [[10, 10], [10, 12], [12, 10], [12, 12]],
    blue: [[10, 2], [10, 4], [12, 2], [12, 4]]
};
const LUDO_BASE_ANCHORS = {
    red: [0, 0],
    green: [0, 9],
    yellow: [9, 9],
    blue: [9, 0]
};

const LUDO_SAFE_INDICES = new Set([0, 13, 26, 39]);
const LUDO_CENTER = [7, 7];
const LUDO_DICE_SYMBOLS = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

let ludoPlayerCount = 0;
let ludoPlayers = [];
let ludoCurrentPlayerIndex = 0;
let ludoTokens = {};
let ludoDiceValue = null;
let ludoHasRolled = false;
let ludoConsecutiveSixes = 0;
let ludoWinner = null;
let ludoLastRollByColor = {};

// DOM elements
const loginPage = document.getElementById('loginPage');
const gameSelectionPage = document.getElementById('gameSelectionPage');
const tictactoeGamePage = document.getElementById('tictactoeGamePage');
const chessGamePage = document.getElementById('chessGamePage');
const ludoSetupPage = document.getElementById('ludoSetupPage');
const ludoGamePage = document.getElementById('ludoGamePage');

const tictactoeCard = document.getElementById('tictactoeCard');
const chessCard = document.getElementById('chessCard');
const ludoCard = document.getElementById('ludoCard');

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('tictactoeStatus');
const tictactoeResetBtn = document.getElementById('tictactoeResetBtn');

const chessStatusDisplay = document.getElementById('chessStatus');
const chessResetBtn = document.getElementById('chessResetBtn');
const chessMoveLog = document.getElementById('chessMoveLog');

const ludoStatusDisplay = document.getElementById('ludoStatus');
const ludoResetBtn = document.getElementById('ludoResetBtn');
const ludoBoardEl = document.getElementById('ludoBoard');
const ludoPlayerButtons = document.querySelectorAll('.ludo-player-btn');

const backFromTictactoeBtn = document.getElementById('backFromTictactoe');
const backFromChessBtn = document.getElementById('backFromChess');
const backFromLudoSetupBtn = document.getElementById('backFromLudoSetup');
const backFromLudoGameBtn = document.getElementById('backFromLudoGame');

const logoutBtn2 = document.getElementById('logoutBtn2');
const logoutBtn3 = document.getElementById('logoutBtn3');
const logoutBtn4 = document.getElementById('logoutBtn4');
const logoutBtn5 = document.getElementById('logoutBtn5');
const logoutBtn6 = document.getElementById('logoutBtn6');

const guestLoginBtn = document.getElementById('guestLoginBtn');
const guestNameInput = document.getElementById('guestName');
const themeToggleBtn = document.getElementById('themeToggle');
const whiteMovesList = document.getElementById('whiteMovesList');
const blackMovesList = document.getElementById('blackMovesList');
const THEME_STORAGE_KEY = 'gamehub-theme';

const ludoPathIndexByKey = new Map();
const ludoHomeLaneByKey = new Map();

LUDO_MAIN_PATH.forEach(([row, col], index) => {
    ludoPathIndexByKey.set(`${row},${col}`, index);
});

Object.entries(LUDO_HOME_LANES).forEach(([color, lane]) => {
    lane.forEach(([row, col]) => {
        ludoHomeLaneByKey.set(`${row},${col}`, color);
    });
});

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
    ludoSetupPage.classList.add('hidden');
    ludoGamePage.classList.add('hidden');
    resetLudoState();
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

if (ludoCard) {
    ludoCard.addEventListener('click', openLudoSetup);
}

if (ludoPlayerButtons.length > 0) {
    ludoPlayerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedPlayers = Number(button.dataset.players);
            startLudoGame(selectedPlayers);
        });
    });
}

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

    if (board.every(currentCell => currentCell !== '')) {
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

function squareToAlgebraic(row, col) {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
}

function getChessAlgebraicNotation({ piece, fromRow, fromCol, toRow, toCol, isCapture, isCastling, isCheck, isMate, promotion }) {
    if (isCastling) {
        const castleNotation = toCol > fromCol ? 'O-O' : 'O-O-O';
        return `${castleNotation}${isMate ? '#' : isCheck ? '+' : ''}`;
    }

    const lowerPiece = piece.toLowerCase();
    const pieceLetter = lowerPiece === 'p' ? '' : piece.toUpperCase();
    const destination = squareToAlgebraic(toRow, toCol);
    const pawnCaptureFile = lowerPiece === 'p' && isCapture ? String.fromCharCode(97 + fromCol) : '';
    const captureMarker = isCapture ? 'x' : '';
    const promotionText = promotion ? `=${promotion.toUpperCase()}` : '';
    const checkSuffix = isMate ? '#' : isCheck ? '+' : '';

    return `${pieceLetter}${pawnCaptureFile}${captureMarker}${destination}${promotionText}${checkSuffix}`;
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
    const rDir = tR - fR;

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
            const isCapture = target !== '.' || isEnPassant;
            let promotedTo = null;

            chessBoard[row][col] = p; chessBoard[fR][fC] = '.';
            if (isEnPassant) chessBoard[fR][col] = '.';
            if (isCastling) {
                const rookC = col > fC ? 7 : 0, nextC = col > fC ? col - 1 : col + 1;
                chessBoard[row][nextC] = chessBoard[row][rookC]; chessBoard[row][rookC] = '.';
            }

            if (p.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                let choice = prompt('Pawn Promotion! Enter Q for Queen, R for Rook, B for Bishop, or N for Knight:');
                if (choice) choice = choice.toUpperCase();
                if (!['Q', 'R', 'B', 'N'].includes(choice)) choice = 'Q';
                chessBoard[row][col] = isWhite ? choice : choice.toLowerCase();
                promotedTo = choice;
            }

            if (p === 'K') { castlingRights.wK = false; castlingRights.wQ = false; }
            if (p === 'k') { castlingRights.bK = false; castlingRights.bQ = false; }
            if (p === 'R') { if (fC === 0) castlingRights.wQ = false; if (fC === 7) castlingRights.wK = false; }
            if (p === 'r') { if (fC === 0) castlingRights.bQ = false; if (fC === 7) castlingRights.bK = false; }

            const opponentState = getChessGameState(!isWhite);
            const moveText = getChessAlgebraicNotation({
                piece: p,
                fromRow: fR,
                fromCol: fC,
                toRow: row,
                toCol: col,
                isCapture,
                isCastling,
                isCheck: opponentState === 'check' || opponentState === 'checkmate',
                isMate: opponentState === 'checkmate',
                promotion: promotedTo
            });
            const moveEntry = {
                pieceUnicode: PIECE_UNICODE[p],
                notation: moveText
            };
            if (isWhite) {
                if (chessMoves.length > 0 && chessMoves[chessMoves.length - 1].white === null) {
                    chessMoves[chessMoves.length - 1].white = moveEntry;
                } else {
                    chessMoves.push({ white: moveEntry, black: null });
                }
            } else {
                if (chessMoves.length === 0 || chessMoves[chessMoves.length - 1].black !== null) {
                    chessMoves.push({ white: null, black: moveEntry });
                } else {
                    chessMoves[chessMoves.length - 1].black = moveEntry;
                }
            }
            lastMove = { fromRow: fR, fromCol: fC, toRow: row, toCol: col, piece: p };
            chessWhiteToMove = !chessWhiteToMove;
            chessSelectedSquare = null;
            updateChessStatus(opponentState);
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

function updateChessStatus(state = getChessGameState(chessWhiteToMove)) {
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
        const latestMove = latestRound.black?.notation || latestRound.white?.notation;
        chessMoveLog.textContent = `Last move: ${latestMove}`;
    } else {
        chessMoveLog.textContent = '';
    }
}

function renderMoveTrackers() {
    if (!whiteMovesList || !blackMovesList) return;
    whiteMovesList.innerHTML = '';
    blackMovesList.innerHTML = '';

    const createHeaderRow = () => {
        const header = document.createElement('div');
        header.className = 'move-item move-item-header';

        const moveNo = document.createElement('span');
        moveNo.className = 'move-cell move-number';
        moveNo.textContent = 'Move';

        const whiteMove = document.createElement('span');
        whiteMove.className = 'move-cell move-white';
        whiteMove.textContent = 'White';

        const blackMove = document.createElement('span');
        blackMove.className = 'move-cell move-black';
        blackMove.textContent = 'Black';

        header.appendChild(moveNo);
        header.appendChild(whiteMove);
        header.appendChild(blackMove);
        return header;
    };

    whiteMovesList.appendChild(createHeaderRow());
    blackMovesList.appendChild(createHeaderRow());

    chessMoves.forEach((round, index) => {
        const moveRow = document.createElement('div');
        moveRow.className = 'move-item';

        const moveNo = document.createElement('span');
        moveNo.className = 'move-cell move-number';
        moveNo.textContent = `${index + 1}.`;

        const whiteMove = document.createElement('span');
        whiteMove.className = 'move-cell move-white';
        whiteMove.textContent = round.white ? `${round.white.pieceUnicode} ${round.white.notation}` : '—';

        const blackMove = document.createElement('span');
        blackMove.className = 'move-cell move-black';
        blackMove.textContent = round.black ? `${round.black.pieceUnicode} ${round.black.notation}` : '—';

        moveRow.appendChild(moveNo);
        moveRow.appendChild(whiteMove);
        moveRow.appendChild(blackMove);

        whiteMovesList.appendChild(moveRow.cloneNode(true));
        blackMovesList.appendChild(moveRow);
    });

    whiteMovesList.scrollTop = whiteMovesList.scrollHeight;
    blackMovesList.scrollTop = blackMovesList.scrollHeight;
}

function resetChess() { initializeChess(); }

// === LUDO FUNCTIONS ===
function openLudoSetup() {
    currentGame = 'ludo';
    gameSelectionPage.classList.add('hidden');
    ludoGamePage.classList.add('hidden');
    ludoSetupPage.classList.remove('hidden');
}

function resetLudoState() {
    ludoPlayerCount = 0;
    ludoPlayers = [];
    ludoCurrentPlayerIndex = 0;
    ludoTokens = {};
    ludoDiceValue = null;
    ludoHasRolled = false;
    ludoConsecutiveSixes = 0;
    ludoWinner = null;
    ludoLastRollByColor = {};
    if (ludoStatusDisplay) ludoStatusDisplay.textContent = 'Select players to start.';
    if (ludoBoardEl) ludoBoardEl.innerHTML = '';
}

function initializeLudoState(playerCount) {
    ludoPlayerCount = playerCount;
    ludoPlayers = LUDO_COLOR_ORDER.slice(0, playerCount);
    ludoCurrentPlayerIndex = 0;
    ludoTokens = {};
    ludoPlayers.forEach(color => {
        ludoTokens[color] = [-1, -1, -1, -1];
    });
    ludoDiceValue = null;
    ludoHasRolled = false;
    ludoConsecutiveSixes = 0;
    ludoWinner = null;
    ludoLastRollByColor = {};
    ludoPlayers.forEach(color => {
        ludoLastRollByColor[color] = null;
    });
}

function startLudoGame(playerCount) {
    initializeLudoState(playerCount);
    ludoSetupPage.classList.add('hidden');
    ludoGamePage.classList.remove('hidden');
    renderLudoBoard();
    setLudoStatus(`${getCurrentLudoLabel()}'s turn. Roll the dice to start.`);
}

function getCurrentLudoColor() {
    return ludoPlayers[ludoCurrentPlayerIndex];
}

function getCurrentLudoLabel() {
    const color = getCurrentLudoColor();
    return color ? LUDO_PLAYER_META[color].label : '';
}

function setLudoStatus(message) {
    if (ludoStatusDisplay) ludoStatusDisplay.textContent = message;
}

function rollLudoDice(requestedColor) {
    if (!isLoggedIn || currentGame !== 'ludo' || ludoWinner || !ludoPlayers.length) return;
    if (requestedColor && requestedColor !== getCurrentLudoColor()) return;
    if (ludoHasRolled) return;

    const activeColor = getCurrentLudoColor();
    const activeLabel = getCurrentLudoLabel();
    ludoDiceValue = getLudoDieRoll();
    ludoLastRollByColor[activeColor] = ludoDiceValue;

    if (ludoDiceValue === 6) ludoConsecutiveSixes += 1;
    else ludoConsecutiveSixes = 0;

    if (ludoConsecutiveSixes === 3) {
        ludoDiceValue = null;
        ludoHasRolled = false;
        ludoConsecutiveSixes = 0;
        setLudoStatus(`${activeLabel} rolled three 6s. Turn forfeited.`);
        advanceLudoTurn();
        renderLudoBoard();
        return;
    }

    const movable = getMovableLudoTokens(activeColor, ludoDiceValue);
    if (movable.length === 0) {
        if (ludoDiceValue === 6) {
            ludoDiceValue = null;
            ludoHasRolled = false;
            setLudoStatus(`${activeLabel} rolled 6 but has no valid move. Bonus roll again.`);
        } else {
            ludoDiceValue = null;
            ludoHasRolled = false;
            setLudoStatus(`${activeLabel} has no valid move. Next player's turn.`);
            advanceLudoTurn();
        }
        renderLudoBoard();
        return;
    }

    ludoHasRolled = true;
    setLudoStatus(`${activeLabel} rolled ${ludoDiceValue}. Select a token to move.`);
    renderLudoBoard();
}

function getMovableLudoTokens(color, diceValue) {
    const tokenList = ludoTokens[color] || [];
    const movable = [];

    tokenList.forEach((progress, tokenIndex) => {
        if (progress === 57) return;
        if (progress === -1) {
            if (diceValue === 6) movable.push(tokenIndex);
            return;
        }

        const nextProgress = progress + diceValue;
        if (nextProgress <= 57) movable.push(tokenIndex);
    });

    return movable;
}

function handleLudoTokenClick(color, tokenIndex) {
    if (!ludoHasRolled || ludoWinner || !ludoPlayers.length) return;
    if (color !== getCurrentLudoColor()) return;
    if (!getMovableLudoTokens(color, ludoDiceValue).includes(tokenIndex)) return;

    moveLudoToken(color, tokenIndex, ludoDiceValue);
}

function moveLudoToken(color, tokenIndex, diceValue) {
    const tokenList = ludoTokens[color];
    let progress = tokenList[tokenIndex];

    if (progress === -1) progress = 0;
    else progress += diceValue;

    tokenList[tokenIndex] = progress;
    let captureText = '';

    if (progress <= 51) {
        const pathIndex = (LUDO_PLAYER_META[color].startIndex + progress) % 52;
        if (!LUDO_SAFE_INDICES.has(pathIndex)) {
            ludoPlayers.forEach(opponentColor => {
                if (opponentColor === color) return;
                ludoTokens[opponentColor] = ludoTokens[opponentColor].map(opponentProgress => {
                    if (opponentProgress < 0 || opponentProgress > 51) return opponentProgress;
                    const opponentPathIndex = (LUDO_PLAYER_META[opponentColor].startIndex + opponentProgress) % 52;
                    if (opponentPathIndex === pathIndex) {
                        captureText = ` ${LUDO_PLAYER_META[color].label} captured ${LUDO_PLAYER_META[opponentColor].label}!`;
                        return -1;
                    }
                    return opponentProgress;
                });
            });
        }
    }

    const activeLabel = LUDO_PLAYER_META[color].label;

    if (tokenList.every(tokenProgress => tokenProgress === 57)) {
        ludoWinner = color;
        ludoHasRolled = false;
        ludoDiceValue = null;
        ludoConsecutiveSixes = 0;
        setLudoStatus(`${activeLabel} wins the game!`);
        renderLudoBoard();
        return;
    }

    const rolledSix = diceValue === 6;
    ludoHasRolled = false;
    ludoDiceValue = null;

    if (rolledSix) {
        setLudoStatus(`${activeLabel} moved and earned a bonus roll.${captureText}`);
    } else {
        ludoConsecutiveSixes = 0;
        advanceLudoTurn();
        setLudoStatus(`${activeLabel} moved.${captureText} ${getCurrentLudoLabel()}'s turn.`);
    }

    renderLudoBoard();
}

function advanceLudoTurn() {
    ludoCurrentPlayerIndex = (ludoCurrentPlayerIndex + 1) % ludoPlayers.length;
    ludoConsecutiveSixes = 0;
}

function getLudoTokenCoordinate(color, progress, tokenIndex) {
    if (progress === -1) return LUDO_BASE_SLOTS[color][tokenIndex];
    if (progress === 57) return LUDO_CENTER;
    if (progress <= 51) {
        const pathIndex = (LUDO_PLAYER_META[color].startIndex + progress) % 52;
        return LUDO_MAIN_PATH[pathIndex];
    }
    return LUDO_HOME_LANES[color][progress - 52];
}

function isCellInBaseArea(row, col, color) {
    if (color === 'red') return row <= 5 && col <= 5;
    if (color === 'green') return row <= 5 && col >= 9;
    if (color === 'yellow') return row >= 9 && col >= 9;
    if (color === 'blue') return row >= 9 && col <= 5;
    return false;
}

function getBaseColorAtCell(row, col) {
    for (const color of LUDO_COLOR_ORDER) {
        if (isCellInBaseArea(row, col, color)) return color;
    }
    return null;
}

function isBaseAnchor(row, col, color) {
    const [anchorRow, anchorCol] = LUDO_BASE_ANCHORS[color];
    return row === anchorRow && col === anchorCol;
}

function buildLudoOccupancyMap() {
    const occupancy = new Map();

    ludoPlayers.forEach(color => {
        ludoTokens[color].forEach((progress, tokenIndex) => {
            if (progress === -1) return;
            const [row, col] = getLudoTokenCoordinate(color, progress, tokenIndex);
            const key = `${row},${col}`;
            if (!occupancy.has(key)) occupancy.set(key, []);
            occupancy.get(key).push({ color, tokenIndex });
        });
    });

    return occupancy;
}

function getLudoDiceSymbol(value) {
    return value && LUDO_DICE_SYMBOLS[value] ? LUDO_DICE_SYMBOLS[value] : '🎲';
}

function getLudoDieRoll() {
    const cryptoObj = globalThis.crypto;
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
        const range = 6;
        const maxUint32Space = 0x100000000;
        const unbiasedLimit = maxUint32Space - (maxUint32Space % range);
        const randomBuffer = new Uint32Array(1);
        let randomValue = 0;

        do {
            cryptoObj.getRandomValues(randomBuffer);
            randomValue = randomBuffer[0];
        } while (randomValue >= unbiasedLimit);

        return (randomValue % range) + 1;
    }

    return Math.floor(Math.random() * 6) + 1;
}

function renderLudoBoard() {
    if (!ludoBoardEl) return;
    ludoBoardEl.innerHTML = '';
    if (!ludoPlayers.length) return;

    const occupancy = buildLudoOccupancyMap();
    const activeColor = getCurrentLudoColor();
    const movableTokens = ludoHasRolled && activeColor ? getMovableLudoTokens(activeColor, ludoDiceValue) : [];

    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            const key = `${row},${col}`;
            const baseColor = getBaseColorAtCell(row, col);

            if (baseColor && !isBaseAnchor(row, col, baseColor)) {
                continue;
            }

            const square = document.createElement('div');
            square.className = 'ludo-square';

            if (row === LUDO_CENTER[0] && col === LUDO_CENTER[1]) {
                square.classList.add('center');
            }

            if (baseColor) {
                square.classList.add('base-block', baseColor);
                square.style.gridRow = `${row + 1} / span 6`;
                square.style.gridColumn = `${col + 1} / span 6`;

                const slots = document.createElement('div');
                slots.className = 'ludo-base-slots';
                const isActiveBasePlayer = ludoPlayers.includes(baseColor);

                for (let slotIndex = 0; slotIndex < 4; slotIndex++) {
                    const slot = document.createElement('div');
                    slot.className = 'ludo-base-slot';
                    if (isActiveBasePlayer) {
                        const tokenProgress = ludoTokens[baseColor][slotIndex];
                        if (tokenProgress === -1) {
                            const tokenEl = document.createElement('div');
                            tokenEl.className = `ludo-token ${baseColor}`;
                            if (!ludoWinner && baseColor === activeColor && movableTokens.includes(slotIndex)) {
                                tokenEl.classList.add('clickable');
                                tokenEl.addEventListener('click', () => handleLudoTokenClick(baseColor, slotIndex));
                            }
                            slot.appendChild(tokenEl);
                        }
                    } else {
                        const tokenEl = document.createElement('div');
                        tokenEl.className = `ludo-token ${baseColor} inactive`;
                        slot.appendChild(tokenEl);
                    }
                    slots.appendChild(slot);
                }

                square.appendChild(slots);

                if (isActiveBasePlayer) {
                    const diceBtn = document.createElement('button');
                    const shouldHighlightRoll = !ludoWinner && !ludoHasRolled && baseColor === activeColor;
                    diceBtn.className = `ludo-base-dice ${baseColor}`;
                    if (shouldHighlightRoll) diceBtn.classList.add('active-turn');
                    diceBtn.disabled = !shouldHighlightRoll;
                    diceBtn.textContent = getLudoDiceSymbol(ludoLastRollByColor[baseColor]);
                    diceBtn.setAttribute('aria-label', `${LUDO_PLAYER_META[baseColor].label} dice`);
                    diceBtn.addEventListener('click', () => rollLudoDice(baseColor));
                    square.appendChild(diceBtn);
                }
            }

            if (ludoPathIndexByKey.has(key)) {
                square.classList.add('path');
                const pathIndex = ludoPathIndexByKey.get(key);
                if (LUDO_SAFE_INDICES.has(pathIndex)) square.classList.add('safe');
            }

            if (ludoHomeLaneByKey.has(key)) {
                square.classList.add('home-lane', ludoHomeLaneByKey.get(key));
            }

            const tokensOnSquare = baseColor ? [] : (occupancy.get(key) || []);
            if (tokensOnSquare.length > 0 && !baseColor) {
                const stack = document.createElement('div');
                stack.className = 'ludo-token-stack';

                tokensOnSquare.forEach(token => {
                    const tokenEl = document.createElement('div');
                    tokenEl.className = `ludo-token ${token.color}`;

                    if (!ludoWinner && token.color === activeColor && movableTokens.includes(token.tokenIndex)) {
                        tokenEl.classList.add('clickable');
                        tokenEl.addEventListener('click', () => handleLudoTokenClick(token.color, token.tokenIndex));
                    }

                    stack.appendChild(tokenEl);
                });

                square.appendChild(stack);
            }

            ludoBoardEl.appendChild(square);
        }
    }
}

function resetLudoGame() {
    if (!ludoPlayerCount) return;
    initializeLudoState(ludoPlayerCount);
    renderLudoBoard();
    setLudoStatus(`${getCurrentLudoLabel()}'s turn. Roll the dice to start.`);
}

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
if (ludoResetBtn) ludoResetBtn.addEventListener('click', resetLudoGame);

backFromTictactoeBtn.addEventListener('click', () => {
    tictactoeGamePage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

backFromChessBtn.addEventListener('click', () => {
    chessGamePage.classList.add('hidden');
    gameSelectionPage.classList.remove('hidden');
});

if (backFromLudoSetupBtn) {
    backFromLudoSetupBtn.addEventListener('click', () => {
        ludoSetupPage.classList.add('hidden');
        gameSelectionPage.classList.remove('hidden');
        currentGame = null;
    });
}

if (backFromLudoGameBtn) {
    backFromLudoGameBtn.addEventListener('click', () => {
        ludoGamePage.classList.add('hidden');
        ludoSetupPage.classList.remove('hidden');
    });
}

logoutBtn2.addEventListener('click', handleLogout);
logoutBtn3.addEventListener('click', handleLogout);
logoutBtn4.addEventListener('click', handleLogout);
if (logoutBtn5) logoutBtn5.addEventListener('click', handleLogout);
if (logoutBtn6) logoutBtn6.addEventListener('click', handleLogout);
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
