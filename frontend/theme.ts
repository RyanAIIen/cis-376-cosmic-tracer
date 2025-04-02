'use client';

import { purple, pink } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { Agdasima, Tektur } from 'next/font/google';

export const headline = Tektur({
  weight: ['400'],
  subsets: ['latin'],
});

export const body = Agdasima({
  weight: ['400'],
  subsets: ['latin'],
});

export const theme = createTheme({
  typography: {
    ...body.style,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderBottom: '1px solid #222',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#181818',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiLink: {
      styleOverrides: { root: { textDecoration: 'none' } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h1' },
          style: { ...headline.style, fontSize: '1.5rem' },
        },
        {
          props: { variant: 'h2' },
          style: { ...headline.style, fontSize: '1.4rem' },
        },
        {
          props: { variant: 'h3' },
          style: { ...headline.style, fontSize: '1.3rem' },
        },
        {
          props: { variant: 'h4' },
          style: { ...headline.style, fontSize: '1.2rem' },
        },
        {
          props: { variant: 'h5' },
          style: { ...headline.style, fontSize: '1.1rem' },
        },
        {
          props: { variant: 'h6' },
          style: { ...headline.style, fontSize: '1rem' },
        },
      ],
    },
  },
  palette: {
    primary: {
      light: purple[600],
      main: purple[900],
    },
    secondary: {
      main: pink[500],
    },
  },
});
