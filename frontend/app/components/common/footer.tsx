import { Box, Container, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Container maxWidth='xl'>
      <Box
        component='footer'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography color='#aaa'>
          This app is for educational purposes only.
        </Typography>

        <Typography
          sx={{
            display: 'flex',
            gap: 1,
            opacity: 0.5,
          }}
        >
          <Link href='https://cosmic-tracer-ui.vercel.app/'>
            <small>Cosmic Tracer, {new Date().getFullYear()}</small>
          </Link>
          |
          <Link href='https://umdearborn.edu'>
            <small>University of Michigan-Dearborn CIS-376</small>
          </Link>
          |
          <Link href='https://github.com/RyanAIIen/cis-376-cosmic-tracer'>
            <small>View the Code</small>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
