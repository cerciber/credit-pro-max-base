import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { DEFAULT_ROUTES } from '@/app/config/routes';
import { THEME_CONFIG } from '@/app/config/theme';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push(DEFAULT_ROUTES.publicRoute);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress
          sx={{
            color: THEME_CONFIG.palette.line.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
