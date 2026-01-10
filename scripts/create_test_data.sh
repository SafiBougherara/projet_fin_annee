#!/bin/bash

# Script pour créer des données de test via l'API
# Usage: ./create_test_data.sh

# Token JWT (à remplacer par un token valide)
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjgwODAzMTYsImV4cCI6MTc2ODA4MzkxNiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdEBleGFtcGxlLmNvbSJ9..."

BASE_URL="http://localhost:8000/api"

echo "🚀 Création des données de test..."

# 1. Créer un restaurant
echo "\n📍 Création du restaurant..."
RESTAURANT_RESPONSE=$(curl -s -X POST "$BASE_URL/restaurants" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Le Gourmet Parisien",
    "adresse": "123 Avenue des Champs-Élysées, 75008 Paris",
    "telephone": "0142563789",
    "email": "contact@legourmet.fr",
    "capaciteTotale": 50,
    "dureeRepas": 90,
    "bufferNettoyage": 15
  }')

echo "Restaurant créé: $RESTAURANT_RESPONSE"

# 2. Créer des tables
echo "\n🪑 Création des tables..."
curl -s -X POST "$BASE_URL/tables" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTable": 1,
    "capacite": 2,
    "type": "interieur",
    "statut": "disponible",
    "restaurant": "/api/restaurants/1"
  }'

curl -s -X POST "$BASE_URL/tables" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTable": 2,
    "capacite": 4,
    "type": "interieur",
    "statut": "disponible",
    "restaurant": "/api/restaurants/1"
  }'

curl -s -X POST "$BASE_URL/tables" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTable": 3,
    "capacite": 6,
    "type": "terrasse",
    "statut": "disponible",
    "restaurant": "/api/restaurants/1"
  }'

echo "Tables créées ✅"

# 3. Créer des clients
echo "\n👥 Création des clients..."
curl -s -X POST "$BASE_URL/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "telephone": "0612345678",
    "email": "jean.dupont@email.com",
    "consentementRgpd": true
  }'

curl -s -X POST "$BASE_URL/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Marie Martin",
    "telephone": "0698765432",
    "email": "marie.martin@email.com",
    "consentementRgpd": true
  }'

echo "Clients créés ✅"

# 4. Créer des services
echo "\n🕐 Création des services..."
curl -s -X POST "$BASE_URL/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "midi",
    "heureDebut": "12:00:00",
    "heureFin": "14:30:00",
    "joursOuverture": ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
    "restaurant": "/api/restaurants/1"
  }'

curl -s -X POST "$BASE_URL/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "soir",
    "heureDebut": "19:00:00",
    "heureFin": "22:30:00",
    "joursOuverture": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    "restaurant": "/api/restaurants/1"
  }'

echo "Services créés ✅"

# 5. Créer des réservations
echo "\n📅 Création des réservations..."
curl -s -X POST "$BASE_URL/reservations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateReservation": "2026-01-15",
    "heureReservation": "12:30:00",
    "nombrePersonnes": 2,
    "statut": "confirmee",
    "client": "/api/clients/1",
    "restaurant": "/api/restaurants/1",
    "tableReservee": "/api/tables/1"
  }'

curl -s -X POST "$BASE_URL/reservations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateReservation": "2026-01-15",
    "heureReservation": "20:00:00",
    "nombrePersonnes": 4,
    "statut": "confirmee",
    "client": "/api/clients/2",
    "restaurant": "/api/restaurants/1",
    "tableReservee": "/api/tables/2"
  }'

echo "Réservations créées ✅"

echo "\n✅ Toutes les données de test ont été créées avec succès!"
