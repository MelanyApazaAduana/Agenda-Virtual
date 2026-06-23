import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

// Todas las peticiones a la API se sirven a través del proxy de Vite para
// que vivan en el MISMO origen que el frontend (localhost:5173). Así la
// cookie de sesión es de primera parte y el navegador siempre la envía,
// evitando rebotes entre login y dashboard por cookies cross-origin.
const backend = { target: 'http://localhost:3000', changeOrigin: true }
const prefijosApi = [
  '/auth', '/eventos', '/tareas', '/etiquetas', '/notas', '/recordatorios',
  '/gastos', '/ingresos', '/presupuestos', '/recurrencias', '/calendario',
  '/productividad', '/uploads', '/api'
]

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: Object.fromEntries(prefijosApi.map((p) => [p, backend]))
  }
})
