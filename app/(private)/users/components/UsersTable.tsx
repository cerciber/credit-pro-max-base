'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';
import { THEME_CONFIG } from '@/app/config/theme';
import { api } from '@/app/lib/api';
import { API_ROUTES } from '@/app/config/routes';
import { GetUsersOutput } from '@/src/modules/users/schemas/get-users-output-schema';
import { User } from '@/src/modules/users/schemas/user-schema';
import AlertNotification from '@/app/components/AlertNotification';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

export default function UsersTable(): React.ReactNode {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const response = await api.get<GetUsersOutput>(API_ROUTES.users);
        setUsers(response.data);
      } catch {
        setError('No se pudieron cargar los usuarios. Inténtalo nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User): void => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User): void => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserDeleted = (userId: string): void => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleAddNew = (): void => {
    setIsAddModalOpen(true);
  };

  const handleUserAdded = (newUser: User): void => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser: User): void => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const getRoleColor = (role: string): string => {
    return role === 'admin'
      ? THEME_CONFIG.palette.primary.main
      : THEME_CONFIG.palette.secondary.main;
  };

  return (
    <Card>
      <AlertNotification
        message={error}
        severity="error"
        onClose={() => setError('')}
      />
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ textAlign: 'center' }}
          data-testid="users-title"
        >
          Gestión de Usuarios
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small" sx={{ tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Rol
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Género
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: THEME_CONFIG.palette.line.main,
                      textAlign: 'center',
                      py: 1,
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          backgroundColor: getRoleColor(user.role),
                          color: 'white',
                          fontWeight: 'bold',
                          height: 20,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.genre === 'M' ? 'Masculino' : 'Femenino'}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
                        textAlign: 'center',
                        py: 1,
                        px: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <IconButton
                        onClick={() => handleEdit(user)}
                        size="small"
                        sx={{ mr: 0.5, p: 0.5 }}
                        data-testid={`edit-user-${user.id}`}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user)}
                        size="small"
                        sx={{ color: THEME_CONFIG.error.error, p: 0.5 }}
                        data-testid={`delete-user-${user.id}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              colorStyle="primary"
              size="small"
              data-testid="add-user-button"
            >
              Agregar Usuario
            </Button>
          </Box>
        </>
      )}

      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <EditUserModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        user={editingUser}
      />

      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onUserDeleted={handleUserDeleted}
        user={deletingUser}
      />
    </Card>
  );
}
