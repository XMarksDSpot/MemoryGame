const gameContainer = document.querySelector(".game");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const restartBtn = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const highScoreBtn = document.getElementById("high-scores-btn");
const clearBtn = document.getElementById("clear-scores-btn");
const endScreen = document.getElementById("end-screen");
const usernameInput = document.getElementById("name");
const timerDisplayContainer = document.getElementById("timer-display-container");
const timerDisplay = document.getElementById("timer-display");
const highScoreDisplay = document.getElementById("high-score-display");
const topScoreText = document.getElementById("top-score-text");
const h1Title = document.getElementById("title")
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "aqua",
  "darkslategray",
  "khaki",
  "hotpink",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "aqua",
  "darkslategray",
  "khaki",
  "hotpink",
];

let shuffledColors = shuffle(COLORS);
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;

highScoreDisplay.style.display = "none";
if (!localStorage.getItem("savedScores")) {
  localStorage.setItem("savedScores", JSON.stringify([]));
}

topScoreText.style.display = "none";
endScreen.style.display = "none";
backBtn.style.display = "none";
clearBtn.style.display = "none";
timerDisplayContainer.style.display = "none";

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("card", color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flip");
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.className === secondCard.className;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);
  resetBoard();
  matches++;

  if (matches === COLORS.length / 2) {
    stopTimer();

    const score = JSON.parse(localStorage.getItem("score"));
    const elapsedTime = JSON.parse(localStorage.getItem("elapsedTime"));
    const roundedScore = Math.round(score);
    const roundedElapsedTime = Math.round(elapsedTime);
    const userDetails = document.createElement("p");
    userDetails.classList.add("current-user-score");
    userDetails.textContent = `SCORE: ${roundedScore} TIME: ${roundedElapsedTime}`;

    saveCurrentUserScore();
    setTimeout(() => {
      gameContainer.style.display = "none";
      endScreen.style.display = "";
      const userDetailsContainer = document.querySelector(
        "#user-details-container"
      );
      userDetailsContainer.appendChild(userDetails);
      clearBtn.style.display = "none";
      restartBtn.style.display = "";
      timerDisplayContainer.style.display = "none";
    }, 1000);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
let startTime;
let timerInterval;
let score = 0;

function startTimer() {
  startTime = new Date();
  score = 1000;
  timerInterval = setInterval(function () {
    const currentTime = new Date();
    const timeElapsed = Math.round(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );
    timerDisplay.textContent = `${timeElapsed}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  const endTime = new Date();
  const elapsedTimeInSeconds = Math.round(
    (endTime.getTime() - startTime.getTime()) / 1000
  );
  const timeDeduction = elapsedTimeInSeconds - 120;
  const score = 1000 - timeDeduction * 15;
  localStorage.setItem("score", JSON.stringify(score));
  localStorage.setItem("elapsedTime", JSON.stringify(elapsedTimeInSeconds));
}

function startGame() {
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS);
  hasFlippedCard = false;
  lockBoard = false;
  firstCard, secondCard;
  matches = 0;
  startTime;
  timerInterval;
  score = 0;
  timerDisplayContainer.style.display = "";
  startScreen.style.display = "none";
  gameContainer.style.display = "";
  backBtn.style.display = "none";
  restartBtn.style.display = "none";
  endScreen.style.display = "none";
  saveUsername();
  createDivsForColors(shuffledColors);
  startTimer();
}

startBtn.addEventListener("click", () => {
  if (usernameInput.value === "") {
    alert("Please enter your name to start the game!");
    return;
  }

  startGame();
});

function saveUsername() {
  const username = usernameInput.value;
  localStorage.setItem("username", JSON.stringify(username));
}

function startOver() {
  h1Title.style.display = "";
  startScreen.style.display = "";
  usernameInput.style.display = "";
  startBtn.style.display = "";
  highScoreBtn.style.display = "";
  usernameInput.style = "";
  timerDisplayContainer.style.display = "none";
  endScreen.style.display = "none";
  gameContainer.style.display = "none";
  endScreen.style.display = "none";
  restartBtn.style.display = "none";
  backBtn.style.display = "none";
  clearBtn.style.display = "none";
  highScoreDisplay.style.display = "none";
  topScoreText.style.display = "none";

  const userDetails = endScreen.querySelector(".current-user-score");
  if (userDetails) {
    endScreen.remove(userDetails);
  }
}

function saveCurrentUserScore() {
  const username = JSON.parse(localStorage.getItem("username"));
  const score = JSON.parse(localStorage.getItem("score"));
  const elapsedTime = JSON.parse(localStorage.getItem("elapsedTime"));

  if (username && score && elapsedTime) {
    const scoreData = {
      username: username,
      score: score,
      elapsedTime: elapsedTime,
    };

    let savedScores = JSON.parse(localStorage.getItem("savedScores"));
    if (!savedScores) {
      savedScores = [];
    }

    const existingScore = savedScores.find(
      (item) =>
        item.username === username &&
        item.score === score &&
        item.elapsedTime === elapsedTime
    );
    if (!existingScore) {
      savedScores.push(scoreData);
      localStorage.setItem("savedScores", JSON.stringify(savedScores));
    }
  }
}

function updateDisplayState() {
  highScoreDisplay.style.display = "";
  backBtn.style.display = "";
  clearBtn.style.display = "";
  highScoreBtn.style.display = "none";
  usernameInput.style.display = "none";
  timerDisplayContainer.style.display = "none";
  gameContainer.style.display = "none";
  endScreen.style.display = "none";
  restartBtn.style.display = "none";
  startBtn.style.display = "none";
}

function displayAllScores() {
  const savedScores = JSON.parse(localStorage.getItem("savedScores"));

  if (!savedScores || savedScores.length === 0) {
    highScoreDisplay.textContent = "No scores available";
    return;
  }

  savedScores.sort((a, b) => b.score - a.score);

  const topTenScores = savedScores.slice(0, 10);

  const tbody = document.querySelector("#high-score-display tbody");
  tbody.innerHTML = "";

  topTenScores.forEach(({ username, score, elapsedTime }, index) => {
    const displayScores = document.createElement("tr");
    displayScores.classList.add("display-scores");

    const roundedScore = Math.round(score);
    const roundedElapsedTime = Math.round(elapsedTime);
    const capitalizeUsername = username.toUpperCase();

    displayScores.innerHTML = `
      <td>${index + 1}.</td>
      <td>${capitalizeUsername}</td>
      <td>${roundedScore}</td>
      <td>${roundedElapsedTime}</td>`;
    tbody.appendChild(displayScores);
  });
}

function clearScores() {
  localStorage.removeItem("savedScores");
  localStorage.removeItem("username");
  localStorage.removeItem("score");
  localStorage.removeItem("elapsedTime");
  startScreen.style.display = "none";
  usernameInput.style.display = "none";
  startScreen.style.display = "";
  startBtn.style.display = "none";
  backBtn.style.display = "";
}

clearBtn.addEventListener("click", () => {
  clearScores();
  highScoreDisplay.textContent = "";
  const message = document.createElement("p");
  message.textContent = "All scores are cleared";
  message.classList.add("clear");
  highScoreDisplay.appendChild(message);

  clearBtn.disabled = true;
});

highScoreBtn.addEventListener("click", () => {
  topScoreText.style.display = "";
  updateDisplayState();
  displayAllScores();

  clearBtn.disabled = false;
  const savedScores = JSON.parse(localStorage.getItem("savedScores"));
  if (savedScores === null) {
    highScoreDisplay.textContent = "No scores available";
  } else {
  }
});

backBtn.addEventListener("click", () => {
  startOver();

  const message = highScoreDisplay.querySelector(".clear");
  if (message) {
    highScoreDisplay.removeChild(message);
  }
  clearBtn.disabled = false;
});
restartBtn.addEventListener("click", () => {
  const userDetailsContainer = document.querySelector(
    "#user-details-container"
  );
  if (userDetailsContainer.firstChild) {
    userDetailsContainer.removeChild(userDetailsContainer.firstChild);
  }
  startOver();
});
