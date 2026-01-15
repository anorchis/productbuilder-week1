# Chrome Dino Clone Blueprint

## Overview
A web-based clone of the famous Chrome "No Internet" Dinosaur game. The application aims to replicate the core gameplay mechanics (running, jumping, dodging obstacles) and the classic visual style (gray scale, pixelated look). Future iterations will introduce enhanced pixel art visuals.

## Features
- **Core Gameplay**: Infinite runner mechanics.
- **Controls**: Spacebar or Up Arrow to jump. Down Arrow to duck (optional in v1).
- **Obstacles**: Cacti of varying sizes and birds (optional in v1).
- **Scoring**: Score increases with distance. High score tracking (local storage).
- **Game Over**: Collision detection ends the game with a restart option.


## Current Plan: Adjust Gameplay Physics
- **Goal**: Fine-tune the game physics for better playability.
- **Changes**:
    -   Reduce `JUMP_STRENGTH` from -20 to -19.
    -   Increase `SPEED_INCREMENT` to double its current value (from 0.001 to 0.002) to make the game speed up faster.

1.  **Reset Project**: Clear existing web files.
2.  **HTML Structure**: Setup a `canvas` element for the game.
3.  **CSS Styling**: Mimic the "offline" page aesthetic (font, background color).
4.  **Game Engine (`main.js`)**:
    -   Game loop (requestAnimationFrame).
    -   Dino physics (gravity, jump velocity).
    -   Obstacle generation and movement.
    -   Collision detection.
    -   Score keeping.
5.  **Assets**: Use simple drawing primitives (rectangles) or base64 placeholders to mimic the classic Dino and Cacti initially to ensure "exact" feel before adding custom art.
6.  **Adjustments**:
    -   Moved character and pigeon slightly up (SIDEWALK_OFFSET adjusted to 130).
    -   User requested `board.png` replacement.
    -   Reverted game speed: `INITIAL_SPEED` to 6, `SPEED_INCREMENT` to 0.001 (User feedback: too fast).
    -   Updated physics: `JUMP_STRENGTH` to -19, `SPEED_INCREMENT` to 0.002.

## Future Steps
-   Upgrade graphics to "prettier pixel art".
-   Add sound effects.