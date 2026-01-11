import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../services/auth.service';
import '../App.css'; // On utilisera le CSS global pour le style simple

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // Utilisation de react-hook-form pour gérer le formulaire facilement
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    const onSubmit = async (data: LoginCredentials) => {
        setError(null);
        try {
            await authService.login(data);
            // Si login ok, on redirige vers l'accueil
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Connexion</h1>
                <p>Accédez à votre espace restaurateur</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email requis' })}
                            placeholder="exemple@resto.com"
                        />
                        {errors.email && <span className="field-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Mot de passe requis' })}
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="field-error">{errors.password.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
