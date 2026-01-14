// Game Constants
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 434;

// Physics adjustments
const GRAVITY = 0.8; 
const JUMP_STRENGTH = -20; 
const SPEED_INCREMENT = 0.001;
const INITIAL_SPEED = 6;

// Assets
const bgImage = new Image();
bgImage.src = 'way.png';
const dinoRunImage = new Image();
dinoRunImage.src = 'worker.png';
const dinoJumpImage = new Image();
dinoJumpImage.src = 'jump.png';
const dinoDoubleJumpImage = new Image();
dinoDoubleJumpImage.src = 'jump2.png';

// Audio Assets
const bgMusic = new Audio('backmusic.mp3');
bgMusic.loop = true;
const jumpSound = new Audio('jump.mp3');
const gameOverSound = new Audio('over.mp3');

// Obstacle Assets
const obsCoffeeImg = new Image();
obsCoffeeImg.src = 'coffee.png';
const obsPigeonImg = new Image();
obsPigeonImg.src = 'pigeon.png';
const obsBoardImg = new Image();
obsBoardImg.src = 'board.png';

// Translations
const startMessages = {
    'en': 'Press Spacebar to Start',
    'ko': '스페이스바를 눌러 시작하세요',
    'ja': 'スペースキーを押して開始',
    'zh': '按空格键开始',
    'es': 'Presiona la barra espaciadora para empezar',
    'fr': 'Appuyez sur la barre d\'espace pour commencer',
    'de': 'Leertaste drücken zum Starten',
    'it': 'Premi la barra spaziatrice per iniziare',
    'pt': 'Pressione a barra de espaço para iniciar',
    'ru': 'Нажмите пробел для старта'
};

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
    x: 50,
    y: 0,
    width: 203,
    height: 136,
    dy: 0,
    grounded: true,
    jumpCount: 0
};

// Offset for sidewalk (Worker, Coffee, Pigeon)
const SIDEWALK_OFFSET = 90; 
// Offset for road (Scooter/Board)
const ROAD_OFFSET = 20;

let obstacles = [];

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    
    // canvas.style.width and height are handled by CSS for responsiveness

    ctx.imageSmoothingEnabled = false;

    document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput); 
    document.getElementById('restart-btn').addEventListener('click', () => resetGame(true));

    // Initial setup
    resetGame(false);
    
    bgImage.onload = draw;
    dinoRunImage.onload = draw;
    requestAnimationFrame(draw); 
}

function resetGame(start = true) {
    gameSpeed = INITIAL_SPEED;
    score = 0;
    gameRunning = start;
    gameOver = false;
    bgX = 0;
    
    // Worker is on the sidewalk
    dino.y = CANVAS_HEIGHT - dino.height - SIDEWALK_OFFSET;
    dino.dy = 0;
    dino.grounded = true;
    dino.jumpCount = 0;
    obstacles = [];

    document.getElementById('game-ui').classList.remove('visible');
    
    if (frameId) cancelAnimationFrame(frameId);
    
    if (start) {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        update();
    } else {
        draw();
    }
}

function handleInput(e) {
    if (e.type === 'keydown') {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
        } else {
            return;
        }
    }
    
    if (gameOver) {
        resetGame(true);
        return;
    }

    if (!gameRunning) {
        gameRunning = true;
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        update();
    }

    if (dino.grounded) {
        dino.dy = JUMP_STRENGTH;
        dino.grounded = false;
        dino.jumpCount = 1;
        jumpSound.currentTime = 0;
        jumpSound.play().catch(e => console.log("Jump sound failed:", e));
    } else if (dino.jumpCount === 1) {
        dino.dy = JUMP_STRENGTH * 1.05;
        dino.jumpCount = 2;
        jumpSound.currentTime = 0;
        jumpSound.play().catch(e => console.log("Jump sound failed:", e));
    }
}

function spawnObstacle() {
    if (Math.random() < 0.015) {
        if (obstacles.length > 0) {
            const lastObstacle = obstacles[obstacles.length - 1];
            if (CANVAS_WIDTH - lastObstacle.x < 450) return;
        }

        const rand = Math.random();
        let type, img, w, h, offset;

        if (rand < 0.33) {
            type = 'coffee';
            img = obsCoffeeImg;
            w = 120;
            h = 51; 
            offset = 80;
        } else if (rand < 0.66) {
            type = 'pigeon';
            img = obsPigeonImg;
            w = 100;
            h = 48; 
            offset = SIDEWALK_OFFSET;
        } else {
            type = 'board';
            img = obsBoardImg;
            // Original: 356x498. Aspect Ratio ~0.71 (W/H)
            // Scaling to 150px height
            w = 107; 
            h = 150; 
            offset = SIDEWALK_OFFSET; // Move to sidewalk
        }

        obstacles.push({
            x: CANVAS_WIDTH,
            y: CANVAS_HEIGHT - h - offset,
            width: w,
            height: h,
            img: img,
            type: type
        });
    }
}

function update() {
    if (!gameRunning || gameOver) return; 
    
    frameId = requestAnimationFrame(update);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    dino.dy += GRAVITY;
    dino.y += dino.dy;

    const groundY = CANVAS_HEIGHT - dino.height - SIDEWALK_OFFSET;
    if (dino.y > groundY) {
        dino.y = groundY;
        dino.dy = 0;
        dino.grounded = true;
        dino.jumpCount = 0;
    }

    bgX -= gameSpeed;
    if (bgX <= -CANVAS_WIDTH) {
        bgX += CANVAS_WIDTH;
    }

    spawnObstacle();
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        
        // Make 'board' (scooter) move faster to the left
        if (obs.type === 'board') {
            obs.x -= (gameSpeed + 4); 
        } else {
            obs.x -= gameSpeed;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    gameSpeed += SPEED_INCREMENT;

    // Collision Detection
    for (let obs of obstacles) {
        const hitWidth = 40; 
        const hitHeight = 90; 
        const hitX = dino.x + (dino.width / 2) - (hitWidth / 2) - 10; 
        const hitY = dino.y + dino.height - hitHeight; 

        // Obstacle hitbox
        // For tall scooter, hit box focuses on the rider/stem
        const obsHitX = obs.x + (obs.width * 0.2);
        const obsHitW = obs.width * 0.6;
        const obsHitY = obs.y + (obs.height * 0.1);
        const obsHitH = obs.height * 0.8;

        if (
            hitX < obsHitX + obsHitW &&
            hitX + hitWidth > obsHitX &&
            hitY < obsHitY + obsHitH &&
            hitY + hitHeight > obsHitY
        ) {
            handleGameOver();
        }
    }

    draw();
}

function draw() {
    if (bgImage.complete && bgImage.naturalWidth > 0) {
        ctx.drawImage(bgImage, bgX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(bgImage, bgX + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        ctx.fillStyle = '#202020';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    let currentDinoImage;
    if (dino.grounded) {
        currentDinoImage = dinoRunImage;
    } else {
        currentDinoImage = (dino.jumpCount === 2) ? dinoDoubleJumpImage : dinoJumpImage;
    }

    // Fallback: If custom image not loaded, use standard jump image
    if (!currentDinoImage.complete || currentDinoImage.naturalWidth === 0) {
        currentDinoImage = dinoJumpImage;
    }

    if (currentDinoImage.complete && currentDinoImage.naturalWidth > 0) {
        ctx.drawImage(currentDinoImage, dino.x, dino.y, dino.width, dino.height);
    }

    obstacles.forEach(obs => {
        if (obs.img.complete) {
            ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
        }
    });

    ctx.fillStyle = '#ffffff'; 
    ctx.font = 'bold 30px monospace';
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.textAlign = 'right';
    const scoreText = `HI ${Math.floor(highScore)} ${Math.floor(score).toString().padStart(5, '0')}`;
    ctx.fillText(scoreText, CANVAS_WIDTH - 20, 50);

    if (!gameRunning && !gameOver) {
        ctx.textAlign = 'center';
        
        const textMsg = startMessages[navigator.language.split('-')[0]] || startMessages['en'];
        ctx.font = 'bold 40px monospace';
        const textMetrics = ctx.measureText(textMsg);
        const textW = textMetrics.width;
        const textH = 40;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect((CANVAS_WIDTH / 2) - (textW / 2) - 20, (CANVAS_HEIGHT / 2) - (textH) - 10, textW + 40, textH + 30);

        ctx.fillStyle = '#ffffff'; 
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.fillText(textMsg, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    ctx.shadowBlur = 0;
}

function handleGameOver() {
    gameOver = true;
    gameRunning = false;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameOverSound.play().catch(e => console.log("Game over sound failed:", e));
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
    }
    document.getElementById('game-ui').classList.add('visible');
    draw(); 
}

init();
