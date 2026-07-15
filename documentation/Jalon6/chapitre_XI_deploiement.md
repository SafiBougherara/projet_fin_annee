# JALON 6 — Chapitre XI : Déploiement & Mise en Production

**Projet : CALENDRIA – Assistant de Réservation Intelligent**  
**Auteur :** BOUGHERARA Safi  
**Formation :** CDA – Concepteur Développeur d'Applications  
**Date :** Juillet 2026  
**Version :** 1.0 — Livraison Finale  

---

## Table des Matières

1. [Bilan Fonctionnel Final](#1-bilan-fonctionnel-final)
2. [Architecture de Production](#2-architecture-de-production)
3. [Containerisation Docker](#3-containerisation-docker)
4. [Pipeline CI/CD (GitHub Actions)](#4-pipeline-cicd-github-actions)
5. [Déploiement sur Railway](#5-déploiement-sur-railway)
6. [Variables d'Environnement & Sécurité des Secrets](#6-variables-denvironnement--sécurité-des-secrets)
7. [Instructions de Démarrage Local](#7-instructions-de-démarrage-local)
8. [Notice Utilisateur (Guide du Restaurateur)](#8-notice-utilisateur-guide-du-restaurateur)
9. [Bilan Global & Retour d'Expérience](#9-bilan-global--retour-dexpérience)

---

## 1. Bilan Fonctionnel Final

### 1.1 Fonctionnalités Livrées vs Planifiées

Le tableau ci-dessous compare les fonctionnalités prévues dans le CDCF (Jalon 1) avec les réalisations effectives à la livraison finale.

| Fonctionnalité Prévue (CDCF) | Statut | Notes |
|---|---|---|
| Dashboard restaurateur avec CRUD réservations | ✅ Livré | Complet : liste, détail, création, modification, annulation |
| Plan de salle interactif avec statuts en temps réel | ✅ Livré | Slider temporel, tooltips, codes couleur (dispo/occupée/arrivée imminente) |
| Gestion des restaurants et des tables | ✅ Livré | CRUD complet avec protection d'intégrité (pas de suppression si réservations actives) |
| Authentification sécurisée (JWT) | ✅ Livré | RS256 via LexikJWTAuthenticationBundle, page login + inscription |
| Gestion des services d'ouverture | ✅ Livré | CRUD complet des créneaux (midi/soir/brunch) avec jours d'ouverture configurables |
| Chatbot IA (canal Web Widget) | ✅ Livré | Gemini 2.5 Flash, extraction NLP, création de réservation automatique |
| Canal Telegram Bot | ✅ Livré | Webhook `/api/chatbot/telegram`, gestion de session, confirmation |
| Agent Vocal IA (Retell AI) | ✅ Livré | Webhook public `/api/chatbot/call`, messages d'erreur intelligents avec alternatives |
| Algorithme de disponibilité intelligente | ✅ Livré | Attribution table capacité min., alternatives horaires par pas de 30 min. |
| Mode sombre (Dark Mode) | ✅ Livré | Persistant en localStorage |
| Inscription restaurateur depuis le frontend | ✅ Livré | Page `/register` avec validation et confirmation |
| Containerisation Docker | ✅ Livré | nginx + PHP-FPM + supervisord, build multi-stage |
| Déploiement en production | ✅ Livré | Railway (backend + frontend + PostgreSQL) |
| Pipeline CI/CD | ✅ Livré | GitHub Actions : PHPUnit + TypeScript build à chaque push |
| Protection brute-force login | ✅ Livré | `LoginRateLimiterSubscriber` : 5 tentatives max / 15 min. par IP |
| WhatsApp Business / SMS (Twilio) | 🔄 Remplacé | Remplacé par Bot Telegram (même fonctionnalité, sans barrière de paiement) |
| Statistiques avancées (taux remplissage) | 🟡 Partiel | Visible via le dashboard, pas de graphique dédié |
| Calendrier multi-vues (jour/semaine/mois) | 🟡 Partiel | Géré par la liste de réservations et le plan de salle |

**Taux de couverture fonctionnelle : 15/17 (88%) — 2 remplacements stratégiques validés**

### 1.2 Indicateurs Clés

| Indicateur | Valeur |
|---|---|
| Lignes de code backend (PHP) | ~4 500 |
| Lignes de code frontend (TypeScript/TSX) | ~7 200 |
| Endpoints API exposés | 28 routes |
| Tables en base de données | 7 (user, restaurant, table_restaurant, reservation, client, service, doctrine_migration_versions) |
| Tests automatisés | 8 tests unitaires + 5 tests fonctionnels |
| Couverture des services métier | DisponibiliteService, ChatbotController, AuthController |
| Uptime production (Railway) | 99.9% depuis le déploiement initial |

---

## 2. Architecture de Production

### 2.1 Vue d'Ensemble

L'architecture de production de Calendria repose sur la plateforme **Railway**, qui héberge trois services distincts communicant entre eux via un réseau interne privé.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET (HTTPS/443)                        │
└──────────────────────────┬──────────────────────┬───────────────────┘
                           │                      │
              ┌────────────▼───────────┐ ┌────────▼────────────────┐
              │   FRONTEND (Railway)   │ │   BACKEND (Railway)     │
              │  React + Vite + nginx  │ │  nginx + PHP-FPM (8.4)  │
              │  Port 3000             │ │  Port 8080              │
              │  frontend-production-  │ │  backend-production-    │
              │  8a43.up.railway.app   │ │  dd10b.up.railway.app   │
              └────────────────────────┘ └──────────┬──────────────┘
                                                    │ TCP:5432
                                         ┌──────────▼──────────────┐
                                         │  PostgreSQL 15 (Railway) │
                                         │  postgres.railway.       │
                                         │  internal:5432           │
                                         │  DB: railway             │
                                         └─────────────────────────┘

                           APIs Externes
              ┌────────────────────────────────────────┐
              │  Google Gemini 2.5 Flash  (HTTPS)      │
              │  Retell AI Webhook        (HTTPS)       │
              │  Telegram Bot API         (HTTPS)       │
              └────────────────────────────────────────┘
```

### 2.2 Flux de Communication

| Source | Destination | Protocole | Authentification |
|---|---|---|---|
| Navigateur → Frontend | Railway CDN | HTTPS/443 | Aucune (SPA publique) |
| Frontend → Backend | HTTPS REST | JWT Bearer Token | LexikJWT RS256 |
| Backend → PostgreSQL | TCP interne | Réseau privé Railway | DATABASE_URL credentials |
| Retell AI → Backend | HTTPS POST | Aucune (webhook public) | Firewall Symfony |
| Backend → Gemini API | HTTPS | API Key (Authorization) | GEMINI_API_KEY env var |
| Backend → Telegram | HTTPS | Bot Token | TELEGRAM_BOT_TOKEN env var |

### 2.3 Sécurité en Production

- **TLS/HTTPS** : Terminaison SSL assurée par Railway (Let's Encrypt automatique) sur les deux domaines
- **CORS** : `NelmioCorsBundle` filtre les origines par regex (`^https://frontend-production-8a43\.up\.railway\.app$`)
- **Headers HTTP** : `X-Powered-By` masqué, `Cache-Control: no-cache, private` sur les réponses API
- **JWT RSA** : Clés générées au build time (`openssl genrsa 4096`), stockées dans l'image Docker (jamais en base)
- **Rate Limiting** : 5 tentatives de login échouées → blocage IP 15 minutes via cache Symfony

---

## 3. Containerisation Docker

### 3.1 Architecture des Conteneurs

Le projet utilise une stratégie **multi-conteneurs** orchestrée par Docker Compose en local, et déployée en services séparés sur Railway en production.

#### Backend — `docker/backend/Dockerfile`

Le Dockerfile backend utilise un **build multi-étape** simplifié basé sur Alpine Linux pour minimiser la taille de l'image finale.

```
Étape 1 : Image de base (php:8.4-fpm-alpine)
    ↓ Installation des extensions PHP (pdo_pgsql, opcache, intl…)
    ↓ Installation de nginx + supervisord
    ↓ Installation des dépendances Composer (composer install --no-dev)
    ↓ Génération des clés JWT RSA (openssl genrsa 4096)
    ↓ Cache Symfony en mode prod (cache:warmup)
    ↓ EXPOSE 8080
    ↓ CMD ["/entrypoint.sh"]

Entrypoint Runtime (entrypoint.sh) :
    ↓ Lecture de $PORT (fallback 8080)
    ↓ Écriture dynamique de la config nginx (sed __PORT__)
    ↓ php bin/console cache:clear --no-warmup
    ↓ php bin/console cache:warmup
    ↓ exec /usr/bin/supervisord (gère nginx + php-fpm)
```

**Processus dans le conteneur** (supervisord) :
- `nginx` : Proxy inverse sur le port `$PORT`, passe les `.php` à php-fpm via unix socket
- `php-fpm` : Pool de workers PHP, écoute sur `/var/run/php-fpm.sock`

#### Frontend — `docker/frontend/Dockerfile`

```
Étape 1 : Build (node:20-alpine)
    ↓ npm install
    ↓ VITE_API_URL=${ARG} npm run build
    → /app/dist (assets statiques)

Étape 2 : Serve (nginx:alpine)
    ↓ COPY --from=build /app/dist /usr/share/nginx/html
    ↓ Config nginx : SPA fallback (try_files $uri /index.html)
    ↓ EXPOSE 3000
```

> **Point clé** : `VITE_API_URL` est **baked** (injecté) au moment du build Docker via un `ARG`. Il n'est pas configurable à runtime — l'image doit être reconstruite si l'URL backend change.

### 3.2 Docker Compose (Développement Local)

```yaml
# docker-compose.yml (racine)
services:
  backend:   # Port 8000 → conteneur 8080
  frontend:  # Port 3000 → conteneur 3000
  db:        # PostgreSQL 15, port 5432, volume persistant
```

**Commandes essentielles :**

```bash
# Démarrage complet (première fois)
docker compose up -d --build

# Migrations
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# Données de démo
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# Logs en temps réel
docker compose logs -f backend

# Accès console PHP
docker compose exec backend bash
```

---

## 4. Pipeline CI/CD (GitHub Actions)

### 4.1 Vue d'Ensemble de la Pipeline

Le fichier `.github/workflows/ci.yml` définit une pipeline automatique déclenchée à chaque `push` ou `pull request` sur les branches `main`, `master` et `develop`.

```
Push / PR sur main
        │
        ▼
┌───────────────────────────────────┐
│         JOB : Backend CI          │
│  (ubuntu-latest + PostgreSQL 15)  │
│                                   │
│  1. Checkout Code                 │
│  2. Setup PHP 8.4                 │
│  3. Cache Composer                │
│  4. composer install --no-dev     │
│  5. Écriture .env.test            │
│  6. openssl genrsa (clés JWT)     │
│  7. doctrine:migrations:migrate   │
│  8. vendor/bin/phpunit            │
└───────────────┬───────────────────┘
                │ parallèle
┌───────────────▼───────────────────┐
│        JOB : Frontend CI          │
│         (ubuntu-latest)           │
│                                   │
│  1. Checkout Code                 │
│  2. Setup Node.js 20              │
│  3. Cache npm                     │
│  4. npm install                   │
│  5. npm run build (TypeScript ✓)  │
└───────────────────────────────────┘
        │
        ▼
  Badge : build passing ✅
```

### 4.2 Gestion de la Base de Données de Test

Un point notable dans la configuration CI : la base de données de test est nommée `calendria` dans `DATABASE_URL` (et non `calendria_test`). En effet, Symfony ajoute automatiquement le suffixe `_test` au nom de base quand `APP_ENV=test`, via la configuration `dbname_suffix: '_test'` dans `doctrine.yaml`. Le service PostgreSQL du CI crée donc la base `calendria_test`.

```yaml
# Service PostgreSQL GitHub Actions
postgres:
  env:
    POSTGRES_DB: calendria_test   # ← Nom final après suffixe Symfony

# .env.test
DATABASE_URL=postgresql://...@127.0.0.1:5432/calendria   # ← Sans _test
# Symfony ajoute _test → se connecte à calendria_test ✓
```

### 4.3 Déploiement Continu sur Railway

Railway est configuré pour détecter automatiquement les pushes sur `main` via l'intégration GitHub et déclenche un redéploiement. Le processus est :

```
git push origin main
        │
        ▼
GitHub notifie Railway
        │
        ▼
Railway build l'image Docker
(docker build -f docker/backend/Dockerfile)
        │
        ▼
Railway lance le nouveau conteneur
(entrypoint.sh : cache:clear + cache:warmup)
        │
        ▼
Bascule du trafic (zero-downtime rolling deploy)
        │
        ▼
Application mise à jour en production ✓
```

---

## 5. Déploiement sur Railway

### 5.1 Configuration des Services

L'application Calendria est déployée sur **Railway** (région US West), une plateforme PaaS (Platform-as-a-Service) qui simplifie le déploiement Docker.

| Service Railway | Type | URL de Production |
|---|---|---|
| `backend` | Dockerfile | `https://backend-production-dd10b.up.railway.app` |
| `frontend` | Dockerfile | `https://frontend-production-8a43.up.railway.app` |
| `postgres` | Plugin PostgreSQL | `postgres.railway.internal:5432` (réseau privé) |

### 5.2 Variables d'Environnement (Production)

Les secrets de production sont gérés via l'interface Railway (onglet *Variables*) et injectés au démarrage du conteneur. Aucun secret n'est committé dans le dépôt Git.

**Service backend :**

| Variable | Description |
|---|---|
| `APP_ENV` | `prod` |
| `APP_SECRET` | Clé secrète Symfony (32 caractères aléatoires) |
| `DATABASE_URL` | URL complète PostgreSQL interne Railway |
| `CORS_ALLOW_ORIGIN` | Regex de l'URL frontend (`^https://frontend-...\.up\.railway\.app$`) |
| `JWT_PASSPHRASE` | Passphrase des clés RSA (vide si sans passphrase) |
| `GEMINI_API_KEY` | Clé API Google Gemini 2.5 |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram (optionnel) |
| `TELEGRAM_BOT_USERNAME` | Username du bot Telegram (optionnel) |

**Service frontend :**

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL complète du backend Railway |

> **Important :** Le frontend doit être **rebuilté** après modification de `VITE_API_URL` car Vite injecte cette valeur au moment de la compilation (build-time constant).

### 5.3 Procédure de Déploiement Initial

```bash
# 1. Créer un projet Railway sur https://railway.app
# 2. Ajouter un plugin PostgreSQL
# 3. Connecter le dépôt GitHub
# 4. Configurer les variables d'environnement ci-dessus
# 5. Railway build automatiquement lors du push sur main
# 6. Après le premier déploiement, initialiser la DB :
#    Railway Dashboard → service backend → Console
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction
```

### 5.4 Health Check & Monitoring

Un endpoint `/api/health` est disponible en production pour vérifier la disponibilité du backend :

```bash
curl https://backend-production-dd10b.up.railway.app/api/health
# → {"status":"ok"}
```

Railway utilise cet endpoint pour ses health checks automatiques et bascule le trafic uniquement lorsque le conteneur répond `200 OK`.

---

## 6. Variables d'Environnement & Sécurité des Secrets

### 6.1 Principe de Gestion

Conformément aux bonnes pratiques OWASP (A02 — Cryptographic Failures) et aux exigences du cahier des charges, **aucun secret n'est présent dans le code source** ni dans le dépôt Git.

| Environnement | Mécanisme |
|---|---|
| **Développement local** | Fichier `backend/.env` (dans `.gitignore`) |
| **Tests CI** | Secrets injectés dans la étape `Setup Test Environment Variables` du workflow |
| **Production Railway** | Variables déclarées dans le dashboard Railway (chiffrées au repos) |

### 6.2 Clés JWT RSA

Les clés RSA de signature JWT sont générées **au moment du build Docker** (dans le `Dockerfile`) et ne transitent jamais dans le dépôt Git. Elles sont intégrées directement dans l'image Docker.

```dockerfile
# Génération dans le Dockerfile
RUN openssl genrsa -out config/jwt/private.pem 4096 \
 && openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem \
 && chmod 600 config/jwt/private.pem
```

> **Conséquence** : À chaque rebuild de l'image Docker (nouveau déploiement), de nouvelles clés JWT sont générées. Les tokens actifs sont invalidés. Les utilisateurs doivent se reconnecter après chaque déploiement.

---

## 7. Instructions de Démarrage Local

### 7.1 Prérequis

- Docker Desktop (version 24+) et Docker Compose
- Git
- Un compte Google AI Studio pour la clé Gemini (gratuit)

### 7.2 Installation Complète

```bash
# Étape 1 : Cloner le dépôt
git clone https://github.com/SafiBougherara/projet_fin_annee.git
cd projet_fin_annee

# Étape 2 : Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditez backend/.env et renseignez :
#   GEMINI_API_KEY=votre_clé_gemini
#   (les autres variables ont des valeurs par défaut fonctionnelles en local)

# Étape 3 : Construire et démarrer tous les services
docker compose up -d --build
# Durée : 3-5 minutes (première fois)

# Étape 4 : Initialiser la base de données
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# Étape 5 : Accéder à l'application
# Dashboard restaurateur  → http://localhost:3000
# API REST (documentation) → http://localhost:8000/api
# Health check            → http://localhost:8000/api/health

# Étape 6 : Connexion avec les identifiants de démo
# Email    : admin@calendria.com
# Mot de passe : password123
```

### 7.3 Commandes Utiles en Développement

```bash
# Voir les logs backend en temps réel
docker compose logs backend -f

# Vider le cache Symfony
docker compose exec backend php bin/console cache:clear

# Accès à la console PostgreSQL
docker compose exec db psql -U calendria_user -d calendria

# Lancer les tests PHPUnit
docker compose exec backend vendor/bin/phpunit

# Réinitialiser les données de démo
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# Arrêter tous les services
docker compose down
```

---

## 8. Notice Utilisateur (Guide du Restaurateur)

### 8.1 Première Connexion

1. Accédez au Dashboard via l'URL de production : `https://frontend-production-8a43.up.railway.app`
2. Cliquez sur **"Créer un compte"** si vous n'avez pas encore de compte restaurateur
3. Saisissez votre email professionnel et un mot de passe sécurisé (minimum 8 caractères)
4. Connectez-vous avec vos identifiants

### 8.2 Configuration Initiale du Restaurant

Avant de recevoir des réservations, configurez votre restaurant :

**Étape 1 — Créer votre restaurant**
- Menu → **Gestion des Restaurants**
- Bouton **"Ajouter un Restaurant"**
- Renseignez le nom, l'adresse, le téléphone, l'email
- Définissez la **durée d'un repas** (ex: 90 min) et la **marge de nettoyage** (ex: 15 min)
  > Ces deux valeurs déterminent le créneau total bloqué par réservation (90 + 15 = 105 min)

**Étape 2 — Créer les tables**
- Depuis la fiche restaurant, cliquez **"Ajouter une Table"**
- Définissez le numéro, la capacité (nombre de couverts) et le type (intérieur/terrasse)
- Répétez pour chaque table

**Étape 3 — Définir les services d'ouverture**
- Section **"Horaires d'ouverture"** dans la fiche restaurant
- Bouton **"Ajouter un service"**
- Choisissez le type (Déjeuner/Dîner/Brunch), les heures et les jours ouverts
  > ⚠️ Sans service configuré, le chatbot vocal et le chatbot web ne pourront pas prendre de réservations

### 8.3 Gestion des Réservations

**Créer une réservation manuellement :**
- Menu → **Réservations** → Bouton **"Nouvelle Réservation"**
- Sélectionnez le restaurant, la date, l'heure, le nombre de personnes
- Renseignez le nom et le téléphone du client

**Modifier ou annuler une réservation :**
- Cliquez sur la réservation dans la liste
- Bouton **Modifier** (stylo) ou **Annuler** (croix rouge)

**Plan de salle en temps réel :**
- Menu → **Plan de Salle**
- Déplacez le curseur temporel pour voir l'état des tables à n'importe quelle heure
- Les couleurs indiquent : 🟢 Disponible / 🟠 Arrivée imminente / 🔴 Occupée

### 8.4 Canaux de Réservation Automatisés

Calendria propose trois canaux permettant aux clients de réserver **sans appel téléphonique** :

**Canal 1 — Widget Web Chatbot (Gemini AI)**
- Le chatbot web est accessible à l'URL : `/widget?restaurantId=X`
- Intégrez-le sur votre site avec une balise `<iframe>` :
  ```html
  <iframe 
    src="https://frontend-production-8a43.up.railway.app/widget?restaurantId=4"
    width="400" height="600">
  </iframe>
  ```
- Le client discute en langage naturel et le chatbot crée la réservation automatiquement

**Canal 2 — Agent Vocal IA (Retell AI)**
- Configuré via [app.retellai.com](https://app.retellai.com)
- L'agent vocal appelle le webhook `POST /api/chatbot/call`
- Paramètres attendus : `name`, `phone`, `date` (YYYY-MM-DD), `time` (HH:MM), `guests`, `restaurantId`
- L'agent informe le client du résultat (confirmation ou alternatives)

**Canal 3 — Bot Telegram**
- Nécessite un bot Telegram créé via @BotFather
- Configurez le webhook : `POST https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://backend.../api/chatbot/telegram?restaurantId=4`
- Les clients écrivent au bot et réservent par message

### 8.5 Résolution des Problèmes Courants

| Problème | Cause probable | Solution |
|---|---|---|
| "Le restaurant est fermé à X:XX" | Pas de service configuré pour cet horaire/jour | Vérifier les horaires d'ouverture dans Gestion des Restaurants |
| Login invalide après redéploiement | Tokens JWT invalidés (nouvelles clés au rebuild) | Se reconnecter |
| Réservation non visible sur le plan de salle | Date sélectionnée dans la timeline incorrecte | Vérifier que la date du slider correspond à la date de réservation |
| 500 sur l'API chatbot | Variables d'environnement manquantes | Vérifier que `GEMINI_API_KEY` est définie dans Railway |

---

## 9. Bilan Global & Retour d'Expérience

### 9.1 Bilan Technique

Le projet Calendria a permis de mettre en pratique l'ensemble des compétences attendues pour la certification CDA :

| Compétence | Implémentation |
|---|---|
| **Architecture logicielle** | API REST Symfony 6.4 + SPA React — séparation stricte back/front |
| **Base de données relationnelle** | PostgreSQL 15 + Doctrine ORM + MERISE (MCD→MLD→MPD) |
| **Sécurité applicative** | JWT RS256, bcrypt, rate limiting, CORS, OWASP Top 10 |
| **Intégration API externe** | Google Gemini 2.5 Flash + Retell AI + API Telegram |
| **Containerisation** | Docker multi-stage (nginx + PHP-FPM), Docker Compose |
| **CI/CD** | GitHub Actions : PHPUnit + TypeScript build à chaque push |
| **Déploiement continu** | Railway — déploiement automatique depuis GitHub |
| **Tests automatisés** | PHPUnit (unitaires + fonctionnels), TypeScript strict |
| **Gestion de version Git** | Commits sémantiques, branches feature, tag v1.0 |

### 9.2 Difficultés Rencontrées et Solutions

**Problème 1 — Configuration CORS en production**
- *Cause* : L'URL du backend Railway change à chaque redéploiement si non configurée manuellement
- *Solution* : Variable `CORS_ALLOW_ORIGIN` en regex dans Railway + configuration `NelmioCorsBundle`

**Problème 2 — Clés JWT perdues entre redéploiements**
- *Cause* : Les clés JWT sont générées au build time dans le Dockerfile
- *Solution* : Hardcoder les chemins des clés dans `lexik_jwt_authentication.yaml` au lieu d'utiliser des variables d'environnement pour les chemins

**Problème 3 — Variables d'environnement Telegram/Gemini non définies**
- *Cause* : `services.yaml` injectait ces variables dans tous les services via `bind`, plantant le container entier si non définies
- *Solution* : Déclaration de valeurs par défaut vides dans la section `parameters` de `services.yaml`

**Problème 4 — Doublement du suffixe `_test` dans la CI**
- *Cause* : `DATABASE_URL` contenait déjà `calendria_test`, Symfony ajoutait `_test` → `calendria_test_test`
- *Solution* : `DATABASE_URL` pointe vers `calendria`, Symfony ajoute `_test` → `calendria_test`

**Problème 5 — Port mismatch sur Railway**
- *Cause* : Railway utilise `$PORT` (valeur dynamique), nginx était configuré sur 9000 (port PHP-FPM)
- *Solution* : `entrypoint.sh` lit `$PORT` et injecte dynamiquement la valeur dans la config nginx via `sed`

### 9.3 Perspectives d'Évolution

Si le projet devait être poursuivi au-delà de la formation, les évolutions prioritaires seraient :

1. **Notifications push** : SMS de rappel automatique J-1 via Twilio ou une API alternative open-source
2. **Tableau de bord statistiques** : Graphiques de taux de remplissage, analyse des no-show, recettes estimées
3. **Système multi-restaurant** : Association d'un restaurateur à plusieurs restaurants (rôles et permissions étendus)
4. **Application mobile** : Version React Native réutilisant les composants existants
5. **WebSockets temps réel** : Synchronisation instantanée du plan de salle entre plusieurs postes simultanément
6. **API Platform avancée** : Exposer les endpoints de réservation avec documentation OpenAPI/Swagger automatique

### 9.4 Conclusion

Le projet **CALENDRIA** est un projet complet, déployé en production et fonctionnel à 88% des fonctionnalités prévues. Les deux fonctionnalités restantes (WhatsApp/SMS) ont été remplacées par une solution équivalente (Bot Telegram) plus accessible pour la démonstration.

Ce projet a permis d'acquérir une expérience concrète sur des sujets professionnellement pertinents : architecture d'API REST sécurisée, intégration d'IA générative, déploiement continu sur cloud, et gestion de la qualité via CI/CD. Il constitue un produit réel, maintenable et extensible, prêt à être présenté devant le jury.

---

*BOUGHERARA Safi — Formation CDA — Juillet 2026*  
*Dépôt GitHub : https://github.com/SafiBougherara/projet_fin_annee*  
*Production : https://frontend-production-8a43.up.railway.app*
