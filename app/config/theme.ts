import { fontConfig } from './fonts';

const blueColors = {
  main: 'rgb(77, 112, 209)',
  light: 'rgb(112, 137, 199)',
  dark: 'rgb(55, 77, 125)',
  ripple: 'rgba(255, 255, 255, 0.3)',
};

const orangeColors = {
  main: 'rgb(255, 132, 0)',
  light: 'rgb(255, 162, 50)',
  dark: 'rgb(204, 102, 0)',
  ripple: 'rgba(255, 255, 255, 0.3)',
};

const textColors = {
  primary: 'rgb(0, 0, 0)',
  secondary: 'rgb(255, 255, 255)',
};

const lineColors = {
  main: 'rgb(225, 225, 225)',
  light: 'rgba(255, 255, 255, 1)',
  dark: 'rgb(143, 143, 143)',
  ripple: 'rgb(112, 112, 112)',
  hover: 'rgba(255, 255, 255, 0.1)',
};

const errorColors = {
  info: 'rgb(255, 255, 255)',
  success: 'rgb(30, 170, 40)',
  warning: 'rgb(231, 165, 32)',
  error: 'rgb(211, 47, 47)',
};

const primaryColors = blueColors;
const secondaryColors = orangeColors;

export const THEME_CONFIG = {
  palette: {
    primary: primaryColors,
    secondary: secondaryColors,
    text: textColors,
    line: lineColors,
  },
  error: errorColors,
  background: {
    gradient: `radial-gradient(ellipse at 0% 30%, ${primaryColors.main} 0%, #000000 60%, ${primaryColors.main} 100%)`,
  },
  typography: {
    fontFamily: `${fontConfig.primary}, ${fontConfig.fallback}`,
    h1: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: fontConfig.primary,
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      fontFamily: fontConfig.primary,
    },
    body2: {
      fontFamily: fontConfig.primary,
    },
    button: {
      fontFamily: fontConfig.secondary,
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '18px',
      borderRadius: '25px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: secondaryColors.light,
          },
          '&:active': {
            backgroundColor: secondaryColors.dark,
          },
          '& .MuiTouchRipple-root': {
            '& .MuiTouchRipple-ripple': {
              color: secondaryColors.ripple,
            },
          },
        },
      },
    },
  },
} as const;
