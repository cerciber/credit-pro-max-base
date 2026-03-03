import React from 'react';
import { Card, CardContent, SxProps, Theme } from '@mui/material';
import { THEME_CONFIG } from '@/app/config/theme';

interface TranslucentCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  largeWidth?: boolean;
}

const TranslucentCard: React.FC<TranslucentCardProps> = ({
  children,
  sx = {},
  contentSx = {},
  largeWidth = false,
}) => {
  let width: SxProps<Theme> = { xs: 320, sm: 400 };
  if (largeWidth) {
    width = { ...width, md: 700 };
  }
  const defaultCardSx: SxProps<Theme> = {
    maxWidth: width,
    minWidth: width,
    width: '100%',
    borderRadius: '16px',
    backgroundColor: THEME_CONFIG.palette.line.hover,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${THEME_CONFIG.palette.line.hover}`,
    boxShadow: `0 0px 5px 0 ${THEME_CONFIG.palette.primary.dark}`,
    ...sx,
  };

  const defaultContentSx: SxProps<Theme> = {
    p: { xs: 3, sm: 4 },
    ...contentSx,
  };

  return (
    <Card sx={defaultCardSx}>
      <CardContent sx={defaultContentSx}>{children}</CardContent>
    </Card>
  );
};

export default TranslucentCard;
