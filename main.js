// Game Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 150;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const SPEED_INCREMENT = 0.001;
const INITIAL_SPEED = 5;

// Assets
const bgImage = new Image();
bgImage.src = 'background.png';
const dinoImage = new Image();
dinoImage.src = 'character.png';

// Game State
let canvas, ctx;
let gameSpeed = INITIAL_SPEED;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameRunning = false;
let gameOver = false;
let frameId;
let bgX = 0; // Background scroll position

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

    // Disable image smoothing for pixel art look
    ctx.imageSmoothingEnabled = false;

    document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput); // Mobile support
    document.getElementById('restart-btn').addEventListener('click', resetGame);

    resetGame();
    // Don't auto-start, wait for input
    gameRunning = false;
    
    // Wait for images to load before initial draw if needed, 
    // but drawing loop handles it via checks or it just pops in.
    bgImage.onload = draw;
    dinoImage.onload = draw;
    draw(); 
}

function resetGame() {
    gameSpeed = INITIAL_SPEED;
    score = 0;
    gameRunning = true;
    gameOver = false;
    bgX = 0;
    
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

    // Scroll Background
    // Assuming background includes the ground, it moves at gameSpeed
    bgX -= gameSpeed;
    if (bgX <= -CANVAS_WIDTH) {
        bgX = 0;
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
        // Simple AABB collision
        // Shrink hitbox slightly for fairer play with sprite
        const hitX = dino.x + 5;
        const hitY = dino.y + 5;
        const hitW = dino.width - 10;
        const hitH = dino.height - 10;

        if (
            hitX < obs.x + obs.width &&
            hitX + hitW > obs.x &&
            hitY < obs.y + obs.height &&
            hitY + hitH > obs.y
        ) {
            handleGameOver();
        }
    }

    draw();
}

function draw() {
    // Draw Background
    if (bgImage.complete && bgImage.naturalWidth > 0) {
        // Draw two copies for infinite scrolling
        ctx.drawImage(bgImage, bgX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(bgImage, bgX + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Fallback
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw Dino
    if (dinoImage.complete && dinoImage.naturalWidth > 0) {
        ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    } else {
         ctx.fillStyle = '#535353';
         ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    // Obstacles (Cacti)
    // Use a color that stands out against the new background
    // Since we don't know the bg color for sure, dark grey is usually safe, 
    // or maybe a dark green/brown if it's a forest.
    ctx.fillStyle = '#2c3e50'; 
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Score
    ctx.fillStyle = '#ffffff'; // White text might be better on a colored background
    ctx.font = 'bold 20px monospace';
    // Add text shadow for readability
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.textAlign = 'right';
    const scoreText = `HI ${Math.floor(highScore)} ${Math.floor(score).toString().padStart(5, '0')}`;
    ctx.fillText(scoreText, CANVAS_WIDTH - 10, 30);
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function handleGameOver() {
    gameOver = true;
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
    }
    document.getElementById('game-ui').classList.add('visible');
    draw(); 
}

// Start
init();
