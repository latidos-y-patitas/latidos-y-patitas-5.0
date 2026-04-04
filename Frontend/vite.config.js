import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function normalizeProxyTarget(target) {
  let value = String(target || '').trim()
  if (!value) return ''
  value = value.replace(/\/:splat\/?$/, '').replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`
  }
  return value
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const DEFAULT_TARGET = 'https://latidos-y-patitas-50-production.up.railway.app'
  const rawTarget = env.VITE_API_TARGET || DEFAULT_TARGET
  const API_TARGET = normalizeProxyTarget(rawTarget) || DEFAULT_TARGET
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
          secure: API_TARGET.startsWith('https://'),
        },
      },
    },
  }
})