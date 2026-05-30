# 📅 Calendria - Application Frontend React

Cette partie du projet contient l'interface utilisateur (UI) développée en **React**, **Vite** et **TypeScript**. Elle propose une interface moderne, performante et haut de gamme pour permettre aux restaurateurs de gérer leurs réservations, restaurants, et plans de tables.

---

## 🛠️ Pile Technique (Stack)

* **Outil de Build** : Vite
* **Bibliothèque UI** : React 18 & TypeScript
* **Design & Layout** : Material UI v6 (MUI)
* **Formulaires** : React Hook Form (gestion fluide de la validation)
* **Requêtes API** : Axios (avec intercepteurs automatiques pour le token JWT)
* **Polices** : Plus Jakarta Sans & Inter

---

## 📁 Structure du Projet (`src/`)

L'architecture s'articule autour de la séparation des préoccupations :

* **`services/`** :
  * [`api.ts`](file:///c:/laragon/www/projet_fin_annee/frontend/src/services/api.ts) : Configuration d'instance Axios avec baseURL dynamique. Un intercepteur de requêtes injecte automatiquement le header `Authorization: Bearer <token>` s'il est présent en localStorage.
  * [`auth.service.ts`](file:///c:/laragon/www/projet_fin_annee/frontend/src/services/auth.service.ts) : Fonctions de connexion, déconnexion (destruction du token) et vérification du statut connecté.
  * [`reservation.service.ts`](file:///c:/laragon/www/projet_fin_annee/frontend/src/services/reservation.service.ts) : Appels d'API pour le CRUD complet des réservations.
  * [`restaurant.service.ts`](file:///c:/laragon/www/projet_fin_annee/frontend/src/services/restaurant.service.ts) : Appels d'API pour le CRUD des restaurants et des tables associées.
* **`pages/`** :
  * [`Login.tsx`](file:///c:/laragon/www/projet_fin_annee/frontend/src/pages/Login.tsx) : Page de connexion épurée et stylisée utilisant `react-hook-form` pour la validation instantanée.
  * [`Dashboard.tsx`](file:///c:/laragon/www/projet_fin_annee/frontend/src/pages/Dashboard.tsx) : Le centre opérationnel de l'application. Permet de créer une réservation via un formulaire réactif (avec filtres intelligents des tables selon le restaurant choisi), liste les réservations dans un tableau interactif, et propose des modales pour modifier le statut/détails ou supprimer définitivement.
  * [`RestaurantManagement.tsx`](file:///c:/laragon/www/projet_fin_annee/frontend/src/pages/RestaurantManagement.tsx) : Interface d'administration. Une colonne à gauche affiche la liste des restaurants, et la partie droite liste leurs plans de tables (avec badges de statuts : disponible, occupé, réservé). Permet de créer/modifier/supprimer les structures de tables et restaurants.

---

## 🎨 Charte Graphique & Système de Design

L'application utilise une identité visuelle moderne et soignée (inspirée de designs d'outils SaaS comme Stripe et Vercel) :

### 1. Thème Material UI personnalisé
Dans [`App.tsx`](file:///c:/laragon/www/projet_fin_annee/frontend/src/App.tsx), un `ThemeProvider` surcharge les composants MUI :
* **Couleurs** : Palette harmonieuse avec un Indigo moderne (`#4f46e5`) en couleur principale et un Cyan vif (`#0ea5e9`) en couleur secondaire.
* **Bordures & Arrondis** : Surchargé à `12px` de rayon sur les cartes (`Card`) et `8px` sur les boutons pour un effet plus doux.
* **Polices** : Utilisation systématique de la police géométrique **Plus Jakarta Sans**.

### 2. Styles Globaux et Effets (`index.css` & `App.css`)
* **Index.css** : Contient les variables CSS de base, un scrollbar personnalisé pour les navigateurs modernes, et des classes d'effets visuels comme `.glass-panel` (effet de flou verre dépoli) et `.btn-primary` (transitions fluides et élévation au survol).
* **App.css** : Contient les styles isolés pour la mise en page de la page de Connexion.

---

## 🛣️ Routage & Navigation

Le routage est géré avec **React Router** (`react-router-dom`) :

* **`PrivateRoute`** : Un wrapper de route qui vérifie la présence du token dans le stockage local. S'il n'y a pas de token, l'utilisateur est automatiquement redirigé vers `/login`.
* **`NavigationLayout`** : Un conteneur global qui affiche la barre de navigation unifiée sur toutes les pages connectées.
  * **En-tête (Navbar)** : Barre de navigation collante (Sticky) utilisant du glassmorphism (fond blanc semi-transparent avec flou).
  * **Logo Calendria** : Texte en dégradé de couleur progressif Indigo vers Cyan.
  * **Onglets dynamiques** : Remplacement des boutons classiques par des onglets format "pilule" avec mise en valeur visuelle de l'onglet actif (`Réservations` ou `Restaurants & Tables`).
  * **Bouton Déconnexion** : Un bouton au format discret et élégant (contour rouge sans remplissage excessif) pour conserver la clarté visuelle.

---

## ⚡ Commandes Utiles (npm)

Pour travailler sur le frontend en local (depuis le dossier `/frontend`) :

* **Installer les dépendances** :
  ```bash
  npm install
  ```
* **Lancer le serveur de développement local** (avec rechargement à chaud HMR) :
  ```bash
  npm run dev
  ```
  *(Par défaut accessible sur [http://localhost:3000](http://localhost:3000))*
* **Compiler l'application pour la production** :
  ```bash
  npm run build
  ```
  *(Cette commande vérifie les types avec TypeScript `tsc` et génère les fichiers finaux minifiés dans le dossier `dist/`)*
* **Tester localement le build de production** :
  ```bash
  npm run preview
  ```
