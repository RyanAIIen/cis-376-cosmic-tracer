import { Box, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'right',
        gap: 1,
        px: 2,
        opacity: 0.5,
      }}
    >
      <Link href='https://cosmic-tracer-ui.vercel.app/'>
        <small>Nebula Interactive Gaming, {new Date().getFullYear()}</small>
      </Link>
      |
      <Link href='https://umdearborn.edu'>
        <small>University of Michigan-Dearborn, CIS 376</small>
      </Link>
      |
      <Link href='https://github.com/RyanAIIen/cis-376-cosmic-tracer'>
        <small>Code</small>
      </Link>
    </Box>
  );
}
