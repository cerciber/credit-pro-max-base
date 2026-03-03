'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './lib/emotion-cache';
import { AuthProvider } from './components/AuthContext';
import { THEME_CONFIG } from './config/theme';
import { montserrat, openSans } from './config/fonts';
import { useEffect } from 'react';
import './globals.css';

const theme = createTheme(THEME_CONFIG);
const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  useEffect(() => {
    document.body.classList.add('MuiCssBaseline-root');
  }, []);

  const style = {
    '--theme-background-gradient': THEME_CONFIG.background.gradient,
  } as React.CSSProperties;

  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body style={style}>
        <CacheProvider value={clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
