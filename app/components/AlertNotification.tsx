import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Portal } from '@mui/material';
import { THEME_CONFIG } from '../config/theme';

interface AlertNotificationProps {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
  autoHideDuration?: number;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}) => {
  const [open, setOpen] = useState(!!message);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = (): void => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!message) return null;

  return (
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          left: '20px',
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            borderRadius: '12px',
          },
        }}
      >
        <Alert
          severity={severity}
          onClose={handleClose}
          data-testid="alert-notification"
          sx={{
            width: '100%',
            backgroundColor:
              severity === 'error' ? THEME_CONFIG.error.error : undefined,
            color: severity === 'error' ? 'white' : undefined,
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: severity === 'error' ? 'white' : undefined,
            },
            '& .MuiAlert-message': {
              color: severity === 'error' ? 'white' : undefined,
              fontWeight: 500,
            },
            '& .MuiAlert-action': {
              color: severity === 'error' ? 'white' : undefined,
              display: 'flex',
              alignItems: 'center',
              padding: '4px 0',
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Portal>
  );
};

export default AlertNotification;
