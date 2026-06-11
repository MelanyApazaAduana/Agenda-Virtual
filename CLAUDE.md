# CLAUDE.md

## Stack
- **Backend**: Node.js + Express 5, ES Modules (`import/export`), MySQL 8 via `mysql2/promise`
- **Frontend**: Vue 3 + Vite, JavaScript (no TypeScript), Pinia, Axios, Tailwind CSS 3, VueUse, Day.js

---

## Backend — reglas

**Estructura de carpetas**
```
backend/
├── server.js               # entry point
├── src/
│   ├── config/db.js        # pool MySQL
│   ├── routes/             # solo define rutas → llama controller
│   ├── controllers/        # recibe req/res → llama service
│   ├── services/           # lógica de negocio pura
│   ├── models/             # queries SQL
│   ├── middleware/         # auth, error handler, validación
│   └── utils/response.js   # helpers success() / error()
```

**Convenciones**
- Siempre `async/await`, nunca callbacks
- Respuesta estándar: `{ ok: true, data }` / `{ ok: false, message }`
- Propagar errores con `next(err)` al error middleware
- Queries con parámetros preparados: `pool.query("SELECT * FROM t WHERE id = ?", [id])`
- Nunca concatenar strings en SQL

**No hacer**
- Lógica de negocio en rutas o controllers
- Importar `pool` directamente en controllers
- Usar `var`; solo `const/let`

---

## Frontend — reglas

**Estructura de carpetas**
```
frontend/src/
├── api/          # axios.js (instancia base) + archivos por recurso
├── stores/       # Pinia stores (setup syntax)
├── router/       # Vue Router + guards
├── views/        # una por ruta, sufijo View.vue
├── components/
│   ├── ui/       # átomos: AppButton, AppInput, AppModal
│   ├── layout/   # AppNavbar, AppSidebar, AppFooter
│   └── [feature]/
├── layouts/      # plantillas de página completa
├── composables/  # prefijo use: useAuth.js
├── layouts/      # DefaultLayout.vue, AuthLayout.vue, DashboardLayout.vue
└── utils/        # formatters.js, validators.js
```

**Layouts**
- Viven en `src/layouts/`, nombre sufijo `Layout.vue`
- Layouts comunes: `DefaultLayout.vue` (con navbar + sidebar), `AuthLayout.vue` (centrado, sin nav), `BlankLayout.vue`
- Se asignan en el router via `meta.layout`:
  ```js
  { path: '/login', component: LoginView, meta: { layout: 'AuthLayout' } }
  ```
- `App.vue` resuelve el layout dinámicamente:
  ```vue
  <component :is="currentLayout"><router-view /></component>
  ```
- Los layouts solo definen estructura (slots, grid, posición del nav); nunca lógica de negocio


- Siempre `<script setup>` (Composition API)
- Props: `defineProps({ prop: { type: String, required: true } })`
- Emits: `defineEmits(['update:modelValue'])`
- Nombres de archivos: `PascalCase.vue`
- Stores: setup syntax con `ref()` y `computed()`
- Llamadas a la API: siempre via `src/api/`, nunca axios directo en componentes

**Tailwind**
- Mobile first: clases base para móvil, `md:` para tablet, `lg:` para desktop
- Sin `@apply` salvo en `main.css` para clases utilitarias compartidas
- Sin estilos en línea si Tailwind lo resuelve

**No hacer**
- Usar `this` (Composition API)
- Options API
- Fetch o axios directo en componentes
- TypeScript

---

## Variables de entorno

```bash
# backend/.env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=myapp_db
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:3000/api/v1
```
