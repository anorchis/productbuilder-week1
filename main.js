// Game Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 150;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const SPEED_INCREMENT = 0.001;
const INITIAL_SPEED = 5;

// Game State
let canvas, ctx;
let gameSpeed = INITIAL_SPEED;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameRunning = false;
let gameOver = false;
let frameId;

// Entities
let dino = {
    x: 50,
    y: 0,
    width: 40,
    height: 40,
    dy: 0,
    grounded: true,
    jumpTimer: 0
};

let obstacles = [];
let clouds = [];

// Assets (Simple Drawing for now to match strict layout requests)
// In a real strict clone we'd use sprite sheets, but drawing primitives works for logic.

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Scale for Retina/HighDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput); // Mobile support
    document.getElementById('restart-btn').addEventListener('click', resetGame);

    resetGame();
    // Don't auto-start, wait for input
    gameRunning = false;
    draw(); 
}

function resetGame() {
    gameSpeed = INITIAL_SPEED;
    score = 0;
    gameRunning = true;
    gameOver = false;
    
    dino.y = CANVAS_HEIGHT - dino.height;
    dino.dy = 0;
    obstacles = [];
    clouds = [];

    document.getElementById('game-ui').classList.remove('visible');
    
    if (frameId) cancelAnimationFrame(frameId);
    requestAnimationFrame(update);
}

function handleInput(e) {
    if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'ArrowUp') return;
    // Touchstart doesn't need key checks
    
    if (gameOver) {
        resetGame();
        return;
    }

    if (!gameRunning) {
        gameRunning = true;
        update();
    }

    if (dino.grounded) {
        dino.dy = JUMP_STRENGTH;
        dino.grounded = false;
    }
}

function spawnObstacle() {
    // Randomly spawn obstacles
    if (Math.random() < 0.02) {
        const height = Math.random() > 0.5 ? 40 : 25; // Small or Big Cactus
        const width = height === 40 ? 25 : 15;
        
        // Ensure minimum distance between obstacles
        if (obstacles.length > 0) {
            const lastObstacle = obstacles[obstacles.length - 1];
            if (CANVAS_WIDTH - lastObstacle.x < 200) return;
        }

        obstacles.push({
            x: CANVAS_WIDTH,
            y: CANVAS_HEIGHT - height,
            width: width,
            height: height
        });
    }
}

function update() {
    if (!gameRunning || gameOver) return;
    
    frameId = requestAnimationFrame(update);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Physics
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    // Ground Collision
    if (dino.y + dino.height > CANVAS_HEIGHT) {
        dino.y = CANVAS_HEIGHT - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }

    // Move Obstacles
    spawnObstacle();
    
    // Iterate backwards to safely remove elements
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Speed up
    gameSpeed += SPEED_INCREMENT;

    // Collision Detection
    for (let obs of obstacles) {
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ) {
            handleGameOver();
        }
    }

    draw();
}

function draw() {
    // Background (already set in CSS, but can add clouds here)
    
    // Dino (Gray Rectangle for now)
    ctx.fillStyle = '#535353';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Obstacles (Cacti)
    ctx.fillStyle = '#535353';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Score
    ctx.fillStyle = '#535353';
    ctx.font = '20px monospace';
    ctx.textAlign = 'right';
    const scoreText = `HI ${Math.floor(highScore)} ${Math.floor(score).toString().padStart(5, '0')}`;
    ctx.fillText(scoreText, CANVAS_WIDTH - 10, 30);
}

function handleGameOver() {
    gameOver = true;
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
    }
    document.getElementById('game-ui').classList.add('visible');
    draw(); // Draw one last time to ensure overlapping state is visible
}

// Start
init();