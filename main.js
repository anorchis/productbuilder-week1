// Game Constants
// Updated to match image natural dimensions
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 434;

// Physics adjustments for larger scale
// Gravity needs to be stronger for a taller world, jump stronger too
const GRAVITY = 1.5; 
const JUMP_STRENGTH = -25; 
const SPEED_INCREMENT = 0.002;
const INITIAL_SPEED = 8;

// Assets
const bgImage = new Image();
bgImage.src = 'way.png';
const dinoRunImage = new Image();
dinoRunImage.src = 'worker.png';
const dinoJumpImage = new Image();
dinoJumpImage.src = 'jump.png';

// Game State
let canvas, ctx;
let gameSpeed = INITIAL_SPEED;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameRunning = false;
let gameOver = false;
let frameId;
let bgX = 0;

// Entities
let dino = {
    // Start x slightly further out
    x: 50,
    y: 0,
    // Original dimensions from file analysis
    width: 610,
    height: 409,
    dy: 0,
    grounded: true,
    jumpTimer: 0
};

// Sidewalk offset - Adjust this if he looks like he's floating or buried
// Assuming the bottom of the image is the bottom of the sidewalk
const BOTTOM_OFFSET = 0; 

let obstacles = [];

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Scale for Retina/HighDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    
    // Force style to match aspect ratio
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    // Disable image smoothing for pixel art look
    ctx.imageSmoothingEnabled = false;

    document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput); 
    document.getElementById('restart-btn').addEventListener('click', resetGame);

    // Initial positioning
    dino.y = CANVAS_HEIGHT - dino.height - BOTTOM_OFFSET;

    resetGame();
    gameRunning = false;
    
    bgImage.onload = draw;
    dinoRunImage.onload = draw;
    draw(); 
}

function resetGame() {
    gameSpeed = INITIAL_SPEED;
    score = 0;
    gameRunning = true;
    gameOver = false;
    bgX = 0;
    
    dino.y = CANVAS_HEIGHT - dino.height - BOTTOM_OFFSET;
    dino.dy = 0;
    obstacles = [];

    document.getElementById('game-ui').classList.remove('visible');
    
    if (frameId) cancelAnimationFrame(frameId);
    requestAnimationFrame(update);
}

function handleInput(e) {
    if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'ArrowUp') return;
    
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
    if (Math.random() < 0.015) { // Slightly lower spawn rate for larger map
        // Scale obstacles up to match the new world size
        const isBig = Math.random() > 0.5;
        const height = isBig ? 80 : 50; 
        const width = isBig ? 50 : 30;
        
        if (obstacles.length > 0) {
            const lastObstacle = obstacles[obstacles.length - 1];
            // Ensure minimum distance scales with speed and size
            if (CANVAS_WIDTH - lastObstacle.x < 400) return;
        }

        obstacles.push({
            x: CANVAS_WIDTH,
            y: CANVAS_HEIGHT - height - BOTTOM_OFFSET, // Place on same ground line
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
    const groundY = CANVAS_HEIGHT - dino.height - BOTTOM_OFFSET;
    if (dino.y > groundY) {
        dino.y = groundY;
        dino.dy = 0;
        dino.grounded = true;
    }

    // Scroll Background
    bgX -= gameSpeed;
    if (bgX <= -CANVAS_WIDTH) {
        bgX = 0;
    }

    // Move Obstacles
    spawnObstacle();
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    gameSpeed += SPEED_INCREMENT;

    // Collision Detection
    for (let obs of obstacles) {
        // Massive Hitbox Adjustment
        // The image is 610x409 but the character is likely much smaller in the center.
        // We'll approximate a "foot" hitbox at the bottom center.
        
        // Let's assume the character body is roughly centered horizontally
        // and at the bottom vertically.
        
        const hitWidth = 80; // Estimate effective width of the "man"
        const hitHeight = 150; // Estimate effective height
        
        const hitX = dino.x + (dino.width / 2) - (hitWidth / 2) - 50; // Shift left a bit as he is running forward
        const hitY = dino.y + dino.height - hitHeight; // Bottom aligned

        // Debug drawing for hitbox (comment out in production if needed, but useful for verifying)
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(hitX, hitY, hitWidth, hitHeight);

        if (
            hitX < obs.x + obs.width &&
            hitX + hitWidth > obs.x &&
            hitY < obs.y + obs.height &&
            hitY + hitHeight > obs.y
        ) {
            handleGameOver();
        }
    }

    draw();
}

function draw() {
    // Draw Background
    if (bgImage.complete && bgImage.naturalWidth > 0) {
        ctx.drawImage(bgImage, bgX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(bgImage, bgX + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        ctx.fillStyle = '#202020';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw Character
    let currentDinoImage = dino.grounded ? dinoRunImage : dinoJumpImage;
    
    if (currentDinoImage.complete && currentDinoImage.naturalWidth > 0) {
        // Draw at full resolution
        ctx.drawImage(currentDinoImage, dino.x, dino.y, dino.width, dino.height);
    } else {
         ctx.fillStyle = 'red';
         ctx.fillRect(dino.x, dino.y, 50, 100);
    }

    // Obstacles
    ctx.fillStyle = '#d35400'; 
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Score
    ctx.fillStyle = '#ffffff'; 
    ctx.font = 'bold 30px monospace';
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.textAlign = 'right';
    const scoreText = `HI ${Math.floor(highScore)} ${Math.floor(score).toString().padStart(5, '0')}`;
    ctx.fillText(scoreText, CANVAS_WIDTH - 20, 50);
    
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

init();
