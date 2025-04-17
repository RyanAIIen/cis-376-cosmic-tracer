'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RequireAuth } from '../components/utils';
import { submitScore } from './GameAPI';

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
  const [gameTime, setGameTime] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const timerRef = useRef(null);

  // Check for client-side rendering and load high score
  useEffect(() => {
    setIsClient(true);

    // Load high score from local storage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    // Start timer when game starts
    if (gameStarted && !isPaused && !gameOver) {
      timerRef.current = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1);
      }, 1000);
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
      const timeInCycle = gameTime % 60;

      // Show warning 2 seconds before time warp activates (at 58 seconds in each cycle)
      if (timeInCycle === 58) {
        setShowTimeWarpWarning(true);
        console.log('⚠️ TIME WARP APPROACHING! ⚠️');
      }

      // Activate time warp at start of each cycle (0, 60, 120, etc. seconds)
      if (timeInCycle === 0 && gameTime > 0) {
        // Skip the very first second of the game
        setShowTimeWarpWarning(false);
        setIsTimeWarpActive(true);
        console.log(
          `🌀 TIME WARP ACTIVATED at ${gameTime}s! 🌀 Time has slowed down!`,
        );
      }

      // Deactivate time warp after 15 seconds in each cycle
      if (timeInCycle === 15) {
        setIsTimeWarpActive(false);
        console.log(
          `TIME WARP DEACTIVATED at ${gameTime}s! Normal time flow restored.`,
        );
      }

      // Log time warp status every 10 seconds for debugging
      if (gameTime % 10 === 0 && gameTime > 0) {
        console.log(
          `Time: ${gameTime}s - Time warp status: ${isTimeWarpActive ? 'ACTIVE' : 'INACTIVE'}`,
        );
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
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    // Update high score when game ends
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  const startGame = () => {
    if (!isClient) return;

    setScore(0);
    setGameTime(0);
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setIsTimeWarpActive(false);
    setShowTimeWarpWarning(false);
  };

  const resetGame = () => {
    if (!isClient) return;

    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setGameTime(0);
    setIsPaused(false);
    setIsTimeWarpActive(false);
    setShowTimeWarpWarning(false);
  };

  const togglePause = () => {
    if (gameStarted && !gameOver) {
      setIsPaused((prev) => !prev);
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setScoreSubmitted(false);
    setSubmitError(null);
    
    // Compare current score with high score
    const isNewHighScore = score > highScore;
    const scoreToSubmit = isNewHighScore ? score : highScore;
    
    // Update high score if needed
    if (isNewHighScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
      console.log(`New high score achieved: ${score}`);
    }
    
    // Submit high score to leaderboard if user has a score
    if (scoreToSubmit > 0) {
      console.log(`Submitting ${isNewHighScore ? 'new' : 'existing'} high score: ${scoreToSubmit}, Time played: ${gameTime}s`);
      
      submitScore(scoreToSubmit, gameTime)
        .then(response => {
          if (!response.success) {
            // Handle specific error cases
            if (response.error === 'Authentication failed') {
              setSubmitError('Authentication error. Please refresh the page and log in again.');
            } else {
              setSubmitError(response.message || 'Failed to submit score to the server.');
            }
          } else {
            setScoreSubmitted(true);
          }
        })
        .catch(error => {
          console.error('Error submitting score:', error);
          setSubmitError('A network error occurred while submitting your score.');
        });
    }
  };

  return (
    <RequireAuth>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 2,
            bgcolor: '#0d0d2b',
            border: '2px solid #30cfd0',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box textAlign='center'>
            <Button
              component={Link}
              href='/dashboard'
              variant='outlined'
              size='small'
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                textTransform: 'uppercase',
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Main Menu
            </Button>
          </Box>

          <Box display='flex' justifyContent='center' pr={10}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item xs={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='h6' color='#fff'>
                    SCORE
                  </Typography>
                  <Typography
                    variant='h4'
                    color='#ff3e9d'
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {score}
                  </Typography>
                  {showTimeWarpWarning && (
                    <Typography
                      variant='subtitle1'
                      sx={{
                        color: '#ff00ff',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        animation: 'flash 0.5s infinite',
                        textShadow: '0 0 8px #ff00ff',
                        '@keyframes flash': {
                          '0%': { opacity: 0.7 },
                          '50%': { opacity: 1 },
                          '100%': { opacity: 0.7 },
                        },
                      }}
                    >
                      ⚠️ TIME WARP IMMINENT ⚠️
                    </Typography>
                  )}
                  {isTimeWarpActive && (
                    <>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          color: '#9932CC',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          animation: 'pulse 1.5s infinite',
                          textShadow: '0 0 8px #9932CC',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.7, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.05)' },
                            '100%': { opacity: 0.7, transform: 'scale(1)' },
                          },
                        }}
                      >
                        🌀 TIME WARP ACTIVE 🌀
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{ color: '#9932CC', fontWeight: 'bold' }}
                      >
                        {Math.max(0, 15 - (gameTime % 60))} seconds left
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='h6' color='#fff'>
                    HIGH SCORE
                  </Typography>
                  <Typography
                    variant='h4'
                    color='#30cfd0'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {highScore}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='h6' color='#fff'>
                    TIME
                  </Typography>
                  <Typography
                    variant='h4'
                    color='#8A2BE2'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {formatTime(gameTime)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Box
          sx={{
            height: 800,
            bgcolor: '#0a0a1e',
            border: '2px solid #30cfd0',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(48, 207, 208, 0.3)',
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
                zIndex: 10,
              }}
            >
              <Typography
                variant='h4'
                color='#30cfd0'
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                COSMIC TRACER
              </Typography>
              <Typography
                variant='body1'
                color='#fff'
                align='center'
                sx={{ mb: 2, maxWidth: '80%' }}
              >
                Navigate through space as you control your cosmic spaceship.
                <br />
                Collect energy orbs to grow your ship&apos;s trail and increase
                your score.
                <br />
                Look for special power-ups to reset your trail length and gain
                bonus points!
                <br />
                Avoid collisions with obstacles and your own trail!
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(153, 50, 204, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid #9932CC',
                  maxWidth: '80%',
                }}
              >
                <Typography
                  variant='body1'
                  color='#fff'
                  align='center'
                  sx={{ fontWeight: 'bold' }}
                >
                  <span role='img' aria-label='time warp'>
                    🌀
                  </span>{' '}
                  TIME WARP CYCLE{' '}
                  <span role='img' aria-label='time warp'>
                    🌀
                  </span>
                </Typography>
                <Typography variant='body2' color='#fff' align='center'>
                  Every minute, a cosmic time warp will slow down time for 15
                  seconds.
                  <br />
                  Watch for the warning 2 seconds before each warp!
                  <br />
                  Use this cosmic phenomenon to your advantage when navigating
                  tight spaces.
                </Typography>
              </Box>
              <Button
                variant='contained'
                onClick={startGame}
                size='large'
                sx={{
                  bgcolor: '#30cfd0',
                  '&:hover': { bgcolor: '#00a0a0' },
                  mt: 2,
                  minWidth: 200,
                  fontSize: '1.2rem',
                }}
              >
                BLAST OFF
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
                zIndex: 10,
              }}
            >
              <Typography variant='h4' color='#fff' gutterBottom>
                GAME PAUSED
              </Typography>
              <Typography variant='h6' color='#30cfd0' gutterBottom>
                Current Score: {score}
              </Typography>
              <Typography variant='h6' color='#8A2BE2' gutterBottom>
                Time: {formatTime(gameTime)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant='contained'
                  onClick={togglePause}
                  sx={{
                    bgcolor: '#30cfd0',
                    '&:hover': { bgcolor: '#00a0a0' },
                    minWidth: 150,
                  }}
                >
                  RESUME
                </Button>
                <Button
                  variant='outlined'
                  onClick={resetGame}
                  sx={{
                    color: '#ff3e9d',
                    borderColor: '#ff3e9d',
                    '&:hover': {
                      borderColor: '#d01c7c',
                      bgcolor: 'rgba(255, 62, 157, 0.1)',
                    },
                    minWidth: 150,
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
                zIndex: 10,
              }}
            >
              <Typography
                variant='h3'
                color='#ff3e9d'
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                GAME OVER
              </Typography>

              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant='h5' color='#fff' gutterBottom>
                  YOUR SCORE
                </Typography>
                <Typography
                  variant='h2'
                  color='#30cfd0'
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  {score}
                </Typography>
                <Typography variant='h5' color='#8A2BE2' gutterBottom>
                  TIME: {formatTime(gameTime)}
                </Typography>
                
                {/* Display high score section */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant='h6' color='#fff' gutterBottom>
                    YOUR HIGH SCORE
                  </Typography>
                  <Typography
                    variant='h3'
                    color='#ff3e9d'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {highScore}
                  </Typography>
                  <Typography variant='body2' color='#ccc' sx={{ mt: 1 }}>
                    Your best score is automatically submitted to the leaderboard
                  </Typography>
                </Box>
                
                {score >= highScore && score > 0 && (
                  <Box
                    sx={{
                      bgcolor: 'rgba(48, 207, 208, 0.2)',
                      p: 1,
                      mt: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant='subtitle1' color='#30cfd0'>
                      NEW HIGH SCORE!
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  variant='contained'
                  onClick={startGame}
                  size='large'
                  sx={{
                    bgcolor: '#30cfd0',
                    '&:hover': { bgcolor: '#00a0a0' },
                    minWidth: 180,
                    fontSize: '1.1rem',
                  }}
                >
                  PLAY AGAIN
                </Button>

                <Button
                  variant='outlined'
                  component={Link}
                  href='/dashboard'
                  size='large'
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': {
                      borderColor: '#ccc',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    minWidth: 180,
                    fontSize: '1.1rem',
                  }}
                >
                  MAIN MENU
                </Button>
              </Box>

              {scoreSubmitted && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 255, 0, 0.1)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ color: '#4caf50' }}>
                    Your high score has been submitted to the leaderboard!
                  </Typography>
                </Box>
              )}
              
              {submitError && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255, 0, 0, 0.1)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ color: '#f44336' }}>
                    {submitError}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {(!gameStarted || isPaused) && !gameOver && (
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              p: 2,
              bgcolor: '#0d0d2b',
              border: '2px solid #30cfd0',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant='subtitle1' color='#fff' sx={{ mb: 1 }}>
              CONTROLS
            </Typography>

            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(48, 207, 208, 0.1)',
                    color: '#30cfd0',
                  }}
                >
                  WASD / Arrows
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Pilot Spaceship
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(48, 207, 208, 0.1)',
                    color: '#30cfd0',
                  }}
                >
                  Spacebar
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Pause/Resume
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(0, 255, 255, 0.1)',
                    color: '#00ffff',
                  }}
                >
                  ⭐ Power-Up
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Reset Length (+100 pts)
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(153, 50, 204, 0.1)',
                    color: '#9932CC',
                  }}
                >
                  🌀 Time Warp
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Slows Time
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(255, 0, 0, 0.1)',
                    color: '#ff5500',
                  }}
                >
                  💣 Bombs
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Avoid! Game Over
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(255, 62, 157, 0.1)',
                    color: '#ff3e9d',
                  }}
                >
                  Walls/Self
                </Paper>
                <Typography variant='caption' color='#ccc'>
                  Game Over
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </RequireAuth>
  );
}
