'use client';

import { useEffect, useRef, useState } from 'react';

export default function GameCanvas({ gameStarted, gameOver, isPaused, setScore, togglePause, setGameOver, score, resetGame, gameTime }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const snakeRef = useRef([]);
  const foodRef = useRef(null);
  const directionRef = useRef('right');
  const nextDirectionRef = useRef('right');
  const keysPressed = useRef({});
  const [ctx, setCtx] = useState(null);
  const previousGameOverRef = useRef(false);
  
  // Game configuration
  const GRID_SIZE = 20; // Size of each grid cell in pixels
  const GRID_WIDTH = 40; // Number of cells across
  const GRID_HEIGHT = 30; // Number of cells down
  const GAME_SPEED = 100; // Base speed (ms)
  const CANVAS_WIDTH = GRID_SIZE * GRID_WIDTH;
  const CANVAS_HEIGHT = GRID_SIZE * GRID_HEIGHT;
  const WRAP_AROUND = false; // Set to false to make snake die when hitting walls
  
  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
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
          if (directionRef.current !== 'down') {
            nextDirectionRef.current = 'up';
          }
          break;
        case 's':
        case 'ArrowDown':
          if (directionRef.current !== 'up') {
            nextDirectionRef.current = 'down';
          }
          break;
        case 'a':
        case 'ArrowLeft':
          if (directionRef.current !== 'right') {
            nextDirectionRef.current = 'left';
          }
          break;
        case 'd':
        case 'ArrowRight':
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
        
        if (elapsed > GAME_SPEED) {
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
  }, [ctx, gameStarted, gameOver, isPaused]);
  
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
    
    // Create new snake array with new head at the front
    const newSnake = [head, ...snakeRef.current];
    
    if (collidesWithFood) {
      // Increase score
      setScore(prevScore => prevScore + 10);
      
      // Create new food
      createFood();
    } else {
      // Remove the tail if we didn't eat food
      newSnake.pop();
    }
    
    // Update snake
    snakeRef.current = newSnake;
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
    
    // Draw background
    context.fillStyle = '#0a0a1e';
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
        context.fillStyle = '#30cfd0'; // Cyan for head
      } else {
        // Gradient from cyan to darker blue for the body
        const gradient = 1 - (index / snakeRef.current.length) * 0.7;
        context.fillStyle = `rgba(48, 207, 208, ${gradient})`;
      }
      
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
    });
    
    // Draw food
    if (foodRef.current) {
      context.fillStyle = '#ff3e9d'; // Pink for food
      
      // Draw food as a circle
      context.beginPath();
      context.arc(
        foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
        foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      context.fill();
      
      // Add a small white highlight to make food look better
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.beginPath();
      context.arc(
        foodRef.current.x * GRID_SIZE + GRID_SIZE / 2 - 2,
        foodRef.current.y * GRID_SIZE + GRID_SIZE / 2 - 2,
        2,
        0,
        Math.PI * 2
      );
      context.fill();
    }
    
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
      context.fillText('Snake Game', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      context.font = '20px Arial';
      context.fillText('Use WASD or Arrow Keys to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      context.fillText('Press Space to pause', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      
      if (!WRAP_AROUND) {
        context.fillText('Avoid hitting walls and yourself!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      } else {
        context.fillText('You can go through walls but avoid hitting yourself!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
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