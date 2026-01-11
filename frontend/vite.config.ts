import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Écouter sur toutes les adresses IP (nécessaire pour Docker)
    port: 3000,  // Fixer le port à 3000
    watch: {
      usePolling: true, // Nécessaire pour le hot-reload sur certains systèmes Windows/Docker
    }
  },
})
