const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const AI_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Mouse control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top & bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision (Player)
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
        // Add some "spin"
        ballSpeedY += ((ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2)) * 0.1;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = AI_X - BALL_SIZE; // Prevent sticking
        // Add some "spin"
        ballSpeedY += ((ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2)) * 0.1;
    }

    // Left & right wall: reset ball
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 8) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballCenter + 8) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw center line
    ctx.strokeStyle = "#888";
    ctx.beginPath();
    for (let i = 0; i < canvas.height; i += 24) {
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 16);
    }
    ctx.stroke();
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Start game
gameLoop();
