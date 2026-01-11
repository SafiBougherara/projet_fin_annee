import axios from 'axios';

// On crée une instance d'Axios configurée pour notre API
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // L'adresse de notre backend Symfony
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur : Avant chaque requête, on regarde si on a un token
api.interceptors.request.use(
    (config) => {
        // On récupère le token stocké (on le stockera sous le nom 'token' lors du login)
        const token = localStorage.getItem('token');

        // Si on a un token, on l'ajoute à l'en-tête Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
