import React from 'react';
import { Typography, Box, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';
import Card from '@/app/components/Card';
import { THEME_CONFIG } from '@/app/config/theme';

const WelcomeCard: React.FC = () => {
  return (
    <Card data-testid="welcome-card">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ mr: 2, bgcolor: THEME_CONFIG.palette.secondary.main }}>
          <Person sx={{ color: THEME_CONFIG.palette.line.light }} />
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h5">¡Bienvenido!</Typography>
        </Box>
      </Box>
      <Typography variant="body1" align="left">
        Utiliza las opciones del menú con tranquilidad.
      </Typography>
    </Card>
  );
};

export default WelcomeCard;
