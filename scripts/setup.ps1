# Script d'initialisation du projet CALENDRIA (Windows PowerShell)
# Auteur : BOUGHERARA Safi
# Date : 09/01/2026

Write-Host "🚀 Initialisation du projet CALENDRIA..." -ForegroundColor Cyan
Write-Host ""

# Vérifier les prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

$prerequisites = @{
    "PHP" = "php --version"
    "Composer" = "composer --version"
    "Node.js" = "node --version"
    "npm" = "npm --version"
    "Docker" = "docker --version"
    "Docker Compose" = "docker-compose --version"
}

foreach ($tool in $prerequisites.Keys) {
    try {
        Invoke-Expression $prerequisites[$tool] | Out-Null
        Write-Host "✅ $tool installé" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ $tool n'est pas installé" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Installer Symfony
Write-Host "📦 Installation de Symfony 6.4 LTS..." -ForegroundColor Yellow
Set-Location backend

if (-Not (Test-Path "composer.json")) {
    composer create-project symfony/skeleton:"6.4.*" . --no-interaction
    
    Write-Host "📦 Installation des bundles Symfony..." -ForegroundColor Yellow
    composer require webapp --no-interaction
    composer require orm --no-interaction
    composer require api --no-interaction
    composer require maker --dev --no-interaction
    composer require lexik/jwt-authentication-bundle --no-interaction
    composer require nelmio/cors-bundle --no-interaction
    
    Write-Host "✅ Symfony installé avec succès !" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Symfony déjà installé, passage à l'étape suivante..." -ForegroundColor Yellow
}

Set-Location ..
Write-Host ""

# Créer .env.example pour le backend
Write-Host "📝 Création de .env.example..." -ForegroundColor Yellow
@"
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
"@ | Out-File -FilePath "backend\.env.example" -Encoding UTF8
Write-Host "✅ .env.example créé !" -ForegroundColor Green
Write-Host ""

# Installer React
Write-Host "📦 Installation de React avec Vite..." -ForegroundColor Yellow
Set-Location frontend

if (-Not (Test-Path "package.json")) {
    npm create vite@latest . -- --template react-ts --yes
    npm install
    
    Write-Host "📦 Installation des dépendances React..." -ForegroundColor Yellow
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    npm install react-router-dom
    npm install axios
    npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
    npm install react-hook-form
    npm install zustand
    npm install date-fns
    
    Write-Host "✅ React installé avec succès !" -ForegroundColor Green
}
else {
    Write-Host "⚠️  React déjà installé, passage à l'étape suivante..." -ForegroundColor Yellow
}

Set-Location ..
Write-Host ""

# Créer .env.example pour le frontend
Write-Host "📝 Création de .env.example pour le frontend..." -ForegroundColor Yellow
@"
VITE_API_URL=http://localhost:8000
"@ | Out-File -FilePath "frontend\.env.example" -Encoding UTF8
Write-Host "✅ .env.example créé !" -ForegroundColor Green
Write-Host ""

# Résumé
Write-Host "✅ Initialisation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Copier les fichiers .env.example vers .env et configurer les clés API"
Write-Host "   Copy-Item backend\.env.example backend\.env"
Write-Host "   Copy-Item frontend\.env.example frontend\.env"
Write-Host ""
Write-Host "2. Éditer backend\.env et ajouter vos clés Twilio et OpenAI"
Write-Host ""
Write-Host "3. Lancer Docker Compose :"
Write-Host "   docker-compose up -d"
Write-Host ""
Write-Host "4. Accéder à l'application :"
Write-Host "   - Frontend : http://localhost:3000"
Write-Host "   - Backend : http://localhost:8000"
Write-Host ""
Write-Host "🎉 Bon développement !" -ForegroundColor Green
