const rockButton = document.querySelector(".rock");
const paperButton = document.querySelector(".paper");
const scissorsButton = document.querySelector(".scissors");
const resultElement = document.querySelector(".result");
const movesElement = document.querySelector(".game-moves");
const scoreElement = document.querySelector(".score-history");
const resetButton = document.querySelector(".reset-score");
const confirmContainer = document.querySelector(".confirm-container");
const confirmPopup = document.querySelector(".confirm-popup");
const autoPlayButton = document.querySelector(".auto-play");

const score = getScoreFromLs() || {
  wins: 0,
  losses: 0,
  ties: 0,
};
fillScore();

rockButton.addEventListener("click", () => playGame("rock"));
paperButton.addEventListener("click", () => playGame("paper"));
scissorsButton.addEventListener("click", () => playGame("scissors"));

resetButton.addEventListener("click", () => {
  if (!score.wins && !score.ties && !score.losses) {
    return;
  }
    confirmContainer.classList.remove("hidden");
  confirmPopup.querySelector(".yes").addEventListener("click", () => {
    if (intervalId) {
      autoPlayButton.click();
    }
    if (dotsIntervalId) {
      clearInterval(dotsIntervalId);
      autoPlayButton.innerHTML = `Auto Play`;
    }
    removeScoreFromLs();
    score.wins = score.losses = score.ties = 0;
    fillScore();
    resultElement.innerHTML = movesElement.innerHTML = "";
    confirmContainer.classList.add("hidden");
  });
  confirmPopup.querySelector(".no").addEventListener("click", () => {
    confirmContainer.classList.add("hidden");
  });
});

let autoPlaying = false;
let intervalId;
let dotsIntervalId;
autoPlayButton.addEventListener("click", () => {
  if (!autoPlaying) {
    autoPlaying = true;
    let dots = "";
    dotsIntervalId = setInterval(() => {
      autoPlayButton.innerHTML = `Auto Playing ${(dots += ".")}`;
      if (dots === "...") {
        clearInterval(dotsIntervalId);
        intervalId = setInterval(() => {
          playGame(computerRandomMove());
          autoPlayButton.innerHTML = `Stop Auto Playing`;
        }, 1500);
      }
    }, 700);
  } else {
    if (dotsIntervalId) {
      clearInterval(dotsIntervalId);
    }
    autoPlayButton.innerHTML = `Auto Play`;
    clearInterval(intervalId);
    intervalId = null;
    autoPlaying = false;
  }
});

function computerRandomMove() {
  const rand = Math.random();
  let computerMove;
  if (rand >= 0 && rand < 1 / 3) {
    computerMove = "rock";
  } else if (rand >= 1 / 3 && rand < 2 / 3) {
    computerMove = "paper";
  } else computerMove = "scissors";
  return computerMove;
}

function updateResult(result) {
  resultElement.innerHTML = result;
}

function updateMoves(you, computer) {
  movesElement.innerHTML = `
    You
    <img src="images/${you}-emoji.png" alt="${you}" />
    <img src="images/${computer}-emoji.png" alt="${computer}" />
    Computer
    `;
}
function updateScore(result) {
  if (result === "Tie.") {
    score.ties++;
  } else if (result === "You lose.") {
    score.losses++;
  } else score.wins++;
  fillScore();
  storeScoreInLs();
}
function fillScore() {
  scoreElement.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}
function storeScoreInLs() {
  localStorage.setItem("score", JSON.stringify(score));
}
function removeScoreFromLs() {
  localStorage.removeItem("score");
}
function getScoreFromLs() {
  return JSON.parse(localStorage.getItem("score"));
}
function calcMoveResult(playerMove, computerMove) {
  if (computerMove === playerMove) return "Tie.";

  let result;
  if (playerMove === "rock") {
    switch (computerMove) {
      case "paper":
        result = "You lose.";
        break;
      case "scissors":
        result = "You win.";
    }
  } else if (playerMove === "scissors") {
    switch (computerMove) {
      case "rock":
        result = "You lose.";
        break;
      case "paper":
        result = "You win.";
    }
  } else {
    switch (computerMove) {
      case "scissors":
        result = "You lose.";
        break;
      case "rock":
        result = "You win.";
    }
  }
  return result;
}
function playGame(playerMove) {
  const computerMove = computerRandomMove();
  let MoveResult = calcMoveResult(playerMove, computerMove);
  updateResult(MoveResult);
  updateMoves(playerMove, computerMove);
  updateScore(MoveResult);
}

document.body.addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "r":
      rockButton.click();
      break;
    case "p":
      paperButton.click();
      break;
    case "s":
      scissorsButton.click();
      break;
    case "a":
      autoPlayButton.click();
      break;
    case "Escape":
      resetButton.click();
  }
});
