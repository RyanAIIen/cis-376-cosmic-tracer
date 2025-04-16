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
  const [isTimeWarpActive, setIsTimeWarpActive] = useState(false);
  const [showTimeWarpWarning, setShowTimeWarpWarning] = useState(false);
  const [gameTime, setGameTime] = useState(0); // Timer in seconds
  const timerRef = useRef(null); // To hold the timer interval
  
  // Check for client-side rendering and load high score
  useEffect(() => {
    setIsClient(true);
    
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  // Timer logic
  useEffect(() => {
    // Start timer when game starts
    if (gameStarted && !isPaused && !gameOver) {
      timerRef.current = setInterval(() => {
        setGameTime(prevTime => prevTime + 1);
      }, 1000); // Update every second
    }
    
    // Pause or stop timer
    if (isPaused || gameOver || !gameStarted) {
      clearInterval(timerRef.current);
    }
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(timerRef.current);
    };
  }, [gameStarted, isPaused, gameOver]);
  
  // Time warp mechanic (slows down the game)
  useEffect(() => {
    // If game is running, check for time-based events
    if (gameStarted && !isPaused && !gameOver) {
      // Time warp cycles every minute - warning appears 2 seconds before
      const timeInCycle = gameTime % 60; // Get position within a 60-second cycle
      
      // Show warning 2 seconds before time warp activates (at 58 seconds in each cycle)
      if (timeInCycle === 58) {
        setShowTimeWarpWarning(true);
        console.log("⚠️ TIME WARP APPROACHING! ⚠️");
      }
      
      // Activate time warp at start of each cycle (0, 60, 120, etc. seconds)
      if (timeInCycle === 0 && gameTime > 0) { // Skip the very first second of the game
        setShowTimeWarpWarning(false);
        setIsTimeWarpActive(true);
        console.log(`🌀 TIME WARP ACTIVATED at ${gameTime}s! 🌀 Time has slowed down!`);
      }
      
      // Deactivate time warp after 15 seconds in each cycle
      if (timeInCycle === 15) {
        setIsTimeWarpActive(false);
        console.log(`TIME WARP DEACTIVATED at ${gameTime}s! Normal time flow restored.`);
      }
      
      // Log time warp status every 10 seconds for debugging
      if (gameTime % 10 === 0 && gameTime > 0) {
        console.log(`Time: ${gameTime}s - Time warp status: ${isTimeWarpActive ? 'ACTIVE' : 'INACTIVE'}`);
      }
    }
    
    // Reset time warp state when game resets
    if (!gameStarted || gameOver) {
      setIsTimeWarpActive(false);
      setShowTimeWarpWarning(false);
    }
  }, [gameTime, gameStarted, isPaused, gameOver]);
  
  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
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
    setGameTime(0); // Reset timer
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setIsTimeWarpActive(false); // Reset time warp
    setShowTimeWarpWarning(false); // Reset warning
  };
  
  // Reset the game
  const resetGame = () => {
    if (!isClient) return;
    
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setGameTime(0); // Reset timer
    setIsPaused(false);
    setIsTimeWarpActive(false); // Reset time warp
    setShowTimeWarpWarning(false); // Reset warning
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
        COSMIC TRACER
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
            COSMIC TRACER
          </Typography>
        </Box>

        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="#fff">SCORE</Typography>
              <Typography variant="h4" color="#ff3e9d" sx={{ 
                fontWeight: 'bold'
              }}>{score}</Typography>
              {showTimeWarpWarning && (
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#ff00ff', 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    animation: 'flash 0.5s infinite',
                    textShadow: '0 0 8px #ff00ff',
                    '@keyframes flash': {
                      '0%': { opacity: 0.7 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.7 }
                    }
                  }}
                >
                  ⚠️ TIME WARP IMMINENT ⚠️
                </Typography>
              )}
              {isTimeWarpActive && (
                <>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: '#9932CC', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      animation: 'pulse 1.5s infinite',
                      textShadow: '0 0 8px #9932CC',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7, transform: 'scale(1)' },
                        '50%': { opacity: 1, transform: 'scale(1.05)' },
                        '100%': { opacity: 0.7, transform: 'scale(1)' }
                      }
                    }}
                  >
                    🌀 TIME WARP ACTIVE 🌀
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#9932CC', fontWeight: 'bold' }}
                  >
                    {Math.max(0, 15 - (gameTime % 60))} seconds left
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="#fff">HIGH SCORE</Typography>
              <Typography variant="h4" color="#30cfd0" sx={{ fontWeight: 'bold' }}>{highScore}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="#fff">TIME</Typography>
              <Typography variant="h4" color="#8A2BE2" sx={{ fontWeight: 'bold' }}>{formatTime(gameTime)}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={3}>
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
      
      {/* Game Controls Legend (only show when not playing) - MOVED HERE */}
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
              <Typography variant="caption" color="#ccc">Pilot Spaceship</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(48, 207, 208, 0.1)', color: '#30cfd0' }}>
                Spacebar
              </Paper>
              <Typography variant="caption" color="#ccc">Pause/Resume</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(0, 255, 255, 0.1)', color: '#00ffff' }}>
                ⭐ Power-Up
              </Paper>
              <Typography variant="caption" color="#ccc">Reset Length (+100 pts)</Typography>
            </Grid>
            <Grid item xs={3}>
              <Paper sx={{ p: 1, bgcolor: 'rgba(153, 50, 204, 0.1)', color: '#9932CC' }}>
                🌀 Time Warp
              </Paper>
              <Typography variant="caption" color="#ccc">Every Minute (15s)</Typography>
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
            gameTime={gameTime}
            isTimeWarpActive={isTimeWarpActive}
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
              COSMIC TRACER
            </Typography>
            <Typography variant="body1" color="#fff" align="center" sx={{ mb: 2, maxWidth: '80%' }}>
              Navigate through space as you control your cosmic spaceship.<br/>
              Collect energy orbs to grow your ship's trail and increase your score.<br/>
              Look for special star power-ups to reset your trail length and gain bonus points!<br/>
              Avoid collisions with walls and your own trail!
            </Typography>
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: 'rgba(153, 50, 204, 0.2)', 
              borderRadius: '8px',
              border: '1px solid #9932CC',
              maxWidth: '80%'
            }}>
              <Typography variant="body1" color="#fff" align="center" sx={{ fontWeight: 'bold' }}>
                <span role="img" aria-label="time warp">🌀</span> TIME WARP CYCLE <span role="img" aria-label="time warp">🌀</span>
              </Typography>
              <Typography variant="body2" color="#fff" align="center">
                Every minute, a cosmic time warp will slow down time for 15 seconds.<br/>
                Watch for the warning 2 seconds before each warp!<br/>
                Use this cosmic phenomenon to your advantage when navigating tight spaces.
              </Typography>
            </Box>
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
            <Typography variant="h6" color="#8A2BE2" gutterBottom>
              Time: {formatTime(gameTime)}
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
              <Typography variant="h5" color="#8A2BE2" gutterBottom>
                TIME: {formatTime(gameTime)}
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
        © 2025 Cosmic Tracer - Created as part of CIS-376
      </Typography>
    </Box>
  );
} 