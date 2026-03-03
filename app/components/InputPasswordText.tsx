import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { THEME_CONFIG } from '../config/theme';

interface InputPasswordTextProps
  extends Omit<TextFieldProps, 'sx' | 'InputProps'> {
  onErrorClear?: () => void;
  onInvalidText: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const InputPasswordText: React.FC<InputPasswordTextProps> = ({
  onErrorClear,
  onInvalidText,
  showPassword,
  onTogglePassword,
  ...props
}) => {
  const defaultSx = {
    '& .MuiOutlinedInput-root': {
      color: THEME_CONFIG.palette.text.secondary,
      '& fieldset': {
        borderColor: THEME_CONFIG.palette.line.dark,
      },
      '&:hover fieldset': {
        borderColor: THEME_CONFIG.palette.line.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: THEME_CONFIG.palette.line.light,
      },
      '&.Mui-disabled fieldset': {
        borderColor: THEME_CONFIG.palette.line.ripple,
      },
    },
    '& .MuiInputLabel-root': {
      color: THEME_CONFIG.palette.line.main,
      '&.Mui-focused': {
        color: THEME_CONFIG.palette.line.light,
      },
      '&.Mui-disabled': {
        color: THEME_CONFIG.palette.line.ripple,
      },
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: THEME_CONFIG.palette.line.dark,
      WebkitTextFillColor: THEME_CONFIG.palette.line.dark,
    },
  };

  return (
    <TextField
      fullWidth
      margin="normal"
      type={showPassword ? 'text' : 'password'}
      inputProps={{
        onInvalid: (e: React.FormEvent<HTMLInputElement>): void => {
          e.currentTarget.setCustomValidity(onInvalidText);
        },
        onInput: (e: React.FormEvent<HTMLInputElement>): void => {
          e.currentTarget.setCustomValidity('');
          onErrorClear?.();
        },
        ...(props.inputProps || {}),
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onTogglePassword}
              edge="end"
              disabled={props.disabled}
              sx={{ color: THEME_CONFIG.palette.line.main }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={defaultSx}
      {...props}
    />
  );
};

export default InputPasswordText;
