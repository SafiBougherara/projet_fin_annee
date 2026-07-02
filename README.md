# CALENDRIA - Assistant de Réservation Intelligent

[![CI/CD Pipeline](https://github.com/SafiBougherara/projet_fin_annee/actions/workflows/ci.yml/badge.svg)](https://github.com/SafiBougherara/projet_fin_annee/actions/workflows/ci.yml)

Assistant de réservation multi-canal pour restaurants, combinant dashboard web et agent vocal IA pour automatiser la prise de réservations.

## 🌐 Application en Production

| Service | URL |
|---|---|
| **Frontend (Dashboard)** | https://frontend-production-8a43.up.railway.app |
| **Backend API** | https://backend-production-dd10b.up.railway.app |
| **Health Check** | https://backend-production-dd10b.up.railway.app/api/health |

### Identifiants de démo (après `doctrine:fixtures:load`)
- **Email** : `admin@calendria.com`
- **Mot de passe** : `password123`

---

## 🎯 Fonctionnalités

- 🗓️ **Dashboard Restaurateur** : Gestion complète des réservations (CRUD), plan de salle interactif, slider temporel
- 🤖 **Agent Vocal IA (Retell AI)** : Réservation par téléphone via webhook `/api/chatbot/call`
- 🧠 **Chatbot Web (Gemini AI)** : Widget conversationnel intégrable sur site restaurant
- 📲 **Bot Telegram** : Canal de réservation mobile gratuit connecté par webhook
- ✅ **Disponibilité intelligente** : Attribution automatique de table + alternatives horaires
- 🔐 **Authentification JWT** : Espace restaurateur sécurisé
- 🌙 **Mode sombre** : Thème persistant

---

## 🛠️ Stack Technique

| Couche | Technologie |
|---|---|
| **Back-end** | Symfony 6.4 LTS — PHP 8.4 |
| **Front-end** | React 18 + TypeScript + Vite + Material UI |
| **Base de données** | PostgreSQL 15 (Doctrine ORM) |
| **Auth** | LexikJWTAuthenticationBundle (RS256) |
| **APIs externes** | Google Gemini 2.5 Flash · Retell AI |
| **Conteneurisation** | Docker + Docker Compose (nginx + PHP-FPM + supervisord) |
| **CI/CD** | GitHub Actions → Railway (déploiement continu) |

---

## 🚀 Démarrage Rapide (Docker)

### Prérequis
- Docker & Docker Compose
- Clé API Gemini (gratuite sur [Google AI Studio](https://aistudio.google.com/))

### Lancement en local

```bash
# 1. Cloner le dépôt
git clone https://github.com/SafiBougherara/projet_fin_annee.git
cd projet_fin_annee

# 2. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Renseigner GEMINI_API_KEY dans backend/.env

# 3. Lancer tous les services
docker compose up -d --build

# 4. Initialiser la base de données
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# 5. Accéder à l'application
#    Dashboard : http://localhost:3000
#    API       : http://localhost:8000/api/health
```

### Variables d'environnement requises (`backend/.env`)

| Variable | Description | Obligatoire |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ |
| `APP_SECRET` | Clé secrète Symfony (32 chars) | ✅ |
| `GEMINI_API_KEY` | Clé API Google Gemini | ✅ |
| `CORS_ALLOW_ORIGIN` | Regex domaine frontend | ✅ |
| `JWT_PASSPHRASE` | Passphrase clés RSA (vide = sans) | ✅ |
| `TELEGRAM_BOT_TOKEN` | Token bot Telegram | ❌ optionnel |
| `TELEGRAM_BOT_USERNAME` | Username bot Telegram | ❌ optionnel |

---

## 🧪 Tests

```bash
# Tests unitaires et fonctionnels backend
docker compose exec backend php bin/console cache:clear --env=test
docker compose exec backend vendor/bin/phpunit

# Vérification TypeScript frontend
cd frontend && npm run build
```

---

## 📁 Structure du Projet

```
projet_fin_annee/
├── backend/              # API Symfony 6.4
│   ├── src/
│   │   ├── Controller/   # Endpoints REST
│   │   ├── Entity/       # Entités Doctrine
│   │   ├── Service/      # Logique métier
│   │   ├── Repository/   # Couche d'accès aux données
│   │   └── EventSubscriber/ # Rate limiting login
│   ├── tests/            # PHPUnit (unitaires + fonctionnels)
│   ├── config/           # Configuration Symfony
│   └── migrations/       # Migrations Doctrine
├── frontend/             # React SPA (TypeScript + MUI)
│   └── src/
│       ├── pages/        # Dashboard, Login, Register, Plan de salle…
│       ├── components/   # Composants réutilisables
│       └── services/     # Couche API (Axios)
├── docker/               # Dockerfiles + configs nginx/supervisord
├── documentation/        # Livrables jalons 1→6 (Markdown)
├── .github/workflows/    # Pipeline CI/CD GitHub Actions
└── docker-compose.yml    # Orchestration locale
```

---

## 📚 Documentation

| Jalon | Contenu | Statut |
|---|---|---|
| Jalon 1 | Cahier des Charges Fonctionnel | ✅ |
| Jalon 2 | Méthodologie + Conception UI/UX | ✅ |
| Jalon 3 | Modélisation BDD (MCD/MLD/MPD) | ✅ |
| Jalon 4 | Architecture + Diagrammes UML | ✅ |
| Jalon 5 | Version Bêta + Tests + Sécurité | ✅ |
| Jalon 6 | Livraison Finale + Déploiement | ✅ |

---

## 👤 Auteur

**BOUGHERARA Safi**  
Formation CDA — Concepteur Développeur d'Applications  
Promotion 2025–2026

## 📄 Licence

MIT

