# Frontend — Agenda Virtual

## Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite** 8
- **Pinia** — estado global
- **Axios** — peticiones HTTP
- **Day.js** — manejo de fechas
- **VueUse** — utilidades reactivas
- **TailwindCSS** 3 — estilos

## Estructura de componentes

| Componente   | Estado | Descripción |
|-------------|--------|-------------|
| `Login.vue` | ✅ | Formulario de inicio de sesión y registro con tabs. Valida credenciales fijas (correo: `melany@ejemplo.com`, pass: `melany`). Emite `login-success` al autenticar. |
| `DashboardCalendario.vue` | ✅ | Pantalla principal con sidebar, selector de vista (Día/Semana/Mes) y cuadrícula de calendario. Botones "Nuevo" y "+" abren el modal de creación. Navega a Tareas vía `emit('navegar')`. |
| `ModalCrearEvento.vue` | ✅ | Modal con formulario para crear eventos (título, fecha, hora, ubicación, descripción, color). Emite `guardar` con los datos y `cerrar`. |
| `GestionTareas.vue` | ✅ | Panel Kanban con columnas Vencidos/En Proceso/Próximos. Tareas reactivas. Botones "Creación Rápida" y "+" abren `ModalCrearTarea`. Navega a Calendario vía `emit('navegar')`. |
| `ModalCrearTarea.vue` | ✅ | Modal con formulario para crear tareas (nombre, prioridad, fecha, asignado, etiquetas, descripción). Emite `guardar` y `cerrar`. |
| `GestionNotas.vue` | ✅ | Página de notas con grid de tarjetas. Botón "Nueva Nota" abre `ModalCrearNota`. |
| `ModalCrearNota.vue` | ✅ | Modal para crear notas (título, categoría, contenido). Emite `guardar` y `cerrar`. |
| `GestionProductividad.vue` | ✅ | Dashboard de productividad con gráfico de horas pico y ranking de equipo. |
| `GestionUsuarios.vue` | ✅ | Tabla de administración de usuarios con roles y políticas de seguridad. |
| `CalendarioSemanal.vue` | ⚠️ Sin uso directo | Componente de semana independiente, su lógica se integró en `DashboardCalendario`. |

## Navegación
- `App.vue` maneja la vista principal con la variable `vista` ('calendario' | 'tareas' | 'notas' | 'productividad' | 'usuarios').
- Todas las páginas emiten `navegar` desde su sidebar para cambiar de sección. Los links están implementados como `<button>` (no `<a href="#">`) para evitar recargas.
| `HelloWorld.vue` | ❌ Sin uso | Componente por defecto de Vite, sin implementar. |

## Flujo de navegación
- `App.vue` controla la vista con una variable reactiva `usuario`.
- Sin sesión → `Login`.
- Con sesión → `Dashboard`.

## Decisiones
- Las credenciales de login son quemadas (hardcoded) para prototipo.
- El placeholder del nombre en registro se cambió a "Melany Apaza".

## Comandos
```bash
npm run dev      # desarrollo en :5173
npm run build    # build producción
```
