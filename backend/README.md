# 📅 Calendria - Documentation API Backend

Cette partie du projet contient l'API REST développée avec le framework **Symfony 6.4** et **PHP 8.4**. Elle gère l'authentification, la persistance des données, la validation des règles métier (capacité des restaurants, affectation des tables) et fournit les endpoints pour le frontend React.

---

## 🛠️ Pile Technique (Stack)

* **Langage & Framework** : PHP 8.4 & Symfony 6.4
* **Base de données** : PostgreSQL 15 (gérée avec l'ORM Doctrine)
* **Sécurité & Auth** : LexikJWTAuthenticationBundle (Authentification par Token JWT)
* **Conteneurisation** : Docker & Docker Compose

---

## 📁 Architecture du Code Source (`src/`)

L'architecture suit les standards de Symfony :

* **`Controller/`** :
  * [`AuthController.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Controller/AuthController.php) : Endpoints pour l'inscription (`POST /api/register`) et l'authentification des restaurateurs.
  * [`ReservationController.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Controller/ReservationController.php) : Liste les restaurants/tables, gère le CRUD complet des réservations, et associe/crée automatiquement les clients lors des réservations.
  * [`RestaurantAdminController.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Controller/RestaurantAdminController.php) : CRUD complet pour l'administration des structures (Restaurants et Tables) avec contraintes d'intégrité (interdiction de supprimer une table ou un restaurant ayant des réservations en cours).
* **`Entity/`** :
  * [`User.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/User.php) : Entité d'authentification des restaurateurs.
  * [`Restaurant.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/Restaurant.php) : Détails de la structure (adresse, capacité totale, durée du repas, marge de nettoyage).
  * [`Table.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/Table.php) : Numéro de table, emplacement (intérieur/terrasse), capacité, statut (disponible, occupée, réservée).
  * [`Client.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/Client.php) : Coordonnées du client, consentement RGPD.
  * [`Reservation.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/Reservation.php) : Heure, date, nombre de couverts, statut de la réservation (confirmée, en attente, annulée, terminée).
  * [`Service.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/Entity/Service.php) : Créneaux d'ouverture (midi/soir) et jours d'ouverture.
* **`DataFixtures/`** :
  * [`AppFixtures.php`](file:///c:/laragon/www/projet_fin_annee/backend/src/DataFixtures/AppFixtures.php) : Contient le jeu de données initial pour démarrer l'application avec des données cohérentes de démonstration.

---

## 🗄️ Base de Données (PostgreSQL)

La base de données tourne dans le conteneur Docker `calendria_db`. Elle est accessible de deux manières :

### 1. Via l'interface web intégrée (Adminer) 🌐
Un gestionnaire de base de données web léger est accessible directement depuis ton navigateur :
* **URL** : **[http://localhost:8080](http://localhost:8080)**
* **Paramètres de connexion** :
  * **Système** : `PostgreSQL`
  * **Serveur** : `db`
  * **Utilisateur** : `calendria_user`
  * **Mot de passe** : `calendria_pass`
  * **Base de données** : `calendria`

### 2. Via un client externe (DBeaver, TablePlus, pgAdmin...) 🛠️
Si tu souhaites lier ton outil de gestion habituel :
* **Hôte (Host)** : `localhost`
* **Port** : `5432`
* **Utilisateur** : `calendria_user`
* **Mot de passe** : `calendria_pass`
* **Base de données** : `calendria`

---

## 🔑 Sécurité & Authentification JWT

L'API est protégée par un système de token JSON Web Token (JWT).

### Configuration des variables d'environnement (`.env`)
Les variables suivantes sont définies dans le fichier [`.env`](file:///c:/laragon/www/projet_fin_annee/backend/.env) pour indiquer au bundle LexikJWT l'emplacement des clés RSA :
```env
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=
```

### Génération de la paire de clés RSA
Les clés de signature sont stockées dans `config/jwt/`. Elles ont été générées via openssl dans le conteneur :
```bash
openssl genrsa -out config/jwt/private.pem 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```
> **Important** : Pour que le serveur PHP (Apache/Nginx/FPM) puisse lire les clés, les permissions doivent être configurées pour l'utilisateur `www-data` :
> ```bash
> chown www-data:www-data config/jwt/private.pem config/jwt/public.pem
> chmod 600 config/jwt/private.pem
> chmod 644 config/jwt/public.pem
> ```

---

## 🧬 Données Initiales de Démo (Fixtures)

Lorsque tu charges les fixtures (données initiales de test), le système crée automatiquement :
* **Un utilisateur Administrateur** pour se connecter au frontend :
  * **Email** : `admin@calendria.com`
  * **Mot de passe** : `password123`
* **Un Restaurant** : `"Le Gourmet Parisien"` (123 Avenue des Champs-Élysées).
* **10 Tables** associées avec des capacités de 2, 4 et 6 places réparties en intérieur et en terrasse.
* **2 Services** : Midi (12:00 - 14:30) et Soir (19:00 - 22:30).
* **5 Clients** réguliers créés en base.
* **7 Réservations** réparties sur différentes dates et heures pour simuler l'activité.

---

## ⚡ Commandes Utiles (Docker)

Depuis le répertoire racine de ton projet (où se trouve le `docker-compose.yml`) :

* **Voir les logs de l'API en temps réel** :
  ```powershell
  docker compose logs backend -f
  ```
* **Vider le cache de l'application Symfony** (indispensable après modification de configuration, d'entités ou de routes) :
  ```powershell
  docker compose exec backend php bin/console cache:clear
  ```
* **Mettre à jour la base de données après une migration** :
  ```powershell
  docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
  ```
* **Recharger le jeu de données de test à zéro (Fixtures)** :
  ```powershell
  docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
  ```
* **Consulter la liste de toutes les routes de l'API** :
  ```powershell
  docker compose exec backend php bin/console debug:router
  ```
