import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { authService } from './services/auth.service';

// Composant pour protéger les routes qui nécessitent d'être connecté
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  if (!authService.isAuthenticated()) {
    // Si pas connecté, on redirige vers le login
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : Connexion */}
        <Route path="/login" element={<Login />} />

        {/* Route privée : Dashboard (Accueil) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
