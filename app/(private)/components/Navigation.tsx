import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon, Logout, AccountCircle } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { ROUTES_CONFIG } from '@/app/config/routes';
import Logo from '../../components/Logo';
import { THEME_CONFIG } from '@/app/config/theme';

interface RouteConfig {
  readonly path: string;
  readonly label: string;
  readonly roles: readonly string[];
}

interface NavigationRoute {
  path: string;
  label: string;
}

const getRoutesForUser = (userRole: string): NavigationRoute[] => {
  return Object.values(ROUTES_CONFIG.privateRoutes)
    .filter((route: RouteConfig) => route.roles.includes(userRole))
    .map((route: RouteConfig) => ({
      path: route.path,
      label: route.label,
    }));
};

export default function Navigation(): React.ReactNode {
  const [navigationAnchorEl, setNavigationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const routes = user?.role ? getRoutesForUser(user.role) : [];

  const handleNavigationMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setNavigationAnchorEl(event.currentTarget);
  };

  const handleNavigationMenuClose = (): void => {
    setNavigationAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = (): void => {
    setUserAnchorEl(null);
  };

  const handleMenuItemClick = (): void => {
    handleNavigationMenuClose();
  };

  const handleLogout = (): void => {
    logout();
    handleUserMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
      <Toolbar style={{ paddingLeft: '5px', minHeight: '72px' }}>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            marginLeft: '5px',
          }}
        >
          <Logo size="medium" />
        </Box>

        {/* Desktop navigation */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            alignItems: 'center',
          }}
        >
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              passHref
              style={{ textDecoration: 'none' }}
            >
              <Button
                color="inherit"
                size="small"
                sx={{
                  color: THEME_CONFIG.palette.line.main,
                  fontFamily:
                    'var(--font-open-sans), "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  padding: '4px 8px',
                  minWidth: 'auto',
                  fontSize: '17px',
                  '&:hover': {
                    backgroundColor: THEME_CONFIG.palette.line.hover,
                  },
                }}
              >
                {route.label}
              </Button>
            </Link>
          ))}

          {/* User menu for desktop */}
          {user && (
            <Box sx={{ ml: 2 }}>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                sx={{
                  color: THEME_CONFIG.palette.line.main,
                  '&:hover': {
                    backgroundColor: THEME_CONFIG.palette.line.hover,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: THEME_CONFIG.palette.line.hover,
                    color: THEME_CONFIG.palette.line.main,
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userAnchorEl}
                open={Boolean(userAnchorEl)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 180,
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily:
                      'var(--font-open-sans), "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: THEME_CONFIG.palette.line.main,
                    },
                  }}
                >
                  <Logout sx={{ mr: 1, fontSize: 20 }} />
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Mobile menu button */}
        <Box
          sx={{
            display: {
              xs: 'block',
              md: 'none',
              color: THEME_CONFIG.palette.line.main,
            },
          }}
        >
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-controls="navigation-menu"
            aria-haspopup="true"
            onClick={handleNavigationMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="navigation-menu"
            anchorEl={navigationAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(navigationAnchorEl)}
            onClose={handleNavigationMenuClose}
            sx={{
              '& .MuiPaper-root': {
                minWidth: 150,
                mt: 1,
                color: THEME_CONFIG.palette.text.primary,
                backgroundColor: THEME_CONFIG.palette.line.light,
              },
            }}
          >
            {routes.map((route) => (
              <MenuItem
                key={route.path}
                onClick={handleMenuItemClick}
                component={Link}
                href={route.path}
                sx={{
                  fontFamily:
                    'var(--font-open-sans), "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: THEME_CONFIG.palette.line.main,
                  },
                }}
              >
                {route.label}
              </MenuItem>
            ))}

            {/* User section for mobile */}
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily:
                      'var(--font-open-sans), "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: THEME_CONFIG.palette.line.main,
                    },
                  }}
                >
                  <Logout sx={{ mr: 1, fontSize: 20 }} />
                  Cerrar Sesión
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
