'use client';

import React, { useState, useEffect } from 'react';
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
import { updateUserBodySchema } from '@/src/modules/users/schemas/update-user-input-schema';
import { api } from '@/app/lib/api';
import { API_ROUTES } from '@/app/config/routes';
import { UpdateUserOutput } from '@/src/modules/users/schemas/update-user-output-schema';
import { User } from '@/src/modules/users/schemas/user-schema';
import { z } from 'zod';
import { THEME_CONFIG } from '@/app/config/theme';

type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
  user: User | null;
}

export default function EditUserModal({
  open,
  onClose,
  onUserUpdated,
  user,
}: EditUserModalProps): React.ReactNode {
  const [formData, setFormData] = useState<Partial<UpdateUserBody>>({
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        genre: user.genre,
        password: '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof UpdateUserBody, value: string): void => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSend: Partial<UpdateUserBody> = {};

      if (formData.username && formData.username !== '')
        dataToSend.username = formData.username;
      if (formData.email && formData.email !== '')
        dataToSend.email = formData.email;
      if (formData.password && formData.password !== '')
        dataToSend.password = formData.password;
      if (formData.name && formData.name !== '')
        dataToSend.name = formData.name;
      if (formData.role && formData.role !== '')
        dataToSend.role = formData.role;
      if (formData.genre) dataToSend.genre = formData.genre;

      const response = await api.put<UpdateUserBody, UpdateUserOutput>(
        `${API_ROUTES.users}/${user.id}`,
        dataToSend
      );

      setSuccess(response.message);
      onUserUpdated(response.data);

      onClose();
      setSuccess('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al actualizar el usuario');
      } else {
        setError('Error al actualizar el usuario');
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

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Editar Usuario
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
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              helperText="Dejar en blanco para mantener la contraseña actual"
            />
            <TextField
              label="Nombre completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              size="small"
              disabled={loading}
              sx={inputSx}
              inputProps={{ 'data-testid': 'edit-name-input' }}
            />
            <TextField
              label="Rol"
              select
              value={formData.role}
              onChange={(e) =>
                handleChange('role', e.target.value as 'admin' | 'client')
              }
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
            data-testid="update-user-button"
          >
            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
