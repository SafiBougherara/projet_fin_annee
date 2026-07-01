import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Bake VITE_API_URL from process.env into the JS bundle at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL ?? 'http://localhost:8000'),
  },
  server: {
    host: true, // Écouter sur toutes les adresses IP (nécessaire pour Docker)
    port: 3000,  // Fixer le port à 3000
    watch: {
      usePolling: true, // Nécessaire pour le hot-reload sur certains systèmes Windows/Docker
    }
  },
})
