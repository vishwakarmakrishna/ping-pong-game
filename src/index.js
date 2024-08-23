const container = document.getElementById('game-container');
const rod1 = document.getElementById('rod1');
const rod2 = document.getElementById('rod2');
const ball = document.getElementById('ball');
const startButton = document.getElementById('start-button');
const rematchButton = document.getElementById('rematch-button');
const highScoreDisplay = document.getElementById('high-score');
const currentScoreDisplay = document.getElementById('current-score');
const delayMessage = document.getElementById('delay-message');
const countdownDisplay = document.getElementById('countdown');

const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;
const rodWidth = rod1.offsetWidth;
const ballDiameter = ball.offsetWidth;

let rod1X = (containerWidth - rodWidth) / 2;
let rod2X = rod1X;
let ballX = containerWidth / 2 - ballDiameter / 2;
let ballY = containerHeight / 2 - ballDiameter / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
let score = 0;
let gameInterval;

const rodSpeed = 10;
let maxScore = localStorage.getItem('maxScore') || 0;
let maxScoreName = localStorage.getItem('maxScoreName') || '';

function updateScoreDisplays() {
  highScoreDisplay.textContent = `High Score: ${maxScore}`;
  currentScoreDisplay.textContent = `Current Score: ${score}`;
}

function resetGame() {
  ballX = containerWidth / 2 - ballDiameter / 2;
  ballY = containerHeight / 2 - ballDiameter / 2;
  rod1X = (containerWidth - rodWidth) / 2;
  rod2X = rod1X;
  rod1.style.left = `${rod1X}px`;
  rod2.style.left = `${rod2X}px`;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  score = 0;
  updateScoreDisplays();
}

function endGame() {
  clearInterval(gameInterval);
  rematchButton.style.display = 'inline'; // Show rematch button
  if (score > maxScore) {
    maxScore = score;
    maxScoreName = prompt('New high score! Enter your name:');
    localStorage.setItem('maxScore', maxScore);
    localStorage.setItem('maxScoreName', maxScoreName);
  }
  alert(`Game Over! Your score is ${score}. ${maxScoreName} holds the highest score of ${maxScore}.`);
}

function updateBallPosition() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX + ballDiameter >= containerWidth) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY <= rod1.offsetHeight) {
    if (ballX + ballDiameter >= rod1X && ballX <= rod1X + rodWidth) {
      ballSpeedY = -ballSpeedY;
      score++;
    } else {
      endGame();
      return;
    }
  } else if (ballY + ballDiameter >= containerHeight - rod2.offsetHeight) {
    if (ballX + ballDiameter >= rod2X && ballX <= rod2X + rodWidth) {
      ballSpeedY = -ballSpeedY;
      score++;
    } else {
      endGame();
      return;
    }
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}

function moveRods(e) {
  if (e.key === 'a' && rod1X > 0) {
    rod1X -= rodSpeed;
    rod2X -= rodSpeed;
  } else if (e.key === 'd' && rod1X < containerWidth - rodWidth) {
    rod1X += rodSpeed;
    rod2X += rodSpeed;
  }

  rod1.style.left = `${rod1X}px`;
  rod2.style.left = `${rod2X}px`;
}

function startGame() {
  startButton.style.display = 'none'; // Hide the start button
  rematchButton.style.display = 'none'; // Hide the rematch button if present
  delayMessage.style.display = 'block'; // Show delay message
  let countdown = 2; // Starting countdown value
  countdownDisplay.textContent = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      delayMessage.style.display = 'none'; // Hide delay message
      gameInterval = setInterval(updateBallPosition, 10);
      document.addEventListener('keydown', moveRods);
    }
  }, 1000); // Update countdown every second
}

function rematch() {
  resetGame();
  startGame();
}

updateScoreDisplays(); // Initialize score display
startButton.addEventListener('click', startGame);
rematchButton.addEventListener('click', rematch);
