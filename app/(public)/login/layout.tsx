import React from 'react';
import { Box } from '@mui/material';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({
  children,
}: LoginLayoutProps): React.ReactNode {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
        padding: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative' }}>{children}</Box>
    </Box>
  );
}
