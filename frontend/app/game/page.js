'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { IconButton, Grid, Paper, Divider, Tooltip } from '@mui/material';
import Link from 'next/link';

// Create a client-side only component for the game canvas
const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showScoreDoubler, setShowScoreDoubler] = useState(false);
    const [isDoubleScoreActive, setIsDoubleScoreActive] = useState(false);


  // Check for client-side rendering and load high score
  useEffect(() => {
    setIsClient(true);
    
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  // Update high score when game ends
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);
  
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
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#050518', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom color="#30cfd0" sx={{ fontWeight: 'bold', mb: 3 }}>
        COSMIC SNAKE
      </Typography>
      
      {/* Game Stats and Controls Dashboard */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%', 
          maxWidth: 800, 
          mb: 2, 
          p: 2, 
          bgcolor: '#0d0d2b',
          border: '2px solid #30cfd0',
          borderRadius: '8px'
        }}
      >
        {/* Top row with Main Menu button and Game Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            component={Link}
            href="/dashboard"
            variant="outlined" 
            size="small"
            startIcon={<Typography sx={{ fontSize: '1.2rem' }}>←</Typography>}
            sx={{ 
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { 
                borderColor: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.1)' 
              },
            }}
          >
            MAIN MENU
          </Button>
          <Typography variant="h6" color="#30cfd0" fontWeight="bold">
            COSMIC SNAKE
          </Typography>
        </Box>
              {showScoreDoubler && (
                  <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" color="#ffd700" sx={{ fontWeight: 'bold' }}>
                          💥 Score Doubler Active!
                      </Typography>
                  </Box>
              )}

        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="#fff">SCORE</Typography>
              <Typography variant="h4" color="#ff3e9d" sx={{ fontWeight: 'bold' }}>{score}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="#fff">HIGH SCORE</Typography>
              <Typography variant="h4" color="#30cfd0" sx={{ fontWeight: 'bold' }}>{highScore}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {gameStarted && !gameOver ? (
                <Button 
                  variant="contained" 
                  onClick={togglePause}
                  sx={{ 
                    minWidth: 120,
                    bgcolor: isPaused ? '#30cfd0' : '#ff3e9d',
                    '&:hover': { bgcolor: isPaused ? '#00a0a0' : '#d01c7c' },
                  }}
                >
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={startGame}
                  sx={{ 
                    minWidth: 120,
                    bgcolor: '#30cfd0', 
                    '&:hover': { bgcolor: '#00a0a0' },
                  }}
                >
                  {gameOver ? 'PLAY AGAIN' : 'START GAME'}
                </Button>
              )}
              
              <Button 
                variant="outlined" 
                onClick={resetGame}
                sx={{ 
                  minWidth: 120,
                  color: '#ff3e9d',
                  borderColor: '#ff3e9d',
                  '&:hover': { 
                    borderColor: '#d01c7c',
                    bgcolor: 'rgba(255, 62, 157, 0.1)' 
                  },
                }}
              >
                RESET
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Game Controls Legend (only show when not playing) */}
      {(!gameStarted || isPaused) && !gameOver && (
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%', 
            maxWidth: 800, 
            mb: 2, 
            p: 2, 
            bgcolor: '#0d0d2b',
            border: '1px solid #30cfd0',
            borderRadius: '8px'
          }}
        >
          <Typography variant="subtitle1" color="#fff" align="center" sx={{ mb: 1 }}>
            CONTROLS
          </Typography>
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(48, 207, 208, 0.1)', color: '#30cfd0' }}>
                WASD / Arrows
              </Paper>
              <Typography variant="caption" color="#ccc">Move Snake</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(48, 207, 208, 0.1)', color: '#30cfd0' }}>
                Spacebar
              </Paper>
              <Typography variant="caption" color="#ccc">Pause/Resume</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(48, 207, 208, 0.1)', color: '#30cfd0' }}>
                Spacebar
              </Paper>
              <Typography variant="caption" color="#ccc">Restart (Game Over)</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(255, 62, 157, 0.1)', color: '#ff3e9d' }}>
                Walls/Self
              </Paper>
              <Typography variant="caption" color="#ccc">Game Over</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Game Canvas Container */}
      <Box 
        sx={{
          width: 800,
          height: 600,
          bgcolor: '#0a0a1e',
          border: '2px solid #30cfd0',
          borderRadius: '8px',
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(48, 207, 208, 0.3)'
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
            setIsDoubleScoreActive={setIsDoubleScoreActive}
            exposeScoreDoubler={(active) => setShowScoreDoubler(active)}
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
            <Typography variant="h4" color="#30cfd0" sx={{ mb: 2, fontWeight: 'bold' }}>
              COSMIC SNAKE
            </Typography>
            <Typography variant="body1" color="#fff" align="center" sx={{ mb: 3, maxWidth: '80%' }}>
              Navigate through space as you control your cosmic snake.<br/>
              Collect energy orbs to grow longer and increase your score.<br/>
              Avoid collisions with walls and yourself!
            </Typography>
            <Button 
              variant="contained" 
              onClick={startGame}
              size="large"
              sx={{ 
                bgcolor: '#30cfd0', 
                '&:hover': { bgcolor: '#00a0a0' },
                mt: 2,
                minWidth: 200,
                fontSize: '1.2rem'
              }}
            >
              START GAME
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
              bgcolor: 'rgba(10, 10, 30, 0.9)',
              zIndex: 10
            }}
          >
            <Typography variant="h4" color="#fff" gutterBottom>
              GAME PAUSED
            </Typography>
            <Typography variant="h6" color="#30cfd0" gutterBottom>
              Current Score: {score}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={togglePause}
                sx={{ 
                  bgcolor: '#30cfd0', 
                  '&:hover': { bgcolor: '#00a0a0' },
                  minWidth: 150
                }}
              >
                RESUME
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetGame}
                sx={{ 
                  color: '#ff3e9d',
                  borderColor: '#ff3e9d',
                  '&:hover': { 
                    borderColor: '#d01c7c',
                    bgcolor: 'rgba(255, 62, 157, 0.1)' 
                  },
                  minWidth: 150
                }}
              >
                QUIT GAME
              </Button>
            </Box>
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
              bgcolor: 'rgba(10, 10, 30, 0.9)',
              zIndex: 10
            }}
          >
            <Typography variant="h3" color="#ff3e9d" gutterBottom sx={{ fontWeight: 'bold' }}>
              GAME OVER
            </Typography>
            
            <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 3, borderRadius: 2, mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" color="#fff" gutterBottom>
                YOUR SCORE
              </Typography>
              <Typography variant="h2" color="#30cfd0" sx={{ fontWeight: 'bold', mb: 2 }}>
                {score}
              </Typography>
              {score >= highScore && score > 0 && (
                <Box sx={{ bgcolor: 'rgba(48, 207, 208, 0.2)', p: 1, borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="#30cfd0">
                    NEW HIGH SCORE!
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button 
                variant="contained" 
                onClick={startGame}
                size="large"
                sx={{ 
                  bgcolor: '#30cfd0', 
                  '&:hover': { bgcolor: '#00a0a0' },
                  minWidth: 180,
                  fontSize: '1.1rem'
                }}
              >
                PLAY AGAIN
              </Button>
              
              <Button 
                variant="outlined" 
                component={Link}
                href="/dashboard"
                size="large"
                sx={{ 
                  color: '#fff',
                  borderColor: '#fff',
                  '&:hover': { 
                    borderColor: '#ccc',
                    bgcolor: 'rgba(255, 255, 255, 0.1)' 
                  },
                  minWidth: 180,
                  fontSize: '1.1rem'
                }}
              >
                MAIN MENU
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Footer */}
      <Typography variant="caption" color="#777" sx={{ mt: 2 }}>
        © 2025 Cosmic Snake Game - Created as part of CIS-376
      </Typography>
    </Box>
  );
} 