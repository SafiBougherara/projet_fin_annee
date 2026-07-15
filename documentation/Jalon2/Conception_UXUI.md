# CALENDRIA – Conception UX/UI

**Projet** : CALENDRIA – Assistant de Réservation Intelligent Multi-Canal  
**Auteur** : BOUGHERARA Safi  
**Formation** : CDA – Concepteur Développeur d'Applications  
**Date** : Février 2026  
**Jalon** : 2 – Méthodologie de Projet & Conception UI/UX  

---

## Table des Matières

1. [Sitemap / Architecture des Écrans](#1-sitemap--architecture-des-écrans)
2. [Wireframes (Maquettes Fil de Fer)](#2-wireframes-maquettes-fil-de-fer)
3. [Charte Graphique](#3-charte-graphique)
4. [Maquettes Haute Fidélité](#4-maquettes-haute-fidélité)
5. [Considérations UX](#5-considérations-ux)

---

## 1. Sitemap / Architecture des Écrans

### 1.1 Structure Globale

L'application CALENDRIA est composée de deux interfaces distinctes :

1. **Dashboard Restaurateur** (Application Web React) : Interface de gestion accessible après authentification
2. **Interface Client** (Multi-canal) : Accès via WhatsApp, Widget Web ou SMS

### 1.2 Plan du Site – Dashboard Restaurateur

```
🔐 Connexion (/login)
│
└── 🏠 Dashboard (/dashboard)
    │
    ├── 📅 Calendrier (/calendar)
    │   ├── Vue jour
    │   ├── Vue semaine
    │   └── Vue mois
    │
    ├── 🗺️ Plan de Salle (/floor-plan)
    │   ├── Vue en direct des tables (statuts temps réel)
    │   ├── Timeline du service (Gantt par table)
    │   └── Configuration Turnover (slider durée repas)
    │
    ├── 📋 Réservations (/reservations)
    │   ├── Liste des réservations
    │   ├── Détail réservation
    │   ├── Modifier / Annuler
    │   └── Recherche & Filtres
    │
    ├── 👥 Clients (/clients)
    │   ├── Liste des clients
    │   ├── Fiche client
    │   └── Historique réservations
    │
    ├── 📊 Statistiques (/stats)
    │   ├── Taux de remplissage
    │   ├── Analyse no-show
    │   └── Export CSV/PDF
    │
    └── ⚙️ Paramètres (/settings)
        ├── Informations restaurant
        ├── Horaires & Services
        ├── Notifications
        └── RGPD / Confidentialité
```

### 1.3 Flux Client (Canaux de Réservation)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  📱 WhatsApp │   │  🌐 Widget   │   │  📲 SMS      │
│  (QR Code)   │   │  (Site web)  │   │  (Numéro)    │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                   │
       └─────────────────┬┘───────────────────┘
                         ▼
              ┌────────────────────┐
              │   🤖 Moteur IA     │
              │   (OpenAI GPT)     │
              │                    │
              │  1. Collecte infos │
              │  2. Vérif. dispo   │
              │  3. Attribution    │
              │  4. Confirmation   │
              └────────┬───────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
    ┌───────────────┐    ┌───────────────┐
    │ 📨 Notif SMS  │    │ 📊 Dashboard  │
    │ (Confirmation │    │ (Mise à jour  │
    │  + Rappel)    │    │  temps réel)  │
    └───────────────┘    └───────────────┘
```

![Sitemap – Architecture des Écrans CALENDRIA](./CALENDRIA%20-%20Sitemap%20-%20Architecture%20des%20Ecrans.png)

---

## 2. Wireframes (Maquettes Fil de Fer)

Les wireframes suivants représentent l'agencement des éléments pour les écrans clés de l'application. Ce sont des maquettes basse fidélité (fil de fer) qui définissent la structure fonctionnelle sans le design visuel final.

### 2.1 Page de Connexion
> *Répond au besoin CDCF §3.1.3.A — Authentification sécurisée des restaurateurs (email + mot de passe, session JWT Bearer Token)*

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                     ┌────────────────┐                       │
│                     │   🗓️ LOGO      │                       │
│                     │  CALENDRIA     │                       │
│                     └────────────────┘                       │
│                                                              │
│                  ┌────────────────────────┐                  │
│                  │                        │                  │
│                  │   📧 Email             │                  │
│                  │   ┌──────────────────┐ │                  │
│                  │   │                  │ │                  │
│                  │   └──────────────────┘ │                  │
│                  │                        │                  │
│                  │   🔒 Mot de passe      │                  │
│                  │   ┌──────────────────┐ │                  │
│                  │   │                  │ │                  │
│                  │   └──────────────────┘ │                  │
│                  │                        │                  │
│                  │   ☐ Se souvenir de moi │                  │
│                  │                        │                  │
│                  │   ┌──────────────────┐ │                  │
│                  │   │   SE CONNECTER   │ │                  │
│                  │   └──────────────────┘ │                  │
│                  │                        │                  │
│                  │   Mot de passe oublié? │                  │
│                  │                        │                  │
│                  └────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Dashboard (Tableau de Bord) – Desktop
> *Répond au besoin CDCF §3.1.3 — Interface Dashboard Restaurateur : KPIs temps réel, planning du service, vue d'ensemble des réservations*

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗓️ CALENDRIA               🔔 Notifications    👤 Safi B.    ⚙️       │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                            │
│  SIDEBAR   │   TABLEAU DE BORD                          📅 26 Fév 2026 │
│            │                                                            │
│  🏠 Accueil│   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐│
│            │   │ 📋 12      │ │ 👥 48      │ │ 📈 85%     │ │ ⚠️ 2   ││
│  📅 Calen- │   │ Réservation│ │ Couverts   │ │ Remplissage│ │ No-show││
│    drier   │   │ aujourd'hui│ │ attendus   │ │ du jour    │ │ ce mois││
│            │   └────────────┘ └────────────┘ └────────────┘ └────────┘│
│  🗺️ Plan  │                                                            │
│   de Salle │   PROCHAINES ARRIVÉES                                      │
│            │   ┌────────────────────────────────────────────────────────┐│
│  📋 Réser- │   │ Heure │ Client     │ Couverts │ Table │ Statut       ││
│    vations │   │───────│────────────│──────────│───────│──────────────││
│            │   │ 12:00 │ M. Dupont  │    4     │  T3   │ 🟢 Confirmée││
│  👥 Clients│   │ 12:15 │ Mme Martin │    2     │  T1   │ 🟡 Imminente││
│            │   │ 12:30 │ M. Bernard │    6     │  T5   │ 🟢 Confirmée││
│  📊 Stats  │   │ 13:00 │ Mme Petit  │    2     │  T2   │ 🟢 Confirmée││
│  ⚙️ Param. │   └────────────────────────────────────────────────────────┘│
│            │                                                            │
│            │   RÉSERVATIONS PAR SERVICE                                  │
│            │   ┌──────────────────────┐  ┌──────────────────────┐       │
│            │   │  SERVICE MIDI        │  │  SERVICE SOIR         │       │
│            │   │  ████████░░ 8/10     │  │  ██████░░░░ 6/10      │       │
│            │   │  12h00 - 14h30       │  │  19h00 - 22h30        │       │
│            │   └──────────────────────┘  └──────────────────────┘       │
│            │                                                            │
├────────────┴─────────────────────────────────────────────────────────────┤
│  © 2026 CALENDRIA – Assistant de Réservation Intelligent                │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Dashboard – Version Mobile
> *Répond à la contrainte CDCF §4.4 — Interface responsive : le dashboard doit être utilisable sur tablette et smartphone par le restaurateur en salle*

```
┌───────────────────────┐
│ ☰  CALENDRIA     🔔 👤│
├───────────────────────┤
│                       │
│  TABLEAU DE BORD      │
│  📅 26 Février 2026   │
│                       │
│  ┌─────────┐┌────────┐│
│  │ 📋 12   ││ 👥 48  ││
│  │ Réserv. ││Couverts││
│  └─────────┘└────────┘│
│  ┌─────────┐┌────────┐│
│  │ 📈 85%  ││ ⚠️ 2   ││
│  │ Rempli. ││No-show ││
│  └─────────┘└────────┘│
│                       │
│  PROCHAINES ARRIVÉES  │
│  ─────────────────    │
│  🟡 12:15 Mme Martin │
│     2 pers. – Table 1 │
│                       │
│  🟢 12:30 M. Bernard │
│     6 pers. – Table 5 │
│                       │
│  🟢 13:00 Mme Petit  │
│     2 pers. – Table 2 │
│                       │
│  ┌───────────────────┐│
│  │  VOIR TOUT  →     ││
│  └───────────────────┘│
│                       │
│  SERVICE MIDI 8/10    │
│  ████████░░           │
│                       │
│  SERVICE SOIR 6/10    │
│  ██████░░░░           │
│                       │
├───────────────────────┤
│🏠 📅 🗺️ 📋 👥│
│Accueil Cal. Plan Rés. Clients│
└───────────────────────┘
```

### 2.4 Page Réservations – Desktop
> *Répond au besoin CDCF §3.1.3.D — Gestion des Réservations : liste filtrable, statuts visuels, actions rapides (modifier, annuler, marquer arrivé)*

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗓️ CALENDRIA               🔔 Notifications    👤 Safi B.    ⚙️       │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                            │
│  SIDEBAR   │   RÉSERVATIONS                                             │
│            │                                                            │
│  🏠 Accueil│   ┌──────────────────────────────────────────────────────┐ │
│            │   │ 🔍 Rechercher (nom, téléphone...)    📅 Date  🔽    │ │
│  📅 Calen- │   │ Service: [Tous 🔽]  Statut: [Tous 🔽]              │ │
│    drier   │   └──────────────────────────────────────────────────────┘ │
│            │                                                            │
│  🗺️ Plan  │   ┌──────────────────────────────────────────────────────┐ │
│   de Salle │   │ ☐ │ Heure │ Client      │ Pers│ Table │ Statut     │ │
│            │   │───│───────│─────────────│─────│───────│────────────│ │
│  📋 Réser- │   │ ☐ │ 12:00 │ M. Dupont   │  4  │  T3   │ 🟢 Conf.  │ │
│    vations │   │ ☐ │ 12:15 │ Mme Martin  │  2  │  T1   │ 🟡 Immi.  │ │
│   ←active  │   │ ☐ │ 12:30 │ M. Bernard  │  6  │  T5   │ 🟢 Conf.  │ │
│            │   │ ☐ │ 19:00 │ M. Leroy    │  4  │  T4   │ 🟢 Conf.  │ │
│  👥 Clients│   │ ☐ │ 19:30 │ Mme Moreau  │  2  │  T2   │ 🔵 Arrivé │ │
│            │   │ ☐ │ 20:00 │ M. Simon    │  8  │ T5+T6 │ 🟢 Conf.  │ │
│  📊 Stats  │   │ ☐ │ 20:30 │ Mme Durand  │  2  │  T1   │ 🔴 No-show│ │
│  ⚙️ Param. │   └──────────────────────────────────────────────────────┘ │
│            │                                                            │
│            │   Affichage 1-7 sur 12       ◀ 1 2 ▶     Actions:         │
│            │                                          [✏️ Modifier]     │
│            │                                          [❌ Annuler]      │
│            │                                          [✅ Arrivé]       │
├────────────┴─────────────────────────────────────────────────────────────┤
│  © 2026 CALENDRIA                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.5 Plan de Salle – Vue en Direct – Desktop
> *Répond aux besoins CDCF §3.1.2.A (configuration des tables) et §3.1.3.C (vue temps réel avec statuts couleur et timeline de service)*

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗓️ CALENDRIA               🔔 Notifications    👤 Safi B.    ⚙️       │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                            │
│  SIDEBAR   │   PLAN DE SALLE / VUE EN DIRECT       26 février 2026      │
│            │   🟢 Free  🔴 Occupied  🟡 Imminent  🔵 Reserved          │
│            │                                                            │
│            │   ┌──────────────────────┐  TIMELINE DU SERVICE 12h→22h30  │
│            │   │  ┌────┐ ┌────┐      │  ┌──────────────────────────────┐│
│            │   │  │ T1 │ │ T2 │      │  │ T1  ████░░░░░░░░░░░░░░░░░░ ││
│            │   │  │🔴  │ │🟡  │      │  │ T2  ██████░░░░░░░░░░░░░░░░ ││
│            │   │  └────┘ └────┘      │  │ T3  ░░████████░░░░░░░░░░░░ ││
│            │   │  ┌────┐ ┌────┐ ┌──┐ │  │ T4  ░░░░░░████░░░░████░░░░ ││
│            │   │  │ T3 │ │ T4 │ │T5│ │  │ ...                        ││
│            │   │  │🟢  │ │🔵  │ │🟢│ │  │ T21 ░░░░░░░░░░░░░░░░████░░ ││
│            │   │  └────┘ └────┘ └──┘ │  └──────────────────────────────┘│
│            │   │            ...      │                                  │
│            │   │  ┌────┐ ┌────┐      │  Configuration Turnover    ✕     │
│            │   │  │T20│ │T21│       │  ──────●────────── 1h30 (90 min) │
│            │   │  │🟢  │ │🔴  │      │  30min              3h          │
│            │   │  └────┘ └────┘      │                                  │
│            │   └──────────────────────┘                                  │
│            │                                                            │
├────────────┴─────────────────────────────────────────────────────────────┤
│  © 2026 CALENDRIA                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

Cette vue combine :
- **Plan spatial** (gauche) : position des tables avec couleur de statut en temps réel
- **Timeline Gantt** (droite) : occupation de chaque table sur toute la durée du service
- **Slider Turnover** : ajustement de la durée estimée d'un repas (30min – 3h)

### 2.6 Paramètres – Horaires & Services
> *Répond au besoin CDCF §3.1.2.B — Gestion des Services : configuration des horaires midi/soir, jours d'ouverture JSONB, fermetures exceptionnelles*

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗓️ CALENDRIA               🔔 Notifications    👤 Safi B.    ⚙️       │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                            │
│  SIDEBAR   │   PARAMÈTRES > HORAIRES & SERVICES                        │
│            │                                                            │
│            │   ┌─────────────────────────────────────────────────────┐  │
│            │   │  SERVICE MIDI                                       │  │
│            │   │  Début : [12:00 🔽]   Fin : [14:30 🔽]             │  │
│            │   │  Durée repas : [1h30 🔽]                            │  │
│            │   │  Max couverts : [__30__]                             │  │
│            │   │  Créneau réservation : [30 min 🔽]                  │  │
│            │   └─────────────────────────────────────────────────────┘  │
│            │                                                            │
│            │   ┌─────────────────────────────────────────────────────┐  │
│            │   │  SERVICE SOIR                                       │  │
│            │   │  Début : [19:00 🔽]   Fin : [22:30 🔽]             │  │
│            │   │  Durée repas : [2h00 🔽]                            │  │
│            │   │  Max couverts : [__40__]                             │  │
│            │   │  Créneau réservation : [30 min 🔽]                  │  │
│            │   └─────────────────────────────────────────────────────┘  │
│            │                                                            │
│            │   JOURS D'OUVERTURE                                        │
│            │   ☑ Lun  ☑ Mar  ☑ Mer  ☑ Jeu  ☑ Ven  ☑ Sam  ☐ Dim       │
│            │                                                            │
│            │   FERMETURES EXCEPTIONNELLES                               │
│            │   ┌──────────────────────────────────────────────────┐     │
│            │   │ 📅 25/12/2026 – Noël                    [🗑️]   │     │
│            │   │ 📅 01/01/2027 – Nouvel An               [🗑️]   │     │
│            │   └──────────────────────────────────────────────────┘     │
│            │   [+ Ajouter une fermeture]                                │
│            │                                                            │
│            │   ┌─────────────────────┐                                  │
│            │   │   💾 ENREGISTRER    │                                  │
│            │   └─────────────────────┘                                  │
│            │                                                            │
├────────────┴─────────────────────────────────────────────────────────────┤
│  © 2026 CALENDRIA                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.7 Widget Web Chatbot (Côté Client)
> *Répond au besoin CDCF §3.1.1 — Module IA Conversationnel multi-canal : widget web intégrable côté client pour réservation en langage naturel*

```
                                          ┌────────────────────────────┐
                                          │  CALENDRIA 🗓️         ✕   │
                                          ├────────────────────────────┤
                                          │                            │
                                          │  ┌──────────────────────┐  │
                                          │  │ 🤖 Bonjour ! Je suis │  │
                                          │  │ l'assistant de La    │  │
                                          │  │ Belle Assiette.      │  │
                                          │  │ Pour quelle date     │  │
                                          │  │ souhaitez-vous       │  │
                                          │  │ réserver ?           │  │
                                          │  └──────────────────────┘  │
                                          │                            │
                                          │         ┌──────────────┐   │
                                          │         │ Demain soir  │   │
                                          │         └──────────────┘   │
                                          │                            │
                                          │  ┌──────────────────────┐  │
                                          │  │ 🤖 Parfait ! Pour   │  │
                                          │  │ combien de personnes │  │
                                          │  │ ?                    │  │
                                          │  └──────────────────────┘  │
                                          │                            │
                                          │  ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
                                          │  │ 2│ │ 4│ │ 6│ │ 8│    │
                                          │  └──┘ └──┘ └──┘ └──┘    │
                                          │                            │
                                          ├────────────────────────────┤
                                          │  ┌──────────────────┐ [➤] │
                                          │  │ Tapez un message  │     │
                                          │  └──────────────────┘     │
                                          └────────────────────────────┘

        ┌────────┐
        │  💬    │   ← Bulle de chat flottante
        └────────┘      (bas à droite du site)
```

### 2.8 Fiche Client – Desktop
> *Répond au besoin CDCF §3.1.5 — Gestion des Clients : profil, historique des réservations, préférences, taux no-show, droit à l'oubli RGPD*

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗓️ CALENDRIA               🔔 Notifications    👤 Safi B.    ⚙️       │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                            │
│  SIDEBAR   │   👥 FICHE CLIENT                                          │
│            │                                                            │
│            │   ┌─────────────────────────────────────────────────────┐  │
│            │   │  👤 Jean DUPONT                                     │  │
│            │   │                                                     │  │
│            │   │  📞 06 12 34 56 78                                  │  │
│            │   │  📧 jean.dupont@email.com                           │  │
│            │   │  📅 Client depuis : 15/01/2026                      │  │
│            │   │  🍽️ Préférences : Allergie gluten, table terrasse   │  │
│            │   │  ✅ RGPD : Consentement donné le 15/01/2026         │  │
│            │   │                                                     │  │
│            │   │  STATISTIQUES                                       │  │
│            │   │  Visites totales : 8  |  No-show : 1 (12,5%)       │  │
│            │   └─────────────────────────────────────────────────────┘  │
│            │                                                            │
│            │   HISTORIQUE DES RÉSERVATIONS                              │
│            │   ┌──────────────────────────────────────────────────────┐ │
│            │   │ Date       │ Heure │ Pers │ Table │ Statut          │ │
│            │   │────────────│───────│──────│───────│─────────────────│ │
│            │   │ 26/02/2026 │ 20:00 │  4   │  T3   │ 🟢 Confirmée   │ │
│            │   │ 14/02/2026 │ 20:30 │  2   │  T7   │ 🔵 Terminée    │ │
│            │   │ 02/02/2026 │ 12:00 │  4   │  T3   │ 🔵 Terminée    │ │
│            │   │ 20/01/2026 │ 19:30 │  6   │  T5   │ 🔴 No-show     │ │
│            │   └──────────────────────────────────────────────────────┘ │
│            │                                                            │
│            │   [✏️ Modifier]  [📤 Exporter données]  [🗑️ Supprimer]   │
│            │                                                            │
├────────────┴─────────────────────────────────────────────────────────────┤
│  © 2026 CALENDRIA                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Charte Graphique

### 3.1 Identité Visuelle

**Nom** : CALENDRIA  
**Ton** : **Professionnel, moderne et chaleureux** – L'application doit inspirer confiance au restaurateur tout en restant accessible et agréable à utiliser au quotidien.

**Logo** : Icône combinant un calendrier stylisé avec un élément de restauration (couverts ou assiette). Le logo utilise un dégradé de la couleur primaire vers la couleur secondaire.

### 3.2 Palette de Couleurs

#### Couleurs Principales

| Rôle | Nom | Hex | Aperçu | Usage |
|------|-----|-----|--------|-------|
| **Primaire** | Bleu Profond | `#1A5276` | 🔵 | Navigation, headers, boutons principaux |
| **Primaire clair** | Bleu Ciel | `#2E86C1` | 🔵 | Liens, éléments interactifs, hover |
| **Secondaire** | Corail Chaud | `#E74C3C` | 🔴 | Accents, CTA secondaires, notifications |
| **Secondaire clair** | Pêche | `#F1948A` | 🟠 | Badges, alertes douces |

#### Couleurs de Statut

| Statut | Nom | Hex | Usage |
|--------|-----|-----|-------|
| **Succès** | Vert Menthe | `#27AE60` | Réservation confirmée, messages de succès |
| **Attention** | Ambre | `#F39C12` | Arrivée imminente, avertissements |
| **Info** | Bleu Ciel | `#3498DB` | Client arrivé, informations |
| **Erreur** | Rouge Tomate | `#E74C3C` | No-show, erreurs, annulations |
| **Neutre** | Gris Ardoise | `#7F8C8D` | Annulée, éléments désactivés |

#### Couleurs de Fond et Texte

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| **Fond principal** | Blanc Neige | `#FAFBFC` | Fond de page |
| **Fond carte** | Blanc Pur | `#FFFFFF` | Cards, panneaux |
| **Fond sidebar** | Bleu Nuit | `#0E2F44` | Barre latérale |
| **Texte principal** | Anthracite | `#2C3E50` | Titres, texte courant |
| **Texte secondaire** | Gris Moyen | `#7F8C8D` | Sous-titres, labels |
| **Bordures** | Gris Clair | `#E5E8EB` | Séparateurs, bordures de cards |

#### Justification des Choix

- **Bleu profond (`#1A5276`)** : Couleur associée à la confiance, la fiabilité et le professionnalisme. Elle rassure le restaurateur qui confie la gestion de ses réservations à l'outil.
- **Corail chaud (`#E74C3C`)** : Couleur dynamique qui évoque la chaleur et la convivialité de la restauration. Utilisée avec parcimonie pour attirer l'attention sur les éléments clés.
- **Fond clair (`#FAFBFC`)** : Interface aérée et professionnelle, réduisant la fatigue visuelle lors d'une utilisation prolongée (le restaurateur consulte le dashboard toute la journée).
- **Sidebar sombre (`#0E2F44`)** : Contraste fort avec le contenu, guide naturellement l'œil vers la zone de travail principale.

### 3.3 Typographie

#### Polices de Caractères

| Usage | Police | Famille | Source |
|-------|--------|---------|--------|
| **Titres (h1, h2, h3)** | **Outfit** | Sans-serif | [Google Fonts](https://fonts.google.com/specimen/Outfit) |
| **Texte courant** | **Inter** | Sans-serif | [Google Fonts](https://fonts.google.com/specimen/Inter) |
| **Code / Données** | **JetBrains Mono** | Monospace | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

#### Hiérarchie Typographique

| Élément | Police | Taille | Poids | Espacement |
|---------|--------|--------|-------|------------|
| **H1 – Titre de page** | Outfit | 28px | Bold (700) | -0.02em |
| **H2 – Sous-titre** | Outfit | 22px | Semi-Bold (600) | -0.01em |
| **H3 – Titre de section** | Outfit | 18px | Semi-Bold (600) | 0 |
| **Body – Texte courant** | Inter | 14px | Regular (400) | 0 |
| **Body Large** | Inter | 16px | Regular (400) | 0 |
| **Small – Labels, légendes** | Inter | 12px | Medium (500) | 0.02em |
| **Button** | Inter | 14px | Semi-Bold (600) | 0.03em |

#### Justification des Choix Typographiques

- **Outfit** : Police géométrique moderne, idéale pour les titres. Ses formes arrondies apportent de la chaleur sans sacrifier la lisibilité.
- **Inter** : Conçue spécifiquement pour les interfaces utilisateur, excellent rendu à petite taille, très lisible sur écran. C'est la police de référence pour les applications SaaS modernes.
- **JetBrains Mono** : Pour les données tabulaires (numéros de table, identifiants), la monospace garantit un alignement parfait.

### 3.4 Style des Composants

#### Boutons

| Type | Apparence | Usage |
|------|-----------|-------|
| **Primaire** | Fond bleu `#1A5276`, texte blanc, border-radius 8px | Actions principales (Enregistrer, Confirmer) |
| **Secondaire** | Bordure bleu `#1A5276`, fond transparent, texte bleu | Actions secondaires (Annuler, Retour) |
| **Danger** | Fond rouge `#E74C3C`, texte blanc | Actions destructives (Supprimer, Annuler réservation) |
| **Ghost** | Pas de bordure, texte bleu, hover: fond léger | Liens et actions tertiaires |

#### Cards (Cartes)

- Fond blanc `#FFFFFF`
- Border-radius : 12px
- Ombre : `0 2px 8px rgba(0, 0, 0, 0.08)`
- Padding : 24px
- Hover : ombre plus prononcée `0 4px 16px rgba(0, 0, 0, 0.12)`

#### Inputs (Champs de Saisie)

- Bordure : 1px solid `#E5E8EB`
- Border-radius : 8px
- Padding : 12px 16px
- Focus : bordure `#2E86C1`, ombre `0 0 0 3px rgba(46, 134, 193, 0.15)`
- Erreur : bordure `#E74C3C`, ombre `0 0 0 3px rgba(231, 76, 60, 0.15)`

#### Icônes

- **Style** : Outlined (contour), cohérent avec Material Icons (MUI)
- **Taille** : 20px pour inline, 24px pour navigation, 48px pour états vides
- **Couleur** : Hérite de la couleur du texte parent

### 3.5 Espacements et Grille

| Token | Valeur | Usage |
|-------|--------|-------|
| `spacing-xs` | 4px | Espacement minimal |
| `spacing-sm` | 8px | Espacement entre éléments proches |
| `spacing-md` | 16px | Espacement standard |
| `spacing-lg` | 24px | Padding des cards, sections |
| `spacing-xl` | 32px | Séparation entre sections |
| `spacing-2xl` | 48px | Marges de page |

**Grille** : Layout basé sur CSS Grid / Flexbox
- **Sidebar** : Largeur fixe 260px (collapsible à 72px sur mobile)
- **Contenu** : Largeur fluide, max-width 1200px
- **Gouttières** : 24px entre les colonnes

---

## 4. Maquettes Haute Fidélité

> **⚠️ À réaliser par Safi sur Figma**

Les maquettes haute fidélité doivent être réalisées dans **Figma** (ou Adobe XD) en appliquant la charte graphique définie ci-dessus. Les maquettes doivent couvrir **au minimum 2 écrans** :

### Écrans Requis

1. **Dashboard (Tableau de bord)** – Version Desktop (1440px)
2. **Dashboard (Tableau de bord)** – Version Mobile (375px)

### Écrans Recommandés (bonus)

3. Page de Connexion – Desktop
4. Page Réservations – Desktop
5. Widget Chatbot – Desktop (bulle flottante)

### Instructions pour la Réalisation

1. **Créer un fichier Figma** avec les pages suivantes :
   - "Design System" (tokens : couleurs, typographies, composants)
   - "Desktop" (maquettes 1440px de large)
   - "Mobile" (maquettes 375px de large)

2. **Appliquer la charte graphique** :
   - Couleurs : Utiliser les codes hex définis en section 3.2
   - Polices : Outfit pour les titres, Inter pour le texte courant
   - Composants : Respecter les styles de boutons, cards, inputs définis en section 3.4

3. **Se baser sur les wireframes** de la section 2 pour la disposition des éléments

4. **Exporter** les maquettes en PNG (ou fournir le lien Figma) pour les inclure dans le PDF final

---

## 5. Considérations UX

### 5.1 Principes UX Appliqués

#### A. Mobile First

L'application est conçue avec une approche **Mobile First** :

- Le dashboard est d'abord pensé pour être consultable rapidement sur smartphone (le restaurateur vérifie ses réservations sur son téléphone pendant le service).
- Les layouts sont conçus mobile d'abord, puis enrichis pour desktop.
- La navigation mobile utilise une **bottom navigation bar** (onglets en bas de l'écran) pour un accès rapide aux sections principales.
- Le dashboard desktop propose une **sidebar** latérale pour une navigation plus riche.

#### B. Simplicité d'Utilisation

- **3 clics maximum** pour accéder à n'importe quelle information importante (ex : voir le détail d'une réservation).
- **Dashboard par défaut** après connexion : le restaurateur voit immédiatement les informations du jour sans action supplémentaire.
- **Actions contextuelles** : les boutons d'action (modifier, annuler, marquer arrivé) sont disponibles directement dans les listes, pas dans des menus cachés.

#### C. Retours Visuels Clairs

| Situation | Retour Visuel |
|-----------|---------------|
| Nouvelle réservation | 🟢 Toast notification verte + animation subtile dans la liste |
| Réservation annulée | 🔴 Toast notification rouge avec confirmation avant action |
| Arrivée client | 🔵 Changement de couleur de la ligne + effet de transition |
| No-show | 🔴 Alerte discrète + mise à jour du compteur |
| Erreur de formulaire | ❌ Bordure rouge sur le champ + message explicatif sous le champ |
| Succès d'enregistrement | ✅ Toast notification verte "Modifications enregistrées" |
| Chargement | ⏳ Skeleton loading (placeholder grisé animé) |

#### D. Code Couleur des Statuts

Un système de couleurs cohérent est utilisé dans toute l'application pour les statuts de réservation et les tables :

**Statuts des réservations :**

| Statut | Couleur | Icône | Signification |
|--------|---------|-------|---------------|
| **Confirmée** | 🟢 Vert | ✅ | Réservation validée, client attendu |
| **Imminente** | 🟡 Ambre | ⏰ | Arrivée dans moins de 30 minutes |
| **Arrivé** | 🔵 Bleu | 👋 | Client présent au restaurant |
| **No-show** | 🔴 Rouge | ❌ | Client absent sans prévenir |
| **Annulée** | ⚫ Gris | ⊘ | Réservation annulée (par client ou restaurateur) |
| **Terminée** | 🔵 Bleu clair | ✓ | Repas terminé, client parti |

**Statuts des tables (Plan de Salle) :**

| Statut | Couleur | Signification |
|--------|---------|---------------|
| **Free** | 🟢 Vert | Table libre, disponible |
| **Occupied** | 🔴 Rouge | Table actuellement occupée |
| **Imminent** | 🟡 Ambre | Réservation imminente (< 30 min) |
| **Reserved** | 🔵 Bleu | Table réservée pour un service à venir |

### 5.2 Accessibilité

L'application respecte les principes d'accessibilité **WCAG 2.1 niveau AA** :

| Critère | Implémentation |
|---------|----------------|
| **Contraste** | Ratio minimum 4.5:1 pour le texte, 3:1 pour les éléments interactifs |
| **Navigation clavier** | Tous les éléments interactifs accessibles au clavier (Tab, Enter, Espace) |
| **Labels** | Tous les champs de formulaire ont des labels explicites |
| **Alt text** | Toutes les images ont des textes alternatifs descriptifs |
| **Taille de cible** | Minimum 44x44px pour les zones cliquables sur mobile |
| **Couleurs** | Les informations ne sont jamais transmises uniquement par la couleur (ajout d'icônes/texte) |
| **Focus visible** | Indicateur de focus visible sur tous les éléments interactifs |

### 5.3 Parcours Utilisateur Type

#### Parcours Restaurateur : Voir les Réservations du Jour

```
1. Connexion (email + mot de passe)
   ↓
2. Dashboard s'affiche automatiquement
   → Voit immédiatement : nb réservations, couverts attendus, taux remplissage
   ↓
3. Section "Prochaines arrivées" visible sans scroll
   → Statut coloré, heure, nom, nb personnes, table
   ↓
4. Clic sur une réservation → Détail complet
   → Peut modifier / annuler / marquer arrivé en 1 clic
```

**Temps estimé** : < 10 secondes pour voir les infos du jour, < 3 clics pour agir.

#### Parcours Client : Réserver via WhatsApp

```
1. Scan du QR Code sur le menu / clic sur le lien
   ↓
2. Ouverture WhatsApp → Message automatique "Bonjour"
   ↓
3. Le bot demande la date souhaitée
   → Client répond en langage naturel ("demain soir")
   ↓
4. Le bot demande le nombre de personnes
   → Client répond ("4 personnes")
   ↓
5. Le bot demande l'heure
   → Client répond ("20h")
   ↓
6. Le bot vérifie la disponibilité en temps réel
   → Si dispo : Confirmation immédiate ✅
   → Si pas dispo : Propositions alternatives
   ↓
7. Le bot demande le nom
   ↓
8. Confirmation finale avec récapitulatif
   → SMS de confirmation envoyé
   → Rappel 24h avant automatique
```

**Temps estimé** : < 2 minutes pour une réservation complète.

### 5.4 Responsive Design

| Breakpoint | Largeur | Adaptation |
|------------|---------|------------|
| **Mobile** | < 768px | Navigation bottom bar, cards empilées, sidebar cachée |
| **Tablet** | 768px - 1024px | Sidebar collapsible, grille 2 colonnes |
| **Desktop** | > 1024px | Sidebar étendue, grille multi-colonnes, tableau complet |

### 5.5 Micro-Interactions

| Élément | Animation | Objectif |
|---------|-----------|---------|
| **Nouvelle réservation** | Slide-in + flash vert | Attirer l'attention sans interrompre |
| **Changement de statut** | Transition de couleur 300ms | Feedback visuel fluide |
| **Hover sur une ligne** | Fond légèrement plus sombre | Indiquer la ligne sélectionnable |
| **Ouverture sidebar mobile** | Slide depuis la gauche + overlay | Navigation fluide |
| **Skeleton loading** | Pulse animation sur placeholders | Réduire la perception d'attente |
| **Toast notifications** | Slide-in depuis le haut + auto-dismiss 4s | Information sans interférence |

---

## Annexes

### A. Outils Utilisés

| Outil | Usage |
|-------|-------|
| **Figma** | Maquettes haute fidélité (à réaliser) |
| **PlantUML** | Diagrammes Sitemap et Gantt |
| **Google Fonts** | Polices Outfit, Inter, JetBrains Mono |
| **Material Icons** | Icônes de l'interface |

### B. Références Design

- [Material Design 3 (Google)](https://m3.material.io/)
- [Dribbble – Restaurant Dashboard](https://dribbble.com/search/restaurant-dashboard)
- [Figma Community – SaaS Dashboard Templates](https://www.figma.com/community/search?resource_type=mixed&sort_by=relevancy&query=saas+dashboard)
