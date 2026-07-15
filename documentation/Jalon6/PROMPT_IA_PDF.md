# PROMPT — Génération du Rapport Final CALENDRIA (PDF)

> **Instructions pour l'IA de documentation** : Ce fichier est le prompt de travail. Lis-le intégralement avant de commencer. Il te dit exactement quoi faire avec les fichiers joints.
>
> ⚠️ **STRATÉGIE MULTI-PASSES** : Le rapport complet est trop volumineux pour une seule session. Tu vas générer **3 blocs HTML séparés** (un par session). À la fin, un script les assemble en un seul PDF. Chaque bloc utilise la même feuille de style CSS (fournie ci-dessous une seule fois dans la **Passe 1**).

---

## Ton Rôle

Tu es un expert en mise en page de rapports techniques académiques. Tu vas convertir des fichiers Markdown en **HTML structuré et stylisé**, prêt à être imprimé en PDF via navigateur (`Ctrl+P → Enregistrer en PDF`).

---

## Contexte du Projet

**CALENDRIA** est un assistant de réservation de tables de restaurant basé sur l'IA, développé comme projet de fin de formation CDA sur 6 mois (janvier–juillet 2026).

| Champ | Valeur |
|---|---|
| **Titre du rapport** | CALENDRIA — Assistant de Réservation Intelligent Multi-Canal |
| **Auteur** | BOUGHERARA Safi |
| **Formation** | CDA — Concepteur Développeur d'Applications |
| **Promotion** | 2025-2026 |
| **Commanditaire (fictif)** | M. Gilles MOREL — Gérant de « Le Gourmet Parisien », 15 rue de la Paix, 75001 Paris |
| **Version** | 1.0 — Livraison Finale |
| **Tag Git** | v1.0 |
| **Date de livraison** | Juillet 2026 |
| **URL Production Frontend** | https://frontend-production-8a43.up.railway.app |
| **URL Production Backend** | https://backend-production-dd10b.up.railway.app |

---

## PASSE 1 — Couverture + Chapitres I à IV

### Fichiers à joindre pour cette passe

```
documentation/Jalon1/CDCF_CALENDRIA_Jalon1.md
documentation/Jalon2/Methodologie_Organisation.md
documentation/Jalon2/Conception_UXUI.md
```

### Ce que tu dois produire : `rapport_partie1.html`

Un fichier HTML **complet** (avec `<html>`, `<head>`, `<style>` CSS, `<body>`) contenant :

1. **Page de couverture** (voir §Mise en Forme)
2. **Table des Matières provisoire** — liste uniquement les chapitres de cette passe (I, II, III, IV) avec une note : *"Table des matières complète disponible dans le document assemblé final."*
3. **Chapitre I — Contexte Métier & Présentation du Projet**
   - Source : `CDCF_CALENDRIA_Jalon1.md`, sections 1 (§1.0 à §1.5) et 2 (§2.1 à §2.3)
4. **Chapitre II — Périmètre Fonctionnel & Cahier des Charges**
   - Source : `CDCF_CALENDRIA_Jalon1.md`, sections 3, 4, 5, 6, 7
5. **Chapitre III — Méthodologie & Organisation**
   - Source : `Methodologie_Organisation.md` (intégralité)
6. **Chapitre IV — Conception UI/UX**
   - Source : `Conception_UXUI.md` (intégralité)

> **Supprime** les lignes d'en-tête internes des fichiers MD (ex: `# CALENDRIA`, `## Cahier des Charges Fonctionnel`, les blocs de métadonnées **Auteur/Date/Jalon** en début de fichier). **Seuls les titres de section** à partir de `## 1.` doivent être conservés.

---

## PASSE 2 — Chapitres V à IX

### Fichiers à joindre pour cette passe

```
documentation/Jalon3/README_Jalon3.md
documentation/Jalon3/dictionnaire_donnees.md
documentation/Jalon4/architecture.md
documentation/Jalon4/README_Jalon4.md
documentation/Jalon5/securite.md
```

### Ce que tu dois produire : `rapport_partie2.html`

Un fichier HTML **partiel** (uniquement `<body>` sans `<html>/<head>/<style>` — le CSS est déjà dans la partie 1) contenant :

5. **Chapitre V — Modélisation MERISE (MCD/MLD/MPD)**
   - Source : `Jalon3/README_Jalon3.md`
   - Insère les 3 emplacements de figure : `[FIGURE : MCD.puml]`, `[FIGURE : MLD.puml]`, `[FIGURE : MPD.puml]`
6. **Chapitre VI — Dictionnaire des Données**
   - Source : `dictionnaire_donnees.md`
7. **Chapitre VII — Architecture Logicielle**
   - Source : `architecture.md`
   - Insère : `[FIGURE : diagramme_classes.puml]`, `[FIGURE : architecture_ntiers.puml]`
8. **Chapitre VIII — Conception UML**
   - Source : `Jalon4/README_Jalon4.md`
   - Insère : `[FIGURE : diagramme_cas_utilisation.puml]`, `[FIGURE : sequence_authentification.puml]`, `[FIGURE : sequence_reservation_chatbot.puml]`, `[FIGURE : sequence_gestion_reservation.puml]`
9. **Chapitre IX — Sécurité & Conformité RGPD**
   - Source : `securite.md`

> **Supprime** les blocs de métadonnées en-tête (Auteur/Date/Jalon) de chaque fichier MD.

---

## PASSE 3 — Chapitres X et XI (Jalon 6)

### Fichiers à joindre pour cette passe

```
documentation/Jalon6/chapitre_X_tests_final.md
documentation/Jalon6/chapitre_XI_deploiement.md
```

### Ce que tu dois produire : `rapport_partie3.html`

Un fichier HTML **partiel** (uniquement `<body>`) contenant :

10. **Chapitre X — Tests Automatisés & Qualité Logicielle**
    - Source : `chapitre_X_tests_final.md`
11. **Chapitre XI — Déploiement & Mise en Production**
    - Source : `chapitre_XI_deploiement.md`
    - Insère : `[FIGURE : architecture_production.puml]` dans §2, `[FIGURE : cicd_pipeline.puml]` dans §4

> **Supprime** les blocs de métadonnées en-tête (JALON 6 — Chapitre X/XI, Auteur, Date).

---

## Mise en Forme (CSS — à inclure dans la Passe 1 uniquement)

### Page de Couverture

```html
<div class="cover">
  <h1>CALENDRIA</h1>
  <h2>Assistant de Réservation Intelligent Multi-Canal avec IA</h2>
  <hr class="deco"/>
  <table class="meta-table">
    <tr><td>Rapport de Projet</td><td>Livrable Final — Jalon 6</td></tr>
    <tr><td>Auteur</td><td>BOUGHERARA Safi</td></tr>
    <tr><td>Formation</td><td>CDA — Concepteur Développeur d'Applications</td></tr>
    <tr><td>Promotion</td><td>2025-2026</td></tr>
    <tr><td>Commanditaire</td><td>M. Gilles MOREL — « Le Gourmet Parisien »</td></tr>
    <tr><td>Version</td><td>1.0 — Tag Git : v1.0</td></tr>
    <tr><td>Date</td><td>Juillet 2026</td></tr>
    <tr><td>Production</td><td>https://frontend-production-8a43.up.railway.app</td></tr>
  </table>
  <div class="footer-note">Formation CDA — Projet Fil Rouge — 2025-2026</div>
</div>
```

### Typographie & Mise en Page

| Élément | Style |
|---|---|
| Police principale | Helvetica, Arial, sans-serif — 11pt |
| Titres H1 chapitres | 18pt, gras, couleur `#2E86C1`, `page-break-before: always` |
| Titres H2 | 14pt, gras, couleur `#1A5276` |
| Titres H3 | 12pt, gras |
| Corps de texte | 11pt, `line-height: 1.5` |
| Blocs `<pre><code>` | `font-family: Courier New, monospace`, 9.5pt, fond `#F5F5F5`, `border-left: 4px solid #2E86C1`, padding 12px |
| Tableaux | Bordures `1px solid #BDC3C7`, en-têtes `background: #2E86C1; color: white`, lignes paires fond `#EBF5FB` |
| Marges `@page` | `margin: 2.5cm 2cm 2cm 3cm` |
| `counter-reset` pages | Commence à 3 (couverture + sommaire = pages 1-2) |
| En-tête | `position: running(header)` : *CALENDRIA — Rapport Final — BOUGHERARA Safi* |
| Pied de page | *Formation CDA 2025-2026* + numéro de page |

### Figures PlantUML

Pour chaque `[FIGURE : xxx.puml]`, génère un bloc placeholder :

```html
<div class="figure">
  <div class="figure-placeholder">[ Diagramme : xxx.puml — à insérer ]</div>
  <p class="caption">Figure X.Y — Description du diagramme</p>
</div>
```

Style du placeholder : `border: 2px dashed #2E86C1; padding: 40px; text-align: center; color: #777; background: #F8FBFF;`

> Les images réelles (PNG exportées depuis PlantUML) sont à insérer manuellement dans le HTML final en remplaçant `<div class="figure-placeholder">` par `<img src="nom_fichier.png" style="max-width:95%;display:block;margin:auto;">`.

---

## Consignes Spéciales

### Doubles titres à supprimer

Chaque fichier MD commence par un titre de type `# JALON X — Chapitre Y : ...` suivi de métadonnées. **Supprime intégralement** ce bloc jusqu'à la première `---` horizontale. Le seul H1 visible doit être le titre de chapitre que **tu génères** (ex: `<h1>Chapitre III — Méthodologie & Organisation</h1>`).

### Technologies remplacées (chapitres I–VIII)

Les fichiers anciens mentionnent WhatsApp/Twilio/OpenAI GPT-4. **Ne les modifie pas.** Ajoute uniquement cette note HTML après le premier paragraphe qui mentionne ces technologies :

```html
<blockquote class="tech-note">
  <strong>Note de mise à jour :</strong> Certains canaux (WhatsApp, SMS Twilio, OpenAI GPT-4)
  ont été remplacés en cours de projet. Voir Chapitre XI §1.1 pour le bilan fonctionnel final.
</blockquote>
```

### Liens Markdown internes

Remplace `[texte](#ancre)` par `<em>texte</em>` (sans lien), ou `<em>(voir §X.Y)</em>` si l'ancre correspond à une section numérotée.

### Emojis

Conserve-les. Si un emoji ne s'affiche pas, remplace : ✅ → `<span class="ok">✓</span>`, ❌ → `<span class="ko">✗</span>`, 🔄 → `~`.

---

## Livrable Final (assemblage manuel)

Après les 3 passes, tu auras :
- `rapport_partie1.html` (avec `<html>`, `<head>`, CSS, couverture, chapitres I–IV)
- `rapport_partie2.html` (body only — chapitres V–IX)
- `rapport_partie3.html` (body only — chapitres X–XI)

**Pour assembler :** Ouvre `rapport_partie1.html`, colle le contenu body de `rapport_partie2.html` juste avant `</body>`, puis le contenu body de `rapport_partie3.html`. Remplace les placeholders figures par les vraies images PNG exportées depuis PlantUML. Ouvre dans Chrome → `Ctrl+P` → **Enregistrer en PDF** (format A4, marges : aucune — déjà dans le CSS).

Nom du fichier final : `Rapport_Final_CALENDRIA_Safi_Bougherara.pdf`

---

*Prompt préparé par GitHub Copilot pour le projet CALENDRIA — Juillet 2026*
