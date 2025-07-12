let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let resultMsg = document.querySelector("#result-msg");

let turnO = true; // true = O's turn, false = X's turn
let count = 0; // To track draw condition

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Reset game logic
const resetGame = () => {
    turnO = true;
    count = 0;
    resultMsg.textContent = "";
    enableBoxes();

    // Remove winner animation and color classes
    boxes.forEach(box => {
        box.classList.remove("winner-box", "x", "o");
    });
};

// Handle click on each box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            box.classList.add("o");
            turnO = false;
        } else {
            box.innerText = "X";
            box.classList.add("x");
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();

        if (!isWinner && count === 9) {
            showDraw();
        }
    });
});

// Disable all boxes (after win/draw)
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

// Enable all boxes (on reset)
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

// Display winner message
const showWinner = (winner) => {
    resultMsg.textContent = `Player ${winner} wins!`;
    disableBoxes();
};

// Display draw message
const showDraw = () => {
    resultMsg.textContent = "Game ended in a draw!";
    disableBoxes();
};

// Check winning combinations
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                // Highlight winning boxes
                boxes[pattern[0]].classList.add("winner-box");
                boxes[pattern[1]].classList.add("winner-box");
                boxes[pattern[2]].classList.add("winner-box");

                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

// Button listener
resetBtn.addEventListener("click", resetGame);

// Initialize game
resetGame();
