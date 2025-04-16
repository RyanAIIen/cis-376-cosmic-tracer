'use client';

import { useEffect, useRef, useState } from 'react';

export default function GameCanvas({
  gameStarted,
  gameOver,
  isPaused,
  setScore,
  togglePause,
  setGameOver,
  score,
  resetGame,
  gameTime,
  isTimeWarpActive
}) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const snakeRef = useRef([]);
  const foodRef = useRef(null);
  const powerUpRef = useRef(null); // Add reference for power-up
  const powerUpTypeRef = useRef(null); // Type of power-up (reset)
  const bombsRef = useRef([]); // Array to hold bomb positions
  const directionRef = useRef('right');
  const nextDirectionRef = useRef('right');
  const keysPressed = useRef({});
  const [ctx, setCtx] = useState(null);
  const previousGameOverRef = useRef(false);
  const growSnake = useRef(false);
  
  // Game configuration
  const GRID_SIZE = 20; // Size of each grid cell in pixels
  const GRID_WIDTH = 40; // Number of cells across
  const GRID_HEIGHT = 30; // Number of cells down
  const NORMAL_GAME_SPEED = 100; // Normal speed (ms)
  const TIME_WARP_GAME_SPEED = 200; // Time warp speed (ms) - slower!
  const CANVAS_WIDTH = GRID_SIZE * GRID_WIDTH;
  const CANVAS_HEIGHT = GRID_SIZE * GRID_HEIGHT;
  const WRAP_AROUND = false; // Set to false to make snake die when hitting walls
  const POWER_UP_CHANCE = 0.01; // 1% chance per update to spawn a power-up when none exists
  const BOMB_SPAWN_CHANCE = 0.005; // 0.5% chance per update to spawn a bomb
  const MAX_BOMBS = 3; // Maximum number of bombs that can exist at once
  const BOMB_LIFETIME = 8000; // Bombs disappear after 8 seconds
  
  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  // Get current game speed based on time warp status
  const getCurrentGameSpeed = () => {
    return isTimeWarpActive ? TIME_WARP_GAME_SPEED : NORMAL_GAME_SPEED;
  };
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    const context = canvas.getContext('2d');
    setCtx(context);

    // Initial draw
    drawGame(context);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  // Setup keyboard event listeners
  useEffect(() => {
    const keyHandler = (e) => {
      console.log(`Key pressed: ${e.key}, gameStarted: ${gameStarted}, gameOver: ${gameOver}, isPaused: ${isPaused}`);
      
      switch (e.key) {
        case 'w':
        case 'ArrowUp':
          e.preventDefault(); // Prevent page scrolling
          if (directionRef.current !== 'down') {
            nextDirectionRef.current = 'up';
          }
          break;
        case 's':
        case 'ArrowDown':
          e.preventDefault(); // Prevent page scrolling
          if (directionRef.current !== 'up') {
            nextDirectionRef.current = 'down';
          }
          break;
        case 'a':
        case 'ArrowLeft':
          e.preventDefault(); // Prevent page scrolling
          if (directionRef.current !== 'right') {
            nextDirectionRef.current = 'left';
          }
          break;
        case 'd':
        case 'ArrowRight':
          e.preventDefault(); // Prevent page scrolling
          if (directionRef.current !== 'left') {
            nextDirectionRef.current = 'right';
          }
          break;
        case ' ': // Space bar for pause/restart
          e.preventDefault(); // Prevent page scrolling
          console.log("Space pressed - handling pause/restart");
          
          if (gameStarted && !gameOver) {
            console.log("Toggling pause");
            togglePause();
          } else if (gameOver) {
            console.log("Restarting game");
            resetGame();
          }
          break;
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', keyHandler);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', keyHandler);
    };
  }, [gameStarted, gameOver, isPaused, togglePause, resetGame]);
  
  // Track game state changes
  useEffect(() => {
    // Reset the snake when game is reset (gameOver becomes false after being true)
    if (!gameOver && previousGameOverRef.current && gameStarted) {
      // Clear the snake so it will be reinitialized in the game loop
      snakeRef.current = [];
    }
    
    // Focus the canvas when the game starts
    if (gameStarted && !gameOver && canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [gameOver, gameStarted]);
  
  // Game loop
  useEffect(() => {
    if (!ctx) return;
    
    if (gameStarted && !gameOver && !isPaused) {
      // Initialize snake if needed
      if (snakeRef.current.length === 0) {
        initializeGame();
      }
      
      let lastUpdateTime = 0;
      
      // Game loop
      const gameLoop = (timestamp) => {
        if (!gameStarted || gameOver || isPaused) {
          return;
        }
        
        const elapsed = timestamp - lastUpdateTime;
        
        // Use dynamic game speed based on time warp status
        if (elapsed > getCurrentGameSpeed()) {
          lastUpdateTime = timestamp;
          updateGame();
          drawGame(ctx);
        }
        
        requestRef.current = requestAnimationFrame(gameLoop);
      };
      
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      // Cancel animation when paused or game over
      cancelAnimationFrame(requestRef.current);
      
      // Still draw the current state
      drawGame(ctx);
    }
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [ctx, gameStarted, gameOver, isPaused, isTimeWarpActive]);
  
  // Initialize game
  const initializeGame = () => {
    // Create initial snake (3 segments at the center)
    const centerX = Math.floor(GRID_WIDTH / 2);
    const centerY = Math.floor(GRID_HEIGHT / 2);
    
    snakeRef.current = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ];
    
    // Reset direction
    directionRef.current = 'right';
    nextDirectionRef.current = 'right';
    
    // Create initial food
    createFood();
    
    // Reset score
    setScore(0);
  };
  
  // Create food at random position
  const createFood = () => {
    let position;
    let overlapsSnake;
    
    // Keep generating positions until we find one that doesn't overlap with the snake
    do {
      position = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
      
      overlapsSnake = snakeRef.current.some(segment => 
        segment.x === position.x && segment.y === position.y
      );
    } while (overlapsSnake);
    
    foodRef.current = position;
    
    // Chance to spawn a power-up if none exists
    if (!powerUpRef.current && Math.random() < POWER_UP_CHANCE) {
      createPowerUp();
    }
  };
  
  // Create a power-up at a random position
  const createPowerUp = () => {
    let position;
    let overlapsSnake;
    let overlapsFood;
    
    // Keep generating positions until we find one that doesn't overlap with the snake or food
    do {
      position = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
      
      overlapsSnake = snakeRef.current.some(segment => 
        segment.x === position.x && segment.y === position.y
      );
      
      overlapsFood = foodRef.current && 
        foodRef.current.x === position.x && 
        foodRef.current.y === position.y;
        
    } while (overlapsSnake || overlapsFood);
    
    powerUpRef.current = position;
    powerUpTypeRef.current = 'reset'; // Currently only have reset type
    
    console.log("Power-up spawned: Reset Length");
    
    // Power-ups disappear after 10 seconds
    setTimeout(() => {
      if (powerUpRef.current) {
        powerUpRef.current = null;
        console.log("Power-up disappeared");
      }
    }, 10000);
  };
  
  // Create a bomb at a random position
  const createBomb = () => {
    if (bombsRef.current.length >= MAX_BOMBS) return;
    
    let position;
    let overlapsSnake;
    let overlapsFood;
    let overlapsPowerUp;
    let overlapsBomb;
    
    // Keep generating positions until we find one that doesn't overlap with anything
    do {
      position = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
      
      overlapsSnake = snakeRef.current.some(segment => 
        segment.x === position.x && segment.y === position.y
      );
      
      overlapsFood = foodRef.current && 
        foodRef.current.x === position.x && 
        foodRef.current.y === position.y;
        
      overlapsPowerUp = powerUpRef.current && 
        powerUpRef.current.x === position.x && 
        powerUpRef.current.y === position.y;
        
      overlapsBomb = bombsRef.current.some(bomb => 
        bomb.x === position.x && bomb.y === position.y
      );
        
    } while (overlapsSnake || overlapsFood || overlapsPowerUp || overlapsBomb);
    
    // Add the bomb to the bombs array with a timestamp
    const bomb = {
      x: position.x,
      y: position.y,
      createdAt: Date.now()
    };
    
    bombsRef.current.push(bomb);
    console.log("Bomb spawned at", position.x, position.y);
    
    // Schedule bomb to disappear
    setTimeout(() => {
      bombsRef.current = bombsRef.current.filter(b => b !== bomb);
      console.log("Bomb disappeared");
    }, BOMB_LIFETIME);
  };
  
  // Food collision check
  const isCollidingWithFood = () => {
    if (!foodRef.current) return false;
    
    const snakeHead = snakeRef.current[0];
    return (
      snakeHead.x === foodRef.current.x &&
      snakeHead.y === foodRef.current.y
    );
  };
  
  // Update game state
  const updateGame = () => {
    // Update direction from the next direction
    directionRef.current = nextDirectionRef.current;
    
    // Get current head position
    const head = { ...snakeRef.current[0] };
    
    // Calculate new head position based on direction
    switch (directionRef.current) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }
    
    // Check for collision with walls
    const hitWall = head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT;
    
    if (hitWall) {
      if (WRAP_AROUND) {
        // Wrap around to the other side
        head.x = (head.x + GRID_WIDTH) % GRID_WIDTH;
        head.y = (head.y + GRID_HEIGHT) % GRID_HEIGHT;
      } else {
        // Game over if hitting walls
        endGame();
        return;
      }
    }
    
    // Check for collision with self (skip the tail because it will be removed)
    const collidesWithSelf = snakeRef.current.some((segment, index) => {
      // Skip head and tail (the tail will move away)
      if (index === 0 || index === snakeRef.current.length - 1) return false; 
      return segment.x === head.x && segment.y === head.y;
    });
    
    if (collidesWithSelf) {
      // Game over
      endGame();
      return;
    }
    
    // Check for collision with food
    const collidesWithFood = foodRef.current && head.x === foodRef.current.x && head.y === foodRef.current.y;
    
    // Check for collision with power-up
    const collidesWithPowerUp = powerUpRef.current && head.x === powerUpRef.current.x && head.y === powerUpRef.current.y;
    
    // Check for collision with bombs
    const collidesWithBomb = bombsRef.current.some(bomb => 
      head.x === bomb.x && head.y === bomb.y
    );
    
    if (collidesWithBomb) {
      // Game over if hitting a bomb
      endGame();
      return;
    }
    
    // Add new head to the snake
    snakeRef.current.unshift(head);
    
    // Process food collision
    if (collidesWithFood) {
      // Add points for collecting food
      const pointsToAdd = 10; // Always 10 points
      
      console.log(`Food collected! Adding ${pointsToAdd} points to score`);
      
      // Update score
      setScore(prevScore => {
        const newScore = prevScore + pointsToAdd;
        console.log(`Score updated from ${prevScore} to ${newScore}`);
        return newScore;
      });
      
      // Create new food (snake grows by keeping tail - don't remove last segment)
      createFood();
    } else if (collidesWithPowerUp && powerUpTypeRef.current === 'reset') {
      // Handle reset power-up collision
      console.log("RESET POWER-UP ACTIVATED!");
      
      // Add bonus points for collecting power-up (100 points)
      setScore(prevScore => prevScore + 100);
      
      // Reset snake to 3 segments (head + 2)
      while (snakeRef.current.length > 3) {
        snakeRef.current.pop();
      }
      
      // Clear the power-up
      powerUpRef.current = null;
    } else {
      // Remove the tail if no food was eaten
      snakeRef.current.pop();
    }
    
    // Chance to spawn a power-up if none exists
    if (!powerUpRef.current && Math.random() < POWER_UP_CHANCE / 5) {
      createPowerUp();
    }
    
    // Chance to spawn a bomb
    if (Math.random() < BOMB_SPAWN_CHANCE && bombsRef.current.length < MAX_BOMBS) {
      createBomb();
    }
  };
  
  // End the game
  const endGame = () => {
    cancelAnimationFrame(requestRef.current);
    setGameOver(true);
    previousGameOverRef.current = true;
  };
  
  // Draw everything
  const drawGame = (context) => {
    if (!context) return;
    
    // Clear canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background - add time warp visual effect
    if (isTimeWarpActive) {
      // Create time warp background effect
      const gradient = context.createRadialGradient(
        CANVAS_WIDTH / 2, 
        CANVAS_HEIGHT / 2, 
        50, 
        CANVAS_WIDTH / 2, 
        CANVAS_HEIGHT / 2, 
        CANVAS_WIDTH / 1.5
      );
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(1, '#0a0a1e');
      context.fillStyle = gradient;
      
      // Add subtle swirl patterns
      const time = Date.now() / 5000;
      for (let i = 0; i < 5; i++) {
        context.beginPath();
        const radius = 100 + i * 80;
        const startAngle = (time + i * 0.2) % (Math.PI * 2);
        const endAngle = startAngle + Math.PI;
        context.arc(
          CANVAS_WIDTH / 2, 
          CANVAS_HEIGHT / 2, 
          radius, 
          startAngle, 
          endAngle
        );
        context.strokeStyle = `rgba(153, 50, 204, ${0.1 - i * 0.015})`;
        context.lineWidth = 8;
        context.stroke();
      }
    } else {
      // Normal background
      context.fillStyle = '#0a0a1e';
    }
    
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid (optional)
    context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    context.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CANVAS_HEIGHT);
      context.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CANVAS_WIDTH, y);
      context.stroke();
    }
    
    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      // Different color for head
      if (index === 0) {
        // Draw spaceship head instead of cube
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        const size = GRID_SIZE;
        
        // Save the current context state
        context.save();
        
        // Translate to the center of the grid cell
        context.translate(x + size/2, y + size/2);
        
        // Rotate based on direction
        let rotation = 0;
        switch(directionRef.current) {
          case 'up':
            rotation = -Math.PI/2;
            break;
          case 'down':
            rotation = Math.PI/2;
            break;
          case 'left':
            rotation = Math.PI;
            break;
          case 'right':
            rotation = 0;
            break;
        }
        context.rotate(rotation);
        
        // Draw spaceship
        context.fillStyle = isTimeWarpActive ? '#9932CC' : '#30cfd0'; // Purple during time warp
        context.beginPath();
        
        // Spaceship shape (pointing right by default)
        // Main body
        context.moveTo(size/2 - 2, 0); // Nose of the ship
        context.lineTo(-size/4, size/3); // Bottom right
        context.lineTo(-size/3, 0); // Back center
        context.lineTo(-size/4, -size/3); // Top right
        context.closePath();
        context.fill();
        
        // Engine glow
        context.fillStyle = isTimeWarpActive ? '#cc00cc' : '#ff3e9d'; // Different engine color during time warp
        context.beginPath();
        
        // Engine flame
        context.moveTo(-size/3, 0);
        context.lineTo(-size/3 - 2, size/4);
        context.lineTo(-size/2, 0);
        context.lineTo(-size/3 - 2, -size/4);
        context.closePath();
        context.fill();
        
        // Add time warp trail effect
        if (isTimeWarpActive) {
          // Add motion blur / time echo effect
          context.globalAlpha = 0.3;
          for (let i = 1; i <= 3; i++) {
            const echo = i * 3;
            
            // Draw echo of the ship
            context.fillStyle = `rgba(153, 50, 204, ${0.3 - i * 0.07})`;
            context.beginPath();
            context.moveTo(size/2 - 2 - echo, 0);
            context.lineTo(-size/4 - echo, size/3);
            context.lineTo(-size/3 - echo, 0);
            context.lineTo(-size/4 - echo, -size/3);
            context.closePath();
            context.fill();
          }
          context.globalAlpha = 1.0;
        }
        
        // Cockpit highlight
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.beginPath();
        context.arc(size/8, 0, size/6, 0, Math.PI * 2);
        context.fill();
        
        // Restore the context state
        context.restore();
      } else {
        // Rainbow colors for the body, with time warp effect
        // Define rainbow colors - shift to purples during time warp
        const rainbowColors = isTimeWarpActive 
          ? [
              '#8A2BE2', // Blue Violet
              '#9932CC', // Dark Orchid
              '#BA55D3', // Medium Orchid
              '#DA70D6', // Orchid
              '#EE82EE', // Violet
              '#FF00FF', // Magenta
              '#C71585'  // Medium Violet Red
            ]
          : [
              '#FF0000', // Red
              '#FF7F00', // Orange
              '#FFFF00', // Yellow
              '#00FF00', // Green
              '#0000FF', // Blue
              '#4B0082', // Indigo
              '#9400D3'  // Violet
            ];
        
        // Calculate color index based on segment position and time for animation
        const timeMultiplier = isTimeWarpActive ? 75 : 150; // Slower color cycling during time warp
        const colorIndex = (index + Math.floor(Date.now() / timeMultiplier)) % rainbowColors.length;
        context.fillStyle = rainbowColors[colorIndex];
        
        // Draw snake segment with rounded corners for better appearance
        const radius = 4; // Corner radius
        const x = segment.x * GRID_SIZE + 1;
        const y = segment.y * GRID_SIZE + 1;
        const width = GRID_SIZE - 2;
        const height = GRID_SIZE - 2;
        
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
        
        // Add time warp echo/blur effect to segments
        if (isTimeWarpActive && index < 5) { // Only for first few segments for performance
          context.globalAlpha = 0.3 - (index * 0.05);
          context.fillStyle = '#9932CC';
          context.beginPath();
          context.moveTo(x + radius + 2, y - 1);
          context.lineTo(x + width - radius + 2, y - 1);
          context.quadraticCurveTo(x + width + 2, y - 1, x + width + 2, y + radius - 1);
          context.lineTo(x + width + 2, y + height - radius - 1);
          context.quadraticCurveTo(x + width + 2, y + height - 1, x + width - radius + 2, y + height - 1);
          context.lineTo(x + radius + 2, y + height - 1);
          context.quadraticCurveTo(x + 2, y + height - 1, x + 2, y + height - radius - 1);
          context.lineTo(x + 2, y + radius - 1);
          context.quadraticCurveTo(x + 2, y - 1, x + radius + 2, y - 1);
          context.closePath();
          context.fill();
          context.globalAlpha = 1.0;
        }
      }
    });
    
    // Draw food with time warp effect
    if (foodRef.current) {
      const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
      const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
      const foodRadius = GRID_SIZE / 2 - 2;
      
      // Draw food with time warp pulse effect
      if (isTimeWarpActive) {
        // Pulsing glow
        const pulseSize = (Math.sin(Date.now() / 200) + 1) * 3;
        context.beginPath();
        context.arc(foodX, foodY, foodRadius + pulseSize, 0, Math.PI * 2);
        context.fillStyle = 'rgba(153, 50, 204, 0.3)';
        context.fill();
      }
      
      // Main food circle
      context.fillStyle = isTimeWarpActive ? '#cc00cc' : '#ff3e9d'; // Different color during time warp
      context.beginPath();
      context.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
      context.fill();
      
      // Add a small white highlight to make food look better
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.beginPath();
      context.arc(foodX - 2, foodY - 2, 2, 0, Math.PI * 2);
      context.fill();
    }
    
    // Draw power-up (if exists)
    if (powerUpRef.current) {
      if (powerUpTypeRef.current === 'reset') {
        // Draw reset power-up (flashing light blue and white)
        const pulseRate = Date.now() % 1000 / 1000; // Value between 0 and 1
        const pulseColor = pulseRate > 0.5 ? '#ffffff' : '#00ffff';
        
        context.fillStyle = pulseColor;
        
        // Draw as a star shape
        const centerX = powerUpRef.current.x * GRID_SIZE + GRID_SIZE / 2;
        const centerY = powerUpRef.current.y * GRID_SIZE + GRID_SIZE / 2;
        const outerRadius = GRID_SIZE / 2 - 1;
        const innerRadius = outerRadius / 2;
        const spikes = 5;
        
        context.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.closePath();
        context.fill();
        
        // Add a pulsing glow effect
        context.shadowBlur = 10 * pulseRate;
        context.shadowColor = '#00ffff';
        context.fill();
        context.shadowBlur = 0;
        
        // Draw a "R" letter in the center
        context.fillStyle = '#0a0a1e';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('R', centerX, centerY);
      }
    }
    
    // Draw bombs
    bombsRef.current.forEach(bomb => {
      const bombX = bomb.x * GRID_SIZE + GRID_SIZE / 2;
      const bombY = bomb.y * GRID_SIZE + GRID_SIZE / 2;
      const bombRadius = GRID_SIZE / 2 - 3;
      
      // Calculate pulse based on time remaining (faster pulse as time runs out)
      const timeElapsed = Date.now() - bomb.createdAt;
      const timeRemaining = BOMB_LIFETIME - timeElapsed;
      const pulseSpeed = Math.max(100, 500 - (timeElapsed / 20)); // Pulse faster as time runs out
      const pulsePhase = (Date.now() % pulseSpeed) / pulseSpeed;
      
      // Draw outer circle (red/yellow pulsing)
      context.beginPath();
      context.arc(bombX, bombY, bombRadius, 0, Math.PI * 2);
      
      // Color shifts from yellow to red as time runs out
      const redComponent = Math.min(255, 255);
      const greenComponent = Math.max(0, Math.floor(255 * (timeRemaining / BOMB_LIFETIME)));
      context.fillStyle = `rgb(${redComponent}, ${greenComponent}, 0)`;
      context.fill();
      
      // Draw bomb fuse
      context.beginPath();
      context.moveTo(bombX, bombY - bombRadius);
      context.quadraticCurveTo(
        bombX + bombRadius/2, 
        bombY - bombRadius - 5,
        bombX + bombRadius/2, 
        bombY - bombRadius - 8
      );
      context.lineWidth = 2;
      context.strokeStyle = '#888';
      context.stroke();
      
      // Draw spark on the fuse (blinking)
      if (pulsePhase > 0.5) {
        context.beginPath();
        context.arc(
          bombX + bombRadius/2, 
          bombY - bombRadius - 8,
          2,
          0, 
          Math.PI * 2
        );
        context.fillStyle = '#fff';
        context.fill();
      }
    });
    
    // Draw time in corner if game is running
    if (gameStarted && !gameOver && !isPaused) {
      // Timer display has been removed
    }
    
    // Draw game over message
    if (gameOver) {
      context.fillStyle = 'rgba(10, 10, 30, 0.8)';
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      context.fillStyle = '#fff';
      context.font = '30px Arial';
      context.textAlign = 'center';
      context.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      
      context.font = '20px Arial';
      context.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      context.fillText(`Time: ${formatTime(gameTime)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }
    
    // Draw paused message
    if (isPaused && gameStarted && !gameOver) {
      context.fillStyle = 'rgba(10, 10, 30, 0.8)';
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      context.fillStyle = '#fff';
      context.font = '30px Arial';
      context.textAlign = 'center';
      context.fillText('Paused', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
    
    // Draw start message
    if (!gameStarted && !gameOver) {
      context.fillStyle = 'rgba(10, 10, 30, 0.8)';
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      context.fillStyle = '#fff';
      context.font = '30px Arial';
      context.textAlign = 'center';
      context.fillText('Cosmic Tracer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      context.font = '20px Arial';
      context.fillText('Use WASD or Arrow Keys to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      context.fillText('Press Space to pause', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      
      if (!WRAP_AROUND) {
        context.fillText('Avoid hitting walls and your trail!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      } else {
        context.fillText('You can go through walls but avoid hitting your trail!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      }
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT} 
      style={{ 
        display: 'block', 
        width: '100%', 
        height: '100%',
        objectFit: 'contain'  
      }}
      tabIndex={0}
    />
  );
} 