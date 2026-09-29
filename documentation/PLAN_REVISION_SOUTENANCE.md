# PLAN DE RÉVISION — Soutenance CALENDRIA

> **Règle du jeu :** on ne coche une case que si tu sais l'expliquer **à voix haute, sans notes**.
> Un bloc n'est validé que si tu as **10/10** au quiz. Sinon on recommence le bloc.

**Progression globale :** 0 / 13 blocs validés

---

## Chiffres et faits à connaître par cœur

À réciter sans hésiter — le jury teste souvent ça en ouverture.

- [ ] Symfony **6.4 LTS** (support jusqu'en nov. 2027) — *pas* Symfony 7
- [ ] PHP **8.4** dans le conteneur Docker
- [ ] React **19** + TypeScript + Vite + Material UI
- [ ] PostgreSQL **15**
- [ ] 6 entités : `User`, `Client`, `Restaurant`, `Table`, `Service`, `Reservation`
- [ ] 4 canaux de réservation : back-office, widget web, Telegram, agent vocal
- [ ] Durée d'occupation d'une table = `dureeRepas (90) + bufferNettoyage (15)` = **105 min**
- [ ] IA utilisée : **Google Gemini 2.5 Flash**
- [ ] Session chatbot en cache : **30 min** (1800 s)
- [ ] Rate limiting login : **5 tentatives / 15 min** par IP
- [ ] 4 conteneurs Docker : `db`, `backend`, `frontend`, `adminer`
- [ ] CI GitHub Actions : **2 jobs** (backend PHPUnit, frontend build)

---

# AXE 1 — CONCEPTION

## Bloc 1.1 — Architecture globale

**Savoir expliquer :**
- [ ] Les 3 tiers (présentation / traitement / données) et la techno de chacun
- [ ] Ce que veut dire « **découplé** » et pourquoi c'est un avantage ici
- [ ] Ce que veut dire « **stateless** » et ce que serait l'alternative (sessions serveur)
- [ ] Pourquoi une **API REST** plutôt qu'un site Twig classique (2 raisons liées au projet)
- [ ] Tracer le chemin complet d'une réservation Telegram jusqu'à PostgreSQL, fichier par fichier
- [ ] Justifier que le plan de salle recalcule des couleurs côté React (affichage ≠ décision)

**Savoir dessiner au tableau :**
- [ ] Le schéma React → Symfony → PostgreSQL avec les 3 autres canaux greffés

**Validation :** - [ ] Quiz 1.1 réussi 10/10 — date : ______

---

## Bloc 1.2 — POO (concepts)

**Savoir définir en une phrase chacun :**
- [ ] Classe vs objet (instance)
- [ ] Propriété vs méthode
- [ ] `public` / `protected` / `private` (encapsulation)
- [ ] Constructeur + promotion de propriétés PHP 8
- [ ] Interface — et pourquoi on type sur une interface plutôt qu'une classe
- [ ] Héritage (`extends AbstractController`) — qu'est-ce que ça t'apporte concrètement
- [ ] Implémentation (`implements UserInterface`) — la différence avec `extends`
- [ ] Injection de dépendances + autowiring Symfony
- [ ] Namespace + autoload PSR-4 (`use` → chemin dans `vendor/`)

**Savoir montrer un exemple dans TON code pour chaque :**
- [ ] Une interface → `UserPasswordHasherInterface` dans `AuthController`
- [ ] Un héritage → `class AuthController extends AbstractController`
- [ ] Une implémentation → `class User implements UserInterface`
- [ ] De l'encapsulation → propriétés `private` + getters/setters dans les entités
- [ ] De l'injection → le constructeur de `DisponibiliteService`

**Validation :** - [ ] Quiz 1.2 réussi 10/10 — date : ______

---

## Bloc 1.3 — Backend : organisation Symfony

**Savoir expliquer le rôle de chaque dossier :**
- [ ] `src/Controller/` — reçoit la requête HTTP, valide, renvoie du JSON
- [ ] `src/Entity/` — le modèle de données (mappé aux tables)
- [ ] `src/Repository/` — les requêtes de lecture
- [ ] `src/Service/` — la logique métier
- [ ] `src/EventSubscriber/` — branchements sur le cycle de vie de la requête
- [ ] `src/DataFixtures/` — jeu de données de démo
- [ ] `config/packages/` — configuration des bundles
- [ ] `migrations/` — historique du schéma de BDD

**Savoir justifier :**
- [ ] Pourquoi `DisponibiliteService` est un **service** et pas du code dans le contrôleur
  (réutilisé par 4 canaux + testable unitairement)
- [ ] Pourquoi tu sérialises le JSON à la main dans `ReservationController`
  (éviter les références circulaires restaurant ↔ table)
- [ ] Le pattern **MVC** et où est le « V » dans une API (réponse : il est dans React)

**Savoir naviguer instantanément :**
- [ ] Ouvrir le fichier de l'algorithme de disponibilité en < 5 secondes
- [ ] Ouvrir le fichier du chatbot en < 5 secondes

**Validation :** - [ ] Quiz 1.3 réussi 10/10 — date : ______

---

## Bloc 1.4 — Base de données

**Savoir expliquer :**
- [ ] La différence MCD / MLD / MPD (tes fichiers sont dans `documentation/Jalon3/`)
- [ ] Le rôle d'un **ORM** et ce que Doctrine t'évite d'écrire
- [ ] Les relations de ton schéma :
  - `Restaurant` 1—N `Table`
  - `Restaurant` 1—N `Service`
  - `Client` 1—N `Reservation`
  - `Table` 1—N `Reservation` (nullable)
- [ ] `OneToMany` / `ManyToOne` : qui porte la clé étrangère (le côté `ManyToOne`)
- [ ] `orphanRemoval: true` sur les tables d'un restaurant
- [ ] Pourquoi `table_reservee_id` est nullable (choix métier, pas technique)
- [ ] Pourquoi `User` et `Client` sont deux tables distinctes
- [ ] Pourquoi `` `table` `` et `` `user` `` sont entre backticks (mots réservés SQL)
- [ ] À quoi sert une **migration** et la commande pour la jouer

**Savoir traduire en SQL :**
- [ ] `findOneBy(['email' => $x])` → `SELECT ... WHERE email = ? LIMIT 1`
- [ ] Le `createQueryBuilder` de `DisponibiliteService` → le SELECT équivalent

**Validation :** - [ ] Quiz 1.4 réussi 10/10 — date : ______

---

## Bloc 1.5 — Frontend React

**Savoir définir :**
- [ ] Un **composant** (fonction qui retourne du JSX)
- [ ] **JSX** (syntaxe qui mélange HTML et JS, compilée par Vite)
- [ ] **Props** vs **state** — la différence fondamentale
- [ ] `useState` — pourquoi on ne modifie jamais une variable directement
- [ ] `useEffect` — à quoi sert le tableau de dépendances `[]`
- [ ] `useMemo` — pourquoi tu l'utilises pour `sortedReservations`
- [ ] **SPA** et rôle de React Router (pas de rechargement de page)
- [ ] Ce qu'est un **intercepteur axios**

**Savoir montrer dans TON code :**
- [ ] Un `useState` → `Dashboard.tsx`
- [ ] Un `useEffect` de chargement initial → `Dashboard.tsx`
- [ ] Un composant réutilisable → `PrivateRoute` dans `App.tsx`
- [ ] Le rendu conditionnel → `{error && <Alert .../>}`
- [ ] Une liste avec `key` → `.map()` sur les réservations, et **pourquoi `key` est obligatoire**

**Savoir justifier :**
- [ ] Pourquoi TypeScript plutôt que JavaScript
- [ ] Pourquoi Vite plutôt que Create React App
- [ ] Pourquoi Material UI

**Validation :** - [ ] Quiz 1.5 réussi 10/10 — date : ______

---

# AXE 2 — SÉCURITÉ

## Bloc 2.1 — Authentification JWT

**Savoir expliquer :**
- [ ] Les 3 parties d'un JWT : `header.payload.signature`
- [ ] Que le payload est **lisible par tous** (base64, pas chiffré)
- [ ] Que c'est la **signature** qui protège (clé privée RSA du serveur)
- [ ] Pourquoi on ne peut pas se donner `ROLE_ADMIN` en modifiant le token
- [ ] Où est stocké le token côté client (`localStorage`, dans `auth.service.ts`)
- [ ] Qui l'ajoute aux requêtes (l'intercepteur de `services/api.ts`)
- [ ] Le format de l'en-tête : `Authorization: Bearer <token>`
- [ ] Pourquoi `AuthController::login()` a un corps vide

**Savoir lire `config/packages/security.yaml` :**
- [ ] Le rôle d'un **firewall** et pourquoi tu en as 6
- [ ] Pourquoi `register`, `health` et `chatbot` ont `security: false`
- [ ] Ce que fait `access_control` et pourquoi l'ordre des lignes compte
- [ ] `stateless: true` — le lien avec l'architecture

**Savoir répondre :**
- [ ] « Un token volé, vous faites quoi ? » (durée de vie courte, HTTPS, révocation impossible = limite assumée)
- [ ] « Pourquoi localStorage et pas un cookie httpOnly ? » (connaître le compromis XSS vs CSRF)

**Validation :** - [ ] Quiz 2.1 réussi 10/10 — date : ______

---

## Bloc 2.2 — Mots de passe

**Savoir expliquer :**
- [ ] Hachage ≠ chiffrement (irréversible vs réversible)
- [ ] Le rôle du **sel** et pourquoi il n'y a pas de colonne `salt` en base
- [ ] Ce que veut dire l'algorithme `auto` dans `security.yaml`
- [ ] Pourquoi le mot de passe n'est jamais renvoyé dans la réponse JSON
- [ ] Pourquoi `cost: 4` en environnement de test uniquement
- [ ] À quoi sert `PasswordUpgraderInterface` dans `UserRepository`

**Validation :** - [ ] Quiz 2.2 réussi 10/10 — date : ______

---

## Bloc 2.3 — OWASP : les attaques et tes parades

**Pour chaque attaque, savoir nommer TA parade :**
- [ ] **Injection SQL** → Doctrine prépare les requêtes, aucune concaténation
- [ ] **XSS** → React échappe le JSX automatiquement
- [ ] **Bruteforce** → `LoginRateLimiterSubscriber`, 5 essais / 15 min, HTTP 429
- [ ] **Accès non autorisé** → firewall JWT + `access_control`
- [ ] **CSRF** → sans objet : API stateless avec token en en-tête, pas de cookie de session
- [ ] **CORS** → `nelmio_cors.yaml`, origines restreintes par regex
- [ ] **Énumération de comptes** → limite assumée : `/api/register` révèle qu'un email existe (409)

**Savoir expliquer :**
- [ ] Ce qu'est CORS et pourquoi le navigateur bloquerait sans cette config
- [ ] Pourquoi `allow_credentials: false` est cohérent avec ton usage du JWT

**Validation :** - [ ] Quiz 2.3 réussi 10/10 — date : ______

---

## Bloc 2.4 — Secrets et failles assumées

**Savoir expliquer :**
- [ ] Le rôle de `.env` vs `.env.example` (l'un est ignoré par git, l'autre est le modèle)
- [ ] Où sont les clés JWT et pourquoi `config/jwt/*.pem` est dans `.gitignore`
- [ ] Comment les clés d'API (Gemini, Telegram) arrivent dans le code
  (`config/services.yaml` → `bind:` → variables d'environnement)
- [ ] Pourquoi le token Telegram ne sort jamais du serveur (seul le *username* est exposé)

**Failles à assumer AVANT que le jury ne les trouve :**
- [ ] `APP_SECRET: change_me_in_production` et mot de passe DB en clair dans `docker-compose.yml`
      → assumer : « fichier de développement local uniquement, en production Railway injecte les vraies valeurs »
- [ ] `APP_ENV: dev` dans `docker-compose.yml` → le profiler serait exposé en production
- [ ] Les clés JWT sont **régénérées à chaque build Docker** → tous les tokens sont invalidés au redéploiement
      → correctif : monter les clés en volume ou les injecter par variable d'environnement
- [ ] Pas de verrou transactionnel sur la création de réservation → double réservation théoriquement possible
      → correctif : verrou pessimiste Doctrine ou contrainte d'unicité en base

**Validation :** - [ ] Quiz 2.4 réussi 10/10 — date : ______

---

# AXE 3 — DEVOPS

## Bloc 3.1 — Docker : les fondamentaux

**Savoir définir :**
- [ ] **Image** vs **conteneur** (le moule vs le gâteau)
- [ ] `Dockerfile` — la recette de l'image
- [ ] Une **couche** (layer) et pourquoi l'ordre des instructions compte pour le cache
- [ ] Pourquoi `alpine` (image minimale, surface d'attaque réduite)
- [ ] `EXPOSE` vs `ports:` dans compose

**Savoir expliquer TON `docker/backend/Dockerfile` :**
- [ ] Pourquoi copier `composer.json` **avant** le code source (optimisation du cache)
- [ ] Pourquoi `--no-dev --optimize-autoloader`
- [ ] Ce que fait **supervisord** (lance nginx ET php-fpm dans le même conteneur)
- [ ] Le rôle de `entrypoint.sh` (config nginx dynamique avec `$PORT`, warmup du cache)

**Savoir expliquer TON `docker/frontend/Dockerfile` :**
- [ ] Ce qu'est un **build multi-stage** et pourquoi c'est ton meilleur argument DevOps
      (stage 1 = node compile ; stage 2 = nginx sert des fichiers statiques → image finale ~20 Mo sans Node)
- [ ] Pourquoi `try_files $uri /index.html` (sinon React Router renvoie des 404)

**Validation :** - [ ] Quiz 3.1 réussi 10/10 — date : ______

---

## Bloc 3.2 — docker-compose

**Savoir expliquer :**
- [ ] Le rôle de chacun de tes 4 services : `db`, `backend`, `frontend`, `adminer`
- [ ] Ce qu'est un **volume** et pourquoi `db_data` est indispensable (persistance)
- [ ] La différence entre un volume nommé et un bind mount (`./backend:/var/www/html`)
- [ ] L'astuce `- /app/node_modules` dans le service frontend (et pourquoi elle est nécessaire)
- [ ] Le **réseau** `calendria_network` et pourquoi le backend écrit `@db:5432` et non `localhost`
- [ ] `depends_on` — et sa limite (n'attend pas que Postgres soit *prêt*, seulement *démarré*)
- [ ] Le rôle de `docker/database/init.sql`
- [ ] Les commandes : `docker compose up -d`, `logs -f`, `down -v`

**Validation :** - [ ] Quiz 3.2 réussi 10/10 — date : ______

---

## Bloc 3.3 — CI/CD

**Savoir expliquer `.github/workflows/ci.yml` :**
- [ ] Ce que veut dire **CI** et **CD**
- [ ] Les déclencheurs : `push` et `pull_request` sur `main`/`master`/`develop`
- [ ] Le job **backend** : service PostgreSQL éphémère → install → génération des clés JWT → migrations → PHPUnit
- [ ] Le job **frontend** : install → `npm run build` (qui fait aussi le typecheck TypeScript)
- [ ] Pourquoi les 2 jobs tournent **en parallèle**
- [ ] À quoi sert le cache Composer / npm (temps de build)
- [ ] Pourquoi on génère des clés JWT **jetables** dans la CI
- [ ] Le rôle du `healthcheck` `pg_isready` sur le service postgres

**Savoir répondre :**
- [ ] « Que se passe-t-il si un test échoue ? » (le job est rouge, la PR est bloquée)
- [ ] « Votre CI déploie-t-elle ? » (non, elle valide ; le déploiement est déclenché par Railway sur push)

**Validation :** - [ ] Quiz 3.3 réussi 10/10 — date : ______

---

## Bloc 3.4 — Déploiement

**Savoir expliquer :**
- [ ] Où est hébergé le projet (Railway) et pourquoi ce choix
- [ ] Comment Railway injecte le port (`$PORT`) et comment `entrypoint.sh` s'y adapte
- [ ] Comment les variables d'environnement de production sont fournies (pas de `.env` en prod)
- [ ] Pourquoi `VITE_API_URL` est un **ARG de build** côté frontend
      (Vite compile la valeur en dur dans le bundle → elle doit être connue au build, pas au runtime)
- [ ] Comment tu joues les migrations en production
- [ ] La différence `APP_ENV=dev` / `APP_ENV=prod` (profiler, cache, performances)

**Validation :** - [ ] Quiz 3.4 réussi 10/10 — date : ______

---

# ÉPREUVE FINALE

- [ ] **Oral blanc complet** : 15 questions tirées au hasard dans les 3 axes, 10/15 minimum
- [ ] **Navigation chronométrée** : 8 fichiers à ouvrir sur demande, < 10 s chacun
- [ ] **Démo à blanc** sans plantage, du login jusqu'à la réservation Telegram
- [ ] **Les 4 failles** énoncées spontanément avec leur correctif

---

## Journal de session

| Date | Bloc travaillé | Score | À revoir |
|---|---|---|---|
| 23/09 | Quiz de positionnement | 9/25 | JWT, calcul 105 min, rôle PHP vs IA |
| | | | |
