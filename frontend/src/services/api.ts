import axios from 'axios';

/**
 * Client HTTP centralisé : toutes les requêtes authentifiées passent par ici.
 *
 * Deux intercepteurs :
 *  - requête  : injecte automatiquement le token JWT dans l'en-tête Authorization.
 *  - réponse  : sur un 401, purge le token et renvoie l'utilisateur vers /login.
 *
 * L'URL de base vient de VITE_API_URL (voir frontend/.env), ce qui permet de
 * basculer entre local, Docker et production sans toucher au code.
 */
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si le token est expiré ou invalide, on déconnecte l'utilisateur
      // Exception sur /login : un 401 y signifie simplement « mauvais identifiants »,
      // on laisse la page afficher son message d'erreur au lieu de recharger.
      if (!error.config.url.endsWith('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
