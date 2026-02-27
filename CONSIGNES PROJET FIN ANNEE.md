# 📋 Cahier des Charges Technique – Projet Fil Rouge
### CDA – Concepteur Développeur d'Applications

---

## Table des matières

1. [Contexte et Objectifs du Projet](#1-contexte-et-objectifs-du-projet)
2. [Contraintes Techniques et Socle Technologique Imposé](#2-contraintes-techniques-et-socle-technologique-imposé)
3. [Méthodologie et Organisation du Projet](#3-méthodologie-et-organisation-du-projet)
4. [Calendrier des Jalons et Livrables Attendus](#4-calendrier-des-jalons-et-livrables-attendus)
   - [Jalon 1 – Janvier : Cahier des Charges Fonctionnel](#jalon-1--janvier--cahier-des-charges-fonctionnel)
   - [Jalon 2 – Février : Méthodologie de Projet & Conception UI/UX](#jalon-2--février--méthodologie-de-projet--conception-uiux)
   - [Jalon 3 – Mars : Modélisation de la Base de Données](#jalon-3--mars--modélisation-de-la-base-de-données)
   - [Jalon 4 – Avril : Conception de l'Application & Architecture](#jalon-4--avril--conception-de-lapplication--architecture)
   - [Jalon 5 – Mai : Développement, Sécurité & Tests (version Bêta)](#jalon-5--mai--développement-sécurité--tests-version-bêta)
   - [Jalon 6 – Juin : Déploiement et Mise en Production (Livrable final)](#jalon-6--juin--déploiement-et-mise-en-production-livrable-final)
5. [Modalités de Remise des Livrables](#5-modalités-de-remise-des-livrables)

---

## 1. Contexte et Objectifs du Projet

Dans le cadre de la formation CDA, chaque apprenant réalisera un **projet fil rouge individuel sur 6 mois** (janvier à juin). L'objectif est de mener un projet complet, de l'idée initiale jusqu'au produit final, qui sera présenté devant un jury en fin de formation. Ce projet doit permettre de mettre en pratique l'ensemble des compétences acquises :

- Analyse du besoin
- Conception
- Développement front-end et back-end
- Base de données
- Tests
- Déploiement

> **Ce cahier des charges technique** définit les exigences techniques et les étapes clés du projet. Il se concentre sur **"comment"** réaliser le projet (choix d'architecture, de technologies, contraintes à respecter), tandis que le **Cahier des Charges Fonctionnel (CDCF)** décrira **"quoi"** réaliser.

**Organisation générale :** Le projet est découpé en **6 jalons mensuels** (fin de chaque mois, de janvier à juin). Pour chaque jalon, des livrables précis sont attendus. Les travaux sont **individuels**, bien que l'entraide soit encouragée. Le respect des échéances est crucial.

---

## 2. Contraintes Techniques et Socle Technologique Imposé

> ⚠️ Le socle technologique est **imposé** pour tous les apprenants — vous n'avez pas le choix des technologies principales. Vous devrez **justifier vos choix d'implémentation** dans le CDCF à l'aide d'une courte analyse comparative.

### 2.1 Back-end

- **Framework obligatoire : Symfony (PHP)** — version récente LTS de préférence.
- Deux options possibles :
  - **Application full-stack Symfony** : Symfony gère le back-end et le front avec Twig.
  - **API Symfony RESTful** + front-end séparé (React ou Angular).
- Indiquer dans le CDCF le choix retenu et sa justification.

### 2.2 Front-end

- **Option full Symfony** : Twig/HTML, CSS (framework CSS au choix, ex. Bootstrap), JavaScript.
- **Option front séparé** : Single Page Application en **React** ou **Angular** (dernière version stable).
- Dans **tous les cas** : interface **responsive** (desktop + mobile), soignée en termes d'UX/UI (charte graphique cohérente, ergonomie travaillée).

### 2.3 Base de Données

- **SGBD relationnel obligatoire** : MySQL/MariaDB, PostgreSQL ou SQL Server.
- **NoSQL exclu.**
- Schéma conçu et normalisé (méthode MERISE), implémenté via un ORM (ex. Doctrine) ou SQL.

### 2.4 API Externe

- Intégrer **au moins une API tierce externe** (ex. Google Maps, OpenWeatherMap, OAuth Google/Facebook, API de paiement…).
- Gérer les clés d'API de manière **sécurisée** : variables d'environnement uniquement, jamais codées en dur.

### 2.5 Containerisation (Docker)

- Le projet devra être **dockerisé**.
- Fournir des conteneurs Docker pour l'application (serveur web + PHP, base de données, etc.).
- Utiliser **Docker Compose** pour orchestrer les services.
- Avantages attendus : uniformité des environnements dev/test/prod, reproductibilité, automatisation du déploiement.

### 2.6 Contrôle de Version (Git)

- Héberger le code sur **GitHub ou GitLab** (repo privé ou public).
- Stratégie de versionnement professionnelle :
  - Travailler sur des **branches** (par fonctionnalité, `develop`/`main`, etc.).
  - Merger via des **pull requests** si possible.
  - Commits **fréquents, significatifs**, messages clairs.

### 2.7 Intégration Continue (CI)

- Mettre en place une **pipeline CI** (ex. GitHub Actions ou GitLab CI).
- À chaque push : lancer **tests automatiques** + build/packaging.
- Objectif : identifier rapidement les bugs après chaque commit, éviter les régressions.

### 2.8 Déploiement Continu (CD)

- Compléter la CI par un volet **CD** (Continuous Delivery/Deployment) si possible.
- La pipeline peut bâtir une image Docker et la déployer automatiquement.
- **Minimum attendu** : fournir une **procédure claire de mise en production** (script de déploiement ou commandes Docker).

### 2.9 Tests Automatisés

Le projet doit comporter des tests à plusieurs niveaux :

- **Tests unitaires** : sur les composants métier, utils, etc. (ex. PHPUnit).
- **Tests fonctionnels / d'intégration** : simulateurs de requêtes HTTP, tests API/contrôleurs, tests end-to-end sur le front (Jest, Selenium…).
- **Autres** (appréciés si pertinents) : tests de performance, tests de sécurité, tests d'UI.

### 2.10 Sécurité

L'application doit respecter les **bonnes pratiques OWASP** :

| Vulnérabilité | Mesure requise |
|---|---|
| **Injection SQL** | Requêtes préparées ou ORM (Doctrine) — jamais d'entrées utilisateur insérées directement |
| **XSS** | Échapper toutes les sorties via Twig (par défaut Twig échappe les variables) |
| **CSRF** | Tokens CSRF de Symfony sur les formulaires sensibles (natif Symfony) |
| **Authentification** | Mots de passe hachés (bcrypt/Argon2), jamais en clair. Politique de mot de passe sérieuse. Limiter les tentatives de connexion (brute force) |
| **Données personnelles (RGPD)** | Transparence sur la collecte, droit à la suppression, stockage sécurisé, politique de confidentialité |

### 2.11 Architecture Logicielle

- Adopter une **architecture multi-couche** propre (pattern **MVC** pour la partie logicielle, architecture **n-tiers** pour le déploiement).
- Respecter la séparation des responsabilités : vue / contrôleur / modèle, couche API / métier / accès aux données.
- Suivre les **bonnes pratiques** : lisibilité, modularité, DRY/KISS, conventions PSR pour PHP.
- Documenter ces aspects dans les livrables de conception.

---

## 3. Méthodologie et Organisation du Projet

### 3.1 Méthode de Gestion de Projet

- **Approche agile recommandée** (Scrum/Kanban) — adaptée aux livraisons mensuelles itératives.
- Approche classique (cycle en V) acceptée si justifiée.
- Si Scrum : vous êtes à la fois Product Owner, Scrum Master et Développeur.
- **Définir dès le début un planning prévisionnel** et le mettre à jour au fil de l'avancement.

### 3.2 Planning et Suivi

- Réaliser un **diagramme de Gantt** global (phases du projet + dates de rendus).
- Tenir un **tableau Kanban** (Trello, Jira, GitHub Projects…) : tâches à faire / en cours / terminées.
- Identifier les tâches critiques et leurs échéances.
- Anticiper du temps pour les imprévus et les tests.

### 3.3 Gestion de Configuration et Branches Git

Adopter une organisation claire inspirée de GitFlow (ou variante simplifiée) :

- `main` / `master` : versions stables (livrables aux jalons).
- `develop` : intégration des fonctionnalités en cours avant stabilisation.
- Branches `feature/xxx` : une par fonctionnalité ou user story, fusionnées une fois terminées et testées.
- Messages de commit **explicites**.
- Versionner aussi les fichiers de configuration (Docker, CI, etc.).

### 3.4 Outils de Collaboration

- Utiliser les **issues GitHub/GitLab** pour tracer les fonctionnalités et bugs.
- Utiliser le **README du repo** pour documenter l'installation.
- Documenter les choix techniques tout au long du projet (traces pour la soutenance).

### 3.5 DevOps – CI/CD

- Planifier et décrire la pipeline CI/CD dès le cahier des charges.
- Choisir la plateforme (GitHub Actions, GitLab CI…) et décrire les étapes automatisées.
- Implémenter progressivement ces automatisations au fil des jalons.

> **Synthèse :** Soyez organisé et proactif. Suivez les jalons pour éviter l'effet "tunnel". Documentez bien à chaque étape et conservez les traces (commits Git, documentation des choix) pour justifier vos décisions lors de la soutenance.

---

## 4. Calendrier des Jalons et Livrables Attendus

> Les livrables sont à remettre via **Microsoft Teams (section Devoirs)** avant le dernier jour ouvrable du mois concerné. Format général : **PDF** pour les documents, **lien Git** pour le code.

---

### Jalon 1 – Janvier : Cahier des Charges Fonctionnel

**Échéance :** 31/01/2026 (dernier jour ouvrable de janvier)

**Livrable :** Cahier des charges fonctionnel (document PDF)

Ce document correspond au **chapitre III du rapport final** et doit inclure :

#### a) Contexte métier
- Présenter le sujet choisi pour l'application.
- Décrire le domaine/secteur d'activité, le problème à résoudre, le besoin auquel répond l'application.
- Identifier les utilisateurs cibles.

#### b) Objectifs du projet
- Énoncer clairement les objectifs principaux (fonctionnalités permises, bénéfices apportés).
- Formuler en bullet points.
- Les objectifs doivent être **SMART** (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis).

#### c) Périmètre fonctionnel (exigences fonctionnelles)
- Lister les **fonctionnalités attendues** sous forme de liste numérotée.
- Décrire chaque fonctionnalité orientée "besoin utilisateur" (pas encore technique).
- Indiquer ce qui est hors scope si pertinent.

#### d) Exigences techniques
- Indiquer le choix d'architecture : full Symfony (Twig) ou API Symfony + front React/Angular.
- Préciser les composants : PHP 8+, Symfony, framework front si applicable, SGBD choisi, Docker, etc.
- **Justifier brièvement** ces choix par rapport aux besoins du projet (benchmark rapide si hésitation).
- Lister les contraintes imposées : Docker, CI/CD, tests, sécurité.
- Mentionner les attentes de qualité : code maintenable, normes PSR, documentation.

#### e) Contraintes et enjeux du projet
- Contraintes temporelles : 6 mois, jalons mensuels, temps disponible par semaine.
- Contraintes réglementaires ou normatives liées au sujet (RGPD, PCI-DSS, etc.).
- **Risques majeurs identifiés** et hypothèses prises.
- **Critères de succès** : comment saura-t-on que le projet est une réussite ?

> Ce CDCF sera votre référence fonctionnelle tout au long du développement. Il doit être **validé par le formateur** avant d'entamer la conception détaillée.

---

### Jalon 2 – Février : Méthodologie de Projet & Conception UI/UX

**Échéance :** 28/02/2026 (dernier jour ouvrable de février)

**Livrables :** Deux documents (combinables ou séparés) :
1. Documentation de méthodologie et organisation du projet (PDF)
2. Livrables de conception UX/UI (maquettes, PDF, etc.)

Ces livrables correspondent aux **chapitres IV et V du rapport final**.

---

#### Document 1 — Méthodologie et Organisation (Gestion de projet)

##### a) Méthode de gestion de projet
- Préciser la méthodologie adoptée (Agile Scrum, Kanban, cycle en V) et la **justifier**.
- Expliquer comment vous l'adaptez en solo (ex. sprints allégés, journal de bord).

##### b) Planning (macro-planning)
- Fournir un **planning global jusqu'en juin**.
- Idéalement un **diagramme de Gantt** avec les grandes phases et jalons.
- Indiquer les principales tâches par phase (ex. février : Design UI/UX, mars : Modélisation BD, etc.).

##### c) Outils de suivi
- Décrire le système de suivi de l'avancement (Trello, issues GitLab, etc.).
- Mentionner la fréquence des mises à jour et révisions du planning.

##### d) Gestion du code source (Git)
- Présenter la **stratégie de versioning Git** (branches `main`, `develop`, `feature/xxx`).
- Expliquer la gestion des merges et éventuellement des revues de code.
- Si le dépôt Git est déjà initialisé : mentionner le lien et les premiers commits.

##### e) CI/CD planifié
- Décrire le plan de pipeline CI/CD (même si non encore implémenté).
- Indiquer les outils prévus (ex. GitHub Actions, Docker Hub).
- Décrire les étapes envisagées (ex. tests PHPUnit + ESLint à chaque push, déploiement Docker auto à partir de mai).

> **Astuce :** Structurer ce document en sous-parties 4.a, 4.b, 4.c du CDC technique pour être sûr de tout couvrir.

---

#### Document 2 — Conception UX/UI

##### a) Zoning / Sitemap
- Schéma de zoning (disposition des zones principales à l'écran) ou plan de site (pages/écrans + navigation entre eux).

##### b) Wireframes (maquettes fil de fer)
- Maquettes **basse fidélité** (noir et blanc) pour les principales pages.
- Définissent l'agencement des éléments sans le design final (menus, boutons, champs, structure).
- Outils possibles : Figma, Balsamiq, Adobe XD, ou dessin numérisé.
- Couvrir les **écrans clés** : accueil, liste, détail, formulaires principaux + version mobile si pertinent.

##### c) Charte graphique
- **Couleurs** principales et secondaires (avec codes hexadécimaux).
- **Polices** de caractères (titres, texte courant).
- Style d'icônes/illustrations, ton général (moderne, épuré, professionnel…).
- Justifier les choix en quelques phrases.

##### d) Maquettes graphiques haute fidélité
- Mockups/prototypes représentant l'apparence finale pour **au moins 2 écrans** :
  - Un écran en version **desktop**
  - Le même en version **mobile** (pour démontrer la responsivité)
- Appliquer la charte graphique définie.
- Outils : Figma, Adobe XD, Sketch ou autre.
- Intégrer les images dans le PDF ou fournir un lien Figma.

##### e) Prototype (optionnel)
- Prototype cliquable (Figma, Adobe XD) simulant quelques interactions de navigation.
- Non obligatoire, mais constitue un plus pour valider l'ergonomie.

##### f) Considérations UX
- Notes sur les choix UX : simplicité, accessibilité, parcours utilisateur fluide.
- Mention de principes appliqués : Mobile First, retours visuels clairs (messages validation/erreur), etc.

> Au terme du jalon 2, tous les aspects "design" et "organisation" doivent être validés avant de démarrer réellement le développement.

---

### Jalon 3 – Mars : Modélisation de la Base de Données

**Échéance :** 31/03/2026 (dernier jour ouvrable de mars)

**Livrable :** Dossier de conception de la base de données (PDF avec schémas + explications)

Ce livrable correspond au **chapitre VI du rapport final**. Suivre la démarche **MERISE** (ou UML équivalent).

#### a) Introduction à la méthode (MERISE)
- Rappeler brièvement la démarche : MCD → MLD → MPD.
- Expliquer que cette progression du conceptuel vers le physique assure que la base répond aux besoins fonctionnels.

#### b) Dictionnaire des données
- Tableau listant toutes les **entités** identifiées avec :
  - Nom de l'entité
  - Attributs et leur signification
  - Type de donnée attendu (sans encore aller jusqu'au type SQL précis)

#### c) Modèle Conceptuel de Données (MCD)
- Diagramme **Entité-Association complet** :
  - Toutes les entités métiers du domaine
  - Associations avec **cardinalités** (0,1,N) clairement indiquées
  - Entités associatives si nécessaire
- Outils : MySQL Workbench, PowerAMC, Dia, LucidChart, etc.
- Bonne résolution, lisible, intégré dans le PDF.

#### d) Modèle Logique de Données (MLD)
- Traduction du MCD en **modèle relationnel** (tables).
- Pour chaque table : nom, clé primaire, attributs avec types génériques, clés étrangères.
- Format : textuel ou diagramme relationnel.
- Exemple : `UTILISATEUR (id_utilisateur PK, nom, prenom, email, mot_de_passe, …)`
- Vérifier : toutes les entités MCD → tables, associations correctement transformées, contraintes d'intégrité (unicités, NOT NULL, etc.).

#### e) Modèle Physique de Données (MPD)
- Schéma **pour le SGBD choisi** :
  - Types de colonnes SQL concrets + taille des champs si applicable
  - Index
- Format : script SQL de création (`CREATE TABLE` commentés) ou tableau colonnes/types SQL.
- Tenir compte des spécificités du SGBD (ex. `SERIAL` sur PostgreSQL, moteur InnoDB sur MySQL).

#### f) Justifications et vérification
- Expliquer en quelques lignes comment le modèle répond aux besoins fonctionnels.
- Mentionner les choix de modélisation particuliers.
- Vérifier l'élimination des redondances (**3NF** en général).

> Au terme du jalon 3, la conception de la base de données doit être finalisée et validée. Elle sert de fondation pour le développement back-end. Tester la cohérence en créant la base réelle et en insérant des données factices.

---

### Jalon 4 – Avril : Conception de l'Application & Architecture

**Échéance :** 30/04/2026 (dernier jour ouvrable d'avril)

**Livrable :** Dossier de conception technique (PDF avec schémas UML + description d'architecture)

Ce livrable correspond aux **chapitres VII et VIII du rapport final**. En parallèle, le développement back-end et front-end commence.

#### a) Diagrammes de cas d'utilisation (Use Case UML)
- Vue d'ensemble des interactions utilisateurs-système.
- Identifier tous les **acteurs** (utilisateur, admin, etc.).
- Chaque fonctionnalité du CDCF doit être représentée par **au moins un use case**.
- Inclure les relations `include`/`extend` si pertinentes (non obligatoires).

#### b) Diagrammes de séquence
- Choisir **2 à 3 cas d'utilisation principaux** et les détailler en séquences.
- Illustrer l'enchaînement des messages entre composants (UI → Contrôleur → Service → Repository → BDD).
- Montrer les échanges front-end / back-end (appels API si application séparée).
- Respecter la syntaxe UML (boucles, alternatives si nécessaires).

#### c) Diagramme de classes
- Couvrir les **principales classes back-end** (et éventuellement front).
- Se concentrer sur les **classes métier** et leurs relations (association, composition, agrégation, héritage).
- Inclure cardinalités sur les associations.
- Utiliser des **packages UML** pour montrer la séparation en couches (Controllers, Services, Entities/Models).
- Partir du MCD/MLD comme base pour les entités ORM, puis ajouter les classes de logique applicative.

#### d) Description de l'architecture multi-couches

##### Pattern MVC
- Décrire comment MVC est implémenté avec Symfony :
  - Contrôleurs : reçoivent les requêtes, préparent les données
  - Services (dossier `src/Service`) : encapsulent la logique métier
  - Entités/Repositories : accès aux données via ORM
  - Vues : Twig (full Symfony) ou application front React/Angular

##### Architecture n-tiers
- Exposer la structure physique : client (navigateur) → serveur web/app (Symfony) → base de données.
- Préciser les composants sur chaque tiers.
- Décrire la configuration Docker (conteneurs et leurs rôles).
- Faire la distinction entre couche logique et tiers physique.

##### Séparation des responsabilités / Bonnes pratiques
- Expliquer comment les principes **SOLID** sont respectés (ex. Single Responsibility).
- Mentionner la configuration isolée (fichiers `.env` pour les secrets).
- Citer les **design patterns** utilisés si applicable (Factory, Singleton, Strategy…).

##### Composants externes / Bibliothèques
- Préciser les bundles Symfony additionnels (API Platform, LexikJWT, etc.) ou packages npm.
- Expliquer leur intégration à l'architecture.

#### e) Schémas complémentaires (optionnels)
- Schéma des composants déployables, diagramme d'état (state machine) si workflows complexes, etc.
- N'ajouter que si cela apporte de la valeur.

> Au terme du jalon 4, la conception s'achève. Le développement doit être bien entamé (projet Symfony créé, entités générées, 1 ou 2 fonctionnalités simples implémentées). Si le code évolue par rapport aux diagrammes, **mettre les diagrammes à jour** pour qu'ils restent cohérents.

---

### Jalon 5 – Mai : Développement, Sécurité & Tests (version Bêta)

**Échéance :** 29/05/2026 (dernier jour ouvrable de mai)

**Livrables :**
1. Code source de l'application (version bêta) — lien Git + tag/commit de référence
2. Rapport de tests automatisés (chapitre X)
3. Analyse de sécurité & conformité (chapitre IX)

---

#### 1. Code source — version bêta

- Dépôt Git à jour avec **la majorité des fonctionnalités** implémentées.
- Fournir : lien vers le dépôt Git + commit/tag de référence pour la version livrée.
- Le repo doit contenir : code source Symfony/React, `Dockerfile`, `docker-compose.yml`, documentation d'installation.
- Le `docker-compose` doit permettre de **lancer l'application en local**.
- Toutes les fonctionnalités principales doivent être implémentées ou en passe de l'être.
- **Intégration de l'API externe** opérationnelle.
- **Preuve de CI en fonctionnement** : capture d'écran d'une pipeline réussie, ou badge `build: passing` dans le README.

---

#### 2. Rapport de tests automatisés (chapitre X — Politique de tests)

##### a) Couverture de tests unitaires
- Décrire quelles parties du code sont couvertes.
- Donner un **exemple de cas de test unitaire** pertinent.
- Fournir le pourcentage de couverture si disponible.

##### b) Tests fonctionnels
- Expliquer comment les cas d'usage ont été testés de bout en bout.
- Exemples : tests Behat, tests Postman/Newman sur les endpoints API, tests Jest/React Testing Library, Selenium…

##### c) Autres tests (si réalisés)
- Tests d'intégration (connexion réelle à la BD, appel à l'API externe).
- Tests de performance simples (temps de chargement d'une page, JMeter pour requêtes concurrentes).

##### d) Outils utilisés
- Lister les frameworks de tests employés (PHPUnit, Behat, Jest, Panther, etc.) et leur mode d'exécution (CI ou local).

##### e) Résultats actuels
- Donner le **statut à date** : nombre de tests qui passent, lesquels échouent et plan d'action.
- Fournir un extrait de log ou capture de rapport de tests.

---

#### 3. Analyse de sécurité & conformité (chapitre IX — Sécurité)

Pour chaque point du Top 10 OWASP pertinent, montrer comment il est adressé :

| Point sécurité | Implémentation attendue |
|---|---|
| **Injection SQL** | Doctrine ORM ou requêtes PDO préparées — aucune entrée utilisateur insérée directement |
| **XSS** | Twig échappe par défaut les variables — tester en injectant `<script>` dans les formulaires |
| **CSRF** | Tokens CSRF Symfony sur les formulaires sensibles — ou mécanisme équivalent pour API REST |
| **Mots de passe** | Hachage via bcrypt/Argon2 (`password_hash` PHP ou outils Symfony) — réinitialisation sécurisée par email |
| **Brute force** | Limitation des tentatives de login (Rate Limiter Symfony, compteur de session, reCAPTCHA) |
| **RGPD** | Droit à la suppression de compte/données, politique de confidentialité, communications HTTPS en prod |
| **Contrôle d'accès** | Rôles et permissions Symfony (utilisateur normal ≠ admin), validation des données en entrée |
| **En-têtes HTTP** | CORS configuré, `X-Frame-Options` contre clickjacking (si implémenté) |

##### Bilan d'avancement (fin mai)
- État global du projet : fonctionnalités terminées vs restantes.
- Avance ou retard sur le planning initial.
- Plan d'action pour le mois de juin.

> Le jalon 5 doit démontrer que l'application fonctionne dans sa quasi-totalité, qu'elle est de qualité (tests OK, sécurité OK) et qu'elle se rapproche d'une version candidate à la mise en production. Documenter le lancement dans le README (commande `docker-compose up`, URL d'accès, comptes de test).

---

### Jalon 6 – Juin : Déploiement et Mise en Production (Livrable final)

**Échéance :** 30/06/2026 (dernier jour ouvrable de juin)

**Livrables :**
- Produit logiciel final (code complet, conteneurs Docker finalisés, tag `release`)
- Documentation finale consolidée (PDF)
- Présentation pour la soutenance orale (slides — à préparer pour l'oral, non remis sur Teams)

Ce jalon couvre le **chapitre XI du rapport final** et réunit tous les chapitres précédents.

---

#### 1. Produit final prêt à déployer

##### a) Code source taggé "release"
- Créer un **tag ou une release** `v1.0` sur le dépôt Git.
- Cette version intègre toutes les corrections finales, optimisations et fonctionnalités complètes.
- Le code sera **gelé à cette version** pour l'évaluation finale.

##### b) Conteneurs Docker prêts
- Fichier `docker-compose.yml` final permettant de lancer l'application complète en un coup.
- Services attendus :
  - Backend Symfony (PHP + serveur web)
  - Base de données (avec dump des données de base ou volumes)
  - Front-end si séparé (ou nginx pour servir les fichiers statiques)

##### c) Instructions de déploiement
- Section "Mise en production" dans le README ou la documentation.
- Décrire le processus complet (CD automatique ou procédure manuelle).
- Exemple : "Lancer `docker-compose up -d`, configurer les variables d'environnement X, Y, importer le dump SQL fourni".
- **Objectif : un développeur tiers peut déployer l'appli sans poser de question.**

##### d) Environnements de déploiement
- Mentionner les différents environnements (dev, test, prod) et la gestion des différences.
- Ex. fichier `.env` Symfony adapté (`APP_ENV=prod`, debug désactivé), Docker pour simuler la prod en local.
- Si hébergement en ligne (Heroku, Netlify, AWS free tier…) : fournir l'URL et décrire l'architecture déployée.

##### e) Stratégie de mise en production
- Expliquer (théoriquement) la stratégie de déploiement pour minimiser les interruptions :
  - **Blue/Green** : nouvelle version déployée en parallèle, puis bascule du routage
  - **Rolling update** : mise à jour progressive conteneur par conteneur
  - Ou simplement déploiement manuel pendant une fenêtre de maintenance
- Montrer la maîtrise de ces concepts, même en contexte pédagogique.

---

#### 2. Documentation finale (PDF complet)

Compiler un rapport final complet avec **table des matières**, réunissant tous les livrables documentaires mis à jour :

| Chapitre | Contenu |
|---|---|
| **III. Cahier des charges** | CDCF initial, ajusté si le projet a évolué |
| **IV. Méthodologie et organisation** | Planning réel vs prévisionnel, retour d'expérience sur la méthode |
| **V. Conception UI/UX** | Maquettes finales + captures d'écran de l'interface réelle |
| **VI. Modélisation de la BD** | MCD/MLD/MPD final (version réelle implémentée) |
| **VII. Conception de l'application (UML)** | Diagrammes mis à jour pour refléter le code final |
| **VIII. Architecture multi-couches** | Description finale + schéma Docker-compose (conteneurs et interactions) |
| **IX. Sécurité** | Résumé des mesures appliquées, résultats de scans éventuels |
| **X. Tests** | Bilan final : taux de couverture, résultats (tous les tests doivent passer) |
| **XI. Déploiement et mise en production** | Instructions de déploiement, retour d'expérience DevOps |
| **Annexes** | Code source de tests clés, extrait pipeline CI, captures d'écran, etc. |

##### Guide utilisateur (si applicable)
- Petite section expliquant comment utiliser l'application (parcours utilisateur, comptes de test, etc.).
- Utile pour le jury qui jouera le rôle d'un utilisateur durant la démo.

##### Conclusion et perspectives
- Bilan global : apprentissages, défis surmontés.
- Améliorations envisageables (nouvelles fonctionnalités, optimisations).
- Montre la capacité d'analyse critique sur le travail réalisé.

---

#### 3. Soutenance orale (préparation)

- **Durée** : environ 15 minutes devant le jury.
- Démontrer l'application en live (ou vidéo si démonstration trop risquée).
- Présenter les points forts : originalité, difficultés techniques surmontées, résultats obtenus.
- Préparer des **slides synthétiques** (support conseillé, non remis sur Teams).
- Savoir expliquer l'architecture et les choix techniques de manière pédagogique.
- Anticiper les questions du jury (ex. "Comment avez-vous protégé contre les XSS ?").

> Au terme du jalon 6, le projet doit être **100% fonctionnel et complet** : toutes les fonctionnalités implémentées et testées, toutes les exigences techniques respectées (Docker, tests, CI, sécurité, API externe), documentation à jour et exhaustive, application déployable sans encombre. C'est cette version finale qui sera évaluée par le jury national.

---

## 5. Modalités de Remise des Livrables

| Format | Modalité |
|---|---|
| **Documents** | PDF de préférence — présentation professionnelle (page de titre, sommaire, numérotation) |
| **Code source** | URL du dépôt Git dans le commentaire du devoir (pas d'archive ZIP) — s'assurer que le formateur y a accès |
| **Schémas / Maquettes** | Intégrés dans les PDFs ou images attachées (bonne qualité) — maquettes interactives via lien Figma |
| **Images Docker** | Indication optionnelle (DockerHub, etc.) — non obligatoire de remettre séparément |
| **Autres** | Vidéo de démonstration ou tout élément non textuel important peut être joint en annexe |

> En cas de difficulté majeure empêchant un rendu dans les temps, prévenir en amont. Un léger aménagement peut être envisagé au cas par cas, mais ne pas en abuser.

---

> ⚠️ **Originalité** : Deux projets ne doivent pas être identiques. Le sujet fonctionnel, l'approche et la créativité UX sont libres. Inspirez-vous de ressources existantes, mais **pas de plagiat** — le code écrit doit être le vôtre et vous devez être capable de l'expliquer.

---

*Bonne chance ! Ce projet fil rouge est une occasion unique de synthétiser tout votre apprentissage. En suivant ce cahier des charges et en respectant les jalons, vous mettrez toutes les chances de votre côté pour réussir votre passage devant le jury.*
