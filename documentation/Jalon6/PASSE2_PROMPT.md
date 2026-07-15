# PROMPT PASSE 2 — Chapitres V à IX

## Fichiers à joindre dans Perplexity pour cette session

```
documentation/Jalon3/README_Jalon3.md
documentation/Jalon3/dictionnaire_donnees.md
documentation/Jalon4/architecture.md
documentation/Jalon4/README_Jalon4.md
documentation/Jalon5/securite.md
```

Joins ces 5 fichiers + ce fichier de prompt. C'est tout.

---

## Ta Mission

Convertis les fichiers Markdown joints en un **fragment HTML** nommé `rapport_partie2.html`.

Ce fichier ne contient **PAS** de `<html>`, `<head>` ou `<style>` — seulement le contenu `<body>` (le CSS est déjà dans `rapport_partie1.html`).

Il doit contenir dans l'ordre :
5. Chapitre V — Modélisation de la Base de Données (MERISE)
6. Chapitre VI — Dictionnaire des Données
7. Chapitre VII — Architecture Logicielle
8. Chapitre VIII — Conception UML
9. Chapitre IX — Sécurité & Conformité RGPD

---

## Sources par chapitre

| Chapitre | Fichier source | Notes |
|---|---|---|
| V | `README_Jalon3.md` | Intégralité — insère les 3 figures MCD/MLD/MPD |
| VI | `dictionnaire_donnees.md` | Intégralité |
| VII | `architecture.md` | Intégralité — insère 2 figures |
| VIII | `README_Jalon4.md` | Intégralité — insère 4 figures |
| IX | `securite.md` | Intégralité |

**Important** : Supprime les blocs de métadonnées en début de chaque fichier (`**Auteur**`, `**Date**`, `**Jalon**` etc. jusqu'à la première `---`). Le H1 visible doit être celui que tu génères pour chaque chapitre.

---

## Figures à insérer (placeholders)

Pour chaque figure, génère ce bloc HTML à l'endroit correspondant dans le texte :

```html
<div class="figure">
  <div class="figure-placeholder">[ Diagramme : NOM_FICHIER.png — à insérer ]</div>
  <p class="caption">Figure X.Y — Description</p>
</div>
```

| Figure | Insérer dans | Légende |
|---|---|---|
| `MCD.png` | Chapitre V — après la section §MCD | Figure 5.1 — Modèle Conceptuel de Données |
| `MLD.png` | Chapitre V — après la section §MLD | Figure 5.2 — Modèle Logique de Données |
| `MPD.png` | Chapitre V — après la section §MPD | Figure 5.3 — Modèle Physique de Données |
| `diagramme_classes.png` | Chapitre VII — §Diagramme de classes | Figure 7.1 — Diagramme de Classes UML |
| `architecture_ntiers.png` | Chapitre VII — §Architecture N-Tiers | Figure 7.2 — Architecture N-Tiers |
| `diagramme_cas_utilisation.png` | Chapitre VIII — §Cas d'utilisation | Figure 8.1 — Diagramme des Cas d'Utilisation |
| `sequence_authentification.png` | Chapitre VIII — §Séquences | Figure 8.2 — Séquence Authentification JWT |
| `sequence_reservation_chatbot.png` | Chapitre VIII — §Séquences | Figure 8.3 — Séquence Réservation via Chatbot |
| `sequence_gestion_reservation.png` | Chapitre VIII — §Séquences | Figure 8.4 — Séquence Gestion Réservation |

---

## Livrable

Un seul fichier : **`rapport_partie2.html`**

Structure attendue (fragment uniquement, pas de DOCTYPE/head) :
```html
<h1>Chapitre V — Modélisation de la Base de Données</h1>
<!-- contenu chapitre V -->

<h1>Chapitre VI — Dictionnaire des Données</h1>
<!-- contenu chapitre VI -->

<!-- ... etc jusqu'au chapitre IX -->
```
