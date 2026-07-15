# PROMPT PASSE 1 — Chapitres I à IV

## Fichiers à joindre dans Perplexity pour cette session

```
documentation/Jalon1/CDCF_CALENDRIA_Jalon1.md
documentation/Jalon2/Methodologie_Organisation.md
documentation/Jalon2/Conception_UXUI.md
```

Joins ces 3 fichiers + ce fichier de prompt. C'est tout.

---

## Ta Mission

Tu es un expert en mise en page de rapports techniques académiques.
Convertis les fichiers Markdown joints en un **fichier HTML complet et stylisé** nommé `rapport_partie1.html`.

Ce fichier HTML doit contenir dans l'ordre :
1. La page de couverture
2. Une table des matières partielle (chapitres I à IV uniquement)
3. Chapitre I — Contexte Métier & Présentation du Projet
4. Chapitre II — Périmètre Fonctionnel & Cahier des Charges
5. Chapitre III — Méthodologie & Organisation
6. Chapitre IV — Conception UI/UX

---

## Sources par chapitre

| Chapitre | Fichier source | Sections à inclure |
|---|---|---|
| I | `CDCF_CALENDRIA_Jalon1.md` | Sections 1 et 2 uniquement (§1.0 à §1.5, §2.1 à §2.3) |
| II | `CDCF_CALENDRIA_Jalon1.md` | Sections 3, 4, 5, 6, 7 |
| III | `Methodologie_Organisation.md` | Intégralité |
| IV | `Conception_UXUI.md` | Intégralité |

**Important** : Supprime les blocs de métadonnées en début de chaque fichier (les lignes `**Auteur**`, `**Date**`, `**Jalon**`, `**Formation**` etc. jusqu'à la première `---`). Le seul H1 visible pour chaque chapitre doit être celui que tu génères (ex: `<h1>Chapitre I — Contexte Métier</h1>`).

---

## Page de Couverture

Génère exactement ce HTML :

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

---

## CSS à inclure dans le `<head>` (une seule fois, dans ce fichier uniquement)

```css
@page { margin: 2.5cm 2cm 2cm 3cm; }
@page :first { margin: 0; }
body { font-family: Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; }
h1 { font-size: 18pt; color: #2E86C1; font-weight: bold; page-break-before: always; margin-top: 0; }
h2 { font-size: 14pt; color: #1A5276; font-weight: bold; }
h3 { font-size: 12pt; font-weight: bold; }
p { margin: 0.6em 0; }
table { width: 100%; border-collapse: collapse; margin: 1em 0; }
th { background: #2E86C1; color: white; padding: 8px 10px; text-align: left; font-size: 10pt; }
td { padding: 6px 10px; border: 1px solid #BDC3C7; font-size: 10pt; vertical-align: top; }
tr:nth-child(even) td { background: #EBF5FB; }
pre { background: #F5F5F5; border-left: 4px solid #2E86C1; padding: 12px 14px; font-family: 'Courier New', monospace; font-size: 9.5pt; overflow-x: auto; white-space: pre-wrap; page-break-inside: avoid; }
code { font-family: 'Courier New', monospace; font-size: 9.5pt; background: #F0F0F0; padding: 1px 3px; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid #2E86C1; margin: 1em 0; padding: 8px 16px; background: #EBF5FB; color: #444; }
.cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always; }
.cover h1 { font-size: 42pt; color: #2E86C1; page-break-before: avoid; margin-bottom: 0.2em; }
.cover h2 { font-size: 16pt; color: #555; font-weight: normal; margin-top: 0; }
hr.deco { width: 60%; border: 2px solid #2E86C1; margin: 2em auto; }
.meta-table { width: 60%; margin: 2em auto; border: 1px solid #BDC3C7; }
.meta-table td { padding: 8px 16px; }
.meta-table td:first-child { font-weight: bold; background: #F5F5F5; width: 35%; }
.footer-note { position: absolute; bottom: 3cm; font-style: italic; color: #777; font-size: 10pt; }
.figure { text-align: center; margin: 1.5em 0; page-break-inside: avoid; }
.figure img { max-width: 95%; }
.caption { font-style: italic; font-size: 9pt; color: #555; margin-top: 0.4em; }
.figure-placeholder { border: 2px dashed #2E86C1; padding: 40px; color: #777; background: #F8FBFF; font-style: italic; }
.toc-page { page-break-after: always; }
.toc-page h1 { page-break-before: avoid; }
```

---

## Note sur les technologies remplacées

Quand tu vois WhatsApp, Twilio, OpenAI GPT-4 dans le texte, **ne modifie pas le texte**. Ajoute simplement cette note juste après le premier paragraphe qui les mentionne :

```html
<blockquote>
  <strong>Note de mise à jour :</strong> Ces technologies ont été remplacées en cours de projet
  (WhatsApp → Telegram, OpenAI → Gemini 2.5 Flash, Twilio → intégré Telegram).
  Voir Chapitre XI §1.1 pour le bilan final.
</blockquote>
```

---

## Livrable

Un seul fichier : **`rapport_partie1.html`**

Structure attendue :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>CALENDRIA — Rapport Final</title>
  <style>/* CSS ci-dessus */</style>
</head>
<body>
  <!-- Page de couverture -->
  <!-- TOC partielle -->
  <!-- Chapitre I -->
  <!-- Chapitre II -->
  <!-- Chapitre III -->
  <!-- Chapitre IV -->
</body>
</html>
```
