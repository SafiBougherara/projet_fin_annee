# JALON 5 – Développement, Sécurité & Tests (Version Bêta)

**Projet : CALENDRIA**  
**Étape :** Mai (Jalon 5)  
**Livrables :** Code source de l'application bêta + Dossier de tests + Analyse de sécurité.

---

## 📋 Table des matières

1. [Présentation du Jalon 5](#présentation-du-jalon-5)
2. [Livrables Documentaires](#livrables-documentaires)
3. [Fonctionnalités Bêta Implémentées](#fonctionnalités-bêta-implémentées)
4. [Sécurité & RGPD](#sécurité--rgpd)
5. [Politique de Tests & Compilation](#politique-de-tests--compilation)
6. [Instructions de Démarrage Rapide](#instructions-de-démarrage-rapide)

---

## Présentation du Jalon 5

Ce dossier présente le bilan du **Jalon 5 (Bêta)** de Calendria. 
Durant ce mois de Mai, nous avons transformé la conception technique (UML, MCD) en une **application bêta hautement fonctionnelle** et testée, répondant aux exigences techniques et pédagogiques.

---

## Livrables Documentaires

Pour ce jalon, la documentation finale comprend deux chapitres clés rédigés en Markdown et prêts pour la compilation du rapport final :
*   **[Analyse de Sécurité & Conformité (Chapitre IX)](file:///c:/laragon/www/projet_fin_annee/documentation/Jalon5/securite.md)** : Étude du Top 10 OWASP, sécurisation par tokens JWT, firewalls d'accès publics/privés et conformité au RGPD.
*   **[Rapport de Tests Automatisés (Chapitre X)](file:///c:/laragon/www/projet_fin_annee/documentation/Jalon5/tests.md)** : Politique de tests unitaires backend (PHPUnit), tests statiques TypeScript frontaux et protocoles de validation fonctionnelle manuels.

---

## Fonctionnalités Bêta Implémentées

L'application bêta est quasiment complète et comprend les modules opérationnels suivants :
1.  **Widget Web Chatbot IA** : Canal de discussion en langage naturel intégrable en `iframe` pour les clients finaux.
2.  **Assistant IA Conversationnel (Gemini 2.5 Flash)** : Extraction intelligente de données de réservations structurées (nom, téléphone, date, heure, couverts) et contrôle de disponibilité.
3.  **Bot Telegram Multi-Canal** : Canal de réservation mobile gratuit et fonctionnel connecté par webhook.
4.  **Intégration d'Appels Vocaux IA (Retell AI)** : Route d'API webhook publique (`/api/chatbot/call`) permettant à un agent vocal externe de réserver une table directement.
5.  **Gestion Intelligente de la Disponibilité** : Algorithme d'attribution de table par capacité minimale ascendante et recherche automatique d'alternatives horaires.
6.  **Plan de Salle Interactif & Slider Temporel** : Interface de contrôle en temps réel mise à jour d'après une timeline de service (11h00-23h30).
7.  **Mode Sombre (Dark Mode)** : Option d'affichage premium et persistante pour les restaurateurs.

---

## Sécurité & RGPD

Toutes les routes d'API d'administration sont protégées par **LexikJWTAuthenticationBundle** (Authentification par token JWT Stateless sans cookies). Les formulaires sont immunisés contre les injections SQL par Doctrine ORM. Les flux de données sont cryptés en transit et l'utilisateur garde le contrôle des fiches clients conformément aux directives européennes du RGPD.

---

## Politique de Tests & Compilation

*   **Tests Unitaires** : Écrits pour tester les scénarios aux limites du moteur de disponibilité (`DisponibiliteServiceTest.php`).
*   **Vérification de compilation** : La build frontend génère des ressources statiques optimisées sans erreurs TypeScript via la commande `npm run build`.

---

## Instructions de Démarrage Rapide

L'intégralité du projet est packagée avec Docker et orchestrée via `docker-compose.yml` :

```bash
# 1. Cloner le projet et se positionner à la racine
git clone https://github.com/SafiBougherara/projet_fin_annee.git
cd projet_fin_annee

# 2. Configurer les variables d'environnement (.env.dev ou .env)
# Spécifier la clé d'API Gemini et le token du bot Telegram dans backend/.env

# 3. Lancer l'orchestration Docker
docker-compose up -d --build

# 4. Exécuter les migrations de base de données
docker-compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# 5. Accéder à l'application
# - Dashboard Restaurateur : http://localhost:3000
# - Widget Client : http://localhost:3000/widget?restaurantId=1
# - API Backend : http://localhost:8000
```
