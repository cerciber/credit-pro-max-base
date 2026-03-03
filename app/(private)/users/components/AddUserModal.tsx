'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import Button from '@/app/components/Button';
import AlertNotification from '@/app/components/AlertNotification';
import { createUserBodySchema } from '@/src/modules/users/schemas/create-user-input-schema';
import { api } from '@/app/lib/api';
import { API_ROUTES } from '@/app/config/routes';
import { CreateUserOutput } from '@/src/modules/users/schemas/create-user-output-schema';
import { User } from '@/src/modules/users/schemas/user-schema';
import { z } from 'zod';
import { THEME_CONFIG } from '@/app/config/theme';

type CreateUserBody = z.infer<typeof createUserBodySchema>;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export default function AddUserModal({
  open,
  onClose,
  onUserAdded,
}: AddUserModalProps): React.ReactNode {
  const [formData, setFormData] = useState<CreateUserBody>({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'client',
    genre: 'M',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: keyof CreateUserBody, value: string): void => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post<CreateUserBody, CreateUserOutput>(
        API_ROUTES.users,
        formData
      );

      setSuccess(response.message);
      onUserAdded(response.data);

      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        role: 'client',
        genre: 'M',
      });

      onClose();
      setSuccess('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al crear el usuario');
      } else {
        setError('Error al crear el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!loading) {
      setError('');
      setSuccess('');
      onClose();
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: THEME_CONFIG.palette.text.primary,
      '& fieldset': {
        borderColor: THEME_CONFIG.palette.line.dark,
      },
      '&:hover fieldset': {
        borderColor: THEME_CONFIG.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: THEME_CONFIG.palette.primary.main,
      },
      '&.Mui-disabled': {
        backgroundColor: THEME_CONFIG.palette.line.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: THEME_CONFIG.palette.line.dark,
      '&.Mui-focused': {
        color: THEME_CONFIG.palette.primary.main,
      },
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: THEME_CONFIG.palette.line.dark,
      WebkitTextFillColor: THEME_CONFIG.palette.line.dark,
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Agregar Nuevo Usuario
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <AlertNotification
            message={error}
            severity="error"
            onClose={() => setError('')}
          />
          <AlertNotification
            message={success}
            severity="success"
            onClose={() => setSuccess('')}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre de usuario"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              inputProps={{ 'data-testid': 'add-username-input' }}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              inputProps={{ 'data-testid': 'add-email-input' }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              inputProps={{ 'data-testid': 'add-password-input' }}
            />
            <TextField
              label="Nombre completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              inputProps={{ 'data-testid': 'add-name-input' }}
            />
            <TextField
              label="Rol"
              select
              value={formData.role}
              onChange={(e) =>
                handleChange('role', e.target.value as 'admin' | 'client')
              }
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
            >
              <MenuItem value="client">Cliente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
            <TextField
              label="Género"
              select
              value={formData.genre}
              onChange={(e) =>
                handleChange('genre', e.target.value as 'M' | 'F')
              }
              required
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </TextField>
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
            type="submit"
            colorStyle="primary"
            size="small"
            disabled={loading}
            data-testid="create-user-button"
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
