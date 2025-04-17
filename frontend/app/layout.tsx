import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Box from '@mui/material/Box';
import type { Metadata } from 'next';

import { Navigation, Footer } from '@/app/components/common';
import { Setup } from '@/app/components/utils';
import ReduxProvider from '@/redux/provider';
import { theme } from '@/theme';
import './globals.css';
import { CssBaseline } from '@mui/material';

export const metadata: Metadata = {
  title: 'Cosmic Tracer',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <CssBaseline />
            <ThemeProvider theme={theme}>
              <Setup />
              <Navigation />

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 2 }}
              >
                <Box>{children}</Box>
                <Footer />
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
