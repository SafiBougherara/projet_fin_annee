# JALON 6 — README

**Projet : CALENDRIA – Assistant de Réservation Intelligent**  
**Auteur :** BOUGHERARA Safi  
**Date :** Juillet 2026  
**Version :** 1.0 — Livraison Finale  

---

## Contenu du Dossier Jalon 6

| Fichier | Description |
|---|---|
| `README_Jalon6.md` | Ce fichier — vue d'ensemble du jalon |
| `chapitre_XI_deploiement.md` | **Chapitre XI** — Déploiement & Mise en Production (nouveau) |
| `chapitre_X_tests_final.md` | **Chapitre X (mis à jour)** — Tests automatisés avec les nouveaux tests |
| `architecture_production.puml` | Schéma PlantUML de l'architecture Railway en production |
| `cicd_pipeline.puml` | Schéma PlantUML de la pipeline CI/CD GitHub Actions |
| `PLAN_RAPPORT_FINAL.md` | **Guide complet** pour assembler le PDF final |

---

## Livrables du Jalon 6

### ✅ Code Source Taggé v1.0

Le tag Git `v1.0` a été posé sur le commit de livraison finale :

```bash
git tag v1.0
git push origin v1.0
```

**Commit :** `8e82fa6` — "fix: relax phpunit strict flags (Doctrine deprecations), fix setNumeroTable string type"

### ✅ Documentation Finale

Ce dossier constitue le **Chapitre XI** du rapport final, couvrant :
- Architecture de production (Railway)
- Pipeline CI/CD (GitHub Actions)
- Procédures de déploiement et de démarrage local
- Notice utilisateur du restaurateur
- Bilan fonctionnel final (88% des fonctionnalités livrées)

### ✅ CI/CD Opérationnelle

La pipeline GitHub Actions est verte sur la branche `main` :
- **Backend CI** : PHPUnit 12 tests — ✅ passing
- **Frontend CI** : TypeScript build — ✅ passing

**Badge :** [![CI](https://github.com/SafiBougherara/projet_fin_annee/actions/workflows/ci.yml/badge.svg)](https://github.com/SafiBougherara/projet_fin_annee/actions/workflows/ci.yml)

### ✅ Application en Production

| Service | URL |
|---|---|
| Frontend Dashboard | https://frontend-production-8a43.up.railway.app |
| API Backend | https://backend-production-dd10b.up.railway.app |
| Health Check | https://backend-production-dd10b.up.railway.app/api/health |

**Identifiants de démonstration :**
- Email : `admin@calendria.com`
- Mot de passe : `password123`

---

## Pour le PDF du Rapport Final

👉 **Consulte le fichier [`PLAN_RAPPORT_FINAL.md`](PLAN_RAPPORT_FINAL.md)** pour le guide complet d'assemblage du PDF (ordre des chapitres, export des PlantUML, checklist de soumission).

---

*BOUGHERARA Safi — Formation CDA — Juillet 2026*
