# PLAN DU RAPPORT FINAL — CALENDRIA
## Guide d'Assemblage PDF (Jalon 6)

**Auteur :** BOUGHERARA Safi  
**Date :** Juillet 2026  

---

> Ce document est ton guide de travail pour assembler le rapport final en PDF.  
> Chaque section indique **quel fichier Markdown utiliser**, **dans quel ordre**, et les **éléments à insérer** (images PlantUML, captures d'écran).

---

## Structure du Rapport Final (11 Chapitres)

| # | Titre du Chapitre | Source Markdown | Statut |
|---|---|---|---|
| — | Page de couverture | **À créer toi-même** (voir Section 2) | ✍️ |
| — | Sommaire | **Auto-généré** par Word/Pandoc | 🔧 |
| — | Remerciements (optionnel) | **À créer toi-même** | ✍️ |
| I | Présentation du Projet | `documentation/Jalon1/CahierDesCharges.md` (intro) | ✅ |
| II | Périmètre Fonctionnel & CDCF | `documentation/Jalon1/CDCF_CALENDRIA_Jalon1.md` | ✅ |
| III | Méthodologie & Organisation | `documentation/Jalon2/Methodologie_Organisation.md` | ✅ |
| IV | Conception UI/UX | `documentation/Jalon2/Conception_UXUI.md` | ✅ |
| V | Modélisation de la Base de Données | `documentation/Jalon3/README_Jalon3.md` + schémas | ✅ |
| VI | Dictionnaire des Données | `documentation/Jalon3/dictionnaire_donnees.md` | ✅ |
| VII | Conception Technique & Architecture | `documentation/Jalon4/architecture.md` | ✅ |
| VIII | Conception UML (Cas d'Utilisation, Séquences, Classes) | `documentation/Jalon4/README_Jalon4.md` | ✅ |
| IX | Sécurité & Conformité RGPD | `documentation/Jalon5/securite.md` | ✅ |
| X | Tests Automatisés (mis à jour) | `documentation/Jalon6/chapitre_X_tests_final.md` | ✅ Jalon6 |
| XI | Déploiement & Mise en Production | `documentation/Jalon6/chapitre_XI_deploiement.md` | ✅ Jalon6 |
| — | Conclusion Générale | **Dernière section** de `chapitre_XI_deploiement.md` (§9.4) | ✅ |
| — | Annexes | Voir Section 3 | ✍️ |

---

## Section 2 — Page de Couverture (À Créer)

Crée un fichier `documentation/Jalon6/page_de_couverture.md` ou directement dans Word avec ces informations :

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CALENDRIA
   Assistant de Réservation Intelligent
          Multi-Canal avec IA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rapport de Projet — Livrable Final

Auteur      : BOUGHERARA Safi
Formation   : CDA — Concepteur Développeur d'Applications
Promotion   : 2025-2026
Centre      : [Nom du centre de formation]
Tuteur      : [Nom du tuteur pédagogique]

Commanditaire (fictif) :
  M. Gilles MOREL — Gérant de « Le Gourmet Parisien »
  15 rue de la Paix, 75001 Paris
  gilles.morel@legourmetparisien.fr

Date de soutenance : [Date]
Version     : 1.0 — Livraison Finale
Tag Git     : v1.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL Production :
  Frontend : https://frontend-production-8a43.up.railway.app
  Backend  : https://backend-production-dd10b.up.railway.app
  GitHub   : https://github.com/SafiBougherara/projet_fin_annee
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Section 3 — Schémas PlantUML à Exporter

Avant de faire le PDF, exporte tous les diagrammes PlantUML en PNG/SVG.

### Schémas à Exporter

| Fichier `.puml` | Contenu | Insérer dans le chapitre |
|---|---|---|
| `documentation/Jalon3/MCD.puml` | Modèle Conceptuel de Données | Chapitre V |
| `documentation/Jalon3/MLD.puml` | Modèle Logique de Données | Chapitre V |
| `documentation/Jalon3/MPD.puml` | Modèle Physique de Données | Chapitre V |
| `documentation/Jalon2/sitemap.puml` | Sitemap du dashboard | Chapitre IV |
| `documentation/Jalon2/gantt_planning.puml` | Planning Gantt projet | Chapitre III |
| `documentation/Jalon4/diagramme_cas_utilisation.puml` | Cas d'utilisation UML | Chapitre VIII |
| `documentation/Jalon4/sequence_authentification.puml` | Séquence Auth JWT | Chapitre VIII |
| `documentation/Jalon4/sequence_reservation_chatbot.puml` | Séquence Chatbot | Chapitre VIII |
| `documentation/Jalon4/sequence_gestion_reservation.puml` | Séquence CRUD Réservation | Chapitre VIII |
| `documentation/Jalon4/diagramme_classes.puml` | Diagramme de Classes | Chapitre VII |
| `documentation/Jalon4/architecture_ntiers.puml` | Architecture N-Tiers | Chapitre VII |
| `documentation/Jalon6/architecture_production.puml` | Architecture Production Railway | Chapitre XI |
| `documentation/Jalon6/cicd_pipeline.puml` | Pipeline CI/CD GitHub Actions | Chapitre XI |

### Comment Exporter les PlantUML en Image

**Option 1 — Plugin VS Code (recommandé) :**
1. Ouvre le fichier `.puml` dans VS Code
2. Installe l'extension "PlantUML" (jebbs.plantuml)
3. `Ctrl+Shift+P` → "PlantUML: Export Current File Diagrams"
4. Choisir PNG (300 DPI minimum)

**Option 2 — En ligne :**
1. Va sur https://plantuml.com/plantuml/
2. Colle le contenu du `.puml`
3. Télécharge en PNG

**Option 3 — Ligne de commande (si Java installé) :**
```bash
java -jar plantuml.jar -tpng documentation/**/*.puml -o documentation/exports/
```

---

## Section 4 — Ordre d'Assemblage dans Word/Pandoc

### Option A — Assemblage manuel dans Word

1. Crée un nouveau document Word (`Rapport_Final_Calendria.docx`)
2. Applique le style "Titre du document" à la page de couverture
3. Insère un **saut de page** entre chaque chapitre
4. **Colle le contenu** de chaque fichier Markdown dans l'ordre du tableau (Section 1)
5. Remplace les blocs `![image](...)` par les vraies images exportées (PNG PlantUML)
6. Génère la **Table des Matières** automatique (Références → Table des matières)
7. **Numérotation des pages** : commence à la page 3 (après couverture + sommaire)

### Option B — Conversion avec Pandoc (plus propre)

```bash
# Installer Pandoc : https://pandoc.org/installing.html

# Générer le PDF directement depuis les Markdown
pandoc \
  documentation/Jalon1/CDCF_CALENDRIA_Jalon1.md \
  documentation/Jalon2/Methodologie_Organisation.md \
  documentation/Jalon2/Conception_UXUI.md \
  documentation/Jalon3/README_Jalon3.md \
  documentation/Jalon3/dictionnaire_donnees.md \
  documentation/Jalon4/architecture.md \
  documentation/Jalon4/README_Jalon4.md \
  documentation/Jalon5/securite.md \
  documentation/Jalon6/chapitre_X_tests_final.md \
  documentation/Jalon6/chapitre_XI_deploiement.md \
  --from markdown \
  --to pdf \
  --pdf-engine=weasyprint \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V lang=fr \
  -V geometry:margin=2.5cm \
  -o Rapport_Final_CALENDRIA_Safi_Bougherara.pdf
```

> **Note** : Avec Pandoc + WeasyPrint, les images doivent être en local (chemins relatifs). Assure-toi d'avoir exporté les PNG PlantUML et référencé les bons chemins.

### Option C — Conversion Markdown → PDF via Typora

1. Ouvre Typora
2. File → Import → importe les Markdown dans l'ordre
3. Export → PDF avec thème "Github" ou "Newsprint"

---

## Section 5 — Checklist Avant Soumission

Avant de soumettre le PDF sur Teams, vérifie chaque point :

### Contenu
- [ ] Page de couverture avec nom, formation, date de soutenance
- [ ] Sommaire généré automatiquement (numéros de pages corrects)
- [ ] 11 chapitres présents (I à XI)
- [ ] Tous les schémas PlantUML exportés et insérés (pas de liens cassés)
- [ ] URLs de production présentes dans le chapitre XI
- [ ] Tag Git `v1.0` mentionné

### Mise en Forme
- [ ] Police uniforme (Calibri 11 ou Arial 11)
- [ ] Marges : 2.5 cm (haut/bas/gauche/droite)
- [ ] En-têtes/pieds de page avec nom et titre du projet
- [ ] Numérotation des pages à partir du premier chapitre
- [ ] Blocs de code en `Courier New` ou police monospace
- [ ] Tableaux correctement formatés (pas de texte coupé)

### Vérification Finale
- [ ] Relire chapitre XI (le plus récent) pour les fautes
- [ ] Vérifier que les URLs de production sont accessibles au moment de la remise
- [ ] Taille du PDF < 20 MB (sinon compresser les images PNG)
- [ ] Nom du fichier : `Rapport_Final_CALENDRIA_Safi_Bougherara.pdf`

---

## Section 6 — Annexes Recommandées

### Annexe A — Captures d'Écran de l'Application

Prends ces captures d'écran de l'application en production :

1. Page de Login → `/login`
2. Dashboard principal → `/dashboard`
3. Plan de salle interactif → `/floor-plan`
4. Liste des réservations → `/reservations`
5. Gestion du restaurant (avec services d'ouverture)
6. Chat avec le chatbot IA (widget web)
7. Conversation Telegram Bot (si activé)

### Annexe B — Extrait des Tests PHPUnit

Capture de la sortie verte de la CI GitHub Actions (onglet "Actions" sur GitHub), montrant les 12 tests passing.

### Annexe C — Modèles de Données (SQL)

Si tu veux inclure le DDL SQL complet, récupère-le avec :
```bash
docker compose exec db pg_dump --schema-only -U calendria_user calendria > annexe_schema_sql.sql
```

### Annexe D — Changelog des Jalons

| Jalon | Date | Livrables |
|---|---|---|
| Jalon 1 | Jan 2026 | CDCF, Cahier des Charges |
| Jalon 2 | Fév 2026 | UX/UI, Méthodologie, Planning Gantt |
| Jalon 3 | Mar 2026 | MCD/MLD/MPD, Dictionnaire des données |
| Jalon 4 | Avr 2026 | UML (use cases, séquences, classes), Architecture |
| Jalon 5 | Mai 2026 | Code source (API + Frontend), Sécurité, Tests initiaux |
| Jalon 6 | Juil 2026 | Déploiement Railway, CI/CD, Tests complets, Documentation finale, Tag v1.0 |

---

*Bon courage pour la soutenance ! 🎓*  
*BOUGHERARA Safi — CDA 2025-2026*
