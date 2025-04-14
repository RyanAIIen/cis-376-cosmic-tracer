'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';

// Create a client-side only component for the game canvas
const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Check for client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Start the game
  const startGame = () => {
    if (!isClient) return;
    
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
  };
  
  // Reset the game
  const resetGame = () => {
    if (!isClient) return;
    
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };
  
  // Toggle pause
  const togglePause = () => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev);
    }
  };
  
  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
  };
  
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom color="#30cfd0">
        Snake Game
      </Typography>
      
      <Box 
        sx={{
          width: 800,
          height: 600,
          bgcolor: '#0a0a1e',
          border: '2px solid #30cfd0',
          borderRadius: '4px',
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isClient && (
          <GameCanvas 
            gameStarted={gameStarted}
            gameOver={gameOver}
            isPaused={isPaused}
            setScore={setScore}
            togglePause={togglePause}
            setGameOver={handleGameOver}
            score={score}
            resetGame={startGame}
          />
        )}
        
        {(!isClient || !gameStarted) && !gameOver && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'rgba(10, 10, 30, 0.8)',
              zIndex: 10
            }}
          >
            <Typography variant="h5" color="#fff" gutterBottom>
              Classic Snake Game
            </Typography>
            <Typography variant="body1" color="#30cfd0" align="center" sx={{ mb: 2, maxWidth: '80%' }}>
              Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to control the snake<br/>
              Eat food to grow longer and earn points<br/>
              Don't crash into walls or yourself!<br/>
              Press <strong>Spacebar</strong> to pause/resume the game
            </Typography>
            <Button 
              variant="contained" 
              onClick={startGame}
              sx={{ 
                bgcolor: '#30cfd0', 
                '&:hover': { bgcolor: '#00a0a0' },
                mt: 2
              }}
            >
              Start Game
            </Button>
          </Box>
        )}
        
        {isPaused && gameStarted && !gameOver && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'rgba(10, 10, 30, 0.8)',
              zIndex: 10
            }}
          >
            <Typography variant="h5" color="#fff" gutterBottom>
              Game Paused
            </Typography>
            <Typography variant="body1" color="#30cfd0" align="center" sx={{ mb: 2, maxWidth: '80%' }}>
              Press <strong>Spacebar</strong> or click Resume to continue
            </Typography>
            <Button 
              variant="contained" 
              onClick={togglePause}
              sx={{ 
                bgcolor: '#30cfd0', 
                '&:hover': { bgcolor: '#00a0a0' },
                mt: 2
              }}
            >
              Resume
            </Button>
          </Box>
        )}
        
        {gameOver && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'rgba(10, 10, 30, 0.8)',
              zIndex: 10
            }}
          >
            <Typography variant="h5" color="#fff" gutterBottom>
              Game Over!
            </Typography>
            <Typography variant="h6" color="#30cfd0" gutterBottom>
              Final Score: {score}
            </Typography>
            <Button 
              variant="contained" 
              onClick={startGame}
              sx={{ 
                bgcolor: '#30cfd0', 
                '&:hover': { bgcolor: '#00a0a0' },
                mt: 2
              }}
            >
              Play Again
            </Button>
          </Box>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 800 }}>
        <Typography variant="h6" color="#30cfd0">
          Score: {score}
        </Typography>
        
        {gameStarted && !gameOver && (
          <Button 
            variant="contained" 
            onClick={togglePause}
            sx={{ 
              bgcolor: '#ff3e9d',
              '&:hover': { bgcolor: '#d01c7c' },
            }}
          >
            {isPaused ? 'Resume Game' : 'Pause Game'}
          </Button>
        )}
        
        <Button 
          variant="contained" 
          onClick={resetGame}
          sx={{ 
            bgcolor: '#ff3e9d',
            '&:hover': { bgcolor: '#d01c7c' },
          }}
        >
          Reset Game
        </Button>
      </Box>
    </Box>
  );
} 