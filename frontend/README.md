# Frontend — Agenda Virtual

SPA de la agenda virtual: calendario (mes/semana/día), tareas, notas, productividad, usuarios y módulo financiero (ingresos, gastos, reportes). Construida con Vue 3 y conectada al backend Express vía Axios con sesión por cookie.

## Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite 8** — bundler y dev server
- **Vue Router 4** — enrutamiento con layouts dinámicos y guard de auth
- **Pinia** — estado global (sesión del usuario)
- **Axios** — peticiones HTTP (`withCredentials`)
- **Day.js** — manejo de fechas
- **VueUse** — utilidades reactivas
- **Tailwind CSS 3** — estilos (mobile first)

## Estructura

```
frontend/src/
├── main.js                 # bootstrap: Pinia + Router + CSS
├── App.vue                 # resuelve el layout dinámico según meta.layout
├── api/                    # axios.js (instancia base) + un archivo por recurso
│   ├── axios.js            # baseURL http://localhost:3000, interceptor 401 → /login
│   ├── auth.js, calendario.js, categorias.js, eventos.js,
│   └── ingresos.js, notas.js, tareas.js
├── stores/
│   └── usuarioStore.js     # sesión: verificarSesion / cerrarSesion
├── router/
│   └── index.js            # rutas + beforeEach (requiereAuth)
├── layouts/
│   ├── AuthLayout.vue      # pantallas sin nav (login)
│   └── DashboardLayout.vue # nav + sidebar para la app
├── components/
│   ├── layouts/            # AppHeader, AppSidebar
│   ├── ui/                 # AppFab
│   ├── eventos/, notas/, tareas/   # ModalCrear*.vue
└── views/                  # una por ruta (sufijo View / vistas de calendario)
```

## Rutas

| Ruta | Vista | Layout | Auth |
|------|-------|--------|------|
| `/` | → redirige a `/calendario` | — | — |
| `/login` | `LoginView` | AuthLayout | público |
| `/calendario` | `DashboardCalendarioView` (vista mes) | Dashboard | ✅ |
| `/semanal` | `CalendarioSemanal` | Dashboard | ✅ |
| `/diario` | `CalendarioDiario` | Dashboard | ✅ |
| `/tareas` | `GestionTareasView` | Dashboard | ✅ |
| `/notas` | `GestionNotasView` | Dashboard | ✅ |
| `/productividad` | `GestionProductividadView` | Dashboard | ✅ |
| `/usuarios` | `GestionUsuariosView` | Dashboard | ✅ |
| `/ingresos/registrar` | `RegistrarIngresoView` | Dashboard | ✅ |
| `/ingresos/reportes` | `ReportesFinancierosView` | Dashboard | ✅ |
| `/gastos/registrar` | `RegistrarGastoView` | Dashboard | ✅ |

## Layouts
- El layout se asigna en el router vía `meta.layout` (`'AuthLayout'` | `'DashboardLayout'`).
- `App.vue` lo resuelve dinámicamente con `<component :is="currentLayout">` y `<router-view />`.
- Si no se especifica, usa `DashboardLayout` por defecto.

## Autenticación
- Al montar, `App.vue` llama a `usuarioStore.verificarSesion()` (`GET /auth/verificar`).
- El guard `router.beforeEach` redirige a `/login` las rutas con `requiereAuth` si no hay sesión.
- El interceptor de Axios redirige a `/login` ante un `401`.
- El login se hace con Google OAuth (redirección a `/auth/google` en el backend) y existe `dev-login` para desarrollo.

## Convenciones
- Siempre `<script setup>` (Composition API); nunca Options API ni `this`.
- Las llamadas HTTP van siempre por `src/api/`, nunca Axios directo en componentes.
- Stores Pinia, nombres de variables/funciones en español, archivos `PascalCase.vue`.
- Tailwind mobile first; sin estilos en línea si Tailwind lo resuelve.

## Variables de entorno (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:3000
```

> El dev server además proxea `/api` a `http://localhost:3000` (ver `vite.config.js`).

## Comandos

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # previsualizar el build
```

> Requiere el backend corriendo en `http://localhost:3000` para autenticación y datos.
