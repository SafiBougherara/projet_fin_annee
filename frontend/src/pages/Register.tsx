import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        try {
            await api.post('/register', { email: data.email, password: data.password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création du compte.';
            setError(msg);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Créer un compte</h1>
                <p>Rejoignez l'espace restaurateur Calendria</p>

                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="error-message" style={{ background: '#1a3a1a', borderColor: '#4caf50', color: '#81c784' }}>
                        Compte créé avec succès ! Redirection vers la connexion…
                    </div>
                )}

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
                            {...register('password', {
                                required: 'Mot de passe requis',
                                minLength: { value: 8, message: 'Minimum 8 caractères' }
                            })}
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="field-error">{errors.password.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Confirmer le mot de passe</label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Confirmation requise',
                                validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas'
                            })}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting || success}>
                        {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
