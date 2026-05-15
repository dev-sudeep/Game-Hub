# 🎮 Game Hub

A sleek, browser-based gaming platform featuring classic strategy games with a modern, responsive interface. Whether you're looking for a quick match of **Tic Tac Toe** or a deep tactical battle in **Chess**, Game Hub has you covered.

---

## ✨ Features

### 🔐 Authentication
* **Google Sign-In:** Securely log in using your Google account via Google Identity Services.
* **Guest Mode:** Jump straight into the action with a custom display name without needing an account.

### ♟️ Advanced Chess Engine
The chess implementation follows official FIDE-style rules, including:
* **Move Validation:** Full legality checks for all pieces (Knights, Bishops, Rooks, Queens, and Kings).
* **Castling:** Automated rook movement for both Kingside and Queenside castling.
* **En Passant:** Specialized pawn capture logic that tracks the game state from the previous turn.
* **Pawn Promotion:** Transform your pawn into a Queen, Rook, Bishop, or Knight upon reaching the 8th rank.
* **Check Detection:** Real-time monitoring to ensure the King is never left in an illegal position.
* **Move Log:** A live history of every move made during the match in standard notation.

### ❌ Tic Tac Toe
* Classic 3x3 grid gameplay with high-contrast UI.
* Automatic win detection and victory line highlighting.
* Responsive design for seamless play on mobile or desktop.

### 🎲 Ludo
* Choose **2-4 players** before starting.
* Core rules included: roll 6 to leave base, captures, bonus roll on 6, exact roll to finish.
* First player to bring all four tokens home wins.

---

## 🚀 Tech Stack

* **HTML5:** Semantic structure for the gaming interface.
* **CSS3:** Custom styling with Flexbox/Grid and smooth transitions.
* **JavaScript (ES6+):** Pure "vanilla" logic for game engines, move validation, and state management.
* **Google Identity Services:** Integrated OAuth 2.0 for secure user authentication.

---

## 🛠️ Local Setup & Installation

Because this project uses **Google Identity Services**, the Google Sign-In button requires a secure origin or a local server to appear.

1.  **Clone the project:**
    ```bash
    git clone [https://github.com/yourusername/game-hub.git](https://github.com/yourusername/game-hub.git)
    ```
2.  **Run with a local server:**
    * **VS Code:** Install the "Live Server" extension, right-click `index.html`, and select **Open with Live Server**.
    * **Python:** Run `python -m http.server 8000` in your terminal.
3.  **Configure Google Auth:**
    * Replace the `client_id` in `script.js` with your own credentials from the [Google Cloud Console](https://console.cloud.google.com/).
    * Ensure your local URL (e.g., `http://localhost:5500`) is added to the **Authorized JavaScript origins**.

---

## 📝 How to Play

Go to the Deployments for branch `main` and go to the latest github pages deployment or use local live server if locally installed.

### Chess
1.  Click a piece to select it (valid pieces will highlight).
2.  Click a destination square to execute the move.
3.  **Special Rules:**
    * **Castling:** Move your King two squares toward your Rook.
    * **En Passant:** Capture an opponent's pawn diagonally if they just moved two squares to land beside you.
    * **Promotion:** Reach the last row and follow the prompt to upgrade your pawn.

### Tic Tac Toe
1.  Click any empty cell to place your mark.
2.  The game alternates between **X** and **O** automatically.
3.  Hit **Reset Game** to clear the board at any time.

### Ludo
1.  Select the number of players (2, 3, or 4).
2.  Roll dice and move valid tokens; roll **6** to bring tokens out of base.
3.  Capture opponents on track squares and race all four tokens home.

---

**Developed with care in 2026.**
