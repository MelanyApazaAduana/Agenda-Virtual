# CLAUDE.md — Configuración del proyecto

## Stack
- **Backend**: Node.js + Express 5, ES Modules (`import/export`), MySQL 8 via `mysql2/promise`
- **Frontend**: Vue 3 + Vite, JavaScript (no TypeScript), Pinia, Axios, Tailwind CSS 3, VueUse, Day.js

---

## Reglas de código
- Las variables y funciones creadas deben nombrarse en español
- Se permite mantener el idioma original si:
  - son palabras reservadas del lenguaje
  - APIs nativas del lenguaje
  - librerías externas
  - frameworks

---

## Backend — reglas

### Estructura actual de carpetas
```
backend/
├── server.js                    # entry point
├── .env                         # variables de entorno
├── package.json
├── config/
│   ├── database.js              # pool MySQL
│   └── passport.js              # configuración Passport (Google OAuth)
├── controllers/                 # [vacío] — recibe req/res → llama service
├── middleware/                   # [vacío] — auth, error handler, validación
├── models/
│   └── UsuarioModel.js          # queries SQL de usuarios
├── routes/                      # [vacío] — solo define rutas → llama controller
└── node_modules/
```

### Convenciones
- Siempre `async/await`, nunca callbacks
- Respuesta estándar: `{ ok: true, data }` / `{ ok: false, message }`
- Propagar errores con `next(err)` al error middleware
- Queries con parámetros preparados: `pool.query("SELECT * FROM t WHERE id = ?", [id])`
- Nunca concatenar strings en SQL

### No hacer
- Lógica de negocio en rutas o controllers
- Importar `pool` directamente en controllers
- Usar `var`; solo `const/let`

---

## Frontend — reglas

### Estructura actual de carpetas
```
frontend/src/
├── api/                         # [solo .gitkeep] — axios.js + archivos por recurso
├── stores/                      # [solo .gitkeep] — Pinia stores (setup syntax)
├── router/
│   └── index.js                 # Vue Router + guards (meta.layout)
├── views/                       # una por ruta, sufijo View.vue
│   ├── LoginView.vue
│   ├── DashboardCalendarioView.vue
│   ├── GestionTareasView.vue
│   ├── GestionNotasView.vue
│   ├── GestionProductividadView.vue
│   └── GestionUsuariosView.vue
├── components/
│   ├── ui/                      # [solo .gitkeep] — átomos: AppButton, AppInput, AppModal
│   ├── layout/
│   │   └── AppSidebar.vue
│   ├── eventos/
│   │   └── ModalCrearEvento.vue
│   ├── tareas/
│   │   └── ModalCrearTarea.vue
│   └── notas/
│       └── ModalCrearNota.vue
├── layouts/
│   ├── AuthLayout.vue
│   └── DashboardLayout.vue
├── composables/                 # [solo .gitkeep] — prefijo use: useAuth.js
├── utils/                       # [solo .gitkeep] — formatters.js, validators.js
├── App.vue                      # resuelve layout dinámicamente
├── main.js                      # entry point
├── assets/
│   └── css/
│       └── main.css             # estilos globales + @apply compartidos
└── style.css                    # [legado Vite, sin uso]
```

### Layouts
- Viven en `src/layouts/`, nombre sufijo `Layout.vue`
- Layouts actuales: `AuthLayout.vue` (centrado, sin nav), `DashboardLayout.vue` (con sidebar)
- Se asignan en el router via `meta.layout`:
  ```js
  { path: '/login', component: LoginView, meta: { layout: 'AuthLayout' } }
  ```
- `App.vue` resuelve el layout dinámicamente:
  ```vue
  <component :is="currentLayout"><router-view /></component>
  ```
- Los layouts solo definen estructura (slots, grid, posición del nav); nunca lógica de negocio

### Convenciones de código
- Siempre `<script setup>` (Composition API)
- Props: `defineProps({ prop: { type: String, required: true } })`
- Emits: `defineEmits(['update:modelValue'])`
- Nombres de archivos: `PascalCase.vue`
- Stores: setup syntax con `ref()` y `computed()`
- Llamadas a la API: siempre via `src/api/`, nunca axios directo en componentes

### Tailwind
- Mobile first: clases base para móvil, `md:` para tablet, `lg:` para desktop
- Sin `@apply` salvo en `main.css` para clases utilitarias compartidas
- Sin estilos en línea si Tailwind lo resuelve

### No hacer
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
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=agenda_virtual
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=...

# frontend/.env (pendiente de crear)
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Base de datos
- Motor: MySQL 8 (schema migrado desde MariaDB 10.4)
- Archivo: `database/schema.sql`
- Base de datos: `agenda_virtual`
- Tablas: `usuarios`, `categorias`, `elementos`, `ingresos`, `eventos`, `tareas`, `recurrencias`, `notas`, `recordatorios`, `gastos`, `presupuestos`, `racha_productividad`, `historial_productividad`

---

## Dependencias instaladas

### Backend
| Paquete | Versión | Uso |
|---|---|---|
| express | ^5.2.1 | Framework web |
| mysql2 | ^3.22.5 | Conexión MySQL |
| cors | ^2.8.6 | CORS |
| dotenv | ^17.4.2 | Variables de entorno |
| passport | ^0.7.0 | Autenticación |
| passport-google-oauth20 | ^2.0.0 | Google OAuth |
| express-session | ^1.19.0 | Sesiones |
| nodemon (dev) | ^3.1.14 | Recarga automática |

### Frontend
| Paquete | Versión | Uso |
|---|---|---|
| vue | ^3.5.34 | Framework |
| vue-router | ^4.6.4 | Rutas |
| pinia | ^3.0.4 | Estado global |
| axios | ^1.17.0 | HTTP client |
| @vueuse/core | ^14.3.0 | Utilidades Vue |
| dayjs | ^1.11.21 | Fechas |
| vite | ^8.0.12 | Build tool |
| tailwindcss | ^3.4.19 | CSS utility |
| autoprefixer | ^10.5.0 | CSS vendor prefixes |
| postcss | ^8.5.15 | CSS processor |

---

# Planificación del Proyecto — AgendaVirtual

## Fase 0 — Corrección de deuda técnica actual

| # | Tarea | Estado |
|---|---|---|
| 0.1 | Corregir `database/schema.sql`: eliminar `IF NOT EXISTS` del `ALTER TABLE` (incompatible MySQL 8) | Pendiente |
| 0.2 | Reestructurar backend: mover archivos a `src/`, crear `services/`, `utils/`, poblar `middleware/` | Pendiente |
| 0.3 | Agregar `frontend/.env` con `VITE_API_URL` | Pendiente |
| 0.4 | Eliminar vistas duplicadas viejas sin sufijo `View.vue` (CalendarioSemanal, CalendarioDiario, GestionTareas, GestionNotas, GestionProductividad, GestionUsuarios) | Pendiente |
| 0.5 | Mover `ModalCrear*.vue` de `views/` a `components/feature/` (ya existen en components/) | Pendiente |
| 0.6 | Eliminar archivos legacy: `HelloWorld.vue`, `style.css` | Pendiente |
| 0.7 | Agregar `jsonwebtoken` y `bcryptjs` al backend | Pendiente |

## Fase 1 — Infraestructura base

| # | Tarea |
|---|---|
| 1.1 | Backend: crear `src/utils/response.js` con helpers `exito(data)` y `error(mensaje)` |
| 1.2 | Backend: crear `src/middleware/manejadorErrores.js` con `next(err)` centralizado |
| 1.3 | Backend: crear `src/middleware/auth.js` — middleware JWT |
| 1.4 | Backend: crear `src/routes/`, `src/controllers/`, `src/services/` con estructura base |
| 1.5 | Frontend: crear `src/api/axios.js` (instancia Axios con interceptors) |
| 1.6 | Frontend: crear stores (`useAuthStore`, `useEventosStore`, `useTareasStore`, `useNotasStore`, `useProductividadStore`) |
| 1.7 | Frontend: crear `src/composables/useAuth.js`, `useFormateo.js`, `useNotificacion.js` |
| 1.8 | Frontend: crear componentes UI atómicos (`AppButton.vue`, `AppInput.vue`, `AppModal.vue`, `AppSelect.vue`, `AppBadge.vue`) |

## Fase 2 — Módulo de autenticación y usuarios

| # | Tarea | RF |
|---|---|---|
| 2.1 | Backend: CRUD usuarios (modelo, servicio, controlador, rutas) | RF-06 |
| 2.2 | Backend: registro de usuario `POST /api/v1/auth/registro` | RF-09 |
| 2.3 | Backend: login email/contraseña `POST /api/v1/auth/login` con JWT | RF-06 |
| 2.4 | Backend: login con Google `GET /api/v1/auth/google` + callback | RF-06 |
| 2.5 | Frontend: conectar formulario login/registro con backend | RF-09, RF-06 |
| 2.6 | Frontend: conectar botón Google con backend OAuth | RF-06 |
| 2.7 | Frontend: guardias de ruta (redirect a `/login` si no hay sesión) | RF-06 |

## Fase 3 — Módulo de categorías

| # | Tarea | RF |
|---|---|---|
| 3.1 | Backend: CRUD categorías | RF-13 |
| 3.2 | Frontend: gestión de categorías (UI crear/editar/eliminar) | RF-13 |
| 3.3 | Frontend: componente `SelectorCategoria.vue` reutilizable | RF-13 |

## Fase 4 — Módulo de calendario y eventos

| # | Tarea | RF |
|---|---|---|
| 4.1 | Backend: CRUD eventos | RF-01 |
| 4.2 | Backend: recurrencias (modelo + servicio) | RF-01 |
| 4.3 | Frontend: vista calendario mensual | RF-07 |
| 4.4 | Frontend: vista calendario semanal | RF-07 |
| 4.5 | Frontend: vista calendario diario | RF-07 |
| 4.6 | Frontend: modal crear/editar evento | RF-01 |
| 4.7 | Frontend: navegación mes/semana/día | RF-07 |

## Fase 5 — Módulo de tareas

| # | Tarea | RF |
|---|---|---|
| 5.1 | Backend: CRUD tareas | RF-02 |
| 5.2 | Backend: endpoint `PATCH /tareas/:id/completar` | RF-03 |
| 5.3 | Frontend: lista de tareas con filtros | RF-02 |
| 5.4 | Frontend: checkbox completar tarea | RF-03 |
| 5.5 | Frontend: modal crear/editar tarea | RF-02 |

## Fase 6 — Módulo de notas

| # | Tarea | RF |
|---|---|---|
| 6.1 | Backend: CRUD notas | RF-05 |
| 6.2 | Backend: subida de archivos (audio_url, imagen_url) | RF-05 |
| 6.3 | Frontend: lista de notas tipo grid/tablero | RF-05 |
| 6.4 | Frontend: editor de nota (título, contenido, color, adjuntos) | RF-05 |
| 6.5 | Frontend: filtro por estado (borrador/guardado/archivado) | RF-05 |

## Fase 7 — Módulo de recordatorios

| # | Tarea | RF |
|---|---|---|
| 7.1 | Backend: CRUD recordatorios (polimórfico: evento/tarea/nota) | RF-04 |
| 7.2 | Frontend: lista de recordatorios con estados | RF-04 |
| 7.3 | Frontend: botón "Recordarme" en eventos/tareas/notas | RF-04 |

## Fase 8 — Módulo de ingresos, gastos y presupuestos

| # | Tarea | RF |
|---|---|---|
| 8.1 | Backend: CRUD ingresos | RF-10 |
| 8.2 | Backend: CRUD gastos | RF-11 |
| 8.3 | Backend: CRUD presupuestos | RF-12 |
| 8.4 | Backend: reporte de gastos por categoría/período | RF-14 |
| 8.5 | Backend: reporte de ahorro (ingresos - gastos, tendencias) | RF-15 |
| 8.6 | Frontend: vista dashboard finanzas (resumen ingresos/gastos/saldo) | RF-10, RF-11 |
| 8.7 | Frontend: formularios ingreso/gasto | RF-10, RF-11 |
| 8.8 | Frontend: gestión de presupuestos con progreso | RF-12 |
| 8.9 | Frontend: gráficos de reportes (gastos por categoría, ahorro mensual) | RF-14, RF-15 |

## Fase 9 — Módulo de productividad

| # | Tarea | RF |
|---|---|---|
| 9.1 | Backend: historial_productividad + racha_productividad | RF-08 |
| 9.2 | Backend: endpoint estadísticas agregadas | RF-08 |
| 9.3 | Frontend: dashboard métricas (tareas completadas, racha, promedio) | RF-08 |
| 9.4 | Frontend: gráficos de tendencia semanal/mensual | RF-08 |
| 9.5 | Frontend: vista de racha tipo "calendario de contribuciones" | RF-08 |

## Fase 10 — Pulido y despliegue

| # | Tarea |
|---|---|
| 10.1 | Responsive general (móvil, tablet, desktop) |
| 10.2 | Manejo de errores global con notificaciones toast |
| 10.3 | Estados de carga (skeletons) en todas las vistas |
| 10.4 | Estados vacíos con mensajes ilustrativos |
| 10.5 | Seguridad: sanitización, rate limiting, helmet |
| 10.6 | Pruebas de humo en flujos críticos |
| 10.7 | Build de producción y despliegue |
