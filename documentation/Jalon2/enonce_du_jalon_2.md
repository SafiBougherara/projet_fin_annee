Jalon 2 – Février : Méthodologie de Projet & Conception UI/UX

Échéance : Dernier jour ouvrable de février 2026 (28/02/2026).

Livrables : Deux livrables principaux sont attendus ce mois-ci (vous pouvez les combiner ou les séparer

selon votre préférence) :

1. Documentation de méthodologie et organisation du projet (PDF).

2. Livrables de conception UX/UI (maquettes, PDF de présentation, etc.).

Ce jalon correspond principalement aux chapitres IV. Méthodologie et organisation et V. Conception

UI/UX de votre documentation finale. Voici le détail de ce qui est attendu :

1. Document Méthodologie et Organisation (Gestion de projet) :

Ce document doit expliquer comment vous planifiez et pilotez votre projet. Il s’appuie sur les directives

de la section IV du cahier des charges technique. Incluez notamment :

Méthode de gestion de projet : Précisez la méthodologie adoptée (Agile Scrum, Kanban, cycle

en V, etc.) et justifiez ce choix par rapport à votre contexte. Par exemple : “Méthode Scrum utilisée

sur 5 sprints mensuels, car elle permet des ajustements continus et correspond bien au découpage en

jalons”. Si vous êtes seul, expliquez comment vous adaptez la méthode (sprints allégés, réunions

Scrum simulées via un journal de bord, etc.).

Planning (macro-planning) : Fournissez un planning global du projet jusqu’en juin.

Idéalement, insérez un diagramme de Gantt ou un calendrier mentionnant les grandes phases

et les jalons. Chaque jalon (fin Janv, fin Fév, ...) devrait y apparaître avec les livrables

correspondants. Indiquez aussi les principales tâches ou lots de travaux pour chaque phase. Par

exemple, en février : “Design UI/UX”, en mars : “Modélisation BD”, avril : “Développement

backend”, mai : “Intégration et tests”, juin : “Finalisation et déploiement”. Si vous utilisez un

outil (MS Project, TeamGantt, etc.), vous pouvez exporter une image du planning dans le PDF.

Outils de suivi : Décrivez comment vous suivez l’avancement. Par exemple : “Utilisation d’un

tableau Trello pour gérer les tâches, avec des colonnes À faire/En cours/Fait”, ou “Suivi des tâches via

les issues GitLab”. Mentionnez la fréquence de vos mises à jour (ex: revue hebdomadaire des

progrès, adaptation du planning si retard/priorités changées).

Gestion du code source (Git) : Présentez la stratégie de versioning Git mise en place .

Décrivez les branches que vous comptez utiliser (ex: “une branche main pour les releases jalons,

une branche develop pour l’intégration continue des features, et des branches individuelles par

fonctionnalité ou correctif”). Expliquez comment vous gérez les merges et éventuellement les

revues de code (même en solo, s’obliger à relire son code). Si vous avez déjà initialisé le dépôt Git

et fait quelques commits (par exemple, création du projet Symfony, structure de base), c’est très

bien – mentionnez-le et fournissez le lien du dépôt dans le document.

CI/CD planifié : Décrivez votre plan pour la pipeline CI/CD. Même si l’implémentation effective

interviendra plus tard, indiquez par exemple : “Mise en place d’une intégration continue via GitHub

•

•

13

•

• 14

•

7

Actions : chaque push lance les tests PHPunit et ESLint. Envisageable d’ajouter un déploiement auto

Docker sur Heroku à partir de mai.” L’objectif est de montrer que vous avez anticipé

l’automatisation. Vous pouvez aussi citer les outils que vous prévoyez d’utiliser (ex: GitHub Actions

pour CI, Docker Hub pour stocker les images, etc.). Cette partie démontre votre compréhension

de la démarche DevOps même si tout n’est pas encore en place.

(Astuce : Vous pouvez structurer ce document méthodo en reprenant les sous-parties 4.a, 4.b, 4.c du CDC

technique afin d’être sûr de tout couvrir : 4.a Gestion de projet (méthode + planning), 4.b Versionning Git

(organisation du repo), 4.c DevOps (CI/CD).)

2. Conception UX/UI :

Parallèlement à la partie organisationnelle, le jalon 2 est consacré à la conception de l’interface

utilisateur et de l’expérience utilisateur (UX). C’est le contenu du chapitre V. Conception UI/UX de votre

dossier final. Les livrables attendus sont :

Zoning / Sitemap : Fournissez un schéma de zoning qui présente la structure globale de votre

application (disposition des zones principales à l’écran) ou un plan de site indiquant les

différentes pages/écrans envisagés et la navigation entre eux. Cela peut être un dessin ou

schéma simple montrant, par exemple, le header, menu, zone de contenu, footer pour la page

type, ou une carte des écrans (Accueil -> Page X -> Page Y, etc.).

Wireframes (maquettes fil de fer) : Pour les principales pages de l’application, réalisez des

wireframes basse fidélité. Ces maquettes en noir et blanc définissent l’agencement des

éléments sans le design final. Concentrez-vous sur le fonctionnel : où seront les menus, les

boutons, les champs, comment l’information est structurée. Vous pouvez utiliser des outils

comme Figma, Balsamiq, Adobe XD, ou même dessiner à la main du moment que c’est

proprement numérisé. Les wireframes doivent couvrir les écrans clés (ex : page d’accueil, page

de liste d’un élément, page de détail, formulaires principaux, etc., y compris la version mobile si

l’agencement diffère notablement).

Charte graphique : Définissez l’identité visuelle de votre application. Présentez dans une courte

section la charte graphique retenue : couleurs principales et secondaires (avec codes

hexadécimaux), polices de caractères utilisées (titres, texte courant), style d’icônes ou

illustrations, éventuellement le ton général (moderne, épuré, fun, professionnel, etc.). Expliquez

en quelques phrases les choix (par ex. “Couleurs bleu et blanc pour inspirer confiance et rappeler le

logo de l’entreprise X”). Cette charte servira de référence pour la réalisation des maquettes

graphiques et du front-end.

Maquettes graphiques haute fidélité : Réalisez des mockups ou prototypes graphiques

représentant l’apparence finale de votre application pour au moins 2 écrans : un écran en

version desktop et le même en version mobile (smartphone), afin de démontrer la responsivité.

Vous pouvez en faire pour plusieurs pages si possible (ex: page d’accueil et page de profil

utilisateur). Ces maquettes doivent appliquer la charte graphique définie (couleurs, polices, etc.)

et être le plus proche possible du rendu final prévu. Utilisez Figma, Adobe XD, Sketch ou autre

outil graphique. Intégrez les images de vos maquettes dans le PDF (ou fournissez un lien si

interactif via Figma). On doit pouvoir visualiser à quoi ressemblera l’application une fois

développée.

Prototype (optionnel) : Si vous le souhaitez et en avez la maîtrise, vous pouvez fournir un

prototype cliquable (par exemple via Figma ou Adobe XD) permettant de simuler quelques

•

•

•

•

•

8

interactions de navigation entre vos écrans. Ceci n’est pas obligatoire, mais serait un plus pour

valider l’ergonomie.

Considérations UX : Ajoutez quelques notes sur les choix UX : comment vous assurez une

bonne expérience utilisateur (simplicité d’utilisation, accessibilité, parcours utilisateur fluide).

Par exemple, mentionnez si vous appliquez des principes Mobile First, ou si vous avez prévu des

retours visuels clairs (messages de validation/erreur), etc. L’interface doit respecter les standards

pour ne pas dérouter l’utilisateur.

Au terme de ce jalon 2, tous les aspects “design” et “organisation” du projet doivent être validés

avant d’entamer réellement le développement. En pratique, cela signifie que vous (et votre référent)

avez une vision claire de ce que l’appli fera, à quoi elle ressemblera, et comment vous allez vous

organiser pour la construire. Vous aurez ainsi toutes les clés en main pour démarrer la phase de

conception technique et de développement dès le mois suivant.

(Conseil : Profitez de ce travail de maquettes pour recueillir des avis – par exemple, montrez vos maquettes à

d’autres étudiants comme de futurs utilisateurs, et intégrez leurs retours si pertinents. Il vaut mieux ajuster

l’UI à ce stade qu’en toute fin de projet. 