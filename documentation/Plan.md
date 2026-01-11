# 🚀 Plan de Mise en Place - CALENDRIA

**Projet** : Assistant de Réservation Intelligent Multi-Canal  
**Date de début** : 09/01/2026  
**Deadline Jalon 1** : 31/01/2026  
**Auteur** : BOUGHERARA Safi

---

## 📅 Timeline Globale

```
Janvier  : ✅ CDCF (Jalon 1)
Février  : Méthodologie + Maquettes UI/UX (Jalon 2)
Mars     : MCD/MLD/MPD + API REST + Algorithme tables (Jalon 3)
Avril    : Chatbot WhatsApp + Dashboard restaurateur + UML (Jalon 4)
Mai      : Widget Web + SMS + Tests + Sécurité (Jalon 5)
Juin     : Finalisation + Déploiement + Documentation (Jalon 6)
```

---

## 🎯 Phase 1 : Configuration Initiale (Aujourd'hui - 1h)

### ✅ Étape 1.1 : Créer le Dépôt Git

**Plateforme** : GitHub  
**Nom du repo** : `calendria-reservation-system`  
**Description** : Assistant de réservation intelligent multi-canal pour restaurants (WhatsApp + Widget Web + SMS)  
**Visibilité** : Public ou Privé (au choix)

**Actions** :
1. Aller sur https://github.com/new
2. Remplir :
   - Repository name : `calendria-reservation-system`
   - Description : "Assistant de réservation intelligent multi-canal pour restaurants"
   - ✅ Cocher "Add a README file"
   - ✅ Ajouter .gitignore : None (on le créera manuellement)
   - License : MIT (optionnel)
3. Cliquer "Create repository"
4. Cloner en local :
   ```bash
   git clone https://github.com/[votre-username]/calendria-reservation-system.git
   cd calendria-reservation-system
   ```

---

### ✅ Étape 1.2 : Initialiser la Structure du Projet

**Structure de dossiers** :

```
calendria-reservation-system/
├── backend/                 # API Symfony
│   ├── src/
│   ├── config/
│   ├── migrations/
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── composer.json
│   └── Dockerfile
│
├── frontend/                # React SPA (Dashboard Restaurateur)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── documentation/           # Docs projet (déjà créé ✅)
│   ├── Jalon1/
│   │   ├── CDCF_CALENDRIA_Jalon1.md
│   │   ├── CONFORMITE_CDC_TECHNIQUE.md
│   │   └── RESUME_MODIFICATIONS_CDCF.md
│   ├── Jalon2/
│   ├── Jalon3/
│   └── CahierDesCharges.md
│
├── docker/                  # Configurations Docker
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── database/
│       └── init.sql
│
├── .github/                 # GitHub Actions (CI/CD)
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── scripts/                 # Scripts utilitaires
│   ├── setup.sh
│   └── deploy.sh
│
├── .gitignore
├── docker-compose.yml
├── README.md
└── Plan.md                  # Ce fichier
```

**Commandes pour créer la structure** :

```bash
# Créer les dossiers principaux
mkdir -p backend frontend docker/backend docker/frontend docker/database .github/workflows scripts

# Créer les sous-dossiers backend
mkdir -p backend/src backend/config backend/migrations backend/tests

# Créer les sous-dossiers frontend
mkdir -p frontend/src/components frontend/src/pages frontend/src/services frontend/public

# Documentation déjà créée ✅
```

---

### ✅ Étape 1.3 : Créer les Fichiers de Configuration

#### **1. .gitignore**

```gitignore
# Backend (Symfony)
/backend/vendor/
/backend/var/
/backend/.env.local
/backend/.env.local.php
/backend/.env.*.local
/backend/public/bundles/
/backend/composer.lock

# Frontend (React)
/frontend/node_modules/
/frontend/dist/
/frontend/build/
/frontend/.env.local
/frontend/.env.production.local
/frontend/package-lock.json
/frontend/yarn.lock

# Docker
/docker/database/data/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### **2. README.md**

```markdown
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

- Docker & Docker Compose
- Git
- Compte Twilio (gratuit)
- Compte OpenAI (gratuit)

### Démarrage Rapide

```bash
# Cloner le repo
git clone https://github.com/[username]/calendria-reservation-system.git
cd calendria-reservation-system

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

## 📚 Documentation

Voir le dossier `/documentation` pour :
- CDCF complet (Jalon 1)
- Maquettes UI/UX (Jalon 2)
- Modélisation BDD (Jalon 3)
- Conception UML (Jalon 4)

## 📅 Jalons

- [x] **Jalon 1** (31/01) : CDCF ✅
- [ ] **Jalon 2** (28/02) : Méthodologie + Maquettes
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
```

#### **3. docker-compose.yml**

```yaml
version: '3.8'

services:
  # Base de données PostgreSQL
  db:
    image: postgres:15-alpine
    container_name: calendria_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: calendria
      POSTGRES_USER: calendria_user
      POSTGRES_PASSWORD: calendria_pass
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./docker/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - calendria_network

  # Backend Symfony
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile
    container_name: calendria_backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://calendria_user:calendria_pass@db:5432/calendria?serverVersion=15&charset=utf8
      APP_ENV: dev
      APP_SECRET: change_me_in_production
    volumes:
      - ./backend:/var/www/html
    networks:
      - calendria_network

  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile
    container_name: calendria_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - calendria_network

volumes:
  db_data:

networks:
  calendria_network:
    driver: bridge
```

---

## 🎯 Phase 2 : Setup Backend Symfony (Demain - 2h)

### ✅ Étape 2.1 : Installer Symfony

```bash
# Se placer dans le dossier du projet
cd calendria-reservation-system

# Installer Symfony 6.4 LTS
composer create-project symfony/skeleton:"6.4.*" backend
cd backend

# Installer les bundles essentiels
composer require webapp              # Pack complet (Twig, Asset, etc.)
composer require orm                 # Doctrine ORM
composer require api                 # API Platform
composer require maker --dev         # Maker Bundle (génération de code)
composer require symfony/validator   # Validation
composer require lexik/jwt-authentication-bundle  # JWT Auth
composer require nelmio/cors-bundle  # CORS pour React
```

### ✅ Étape 2.2 : Configurer la Base de Données

**Fichier** : `backend/.env`

```env
# Database
DATABASE_URL="postgresql://calendria_user:calendria_pass@db:5432/calendria?serverVersion=15&charset=utf8"

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# App
APP_ENV=dev
APP_SECRET=change_me_in_production
```

**Créer** : `backend/.env.example` (sans les vraies clés)

```bash
# Créer la BDD
php bin/console doctrine:database:create

# Vérifier la connexion
php bin/console doctrine:query:sql "SELECT 1"
```

### ✅ Étape 2.3 : Créer les Entités de Base

```bash
# Restaurant
php bin/console make:entity Restaurant
# Ajouter : nom, adresse, telephone, email, capacite_totale

# Table
php bin/console make:entity Table
# Ajouter : numero_table, capacite, type, statut, restaurant (ManyToOne)

# Client
php bin/console make:entity Client
# Ajouter : nom, telephone, email, preferences (JSON), consentement_rgpd, taux_noshow

# Reservation
php bin/console make:entity Reservation
# Ajouter : client (ManyToOne), restaurant (ManyToOne), table (ManyToOne)
#           date_reservation, heure_reservation, nombre_personnes, statut

# Service
php bin/console make:entity Service
# Ajouter : restaurant (ManyToOne), type (midi/soir), heure_debut, heure_fin

# Générer la migration
php bin/console make:migration

# Exécuter la migration
php bin/console doctrine:migrations:migrate
```

---

## 🎯 Phase 3 : Setup Frontend React (Demain - 1h)

### ✅ Étape 3.1 : Créer l'App React

```bash
# Créer l'app React avec Vite + TypeScript
npm create vite@latest frontend -- --template react-ts

cd frontend

# Installer les dépendances
npm install
```

### ✅ Étape 3.2 : Installer les Dépendances Essentielles

```bash
# UI Framework
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# Calendrier
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Formulaires
npm install react-hook-form

# State Management
npm install zustand

# Date utilities
npm install date-fns
```

### ✅ Étape 3.3 : Structure Frontend

```
frontend/src/
├── components/
│   ├── Calendar/
│   │   └── ReservationCalendar.tsx
│   ├── Dashboard/
│   │   └── DashboardStats.tsx
│   ├── Reservations/
│   │   ├── ReservationList.tsx
│   │   └── ReservationCard.tsx
│   └── Layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Reservations.tsx
│   ├── Tables.tsx
│   └── Settings.tsx
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── reservations.ts
│
├── store/
│   └── useAuthStore.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
└── main.tsx
```

---

## 🎯 Phase 4 : Docker Setup (Après-demain - 1h)

### ✅ Étape 4.1 : Dockerfile Backend

**Fichier** : `docker/backend/Dockerfile`

```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application
COPY backend/ .

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader

# Expose port
EXPOSE 8000

# Start Symfony server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
```

### ✅ Étape 4.2 : Dockerfile Frontend

**Fichier** : `docker/frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy application
COPY frontend/ .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### ✅ Étape 4.3 : Lancer Docker

```bash
# Construire et lancer tous les services
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f

# Accéder aux services
# Frontend : http://localhost:3000
# Backend : http://localhost:8000
# Database : localhost:5432
```

---

## 🎯 Phase 5 : CI/CD GitHub Actions (Week-end)

### ✅ Étape 5.1 : Workflow CI

**Fichier** : `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          
      - name: Install dependencies
        run: |
          cd backend
          composer install
          
      - name: Run tests
        run: |
          cd backend
          php bin/phpunit

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm install
          
      - name: Run tests
        run: |
          cd frontend
          npm run test
```

---

## 📋 Checklist Complète

### ✅ Aujourd'hui (9 janvier)

- [ ] Créer le dépôt GitHub `calendria-reservation-system`
- [ ] Cloner le repo en local
- [ ] Créer la structure de dossiers
- [ ] Créer `.gitignore`
- [ ] Créer `README.md`
- [ ] Créer `docker-compose.yml`
- [ ] Premier commit + push

### ✅ Demain (10 janvier)

- [ ] Installer Symfony 6.4 dans `backend/`
- [ ] Configurer `.env` (sans les vraies clés API)
- [ ] Créer les entités de base (Restaurant, Table, Client, Reservation)
- [ ] Créer l'app React dans `frontend/`
- [ ] Installer les dépendances frontend

### ✅ Week-end (11-12 janvier)

- [ ] Créer les Dockerfiles
- [ ] Tester `docker-compose up`
- [ ] Créer le workflow CI/CD
- [ ] Créer les comptes Twilio + OpenAI (gratuit)
- [ ] Configurer les clés API

### ✅ Semaine prochaine (13-17 janvier)

- [ ] Commencer les maquettes Figma (Jalon 2)
- [ ] Définir la charte graphique
- [ ] Wireframes dashboard restaurateur
- [ ] Wireframes chatbot

---

## 🎯 Prochaines Étapes Immédiates

### **Option A : Tout Automatiser** 🚀 (Recommandé)

Je peux générer automatiquement :
- ✅ Tous les fichiers de configuration
- ✅ Structure complète du projet
- ✅ README.md détaillé
- ✅ docker-compose.yml fonctionnel
- ✅ .gitignore complet
- ✅ Scripts d'initialisation

### **Option B : Étape par Étape**

On fait ensemble :
1. Créer le dépôt GitHub (toi)
2. Je génère les fichiers de config
3. Tu clones et testes

### **Option C : Juste les Essentiels**

Je crée uniquement :
- README.md
- .gitignore
- docker-compose.yml

---

## 📞 Support

**Questions ?** Demande-moi de :
- Générer un fichier spécifique
- Expliquer une étape
- Créer un script d'automatisation
- Débugger un problème

---

**Dernière mise à jour** : 09/01/2026  
**Statut** : ✅ Prêt à démarrer  
**Prochaine action** : Créer le dépôt GitHub
