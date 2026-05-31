import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RestaurantManagement from './pages/RestaurantManagement';
import ChatWidget from './pages/ChatWidget';
import { authService } from './services/auth.service';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a premium MUI Theme matching our index.css design system
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo
      light: '#6366f1',
      dark: '#4338ca',
    },
    secondary: {
      main: '#0ea5e9', // Cyan
      light: '#38bdf8',
      dark: '#0284c7',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        },
      },
    },
  },
});

// Composant pour protéger les routes qui nécessitent d'être connecté
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    // Si pas connecté, on redirige vers le login
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const NavigationLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: 'none',
          py: 0.5
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <span style={{ WebkitTextFillColor: 'initial' }}>📅</span> CALENDRIA
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                component={Link}
                to="/"
                sx={{
                  mx: 1,
                  px: 2,
                  py: 1,
                  color: location.pathname === '/' ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === '/' ? 700 : 500,
                  backgroundColor: location.pathname === '/' ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(79, 70, 229, 0.04)',
                  },
                }}
              >
                Réservations
              </Button>
              <Button
                component={Link}
                to="/admin"
                sx={{
                  mx: 1,
                  px: 2,
                  py: 1,
                  color: location.pathname === '/admin' ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === '/admin' ? 700 : 500,
                  backgroundColor: location.pathname === '/admin' ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(79, 70, 229, 0.04)',
                  },
                }}
              >
                Restaurants & Tables
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleLogout} 
                sx={{ 
                  ml: 2, 
                  fontWeight: 600,
                  borderWidth: '1.5px',
                  '&:hover': {
                    borderWidth: '1.5px',
                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                  }
                }}
              >
                Déconnexion
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ flexGrow: 1, py: 4, px: 2 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

function AppContent() {
  return (
    <Routes>
      {/* Route publique : Connexion */}
      <Route path="/login" element={<Login />} />

      {/* Route publique : Widget Chat IA */}
      <Route path="/widget" element={<ChatWidget />} />

      {/* Routes privées avec NavigationLayout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <NavigationLayout>
              <Dashboard />
            </NavigationLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <NavigationLayout>
              <RestaurantManagement />
            </NavigationLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
