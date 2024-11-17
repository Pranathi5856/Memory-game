const gameGrid = document.getElementById("game-grid");
const movesCounter = document.getElementById("moves");
const restartButton = document.getElementById("restart-button");
const timerDisplay = document.getElementById("time");
const timerOptionButton = document.getElementById("timer-option");
const movesOptionButton = document.getElementById("moves-option");

let moves = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameMode = null;
let moveLimit = 20; // Default move limit
let timeLimit = 60; // Default time limit in seconds
let timer = null;
let timeLeft = timeLimit;
let timerRunning = false;

// Icons for the cards
const icons = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍍", "🥝", "🍒"];

// Duplicate and shuffle icons
const createShuffledIcons = () => {
    const duplicatedIcons = [...icons, ...icons];
    return duplicatedIcons.sort(() => Math.random() - 0.5);
};

// Initialize the game
const initializeGame = () => {
    gameGrid.innerHTML = "";
    if (gameMode === "moves") {
        moves = 0;
        movesCounter.textContent = `${moveLimit} Moves Left`; // Display move limit
    } else {
        moves = 0;
        movesCounter.textContent = `Moves: ${moves}`; // Show moves for timer mode
    }
    
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    if (gameMode === "timer") {
        timeLeft = timeLimit;
        startTimer();
    } else {
        stopTimer();
        timerDisplay.textContent = "00:00";
    }

    const shuffledIcons = createShuffledIcons();
    shuffledIcons.forEach((icon) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;

        card.innerHTML = `
            <div class="front-face"></div>
            <div class="back-face">${icon}</div>
        `;

        card.addEventListener("click", handleCardClick);
        gameGrid.appendChild(card);
    });
};

// Handle card click events
const handleCardClick = (e) => {
    if (lockBoard || e.target.classList.contains("flipped")) return;

    const clickedCard = e.currentTarget;
    clickedCard.classList.add("flipped");

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        checkForMatch();
    }
};

// Check if two cards match
const checkForMatch = () => {
    const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    if (isMatch) {
        disableMatchedCards();
    } else {
        unflipCards();
    }

    moves++;
    
    if (gameMode === "moves") {
        movesCounter.textContent = `${moveLimit - moves} Moves Left`; // Update moves left
    } else {
        movesCounter.textContent = `Moves: ${moves}`; // Update moves in timer mode
    }

    // Check if moves are exhausted
    if (gameMode === "moves" && moves >= moveLimit) {
        endGame("You are out of moves!");
    }
};

// Disable matched cards
const disableMatchedCards = () => {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetSelection();

    // Check if all cards are matched
    const matchedCards = document.querySelectorAll(".card.matched");
    if (matchedCards.length === document.querySelectorAll(".card").length) {
        endGame("You won!");
    }
};

// Unflip unmatched cards
const unflipCards = () => {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetSelection();
    }, 1000);
};

// Reset card selection
const resetSelection = () => {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
};

// Start the timer
const startTimer = () => {
    if (timerRunning) return;
    timerRunning = true;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame("Time's up!");
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }, 1000);
};

// Stop the timer
const stopTimer = () => {
    clearInterval(timer);
    timerRunning = false;
};

// End the game with a message
const endGame = (message) => {
    alert(message);
    stopTimer();
    lockBoard = true;
};

// Restart the game
restartButton.addEventListener("click", initializeGame);

// Choose the timer mode
timerOptionButton.addEventListener("click", () => {
    gameMode = "timer";
    movesCounter.textContent = `Moves: ${moves}`; // Show current moves for timer mode
    initializeGame();
});

// Choose the limited moves mode
movesOptionButton.addEventListener("click", () => {
    gameMode = "moves";
    moves = 0; // Reset moves for the limited mode
    movesCounter.textContent = `${moveLimit} Moves Left`; // Set the total number of moves
    initializeGame();
});

// Start the game with a default mode
gameMode = "moves"; // Default to move limit mode
initializeGame();
