import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../../components/AuthContext';
import { DEFAULT_ROUTES } from '@/app/config/routes';
import Logo from '../../../components/Logo';
import AlertNotification from '../../../components/AlertNotification';
import TranslucentCard from './TranslucentCard';
import InputText from '../../../components/InputText';
import InputPasswordText from '../../../components/InputPasswordText';
import Button from '../../../components/Button';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isTokenBootstrapFlow, setIsTokenBootstrapFlow] = useState(false);
  const { login, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasTokenParam = Boolean(searchParams.get('token'));

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (hasTokenParam) {
      setIsTokenBootstrapFlow(true);
    }
  }, [hasTokenParam]);

  useEffect(() => {
    if (isTokenBootstrapFlow && !isAuthLoading && !user) {
      setIsTokenBootstrapFlow(false);
    }
  }, [isTokenBootstrapFlow, isAuthLoading, user]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push(DEFAULT_ROUTES.privateRoute.path);
    }
  }, [isAuthLoading, user, router]);

  if (
    !isClientReady ||
    ((hasTokenParam || isTokenBootstrapFlow) && (isAuthLoading || !!user))
  ) {
    return (
      <TranslucentCard>
        <Box
          sx={{
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            color: 'text.secondary',
          }}
        >
          <CircularProgress color="inherit" />
          <Typography color="inherit">Validando acceso...</Typography>
        </Box>
      </TranslucentCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);

    if (success) {
      router.push(DEFAULT_ROUTES.privateRoute.path);
    } else {
      setError('Usuario o contraseña incorrectos');
      setIsLoading(false);
    }
  };

  return (
    <TranslucentCard>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Logo size="large" />
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        marginBottom={2}
      >
        ¡Solicita tu crédito digital ahora!
      </Typography>

      <form onSubmit={handleSubmit}>
        <InputText
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          onErrorClear={() => setError('')}
          onInvalidText={'Ingresa un usuario valido (tipo+numero ej: CC1234)'}
          inputProps={{
            'data-testid': 'login-username-input',
            pattern: '[A-Za-z]{2,10}[0-9]+',
          }}
        />

        <InputPasswordText
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onErrorClear={() => setError('')}
          onInvalidText={'Por favor ingresa tu contraseña'}
          inputProps={{ 'data-testid': 'login-password-input' }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" disabled={isLoading} data-testid="login-button">
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Ingresando...
              </Box>
            ) : (
              'Ingresar'
            )}
          </Button>
        </Box>
      </form>

      <AlertNotification
        message={error}
        severity="error"
        onClose={() => setError('')}
      />
    </TranslucentCard>
  );
};

export default LoginForm;
