# CALENDRIA - Assistant de Réservation Intelligent

Assistant de réservation multi-canal pour restaurants utilisant l'IA conversationnelle.

## 🎯 Fonctionnalités

- 📱 **WhatsApp Business** : Réservation via QR Code
- 🌐 **Widget Web** : Chatbot intégrable sur site restaurant
- 📲 **SMS Direct** : Réservation par SMS
- 🤖 **IA Conversationnelle** : OpenAI GPT-4o-mini
- ✅ **Validation Automatique** : Confirmation instantanée si disponibilité
- 📊 **Dashboard Restaurateur** : Gestion complète des réservations

## 🛠️ Stack Technique

- **Back-end** : Symfony 6.4 LTS (PHP 8.2+)
- **Front-end** : React 18+ (TypeScript)
- **Base de données** : PostgreSQL 15
- **APIs** : Twilio (WhatsApp + SMS) + OpenAI
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions

## 🚀 Installation

### Prérequis

- PHP 8.2+ ✅
- Composer 2.x ✅
- Node.js 20+ ✅
- Docker & Docker Compose ✅
- Compte Twilio (gratuit)
- Compte OpenAI (gratuit)

### Démarrage Rapide

```bash
# Copier les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configurer les clés API dans backend/.env
# TWILIO_ACCOUNT_SID=...
# TWILIO_AUTH_TOKEN=...
# OPENAI_API_KEY=...

# Lancer avec Docker
docker-compose up -d

# Accéder à l'application
# Frontend : http://localhost:3000
# Backend API : http://localhost:8000
```

## 📁 Structure du Projet

```
calendria/
├── backend/              # API Symfony
├── frontend/             # React SPA
├── documentation/        # Docs projet
├── docker/              # Configurations Docker
├── .github/             # GitHub Actions (CI/CD)
└── scripts/             # Scripts utilitaires
```

## 📚 Documentation

Voir le dossier `/documentation` pour :
- [Guide d'Installation](documentation/INSTALLATION.md)
- [Plan du Projet](documentation/Plan.md)
- [Structure Détaillée](documentation/STRUCTURE.md)
- CDCF complet (Jalon 1) ✅
- Maquettes UI/UX (Jalon 2)
- Modélisation BDD (Jalon 3)
- Conception UML (Jalon 4)

## 📅 Jalons

- [x] **Jalon 1** (31/01) : CDCF ✅
- [x] **Jalon 2** (28/02) : Méthodologie + Maquettes ✅
- [ ] **Jalon 3** (31/03) : MCD/MLD/MPD + API
- [ ] **Jalon 4** (30/04) : Chatbot WhatsApp + Dashboard
- [ ] **Jalon 5** (29/05) : Widget Web + Tests
- [ ] **Jalon 6** (30/06) : Livraison finale

## 👤 Auteur

**BOUGHERARA Safi**  
Formation CDA - Concepteur Développeur d'Applications  
Janvier 2026

## 📄 Licence

MIT
