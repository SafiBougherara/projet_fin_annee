# CALENDRIA – Jalon 3 : Modélisation de la Base de Données

**Projet** : CALENDRIA – Assistant de Réservation Intelligent Multi-Canal  
**Auteur** : BOUGHERARA Safi  
**Formation** : CDA – Concepteur Développeur d'Applications  
**Date** : Mars 2026  
**Jalon** : 3 – Modélisation de la Base de Données  
**Échéance** : 31/03/2026  

---

## Introduction à la Démarche MERISE

La modélisation de la base de données de CALENDRIA suit la démarche **MERISE**, une méthodologie de conception par niveaux qui garantit la **cohérence** entre les besoins fonctionnels (exprimés dans le CDCF, Jalon 1) et l'implémentation technique (base PostgreSQL).

### Progression MCD → MLD → MPD

```
 ┌─────────────────────────────────────────────────────┐
 │  NIVEAU CONCEPTUEL (MCD)                            │
 │  ─────────────────────                              │
 │  • Quelles sont les ENTITÉS métier ?                │
 │  • Quelles sont les ASSOCIATIONS entre elles ?      │
 │  • Quelles sont les CARDINALITÉS ?                  │
 │  • Indépendant de toute technologie                 │
 └──────────────────────┬──────────────────────────────┘
                        │ Transformation
                        ▼
 ┌─────────────────────────────────────────────────────┐
 │  NIVEAU LOGIQUE (MLD)                               │
 │  ────────────────────                               │
 │  • Transformation des entités en TABLES             │
 │  • Identification des CLÉS PRIMAIRES et ÉTRANGÈRES  │
 │  • Résolution des associations N:M (si existantes)  │
 │  • Types de données GÉNÉRIQUES                      │
 └──────────────────────┬──────────────────────────────┘
                        │ Implémentation
                        ▼
 ┌─────────────────────────────────────────────────────┐
 │  NIVEAU PHYSIQUE (MPD)                              │
 │  ─────────────────────                              │
 │  • Types SQL CONCRETS (PostgreSQL 15)               │
 │  • INDEX de performance                             │
 │  • Contraintes CHECK, UNIQUE                        │
 │  • Politiques ON DELETE                             │
 │  • Script CREATE TABLE exécutable                   │
 └─────────────────────────────────────────────────────┘
```

### Pourquoi cette démarche ?

1. **Validation progressive** : chaque niveau est vérifiable indépendamment
2. **Traçabilité** : du besoin fonctionnel (CDCF) au code SQL
3. **Qualité** : la normalisation (3NF) est vérifiée au niveau logique
4. **Indépendance** : le MCD est valide quel que soit le SGBD choisi

---

## Contenu de ce Dossier

| Fichier | Description | Format |
|---------|-------------|--------|
| [dictionnaire_donnees.md](./dictionnaire_donnees.md) | Catalogue de toutes les entités et attributs | Markdown (tableaux) |
| [MCD.puml](./MCD.puml) | Modèle Conceptuel de Données (Entité-Association) | PlantUML |
| [MLD.puml](./MLD.puml) | Modèle Logique de Données (Modèle Relationnel) | PlantUML |
| [MPD.puml](./MPD.puml) | Modèle Physique de Données (PostgreSQL 15) | PlantUML |
| [justifications.md](./justifications.md) | Justifications des choix de modélisation et 3NF | Markdown |

---

## Entités du Modèle (9 tables)

| # | Entité | Rôle | Source |
|---|--------|------|--------|
| 1 | **RESTAURANT** | Établissement racine | CDCF §7.2 |
| 2 | **USER** | Compte dashboard (authentification JWT) | Code existant |
| 3 | **TABLE_RESTAURANT** | Table physique du restaurant | CDCF §7.2 |
| 4 | **SERVICE** | Période de service (midi/soir) + jours d'ouverture | CDCF §7.2 (Service + CreneauHoraire fusionnés) |
| 5 | **FERMETURE_EXCEPTIONNELLE** | Dates de fermeture | Wireframes Jalon 2 |
| 6 | **CLIENT** | Personne qui réserve (identifiée par téléphone) | CDCF §7.2 |
| 7 | **RESERVATION** | Réservation de table (entité centrale) | CDCF §7.2 |
| 8 | **CONVERSATION_IA** | Historique conversation chatbot multi-canal | CDCF §7.2 |
| 9 | **NOTIFICATION_SMS** | Messages SMS (confirmation, rappel, annulation) | CDCF §7.2 |

---

## Comment Générer les Diagrammes

Les fichiers `.puml` sont prêts à être rendus via un serveur PlantUML :

### Option 1 : PlantUML Web Server
1. Ouvrir [plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)
2. Copier-coller le contenu du fichier `.puml`
3. Cliquer sur **Submit** → le diagramme s'affiche
4. Télécharger en PNG ou SVG

### Option 2 : Extension VS Code
1. Installer l'extension **PlantUML** (`jebbs.plantuml`)
2. Ouvrir le fichier `.puml`
3. `Alt+D` pour prévisualiser
4. Clic droit → **Export Current Diagram**

### Option 3 : Ligne de commande
```bash
# Avec Java et plantuml.jar
java -jar plantuml.jar MCD.puml MLD.puml MPD.puml
```

---

## Alignement avec les Jalons Précédents

### ← Jalon 1 (CDCF)
- Les 8 entités du CDCF sont **toutes couvertes** (avec adaptations justifiées)
- Chaque fonctionnalité du périmètre fonctionnel (§3) a ses données dans le modèle
- Les contraintes RGPD (§4.3) sont reflétées dans les attributs `consentement_rgpd` et `date_consentement`

### ← Jalon 2 (UX/UI)
- Chaque écran des wireframes a ses données source identifiées
- L'entité `FermetureExceptionnelle` provient directement des wireframes "Paramètres"
- Les codes couleur de statut (wireframes) correspondent aux valeurs de l'ENUM `statut`

### → Jalon 4 (Architecture & UML)
- Les diagrammes de classes UML (Jalon 4) pourront être dérivés directement de ce MLD
- Les entités Doctrine existantes dans `backend/src/Entity/` sont alignées avec le MPD
- Les nouvelles entités (`ConversationIA`, `NotificationSMS`, `FermetureExceptionnelle`) seront à créer via `php bin/console make:entity`
