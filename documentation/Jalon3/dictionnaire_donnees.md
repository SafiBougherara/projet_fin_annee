# CALENDRIA – Dictionnaire des Données

**Projet** : CALENDRIA – Assistant de Réservation Intelligent Multi-Canal  
**Auteur** : BOUGHERARA Safi  
**Formation** : CDA – Concepteur Développeur d'Applications  
**Date** : Mars 2026  
**Jalon** : 3 – Modélisation de la Base de Données  

---

## Introduction

Ce dictionnaire des données recense l'ensemble des entités du système CALENDRIA, leurs attributs, la signification métier de chaque donnée, ainsi que les contraintes associées. Il constitue la **fondation** de la démarche MERISE : chaque entité ici répertoriée sera formalisée dans le MCD, puis transformée en tables (MLD) et enfin implémentée physiquement dans PostgreSQL (MPD).

**Alignement Jalon 1 (CDCF)** : Ce dictionnaire reprend les 8 entités identifiées en annexe 7.2 du CDCF, enrichit le modèle avec `User` (authentification dashboard) et `FermetureExceptionnelle` (issue des wireframes Jalon 2), et unifie `CreneauHoraire` dans `Service`.

---

### Notes Transversales de Modélisation

#### a) Types conceptuels « Date/Heure » → `TIMESTAMP` en SQL

Dans ce dictionnaire, le type **« Date/Heure »** désigne, au niveau conceptuel (MCD), toute donnée temporelle complète (date + heure). Dans l'implémentation physique PostgreSQL (MPD), ce type conceptuel est traduit en **`TIMESTAMP WITHOUT TIME ZONE`**, le type natif PostgreSQL pour les horodatages sans information de fuseau horaire. De même, le type conceptuel « Date » seul devient `DATE`, et le type « Heure » seul devient `TIME`. Ces correspondances sont documentées dans le MPD (`MPD.puml`).

#### b) Colonnes JSON vs JSONB

Plusieurs attributs stockent des structures semi-structurées dans des colonnes JSON. PostgreSQL propose deux variantes :

| Type SQL | Stockage | Index GIN possible | Cas d'usage |
|---|---|---|---|
| `JSON` | Texte brut validé syntaxiquement | ❌ | Archivage pur, transcriptions |
| `JSONB` | Binaire décomposé, plus rapide en lecture | ✅ | Filtrage, recherche, requêtes `@>` |

**Choix retenu** : Les colonnes nécessitant des requêtes fréquentes (`roles` de USER, `jours_ouverture` de SERVICE) utilisent **`JSONB`** pour bénéficier des index GIN et des opérateurs de containement (`@>`, `?`). Les colonnes d'archivage pur (`transcription`, `donnees_collectees`) peuvent rester en `JSON`. Ce choix est explicité dans le MPD.

#### c) Référence « Code existant » dans la synthèse

Certaines entités mentionnent la source « Code existant » dans la synthèse finale. Cela signifie que leur structure a été affinée **en parallèle** de la rédaction de ce dictionnaire (Jalon 3), en vérifiant la cohérence avec les entités Doctrine déjà esquissées. Le dictionnaire reste la **référence conceptuelle** ; c'est lui qui valide le code, et non l'inverse.

---

## 1. RESTAURANT

> Représente l'établissement de restauration utilisant CALENDRIA. C'est l'entité racine du système – toutes les autres entités gravitent autour d'un restaurant.

**Alignement** : CDCF §3.1.3 (Dashboard restaurateur) + Wireframe Paramètres (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique du restaurant | Entier auto-incrémenté | PK | ✅ |
| `nom` | Nom commercial du restaurant | Chaîne de caractères (255) | NOT NULL | ✅ |
| `adresse` | Adresse postale complète | Texte libre | NOT NULL | ✅ |
| `telephone` | Numéro de téléphone du restaurant | Chaîne (20) | NOT NULL | ✅ |
| `email` | Adresse email de contact | Chaîne (255) | NOT NULL | ✅ |
| `capacite_totale` | Nombre maximum de couverts | Entier positif | NOT NULL, > 0 | ✅ |
| `duree_repas` | Durée moyenne d'un repas (en minutes) | Entier positif | NOT NULL, > 0 | ✅ |
| `buffer_nettoyage` | Temps de nettoyage/préparation entre deux services (en minutes) | Entier positif | NOT NULL, ≥ 0 | ✅ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

---

## 2. USER

> Compte utilisateur du dashboard de gestion. Un User est un restaurateur ou un administrateur qui se connecte au backoffice pour gérer les réservations. **Distinct du Client** qui réserve via les canaux chatbot.

**Alignement** : CDCF §3.1.3.A (Authentification et Sécurité) + Wireframe Login (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique | Entier auto-incrémenté | PK | ✅ |
| `email` | Adresse email (identifiant de connexion) | Chaîne (180) | NOT NULL, UNIQUE | ✅ |
| `roles` | Rôles attribués (ROLE_USER, ROLE_RESTAURATEUR, ROLE_ADMIN) | JSON (tableau de chaînes) | NOT NULL | ✅ |
| `password` | Mot de passe hashé (bcrypt/Argon2) | Chaîne (255) | NOT NULL | ✅ |
| `restaurant_id` | Restaurant géré par cet utilisateur | Référence → RESTAURANT | FK, nullable | ❌ |

> **Justification du champ `restaurant_id` nullable** : Ce champ est volontairement nullable pour deux raisons :
> 1. **Compte administrateur système** (ROLE_ADMIN) — un super-administrateur peut avoir accès à tous les restaurants sans être attaché à un établissement particulier.
> 2. **Évolutivité multi-restaurant** — dans une future v2, un restaurateur pourrait gérer plusieurs établissements. La relation deviendrait alors une table d'association `USER ↔ RESTAURANT` (N:M). La nullabilité actuelle prépare cette évolution sans bloquer le MVP (un seul restaurant par restaurateur).
>
> En pratique, lors de l'inscription avec ROLE_RESTAURATEUR, `restaurant_id` est assigné immédiatement après la création du premier restaurant.

---

## 3. TABLE_RESTAURANT

> Représente une table physique dans le restaurant. Chaque table a un numéro, une capacité et un type (intérieur, terrasse, VIP). Le nom de l'entité utilise un suffixe `_RESTAURANT` car `TABLE` est un mot réservé en SQL.

**Alignement** : CDCF §3.1.2.A (Configuration des Tables) + Wireframe Plan de Salle (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique de la table | Entier auto-incrémenté | PK | ✅ |
| `restaurant_id` | Restaurant auquel appartient cette table | Référence → RESTAURANT | FK, NOT NULL | ✅ |
| `numero_table` | Numéro de la table (ex: "T1", "T14") | Chaîne (10) | NOT NULL | ✅ |
| `capacite` | Nombre de places assises | Entier positif | NOT NULL, > 0 | ✅ |
| `type` | Type/emplacement de table | Chaîne (50) | NOT NULL, valeurs : 'interieur', 'terrasse', 'vip', 'prive' | ✅ |
| `statut` | État actuel de la table | Chaîne (20) | NOT NULL, valeurs : 'disponible', 'hors_service' | ✅ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

---

## 4. SERVICE

> Période de service du restaurant (ex: midi, soir). Chaque service définit un créneau horaire et les jours de la semaine où il est actif. **Unifie les entités Service et CreneauHoraire** du CDCF initial (voir justifications).

**Alignement** : CDCF §3.1.2.B (Gestion des Services) + Wireframe Paramètres > Horaires & Services (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique du service | Entier auto-incrémenté | PK | ✅ |
| `restaurant_id` | Restaurant auquel appartient ce service | Référence → RESTAURANT | FK, NOT NULL | ✅ |
| `type` | Type de service | Chaîne (20) | NOT NULL, valeurs : 'midi', 'soir' | ✅ |
| `heure_debut` | Heure de début du service | Heure | NOT NULL | ✅ |
| `heure_fin` | Heure de fin du service | Heure | NOT NULL | ✅ |
| `jours_ouverture` | Jours de la semaine actifs | JSON (tableau) | NOT NULL, ex: ["lundi","mardi","mercredi"] | ✅ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

> **Note `jours_ouverture` — JSON → JSONB** : En production PostgreSQL, cette colonne est de type **`JSONB`** (binaire) et non `JSON`. Cela permet les requêtes de disponibilité avec l'opérateur de containement : `WHERE jours_ouverture @> '"lundi"'`, utilisé par `DisponibiliteService` pour vérifier si un service est actif un jour donné. Sans JSONB, cette requête nécessiterait un cast coûteux ou une normalisation en table dédiée. Voir « Notes Transversales b) » en introduction.

---

## 5. FERMETURE_EXCEPTIONNELLE

> Date de fermeture exceptionnelle du restaurant (Noël, événement privé, travaux...). Entité identifiée à partir des wireframes du Jalon 2 (écran Paramètres > "Fermetures Exceptionnelles").

**Alignement** : CDCF §3.1.2.D (Blocage de dates spécifiques) + Wireframe Paramètres (Jalon 2, lignes 326-330)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique | Entier auto-incrémenté | PK | ✅ |
| `restaurant_id` | Restaurant concerné | Référence → RESTAURANT | FK, NOT NULL | ✅ |
| `date_fermeture` | Date de la fermeture | Date | NOT NULL | ✅ |
| `motif` | Raison de la fermeture | Chaîne (255) | nullable | ❌ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

---

## 6. CLIENT

> Personne qui effectue une réservation via l'un des canaux (WhatsApp, Widget Web, SMS). Le client est identifié principalement par son numéro de téléphone. Il ne possède pas de compte utilisateur (pas de mot de passe).

**Alignement** : CDCF §3.1.5 (Gestion des Clients) + Wireframe Fiche Client (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique du client | Entier auto-incrémenté | PK | ✅ |
| `nom` | Nom complet du client | Chaîne (255) | NOT NULL | ✅ |
| `telephone` | Numéro de téléphone (identifiant WhatsApp/SMS) | Chaîne (20) | NOT NULL, UNIQUE | ✅ |
| `email` | Adresse email | Chaîne (255) | nullable | ❌ |
| `preferences` | Préférences et allergies (données semi-structurées) | JSON | nullable, ex: {"allergies":["gluten"],"notes":"Table terrasse"} | ❌ |
| `consentement_rgpd` | Le client a donné son consentement RGPD | Booléen | NOT NULL | ✅ |
| `date_consentement` | Date à laquelle le consentement a été donné | Date/Heure | nullable | ❌ |
| `taux_noshow` | Taux de non-présentation (0.0 à 1.0) | Décimal | nullable, ≥ 0, ≤ 1 | ❌ |
| `created_at` | Date de première interaction / création | Date/Heure | NOT NULL | ✅ |

---

## 7. RESERVATION

> Réservation de table effectuée par un client pour un restaurant, à une date et heure données. C'est l'entité **centrale** du système : elle est créée par le chatbot, affichée dans le dashboard, et associée aux notifications.

**Alignement** : CDCF §3.1.3.D (Gestion des Réservations) + Wireframe Réservations (Jalon 2)

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique de la réservation | Entier auto-incrémenté | PK | ✅ |
| `client_id` | Client ayant effectué la réservation | Référence → CLIENT | FK, NOT NULL | ✅ |
| `restaurant_id` | Restaurant concerné | Référence → RESTAURANT | FK, NOT NULL | ✅ |
| `table_id` | Table attribuée (peut être assignée après création) | Référence → TABLE_RESTAURANT | FK, nullable | ❌ |
| `date_reservation` | Date de la réservation | Date | NOT NULL | ✅ |
| `heure_reservation` | Heure de la réservation | Heure | NOT NULL | ✅ |
| `nombre_personnes` | Nombre de couverts demandés | Entier positif | NOT NULL, > 0 | ✅ |
| `statut` | État actuel de la réservation | Chaîne (20) | NOT NULL, valeurs : 'confirmee', 'annulee', 'noshow', 'terminee' | ✅ |
| `demandes_speciales` | Demandes particulières (anniversaire, etc.) | Texte libre | nullable | ❌ |
| `created_at` | Date/Heure de création de la réservation | Date/Heure | NOT NULL | ✅ |
| `updated_at` | Date/Heure de dernière modification | Date/Heure | nullable | ❌ |

---

## 8. CONVERSATION_IA

> Historique d'une conversation entre le chatbot IA et un client, quel que soit le canal (WhatsApp, Widget Web, SMS). Permet la traçabilité et l'analyse des interactions du module IA.

**Alignement** : CDCF §3.1.1 (Module IA Conversationnel) + §7.2 entité prévue

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique de la conversation | Entier auto-incrémenté | PK | ✅ |
| `client_id` | Client identifié (si connu) | Référence → CLIENT | FK, nullable | ❌ |
| `telephone_appelant` | Numéro de téléphone de l'interlocuteur | Chaîne (20) | NOT NULL | ✅ |
| `canal` | Canal utilisé pour la conversation | Chaîne (20) | NOT NULL, valeurs : 'whatsapp', 'widget', 'sms' | ✅ |
| `date_debut` | Date/Heure de début de la conversation | Date/Heure | NOT NULL | ✅ |
| `date_fin` | Date/Heure de fin de la conversation | Date/Heure | nullable | ❌ |
| `transcription` | Transcription complète de l'échange | Texte long | nullable | ❌ |
| `donnees_collectees` | Données extraites par l'IA au cours de la conversation | JSON | nullable, ex: {"nom":"Dupont","personnes":4,"date":"2026-03-10"} | ❌ |
| `reservation_id` | Réservation créée suite à cette conversation | Référence → RESERVATION | FK, nullable | ❌ |
| `statut` | Résultat de la conversation | Chaîne (20) | NOT NULL, valeurs : 'complete', 'incomplete', 'erreur' | ✅ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

---

## 9. NOTIFICATION_SMS

> Message SMS envoyé à un client dans le cadre d'une réservation (confirmation, rappel 24h, annulation, proposition de créneau alternatif). Permet le suivi et l'audit des communications.

**Alignement** : CDCF §3.1.4 (Système de Notifications SMS) + §7.2 entité prévue

| Attribut | Signification | Type conceptuel | Contraintes | Obligatoire |
|----------|---------------|-----------------|-------------|:-----------:|
| `id` | Identifiant unique de la notification | Entier auto-incrémenté | PK | ✅ |
| `reservation_id` | Réservation associée à cette notification | Référence → RESERVATION | FK, NOT NULL | ✅ |
| `telephone_destinataire` | Numéro de téléphone du destinataire | Chaîne (20) | NOT NULL | ✅ |
| `message` | Contenu du SMS envoyé | Texte | NOT NULL | ✅ |
| `type` | Type de notification | Chaîne (20) | NOT NULL, valeurs : 'confirmation', 'rappel', 'annulation', 'proposition' | ✅ |
| `statut_envoi` | État de l'envoi du SMS | Chaîne (20) | NOT NULL, valeurs : 'en_attente', 'envoye', 'echec' | ✅ |
| `date_envoi` | Date/Heure d'envoi effectif | Date/Heure | nullable | ❌ |
| `id_externe_twilio` | Identifiant du message côté Twilio (SID) | Chaîne (50) | nullable, UNIQUE si non null | ❌ |
| `created_at` | Date de création de l'enregistrement | Date/Heure | NOT NULL | ✅ |

---

## Synthèse

| # | Entité | Nb attributs | Rôle métier | Source |
|---|--------|:------------:|-------------|--------|
| 1 | RESTAURANT | 9 | Établissement racine | CDCF §7.2, Code existant |
| 2 | USER | 5 | Authentification dashboard | Code existant, CDCF §3.1.3.A |
| 3 | TABLE_RESTAURANT | 7 | Table physique du restaurant | CDCF §7.2, Code existant |
| 4 | SERVICE | 7 | Période de service (midi/soir) | CDCF §7.2 + CreneauHoraire fusionné |
| 5 | FERMETURE_EXCEPTIONNELLE | 5 | Dates de fermeture | Wireframes Jalon 2 |
| 6 | CLIENT | 9 | Personne qui réserve | CDCF §7.2, Code existant |
| 7 | RESERVATION | 11 | Réservation de table (entité centrale) | CDCF §7.2, Code existant |
| 8 | CONVERSATION_IA | 11 | Historique conversation chatbot | CDCF §7.2 |
| 9 | NOTIFICATION_SMS | 9 | Messages SMS envoyés | CDCF §7.2 |
| | **TOTAL** | **73** | | |
