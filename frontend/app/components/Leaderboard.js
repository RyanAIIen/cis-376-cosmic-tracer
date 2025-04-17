'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '../game/GameAPI';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

// Configuration
const USE_DUMMY_DATA = true; // Set to false for production

// Dummy data for the leaderboard (development only)
const dummyScores = [
  { id: 1, username: 'CosmicQueen', score: 870 },
  { id: 2, username: 'NebulaWarrior', score: 760 },
  { id: 3, username: 'StarDust42', score: 690 },
  { id: 4, username: 'GalaxyRider', score: 520 },
  { id: 5, username: 'AstroNova', score: 480 },
  { id: 6, username: 'VoidWalker', score: 450 },
  { id: 7, username: 'PlanetHopper', score: 410 },
  { id: 8, username: 'MoonChild', score: 350 },
  { id: 9, username: 'CometCatcher', score: 320 },
  { id: 10, username: 'SolarFlare', score: 300 },
];

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set a test high score in localStorage for development mode
  useEffect(() => {
    if (USE_DUMMY_DATA && typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('snakeHighScore');
      if (!savedHighScore) {
        const testScore = 550;
        localStorage.setItem('snakeHighScore', testScore.toString());
      }
    }
  }, []);

  // Fetch leaderboard data when component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Fetch data from API
        const data = await getLeaderboard();
        
        if (!USE_DUMMY_DATA && Array.isArray(data) && data.length > 0) {
          // Use real API data in production
          setScores(data);
        } else {
          // Development mode or fallback if API returns no data
          let leaderboardData = [...dummyScores];
          
          // Add user's high score if available
          const userHighScore = getUserHighScore();
          if (userHighScore > 0) {
            // Create combined leaderboard with user score
            leaderboardData = addUserScoreToLeaderboard(leaderboardData, userHighScore);
          }
          
          setScores(leaderboardData);
        }
      } catch (error) {
        // Fallback to dummy data on error
        setScores(dummyScores);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to get user's high score from localStorage
  const getUserHighScore = () => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('snakeHighScore');
      if (savedHighScore) {
        return parseInt(savedHighScore, 10);
      }
    }
    return 0;
  };
  
  // Helper function to add user score to leaderboard and return sorted result
  const addUserScoreToLeaderboard = (leaderboardData, userHighScore) => {
    // Add user's entry
    leaderboardData.push({
      id: 999, // Special ID for user
      username: 'You',
      score: userHighScore
    });
    
    // Sort by score (descending) and take top 10
    return leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress sx={{ color: '#30cfd0' }} />
      </Box>
    );
  }

  // Render leaderboard table
  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          color: '#30cfd0',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(48, 207, 208, 0.5)'
        }}
      >
        GLOBAL LEADERBOARD
      </Typography>

      <TableContainer component={Paper} sx={{ 
        bgcolor: 'rgba(10, 10, 30, 0.9)', 
        borderRadius: '8px',
        border: '2px solid rgba(48, 207, 208, 0.5)',
        boxShadow: '0 0 20px rgba(48, 207, 208, 0.2)',
        overflow: 'hidden'
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: 'rgba(48, 207, 208, 0.15)',
              height: '60px'
            }}>
              <TableCell sx={{ 
                color: '#fff', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderBottom: '2px solid rgba(48, 207, 208, 0.5)',
                width: '20%',
                textAlign: 'center'
              }}>RANK</TableCell>
              <TableCell sx={{ 
                color: '#fff', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderBottom: '2px solid rgba(48, 207, 208, 0.5)',
                width: '50%'
              }}>PLAYER</TableCell>
              <TableCell sx={{ 
                color: '#fff', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderBottom: '2px solid rgba(48, 207, 208, 0.5)',
                width: '30%',
                textAlign: 'center'
              }}>SCORE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.length > 0 ? (
              scores.map((score, index) => (
                <TableRow key={score.id} sx={{ 
                  height: '50px',
                  '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                  '&:hover': { bgcolor: 'rgba(48, 207, 208, 0.1)' },
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background-color 0.2s',
                  ...(score.username === 'You' ? {
                    bgcolor: 'rgba(255, 62, 157, 0.1)',
                    '&:hover': { bgcolor: 'rgba(255, 62, 157, 0.15)' },
                    border: '1px solid rgba(255, 62, 157, 0.3)'
                  } : {})
                }}>
                  <TableCell sx={{ 
                    color: index < 3 ? '#ff3e9d' : '#ccc',
                    fontWeight: index < 3 ? 'bold' : 'normal',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: index < 3 ? '1.2rem' : '1rem',
                    textAlign: 'center',
                    ...(score.username === 'You' ? {
                      color: '#ff3e9d',
                      fontWeight: 'bold'
                    } : {})
                  }}>
                    #{index + 1}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: index < 3 ? '1.1rem' : '1rem',
                    ...(score.username === 'You' ? {
                      color: '#ff3e9d',
                      fontWeight: 'bold'
                    } : {})
                  }}>{score.username}</TableCell>
                  <TableCell sx={{ 
                    color: index === 0 ? '#ff3e9d' : '#30cfd0',
                    fontWeight: 'bold',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: index < 3 ? '1.2rem' : '1rem',
                    textAlign: 'center',
                    ...(score.username === 'You' ? {
                      color: '#ff3e9d'
                    } : {})
                  }}>{score.score}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#ccc', py: 6 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#30cfd0' }}>
                    No Scores Yet
                  </Typography>
                  <Typography>
                    Be the first one on the leaderboard! Play a game and submit your score.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 