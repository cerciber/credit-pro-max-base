import { Button as MuiButton, SxProps, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';
import { fontConfig } from '@/app/config/fonts';
import { THEME_CONFIG } from '@/app/config/theme';

interface CustomButtonProps extends Omit<ButtonProps, 'sx'> {
  children: ReactNode;
  startIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  sx?: SxProps;
  type?: 'button' | 'submit';
  colorStyle?: 'primary' | 'secondary';
}

export default function Button({
  children,
  startIcon,
  onClick,
  disabled,
  sx,
  type,
  colorStyle = 'secondary',
  size = 'medium',
  ...props
}: CustomButtonProps): React.ReactNode {
  const getSizeStyles = (): {
    fontSize: string;
    height: string;
    minHeight: string;
    padding?: string;
    borderRadius: string;
  } => {
    if (size === 'small') {
      return {
        fontSize: '12px',
        height: '28px',
        minHeight: '28px',
        padding: '4px 12px',
        borderRadius: '6px',
      };
    }
    return {
      fontSize: '18px',
      height: '50px',
      minHeight: '50px',
      borderRadius: '10px',
    };
  };

  return (
    <MuiButton
      type={type ?? 'button'}
      variant="contained"
      startIcon={startIcon}
      onClick={onClick}
      disabled={disabled}
      size={size}
      {...props}
      sx={{
        backgroundColor: THEME_CONFIG.palette[colorStyle].main,
        color: THEME_CONFIG.palette.text.secondary,
        fontFamily: fontConfig.primary,
        ...getSizeStyles(),
        '&:hover': {
          backgroundColor: THEME_CONFIG.palette[colorStyle].light,
        },
        '&:active': {
          backgroundColor: THEME_CONFIG.palette[colorStyle].dark,
        },
        '& .MuiTouchRipple-root': {
          '& .MuiTouchRipple-ripple': {
            color: THEME_CONFIG.palette[colorStyle].ripple,
          },
        },
        '& .MuiButton-startIcon': {
          color: THEME_CONFIG.palette.line.main,
        },
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
}
