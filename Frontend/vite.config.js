import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_TARGET = env.VITE_API_TARGET || 'latidos-y-patitas-50-production.up.railway.app'
  return {
    plugins: [
      react(),
      tailwindcss(), 
    ],
    server: {
      port: 3915,
      strictPort: false,
      open: true,
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    proxy: {
      '/api': {
        target: `https://${API_TARGET}`,  // ← agrega https://
        changeOrigin: true,
        secure: true,                      // ← true porque Railway usa HTTPS
      },
    },
  }
})