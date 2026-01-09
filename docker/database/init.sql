-- Script d'initialisation de la base de données CALENDRIA
-- Exécuté automatiquement au premier démarrage du conteneur PostgreSQL

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données CALENDRIA initialisée avec succès !';
END $$;
