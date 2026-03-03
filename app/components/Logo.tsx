import React from 'react';
import { Box, Typography } from '@mui/material';
import { THEME_CONFIG } from '../config/theme';
import { fontConfig } from '../config/fonts';

interface LogoProps {
  size: 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const getSizeStyles = (): {
    fontSize: string;
    height: string;
    padding: string;
  } => {
    switch (size) {
      case 'large':
        return {
          fontSize: '40px',
          height: '64px',
          padding: '12px 24px',
        };
      default:
        return {
          fontSize: '28px',
          height: '48px',
          padding: '8px 16px',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          overflow: 'visible',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            background: THEME_CONFIG.palette.primary.main,
            padding: '5px',
            margin: '0px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h4"
            component="span"
            sx={{
              color: THEME_CONFIG.palette.text.secondary,
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              fontFamily: fontConfig.secondary,
              lineHeight: 0.9,
              margin: 0,
              padding: '2px',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            Credit
          </Typography>
        </Box>

        <Typography
          variant="h4"
          component="span"
          sx={{
            color: THEME_CONFIG.palette.text.secondary,
            fontWeight: 700,
            fontSize: sizeStyles.fontSize,
            fontFamily: fontConfig.secondary,
            marginLeft: size === 'medium' ? '-5px' : '-8px',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          &nbsp;ProMax
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
