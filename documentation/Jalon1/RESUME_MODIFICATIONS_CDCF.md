# Résumé des Modifications - CDCF CALENDRIA v2.0

**Date** : 09/01/2026  
**Version** : 2.0 - Multi-Canal Chatbot  
**Auteur** : BOUGHERARA Safi

---

## 🎯 Changements Majeurs

### **1. Pivot Stratégique : Téléphone Vocal → Chatbot Multi-Canal**

**Avant** : Assistant vocal téléphonique (Twilio Voice + Speech-to-Text)  
**Après** : Chatbot multi-canal (WhatsApp + Widget Web + SMS)

**Raison** : 
- ✅ Faisabilité technique accrue (pas de reconnaissance vocale)
- ✅ Coûts réduits (15-20€/mois vs 50-100€/mois)
- ✅ Taux de succès réaliste (95% vs 80%)
- ✅ Développement plus rapide (3 mois vs 5 mois)

---

## 📱 Les 3 Canaux de Réservation

### **Canal 1 : WhatsApp Business** (Priorité 1 - Obligatoire)
- QR Code sur menus
- Conversation naturelle
- Confirmation instantanée
- **Coût** : ~5€/mois (100 réservations)

### **Canal 2 : Widget Web** (Priorité 2 - Fortement Recommandé)
- Chatbot intégrable sur site restaurant (iframe)
- Design personnalisable
- **Coût** : Gratuit (hébergé avec API)

### **Canal 3 : SMS Direct** (Priorité 3 - Bonus)
- Réservation par SMS vers numéro dédié
- **Coût** : ~7€/mois (100 réservations)

**Total** : ~15-20€/mois (tous canaux confondus)

---

## 🏗️ Architecture Partagée

```
┌─────────────────────────────────────────┐
│  WhatsApp  │  Widget Web  │  SMS        │
└─────────────┬───────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │  OpenAI GPT-4o-mini │ (Chatbot Logic)
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  API REST Symfony   │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  PostgreSQL/MySQL   │
    └─────────────────────┘
```

**Avantage** : 90% du code partagé entre les 3 canaux

---

## 📅 Planning Mis à Jour

| Jalon | Mois | Livrable |
|-------|------|----------|
| 1 | Janvier | CDCF ✅ |
| 2 | Février | Méthodologie + Maquettes UI/UX |
| 3 | Mars | **MCD/MLD/MPD + API REST + Algorithme tables** |
| 4 | Avril | **Chatbot WhatsApp + Dashboard restaurateur + UML** |
| 5 | Mai | **Widget Web + SMS + Tests + Sécurité** |
| 6 | Juin | **Finalisation + Déploiement + (Bonus : Voix)** |

**Changement clé** : Développement commence en **Mars** (au lieu d'Avril)

---

## 💰 Coûts Réduits

| Avant (Vocal) | Après (Chatbot) | Économie |
|---------------|-----------------|----------|
| ~50-100€/mois | ~15-20€/mois | **70-80%** |
| Twilio Voice : 0,013$/min | WhatsApp : 0,005$/msg | **10x moins cher** |
| OpenAI GPT-4 : 0,03$/1K tokens | GPT-4o-mini : 0,002$/1K tokens | **15x moins cher** |

---

## ⚠️ Risques Réduits

| Risque | Avant | Après |
|--------|-------|-------|
| **Complexité IA vocale** | Élevé | **Éliminé** |
| **Dépassement crédit API** | Élevé | **Faible** |
| **Retard sur planning** | Moyen | **Faible** |
| **Taux d'échec** | 15-20% | **<5%** |

---

## ✅ Critères de Succès Adaptés

**Minimum Viable** :
- ✅ Au moins **2 canaux fonctionnels** (WhatsApp + Widget ou SMS)
- ✅ Taux de complétion > **95%**
- ✅ Validation automatique instantanée
- ✅ Dashboard restaurateur opérationnel

**Bonus** :
- ⭐ 3 canaux fonctionnels
- ⭐ Voix téléphonique (Juin si temps restant)

---

## 🎯 Stratégie de Développement Phasée

### **Phase 1 (Mars)** : Fondations
- API REST Symfony
- Algorithme de disponibilité des tables
- Tests avec Postman

### **Phase 2 (Avril)** : MVP
- Chatbot WhatsApp (canal principal)
- Dashboard restaurateur (React)
- SMS de confirmation

### **Phase 3 (Mai)** : Extension
- Widget Web (React component + iframe)
- SMS direct (réutilise logique WhatsApp)
- Tests + Sécurité

### **Phase 4 (Juin)** : Finalisation
- Déploiement Docker
- Documentation
- (Optionnel) Voix téléphonique

---

## 📊 Comparaison Avant/Après

| Critère | Version Vocale | Version Chatbot | Gagnant |
|---------|----------------|-----------------|---------|
| **Faisabilité** | Moyenne | Élevée | ✅ Chatbot |
| **Coûts** | 50-100€/mois | 15-20€/mois | ✅ Chatbot |
| **Taux de succès** | 80-85% | 95%+ | ✅ Chatbot |
| **Temps de dev** | 5 mois | 3 mois | ✅ Chatbot |
| **Complexité** | Élevée | Moyenne | ✅ Chatbot |
| **Différenciation** | Très élevée | Moyenne | ⚠️ Vocal |

**Conclusion** : Chatbot = **Meilleur compromis faisabilité/valeur**

---

## 🚀 Prochaines Étapes

### **Immédiat (Janvier)**
1. ✅ Relire et finaliser le CDCF
2. ✅ Créer le dépôt Git
3. ✅ Générer le PDF
4. ✅ Rendre sur Teams avant le 31/01/2026

### **Février**
1. Créer les maquettes UI/UX (Figma)
2. Définir la charte graphique
3. Wireframes dashboard restaurateur
4. Wireframes chatbot (WhatsApp + Widget)

### **Mars**
1. Modéliser la base de données (MCD/MLD/MPD)
2. Créer l'API REST Symfony
3. Développer l'algorithme de tables
4. Tests unitaires

---

## 📝 Sections Modifiées du CDCF

1. **Section 1.3** : Fonctionnement global → Multi-canal
2. **Section 2.1** : Objectifs SMART → Chatbot multi-canal
3. **Section 3.1.1** : Module IA → 3 canaux détaillés + stratégie phasée
4. **Section 5.1** : Planning → Développement dès Mars
5. **Section 5.3** : Coûts API → 15-20€/mois
6. **Section 5.4** : Risques → Réévalués à la baisse
7. **Section 6.1** : Critères de succès → 2 canaux minimum

---

**Version finale** : CDCF_CALENDRIA_Jalon1.md  
**Prêt pour rendu** : ✅ Oui  
**Date limite** : 31/01/2026
