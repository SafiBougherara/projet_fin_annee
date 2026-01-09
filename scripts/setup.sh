#!/bin/bash

# Script d'initialisation du projet CALENDRIA
# Auteur : BOUGHERARA Safi
# Date : 09/01/2026

echo "Initialisation du projet CALENDRIA..."
echo ""

# Vérifier les prérequis
echo "Verification des prerequis..."

command -v php >/dev/null 2>&1 || { echo "[ERREUR] PHP n'est pas installe. Requis : PHP 8.2+"; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "[ERREUR] Composer n'est pas installe."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[ERREUR] Node.js n'est pas installe. Requis : Node 20+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "[ERREUR] npm n'est pas installe."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "[ERREUR] Docker n'est pas installe."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "[ERREUR] Docker Compose n'est pas installe."; exit 1; }

echo "[OK] Tous les prerequis sont installes !"
echo ""

# Installer Symfony
echo "Installation de Symfony 6.4 LTS..."
cd backend
if [ ! -f "composer.json" ]; then
    composer create-project symfony/skeleton:"6.4.*" . --no-interaction
    
    echo "Installation des bundles Symfony..."
    composer require webapp --no-interaction
    composer require orm --no-interaction
    composer require api --no-interaction
    composer require maker --dev --no-interaction
    composer require lexik/jwt-authentication-bundle --no-interaction
    composer require nelmio/cors-bundle --no-interaction
    
    echo "[OK] Symfony installe avec succes !"
else
    echo "[INFO] Symfony deja installe, passage a l'etape suivante..."
fi
cd ..
echo ""

# Créer .env.example pour le backend
echo "Creation de .env.example..."
cat > backend/.env.example << 'EOF'
# Database
DATABASE_URL="postgresql://calendria_user:calendria_pass@db:5432/calendria?serverVersion=15&charset=utf8"

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# App
APP_ENV=dev
APP_SECRET=change_me_in_production
EOF
echo "[OK] .env.example cree !"
echo ""

# Installer React
echo "Installation de React avec Vite..."
cd frontend
if [ ! -f "package.json" ]; then
    npm create vite@latest . -- --template react-ts --yes
    npm install
    
    echo "Installation des dependances React..."
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    npm install react-router-dom
    npm install axios
    npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
    npm install react-hook-form
    npm install zustand
    npm install date-fns
    
    echo "[OK] React installe avec succes !"
else
    echo "[INFO] React deja installe, passage a l'etape suivante..."
fi
cd ..
echo ""

# Créer .env.example pour le frontend
echo "Creation de .env.example pour le frontend..."
cat > frontend/.env.example << 'EOF'
VITE_API_URL=http://localhost:8000
EOF
echo "[OK] .env.example cree !"
echo ""

# Résumé
echo "[OK] Initialisation terminee !"
echo ""
echo "Prochaines etapes :"
echo "1. Copier les fichiers .env.example vers .env et configurer les cles API"
echo "   cp backend/.env.example backend/.env"
echo "   cp frontend/.env.example frontend/.env"
echo ""
echo "2. Editer backend/.env et ajouter vos cles Twilio et OpenAI"
echo ""
echo "3. Lancer Docker Compose :"
echo "   docker-compose up -d"
echo ""
echo "4. Acceder a l'application :"
echo "   - Frontend : http://localhost:3000"
echo "   - Backend : http://localhost:8000"
echo ""
echo "Bon developpement !"
