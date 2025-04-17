'use client';

import { RequireAuth } from '@/app/components/utils';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Leaderboard component
const Leaderboard = dynamic(() => import('../components/Leaderboard'), { ssr: false });

// Mock leaderboard data
const mockLeaderboard = [
  { id: 1, username: 'CosmicQueen', score: 870, avatar: 'Q' },
  { id: 2, username: 'NebulaWarrior', score: 760, avatar: 'N' },
  { id: 3, username: 'StarDust42', score: 690, avatar: 'S' },
  { id: 4, username: 'GalaxyRider', score: 520, avatar: 'G' },
  { id: 5, username: 'AstroNova', score: 480, avatar: 'A' },
  { id: 6, username: 'VoidWalker', score: 450, avatar: 'V' },
  { id: 7, username: 'PlanetHopper', score: 410, avatar: 'P' },
  { id: 8, username: 'MoonChild', score: 350, avatar: 'M' },
  { id: 9, username: 'CometCatcher', score: 320, avatar: 'C' },
  { id: 10, username: 'SolarFlare', score: 300, avatar: 'S' },
];

export default function Page() {
  const [localHighScore, setLocalHighScore] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboard);

  // Load high score from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('snakeHighScore');
      if (savedHighScore) {
        const score = parseInt(savedHighScore, 10);
        setLocalHighScore(score);

        // Create a copy of the mock leaderboard
        const updatedLeaderboard = [...mockLeaderboard];

        // Add the user's score to the leaderboard if it's greater than 0
        if (score > 0) {
          // Remove any existing "You" entry if present
          const filteredLeaderboard = updatedLeaderboard.filter(
            (player) => player.username !== 'You',
          );

          // Add the user's entry
          filteredLeaderboard.push({
            id: 999,
            username: 'You',
            score: score,
            avatar: 'Y',
          });

          // Sort the leaderboard by score in descending order
          filteredLeaderboard.sort((a, b) => b.score - a.score);

          // Take only the top entries if needed
          setLeaderboardData(filteredLeaderboard);
        }
      }
    }
  }, []);

  return (
    <Container
      maxWidth='lg'
      sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}
    >
      <Typography variant='h3' sx={{ textAlign: 'center', color: '#888' }}>
        Welcome to your cosmic gaming dashboard. Are you ready to test your
        skills?
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          overflow: 'hidden',
          borderRadius: 4,
          background: 'linear-gradient(to right, #0a0a1e, #1a103a)',
          border: '1px solid rgba(48, 207, 208, 0.3)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
          },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Typography
          component='div'
          sx={{
            p: 2,
            color: '#30cfd0',
            fontSize: '2rem',
            bgcolor: '#0a0a1e',
            borderRadius: 2,
            border: '2px solid #30cfd0',
            position: 'relative',

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(45deg, rgba(48, 207, 208, 0.2), rgba(255, 62, 157, 0.2))',
              zIndex: 1,
            },
          }}
        >
          <List>
            <ListItem>- Navigate your ship through space.</ListItem>
            <ListItem>- Collect energy orbs to progress.</ListItem>
            <ListItem>- Avoid collisions with obstacles!</ListItem>
          </List>
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 'max-content',
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            component={Link}
            href='/game'
            variant='contained'
            size='large'
            sx={{
              py: 4,
              px: 8,
              fontSize: '1.75rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #30cfd0 10%, #5390d9 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #30cfd0 30%, #5390d9 100%)',
              },
            }}
          >
            Let's Go!
          </Button>

          <Typography
            variant='subtitle1'
            sx={{ color: '#fff', fontSize: '1.5rem' }}
          >
            YOUR BEST SCORE:{' '}
            <span style={{ color: '#30cfd0', fontWeight: 'bold' }}>
              {localHighScore}
            </span>
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={4}
        sx={{
          mb: 6,
          overflow: 'hidden',
          borderRadius: 4,
          background: 'linear-gradient(to right, #0a0a1e, #1a103a)',
          border: '1px solid rgba(48, 207, 208, 0.3)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          p: 3,
        }}
      >
        {/* Use the new Leaderboard component */}
        <Leaderboard />
      </Paper>
    </Container>
  );
}
