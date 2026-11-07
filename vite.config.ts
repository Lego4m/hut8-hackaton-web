import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Forward API calls to Rails in dev, so the browser never needs CORS.
    proxy: {
      '/api': 'http://localhost:3000',
      '/rails': 'http://localhost:3000',
    },
  },
})
