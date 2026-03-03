import { Card as MuiCard, CardContent, Theme, SxProps } from '@mui/material';
import { ReactNode, HTMLAttributes } from 'react';
import { THEME_CONFIG } from '../config/theme';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function Card({
  children,
  sx,
  ...props
}: CardProps): React.ReactNode {
  return (
    <MuiCard
      {...props}
      elevation={2}
      sx={{
        px: { xs: '20px', md: '40px' },
        py: { xs: '20px', md: '40px' },
        borderRadius: '10px',
        backgroundColor: THEME_CONFIG.palette.line.light,
        ...sx,
      }}
    >
      <CardContent
        sx={{
          textAlign: 'center',
          p: '10px !important',
        }}
      >
        {children}
      </CardContent>
    </MuiCard>
  );
}
