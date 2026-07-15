# PROMPT PASSE 3 — Chapitres X et XI

## Fichiers à joindre dans Perplexity pour cette session

```
documentation/Jalon6/chapitre_X_tests_final.md
documentation/Jalon6/chapitre_XI_deploiement.md
```

Joins ces 2 fichiers + ce fichier de prompt. C'est tout.

---

## Ta Mission

Convertis les fichiers Markdown joints en un **fragment HTML** nommé `rapport_partie3.html`.

Ce fichier ne contient **PAS** de `<html>`, `<head>` ou `<style>` — seulement le contenu `<body>`.

Il doit contenir dans l'ordre :
10. Chapitre X — Tests Automatisés & Qualité Logicielle
11. Chapitre XI — Déploiement & Mise en Production

---

## Sources par chapitre

| Chapitre | Fichier source |
|---|---|
| X | `chapitre_X_tests_final.md` — intégralité |
| XI | `chapitre_XI_deploiement.md` — intégralité |

**Important** : Supprime les lignes d'en-tête internes de chaque fichier (`# JALON 6 — Chapitre X/XI : ...`, `**Projet : CALENDRIA**`, `**Auteur :**`, `**Date :**`, `**Version :**` et la `---` qui suit). Le H1 visible doit être celui que tu génères.

---

## Figures à insérer (placeholders)

```html
<div class="figure">
  <div class="figure-placeholder">[ Diagramme : NOM_FICHIER.png — à insérer ]</div>
  <p class="caption">Figure X.Y — Description</p>
</div>
```

| Figure | Insérer dans | Position dans le texte | Légende |
|---|---|---|---|
| `architecture_production.png` | Chapitre XI | Dans §2 "Architecture de Production", après §2.1 | Figure 11.1 — Architecture de Production Railway |
| `cicd_pipeline.png` | Chapitre XI | Dans §4 "Pipeline CI/CD", après §4.1 | Figure 11.2 — Pipeline CI/CD GitHub Actions |

---

## Livrable

Un seul fichier : **`rapport_partie3.html`**

Structure attendue :
```html
<h1>Chapitre X — Tests Automatisés &amp; Qualité Logicielle</h1>
<!-- contenu chapitre X -->

<h1>Chapitre XI — Déploiement &amp; Mise en Production</h1>
<!-- contenu chapitre XI avec les 2 figures placeholders -->
```

---

## Après les 3 passes — Assemblage final

Une fois que tu as les 3 fichiers (`rapport_partie1.html`, `rapport_partie2.html`, `rapport_partie3.html`) :

1. Ouvre `rapport_partie1.html` dans un éditeur de texte
2. Juste avant `</body>`, colle tout le contenu de `rapport_partie2.html`
3. Juste après, colle tout le contenu de `rapport_partie3.html`
4. Remplace chaque `<div class="figure-placeholder">[ Diagramme : NOM.png...]</div>` par `<img src="NOM.png" style="max-width:95%;display:block;margin:auto;">`
5. Ouvre le fichier assemblé dans **Chrome**
6. `Ctrl+P` → **Enregistrer en PDF** → Format A4, marges = **Aucune** (le CSS les gère)
7. Nom du fichier : `Rapport_Final_CALENDRIA_Safi_Bougherara.pdf`
