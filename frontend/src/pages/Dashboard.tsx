import { authService } from '../services/auth.service';
import '../App.css'; // On réutilise le CSS

export default function Dashboard() {
    const handleLogout = () => {
        authService.logout();
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Tableau de bord</h1>
                <button
                    onClick={handleLogout}
                    style={{ width: 'auto', backgroundColor: '#666' }}
                >
                    Se déconnecter
                </button>
            </div>

            <div className="login-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
                <h2>Bienvenue ! 👋</h2>
                <p>Vous êtes connecté avec succès à l'application Calendria.</p>
                <p>C'est ici que s'affichera prochainement votre calendrier de réservation et vos statistiques.</p>
            </div>
        </div>
    );
}
