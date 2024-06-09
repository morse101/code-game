const phrases = [
    "BTC",
    "ETH",
    "BNB",
    "TON",
    "SOL",
    "DOGE",
    "PEPE",
    "SHIB",
    "USDT",
    "SAND",
    "NEAR",
    "DOT"
];

const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'
};

let timeLeft = 20;
let timer;
let currentPhrase = "";
let currentMorse = "";
let currentLetterIndex = 0;
let translatedPhrase = "";
let attemptCount = 0;
let stars = 0;
let totalStars = 0;

const modal = document.getElementById("game-over-modal");
const closeModalButton = document.getElementById("close-modal");
const finalStars = document.getElementById("final-stars");
const restartBtn = document.getElementById("restart-btn");
const rulesModal = document.getElementById("rules-modal");
const rulesLink = document.getElementById("rules-link");
const closeRulesModal = document.getElementById("close-rules-modal");

closeModalButton.addEventListener("click", () => {
    closeModal(modal);
});

restartBtn.addEventListener("click", () => {
    modal.style.display = "none";
    startGame();
});

rulesLink.addEventListener("click", () => {
    clearInterval(timer);
    rulesModal.style.display = "block";
});

closeRulesModal.addEventListener("click", () => {
    closeModal(rulesModal);
});

function populateMorseTable() {
    const tbody = document.getElementById("morse-table").querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
    for (const letter in morseCode) {
        const row = document.createElement("tr");
        const cellLetter = document.createElement("td");
        cellLetter.textContent = letter;
        const cellMorse = document.createElement("td");
        cellMorse.textContent = morseCode[letter];
        row.appendChild(cellLetter);
        row.appendChild(cellMorse);
        tbody.appendChild(row);
    }
}

function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function startGame() {
    clearInterval(timer);
    timeLeft = 20;
    document.getElementById("timer").innerText = timeLeft;
    currentPhrase = getRandomPhrase();
    document.getElementById("phrase").innerText = currentPhrase;
    currentMorse = "";
    currentLetterIndex = 0;
    translatedPhrase = "";
    attemptCount = 0;
    document.getElementById("translated-phrase").innerText = translatedPhrase;
    document.getElementById("morse-output").innerText = currentMorse;
    document.getElementById("morse-output").dataset.fullMorse = ""; // Clear stored full morse
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result-container").innerText = "Время вышло!";
            endGame();
        }
    }, 1000);
}

function endGame() {
    totalStars += stars;
    finalStars.innerText = stars;
    modal.style.display = "block";
    document.getElementById("stars").innerText = totalStars;
}

document.getElementById("dot-btn").addEventListener("click", () => {
    addSymbol(".");
});

document.getElementById("dash-btn").addEventListener("click", () => {
    addSymbol("-");
});

function addSymbol(symbol) {
    currentMorse += symbol;
    const morseOutput = document.getElementById("morse-output");
    const fullMorse = morseOutput.dataset.fullMorse;
    morseOutput.innerText = fullMorse + currentMorse;

    if (morseCode[currentPhrase[currentLetterIndex]].startsWith(currentMorse)) {
        if (currentMorse === morseCode[currentPhrase[currentLetterIndex]]) {
            translatedPhrase += currentPhrase[currentLetterIndex];
            document.getElementById("translated-phrase").innerText = translatedPhrase;
            morseOutput.dataset.fullMorse = fullMorse + currentMorse + " ";
            morseOutput.innerText = morseOutput.dataset.fullMorse;
            currentLetterIndex++;
            currentMorse = "";
            timeLeft += 5; // Add 5 seconds for each correctly guessed letter
            stars += 3; // Add 3 stars for each correctly guessed letter
            document.getElementById("timer").innerText = timeLeft;
            document.getElementById("stars").innerText = totalStars + stars; // Update stars display in real-time
            if (currentLetterIndex >= currentPhrase.length) {
                setTimeout(() => {
                    startGame();
                }, 500);
            }
        }
    } else {
        timeLeft -= 5; // Subtract 5 seconds for each incorrect guess
        document.getElementById("timer").innerText = timeLeft;
        currentMorse = "";
    }
}

// Close modals with the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (rulesModal.style.display === "block") {
            closeModal(rulesModal);
        }
        if (modal.style.display === "block") {
            closeModal(modal);
        }
    }
});

function closeModal(modal) {
    modal.style.display = "none";
    if (modal === rulesModal) {
        startTimer(); // Restart the timer when the rules modal is closed
    }
}

populateMorseTable();
startGame();