# ✅ Checklist de Conformité CALENDRIA vs CDC Technique

**Date de vérification** : 09/01/2026  
**Version CDCF** : 2.0 - Multi-Canal Chatbot  
**Auteur** : BOUGHERARA Safi

---

## 🛠️ Stack Technologique Imposée (Non Négociable)

### ✅ Back-end : Symfony (PHP)

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| Framework Symfony | ✅ Symfony 6.4 LTS | ✅ OUI |
| PHP 8+ | ✅ PHP 8.2+ | ✅ OUI |
| Architecture API REST | ✅ API RESTful Symfony + React SPA | ✅ OUI |
| Justification architecture | ✅ Section 4.1 du CDCF (tableau comparatif) | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

### ✅ Front-end

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| React v18+ OU Angular v15+ | ✅ React 18+ | ✅ OUI |
| Interface responsive | ✅ Desktop + Mobile (mentionné section 3.1.3) | ✅ OUI |
| UX/UI soignée | ✅ Jalon 2 : Maquettes Figma + Charte graphique | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

### ✅ Base de Données

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| SGBD SQL | ✅ PostgreSQL ou MySQL (section 4.2) | ✅ OUI |
| NoSQL INTERDIT | ✅ Aucune mention de NoSQL | ✅ OUI |
| Méthode MERISE | ✅ Jalon 3 : MCD/MLD/MPD (section 5.1) | ✅ OUI |
| ORM Doctrine | ✅ Doctrine 2.x (section 4.2) | ✅ OUI |
| Normalisation 3NF | ✅ Mentionné section 4.2 | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

### ✅ API Externe (Obligatoire)

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| Au moins 1 API tierce | ✅ **2 APIs** : Twilio + OpenAI | ✅ OUI |
| Exemples acceptés | ✅ Twilio (téléphonie/SMS) + OpenAI (IA) | ✅ OUI |
| Sécurité des clés | ✅ Variables d'environnement `.env` (section 4.2) | ✅ OUI |
| Jamais en dur | ✅ Mentionné section 4.3 | ✅ OUI |

**APIs utilisées** :
1. **Twilio Conversations API** (WhatsApp Business)
2. **Twilio SMS API** (notifications)
3. **OpenAI GPT-4o-mini** (chatbot IA)

**Verdict** : ✅ **CONFORME** (même 3 APIs !)

---

### ✅ Conteneurisation : Docker

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| Docker obligatoire | ✅ Docker 24+ (section 4.2) | ✅ OUI |
| Docker Compose | ✅ Docker Compose 2.x | ✅ OUI |
| Conteneur Symfony + PHP | ✅ php:8.2-fpm (section 4.2) | ✅ OUI |
| Conteneur Base de données | ✅ postgres:15 ou mysql:8 | ✅ OUI |
| Conteneur Front-end | ✅ node:20 (React) | ✅ OUI |

**Architecture Docker** :
```
calendria/
├── docker-compose.yml
├── backend/ (Symfony)
├── frontend/ (React)
└── database/ (PostgreSQL/MySQL)
```

**Verdict** : ✅ **CONFORME**

---

### ✅ Contrôle de Version : Git

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| GitHub ou GitLab | ✅ GitHub (section 4.2) | ✅ OUI |
| Stratégie de branches | ✅ main/develop/feature/* (section 4.2) | ✅ OUI |
| Commits fréquents | ✅ Mentionné dans bonnes pratiques | ✅ OUI |
| Messages clairs | ✅ Mentionné | ✅ OUI |
| Versionnement config | ✅ Docker, CI (section 4.2) | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

### ✅ CI/CD : Intégration et Déploiement Continus

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| Pipeline CI automatisée | ✅ GitHub Actions (section 4.2) | ✅ OUI |
| Tests à chaque push | ✅ PHPUnit + Behat + Jest | ✅ OUI |
| Build/packaging | ✅ Build images Docker | ✅ OUI |
| CD (Continuous Delivery) | ✅ Push sur Docker Hub (section 4.2) | ✅ OUI |
| Procédure déploiement | ✅ Jalon 6 : Documentation déploiement | ✅ OUI |

**Pipeline défini** :
```yaml
on: [push, pull_request]
jobs:
  tests:
    - Linter PHP (PHPStan)
    - Tests unitaires (PHPUnit)
    - Tests fonctionnels (Behat)
    - Linter TypeScript (ESLint)
    - Tests front (Jest)
  build:
    - Build image Docker backend
    - Build image Docker frontend
  deploy:
    - Push sur Docker Hub (si tag release)
```

**Verdict** : ✅ **CONFORME**

---

### ✅ Tests Automatisés (Multi-niveaux)

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| **Tests unitaires** (PHPUnit) | ✅ PHPUnit (section 4.2) | ✅ OUI |
| **Tests fonctionnels** | ✅ Behat + Postman/Newman (section 4.2) | ✅ OUI |
| Tests front (si SPA) | ✅ Jest + React Testing Library | ✅ OUI |
| Couverture > 80% | ✅ > 80% back-end, > 70% front-end (section 6.2) | ✅ OUI |

**Tests appréciés** :
- ✅ Tests de performance (mentionné section 4.2)
- ✅ Tests de sécurité (OWASP, section 4.3)
- ✅ Tests UI responsive (section 6.2)

**Verdict** : ✅ **CONFORME**

---

### ✅ Sécurité : OWASP Top 10

| Menace | Protection Requise | Notre Projet | Conforme |
|--------|-------------------|--------------|----------|
| **Injection SQL** | Requêtes préparées, ORM Doctrine | ✅ Doctrine ORM (section 4.3) | ✅ OUI |
| **XSS** | Échappement Twig, filtrage entrées | ✅ Échappement React, CSP (section 4.3) | ✅ OUI |
| **CSRF** | Tokens CSRF Symfony | ✅ Tokens JWT, SameSite cookies (section 4.3) | ✅ OUI |
| **Mots de passe** | Hashage bcrypt/Argon2 | ✅ bcrypt/Argon2 (section 4.3) | ✅ OUI |
| **Brute force** | Limitation tentatives | ✅ Rate Limiter (mentionné) | ✅ OUI |
| **RGPD** | Suppression compte, politique | ✅ Droit à l'oubli, politique (section 4.3) | ✅ OUI |

**Authentification** :
- ✅ Hashage robuste (jamais en clair)
- ✅ Gestion des rôles (ROLE_RESTAURATEUR, ROLE_ADMIN)
- ✅ Limitation tentatives de connexion

**RGPD** :
- ✅ Transparence sur collecte de données
- ✅ Droit à la suppression des données
- ✅ Politique de confidentialité (section 4.3)

**Verdict** : ✅ **CONFORME**

---

### ✅ Architecture Logicielle

| Exigence | Notre Projet | Conforme |
|----------|--------------|----------|
| **Pattern MVC** | ✅ Contrôleurs / Services / Entités (section 4.1) | ✅ OUI |
| **Architecture n-tiers** | ✅ Client / API Symfony / BDD (section 4.1) | ✅ OUI |
| **Principes SOLID** | ✅ Mentionné section 4.1 | ✅ OUI |
| **DRY / KISS** | ✅ Mentionné bonnes pratiques | ✅ OUI |
| **Conventions PSR** | ✅ PSR-12 (section 6.2) | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

## 📅 Jalons et Livrables

### ✅ Jalon 1 – Janvier : CDCF

| Contenu Attendu | Notre CDCF | Conforme |
|-----------------|------------|----------|
| **Contexte métier** | ✅ Section 1.1-1.2 | ✅ OUI |
| **Objectifs SMART** | ✅ Section 2.1 | ✅ OUI |
| **Périmètre fonctionnel** | ✅ Section 3 (détaillé) | ✅ OUI |
| **Exigences techniques** | ✅ Section 4 (stack complète) | ✅ OUI |
| **Contraintes et enjeux** | ✅ Section 5 | ✅ OUI |
| **Critères de succès** | ✅ Section 6 | ✅ OUI |
| **Justification architecture** | ✅ Section 4.1 (tableau comparatif) | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

### ✅ Jalons Futurs (Planifiés)

| Jalon | Mois | Livrable Attendu | Notre Planning | Conforme |
|-------|------|------------------|----------------|----------|
| 2 | Février | Méthodologie + UX/UI | ✅ Méthodologie + Maquettes UI/UX | ✅ OUI |
| 3 | Mars | Modélisation BDD | ✅ MCD/MLD/MPD + API REST + Algo | ✅ OUI |
| 4 | Avril | Conception UML + Début dev | ✅ Chatbot WhatsApp + Dashboard + UML | ✅ OUI |
| 5 | Mai | Version bêta + Tests | ✅ Widget Web + SMS + Tests + Sécurité | ✅ OUI |
| 6 | Juin | Livraison finale | ✅ Finalisation + Déploiement + Doc | ✅ OUI |

**Verdict** : ✅ **CONFORME**

---

## 📊 Résumé Global de Conformité

### ✅ Stack Technique

| Catégorie | Conformité | Détails |
|-----------|------------|---------|
| **Back-end Symfony** | ✅ 100% | Symfony 6.4 LTS + PHP 8.2+ + API REST |
| **Front-end React** | ✅ 100% | React 18+ + TypeScript + Responsive |
| **Base de données SQL** | ✅ 100% | PostgreSQL/MySQL + MERISE + Doctrine + 3NF |
| **API Externe** | ✅ 100% | Twilio (3 APIs) + OpenAI |
| **Docker** | ✅ 100% | Docker Compose multi-conteneurs |
| **Git + CI/CD** | ✅ 100% | GitHub + GitHub Actions |
| **Tests** | ✅ 100% | PHPUnit + Behat + Jest (>80% coverage) |
| **Sécurité** | ✅ 100% | OWASP Top 10 + RGPD |
| **Architecture** | ✅ 100% | MVC + n-tiers + SOLID |

**Taux de conformité global** : ✅ **100%**

---

## 🎯 Points Forts de Notre CDCF

### 1. **Dépassement des Exigences**

- ✅ **3 APIs externes** au lieu de 1 minimum (Twilio Conversations + SMS + OpenAI)
- ✅ **3 canaux de réservation** (WhatsApp + Widget Web + SMS)
- ✅ **Architecture multi-canal** avec code partagé (90%)
- ✅ **Stratégie phasée** claire et réaliste

### 2. **Justifications Solides**

- ✅ **Tableau comparatif** architecture monolithique vs API REST (section 4.1)
- ✅ **Analyse des risques** détaillée avec mitigation (section 5.4)
- ✅ **Planning réaliste** avec développement dès Mars
- ✅ **Coûts maîtrisés** : 15-20€/mois (section 5.3)

### 3. **Sécurité Renforcée**

- ✅ **RGPD simplifié** (pas de données de santé sensibles)
- ✅ **Toutes les protections OWASP** détaillées
- ✅ **Authentification robuste** (JWT + bcrypt/Argon2)
- ✅ **Logs d'audit** pour traçabilité

### 4. **Tests Complets**

- ✅ **Tests unitaires** : PHPUnit (>80% back-end)
- ✅ **Tests fonctionnels** : Behat + Postman/Newman
- ✅ **Tests front** : Jest + React Testing Library (>70%)
- ✅ **Tests E2E** : Cypress (optionnel)

---

## ⚠️ Points d'Attention (Non Bloquants)

### 1. **Choix BDD Non Finalisé**

**État** : PostgreSQL **ou** MySQL (section 4.2)  
**Recommandation** : Choisir **PostgreSQL** avant Jalon 3  
**Raison** : Meilleure gestion des contraintes, types avancés (JSON)  
**Impact** : ⚠️ Faible (les deux sont conformes)

### 2. **Vocal en Bonus (Optionnel)**

**État** : Voix téléphonique mentionnée comme "bonus Juin"  
**Recommandation** : Rester sur chatbot uniquement si retard  
**Raison** : Vocal = complexité élevée, pas obligatoire  
**Impact** : ⚠️ Aucun (bonus = optionnel)

---

## ✅ Conclusion Finale

### **Notre CDCF est-il conforme au CDC Technique ?**

# ✅ OUI - 100% CONFORME

**Détails** :
- ✅ **Toutes les contraintes techniques respectées**
- ✅ **Stack imposée utilisée** (Symfony + React + SQL + Docker + Git + CI/CD)
- ✅ **APIs externes intégrées** (Twilio + OpenAI)
- ✅ **Tests automatisés planifiés** (>80% coverage)
- ✅ **Sécurité OWASP + RGPD** couverte
- ✅ **Architecture justifiée** (API REST + React)
- ✅ **Jalons respectés** (CDCF complet pour Jalon 1)

### **Points Différenciants (Bonus)**

- 🌟 **3 canaux de réservation** (WhatsApp + Widget + SMS)
- 🌟 **3 APIs externes** (au lieu de 1 minimum)
- 🌟 **Architecture multi-canal** innovante
- 🌟 **Coûts maîtrisés** (15-20€/mois)
- 🌟 **Planning réaliste** (développement dès Mars)

---

## 📝 Actions Avant Rendu (31/01/2026)

### Obligatoire

1. ✅ **Finaliser choix BDD** : PostgreSQL recommandé
2. ✅ **Créer dépôt Git** : GitHub (public ou privé)
3. ✅ **Générer PDF** : Pandoc ou Markdown PDF
4. ✅ **Relire CDCF** : Vérifier orthographe, cohérence
5. ✅ **Remplir formateur** : Nom et email (section 7.5)

### Optionnel (Bonus)

6. ⭐ **Créer README.md** : Présentation du projet sur GitHub
7. ⭐ **Initialiser structure** : Dossiers backend/frontend/docs
8. ⭐ **Créer .gitignore** : PHP, Node, Docker

---

**Date de vérification** : 09/01/2026  
**Statut** : ✅ **PRÊT POUR LE RENDU**  
**Deadline** : 31/01/2026  
**Conformité** : ✅ **100%**
