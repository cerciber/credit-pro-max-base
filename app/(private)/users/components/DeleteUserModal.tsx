'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import Button from '@/app/components/Button';
import AlertNotification from '@/app/components/AlertNotification';
import { api } from '@/app/lib/api';
import { API_ROUTES } from '@/app/config/routes';
import { DeleteUserOutput } from '@/src/modules/users/schemas/delete-user-output-schema';
import { User } from '@/src/modules/users/schemas/user-schema';
import { THEME_CONFIG } from '@/app/config/theme';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserDeleted: (userId: string) => void;
  user: User | null;
}

export default function DeleteUserModal({
  open,
  onClose,
  onUserDeleted,
  user,
}: DeleteUserModalProps): React.ReactNode {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (): Promise<void> => {
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      await api.delete<DeleteUserOutput>(`${API_ROUTES.users}/${user.id}`);

      onUserDeleted(user.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al eliminar el usuario');
      } else {
        setError('Error al eliminar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Eliminar Usuario
        </Typography>
      </DialogTitle>
      <DialogContent>
        <AlertNotification
          message={error}
          severity="error"
          onClose={() => setError('')}
        />
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{user.name}</strong> ({user.username})?
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: THEME_CONFIG.error.error, fontWeight: 'bold' }}
          >
            Esta acción no se puede deshacer.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          colorStyle="secondary"
          size="small"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          colorStyle="primary"
          size="small"
          disabled={loading}
          data-testid="confirm-delete-button"
          sx={{
            backgroundColor: THEME_CONFIG.error.error,
            '&:hover': {
              backgroundColor: THEME_CONFIG.error.error,
              opacity: 0.8,
            },
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
