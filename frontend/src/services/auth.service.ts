import api from './api';

// Types pour TypeScript (pour savoir quelles données on manipule)
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

// Le service d'authentification
export const authService = {
    // Méthode pour se connecter
    login: async (credentials: LoginCredentials): Promise<string> => {
        // On envoie POST /login avec email/password
        const response = await api.post<AuthResponse>('/login', credentials);

        // Si on reçoit un token, on le sauvegarde
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data.token;
    },

    // Méthode pour se déconnecter
    logout: () => {
        localStorage.removeItem('token'); // On supprime le token
        window.location.href = '/login';  // On redirige vers la page de login
    },

    // Vérifier si on est connecté (simplement si on a un token)
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};
