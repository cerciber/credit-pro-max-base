import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { THEME_CONFIG } from '../config/theme';

interface InputTextProps extends Omit<TextFieldProps, 'sx'> {
  onErrorClear?: () => void;
  onInvalidText: string;
}

const InputText: React.FC<InputTextProps> = ({
  onErrorClear,
  onInvalidText,
  inputProps,
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

  const mergedInputProps = {
    ...(inputProps || {}),
    onInvalid: (e: React.FormEvent<HTMLInputElement>): void => {
      e.currentTarget.setCustomValidity(onInvalidText);
      if (typeof inputProps?.onInvalid === 'function') {
        inputProps.onInvalid(e);
      }
    },
    onInput: (e: React.FormEvent<HTMLInputElement>): void => {
      e.currentTarget.setCustomValidity('');
      onErrorClear?.();
      if (typeof inputProps?.onInput === 'function') {
        inputProps.onInput(e);
      }
    },
  };

  return (
    <TextField
      fullWidth
      margin="normal"
      autoComplete="off"
      inputProps={mergedInputProps}
      sx={defaultSx}
      {...props}
    />
  );
};

export default InputText;
