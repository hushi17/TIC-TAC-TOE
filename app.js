// DOM Elements
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const resultMsg = document.querySelector("#result-msg");
const gameContainer = document.querySelector("#gameContainer");
const symbolModal = document.querySelector("#symbolModal");
const difficultyModal = document.querySelector("#difficultyModal");
const symbolButtons = document.querySelectorAll("[data-symbol]");
const difficultyButtons = document.querySelectorAll("[data-level]");

// Game State
let playerSymbol = "X";
let computerSymbol = "O";
let gameLevel = "easy";
let isGameOver = false;
let count = 0;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Symbol Selection
symbolButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        playerSymbol = btn.dataset.symbol;
        computerSymbol = playerSymbol === "X" ? "O" : "X";

        symbolButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        symbolModal.classList.add("hide");
        difficultyModal.classList.remove("hide");
    });
});

// Difficulty Selection
difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        gameLevel = btn.dataset.level;

        difficultyButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        difficultyModal.classList.add("hide");
        gameContainer.classList.remove("hide");
        initGame();

        if (computerSymbol === "X") {
            setTimeout(computerMove, 500);
        }
    });
});

// Initialize Game
function initGame() {
    boxes.forEach(box => {
        box.innerText = "";
        box.classList.remove("x", "o", "winner-box");
        box.disabled = false;
    });
    resultMsg.textContent = "";
    count = 0;
    isGameOver = false;
}

// Box Click Handler
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (isGameOver || box.innerText !== "") return;

        box.innerText = playerSymbol;
        box.classList.add(playerSymbol.toLowerCase());
        box.disabled = true;
        count++;

        if (checkWinner(playerSymbol)) {
            showWinner(playerSymbol);
            return;
        }

        if (count < 9) {
            setTimeout(computerMove, 500);
        } else {
            showDraw();
        }
    });
});

// Computer Move Logic
function computerMove() {
    if (isGameOver) return;

    const emptyBoxes = [...boxes].filter(box => box.innerText === "");
    if (emptyBoxes.length === 0) return;

    let targetBox;

    if (gameLevel === "easy") {
        targetBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    } else if (gameLevel === "medium") {
        targetBox = findBestMove() || emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    } else { // hard
        targetBox = findBestMove(true);
    }

    if (targetBox) {
        targetBox.innerText = computerSymbol;
        targetBox.classList.add(computerSymbol.toLowerCase());
        targetBox.disabled = true;
        count++;

        if (checkWinner(computerSymbol)) {
            showWinner(computerSymbol);
        } else if (count === 9) {
            showDraw();
        }
    }
}

// Find Best Move (Simple AI)
function findBestMove() {
    // Try to win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const values = [boxes[a], boxes[b], boxes[c]];

        if (values.filter(b => b.innerText === computerSymbol).length === 2 &&
            values.some(b => b.innerText === "")) {
            return values.find(b => b.innerText === "");
        }
    }

    // Block player
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const values = [boxes[a], boxes[b], boxes[c]];

        if (values.filter(b => b.innerText === playerSymbol).length === 2 &&
            values.some(b => b.innerText === "")) {
            return values.find(b => b.innerText === "");
        }
    }

    // Take center if available
    if (boxes[4].innerText === "") return boxes[4];

    // Take a random corner
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => boxes[i].innerText === "");
    if (emptyCorners.length > 0) {
        return boxes[emptyCorners[Math.floor(Math.random() * emptyCorners.length)]];
    }

    // Take any available space
    return [...boxes].find(box => box.innerText === "");
}

// Check for Winner
function checkWinner(symbol) {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        if (boxes[a].innerText === symbol &&
            boxes[b].innerText === symbol &&
            boxes[c].innerText === symbol) {

            boxes[a].classList.add("winner-box");
            boxes[b].classList.add("winner-box");
            boxes[c].classList.add("winner-box");

            isGameOver = true;
            return true;
        }
        return false;
    });
}

// Show Winner Message
function showWinner(winner) {
    resultMsg.textContent = winner === playerSymbol ? "You Win!" : "Computer Wins!";
    disableBoxes();
}

// Show Draw Message
function showDraw() {
    resultMsg.textContent = "It's a Draw!";
    disableBoxes();
}

// Disable All Boxes
function disableBoxes() {
    boxes.forEach(box => box.disabled = true);
}

// Reset Game
resetBtn.addEventListener("click", () => {
    initGame();
    if (computerSymbol === "X") {
        setTimeout(computerMove, 500);
    }
});