# Backend — Agenda Virtual

API REST para una agenda virtual con calendario, tareas, notas, recordatorios y gestión financiera (ingresos, gastos, presupuestos). Autenticación mediante Google OAuth 2.0 con sesiones.

## Stack
- **Node.js + Express 5** (ES Modules `import/export`)
- **MySQL 8** vía `mysql2` (codificación **utf8mb4** para acentos y ñ)
- **Passport** + `passport-google-oauth20` — autenticación con Google
- **express-session** — manejo de sesión por cookie
- **node-cron** — tareas programadas (actualización automática de estados)
- **dotenv** — variables de entorno

## Estructura

```
backend/
├── server.js               # entry point: inicializa BD, middlewares, rutas, cron
├── config/
│   ├── database.js         # pool MySQL (mysql2/promise, charset utf8mb4) + testConnection()
│   ├── initDb.js           # crea la BD y tablas si no existen (al arrancar)
│   └── passport.js         # estrategia Google OAuth + serialize/deserialize
├── middleware/
│   └── auth.js             # verificarAutenticacion (protege rutas)
├── migrations/
│   └── init.sql            # esquema completo (idempotente, CREATE ... IF NOT EXISTS)
├── routes/                 # define rutas → llama al controller
├── controllers/            # recibe req/res → llama al model
└── models/                 # queries SQL (mysql2)
```

## Base de datos (MySQL) y codificación

- El proyecto usa **MySQL 8** exclusivamente. El esquema (`migrations/init.sql`) y la
  conexión usan **utf8mb4 / utf8mb4_unicode_ci**, por lo que acentos y la **ñ** se
  guardan y se muestran correctamente.
- **Creación automática al arrancar**: al ejecutar `npm run dev` (o `npm start`),
  `config/initDb.js` ejecuta `init.sql` con una conexión sin base de datos seleccionada.
  Como todo el script usa `CREATE DATABASE/TABLE IF NOT EXISTS`, **la base de datos y las
  tablas se crean solo si no existen y los registros previos se conservan** (no se borra nada).
- No necesitas crear la base de datos a mano antes de arrancar; basta con tener el servidor
  MySQL corriendo y las credenciales correctas en `backend/.env`.

## Modelo de datos (esquema v3)

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Cuentas (Google OAuth o dev-login). Roles `admin` / `usuario`. |
| `etiquetas` | Etiquetas (tags) por usuario; `color_hex` colorea el chip. |
| `entidad_etiquetas` | Pivote N:N polimórfico (etiqueta ↔ evento/tarea/ingreso/gasto). |
| `eventos` | Eventos del calendario (fecha inicio/fin, ubicación, estado, `color_hex`). Tabla autónoma. |
| `tareas` | Tareas con prioridad, fecha límite, estado y `color_hex`. Tabla autónoma. |
| `notas` | Notas con contenido, audio/imagen y `color_hex`; pueden colgar de un evento o tarea. |
| `recordatorios` | Recordatorios para **un** evento **o** una tarea (CHECK exclusivo). |
| `recurrencias` | Reglas de repetición; referenciadas por `eventos.recurrencia_id` / `tareas.recurrencia_id`. |
| `ingresos` | Ingresos con fuente y monto; opcionalmente ligados a un presupuesto. |
| `gastos` | Gastos con método de pago; opcionalmente ligados a una tarea y/o presupuesto. |
| `presupuestos` | Presupuestos históricos (`monto_total`, `limite_personalizado`); el vigente es el último creado. |
| `historial_productividad` | Métricas diarias de tareas (creadas/completadas/vencidas). |

**Color de los ítems**: `eventos`, `tareas` y `notas` tienen su propio `color_hex`
(el backend asigna un color por defecto según el tipo si no se envía: evento azul
`#3B82F6`, tarea verde `#10B981`, nota ámbar `#F59E0B`). Es independiente del
`etiquetas.color_hex`, que sólo colorea el chip de la etiqueta.

## Endpoints

Todas las rutas (salvo `/auth`) requieren sesión autenticada (`verificarAutenticacion`).

| Prefijo | Recurso |
|---------|---------|
| `/auth` | Login con Google, callback, verificar sesión, logout, dev-login |
| `/etiquetas` | CRUD, predeterminadas, vincular/desvincular, etiquetas de una entidad, entidades de una etiqueta |
| `/eventos` | CRUD, cambiar estado, actualización automática de estados |
| `/tareas` | CRUD, por estado, vencidas, cambiar estado/prioridad |
| `/notas` | CRUD, autoguardar, por evento/tarea, buscar, recientes, resumen |
| `/recordatorios` | CRUD, marcar leído, posponer, cancelar, pendientes, por evento/tarea |
| `/ingresos` | CRUD, resumen, por rango |
| `/gastos` | CRUD, resumen, reporte por método de pago, por tarea/rango/mes |
| `/presupuestos` | Listar historial, vigente, obtener, crear, eliminar |
| `/recurrencias` | Listar, obtener, crear, eliminar |
| `/calendario` | Vista combinada de eventos, tareas y notas |
| `/api/health` | Health check (estado del servidor y autenticación) |

### Autenticación (`/auth`)
- `GET /auth/google` — inicia el flujo OAuth de Google
- `GET /auth/google/callback` — callback; redirige al frontend
- `GET /auth/verificar` — `{ autenticado, usuario }` para el frontend
- `GET /auth/logout` — cierra sesión
- `POST /auth/dev-login` — login de desarrollo sin Google (usuario `dev@test.com`)

## Convenciones
- Siempre `async/await`, parámetros preparados (`pool.query(sql, [params])`).
- Las rutas solo enrutan; la lógica de queries vive en `models/`.
- Variables y funciones en español; se mantiene idioma original para palabras reservadas, APIs nativas y librerías.

## Tareas programadas
`node-cron` ejecuta cada hora (`0 * * * *`) `EventoModel.actualizarEstadosAutomaticos`, que marca eventos vencidos / en curso según la fecha.

## Variables de entorno (`backend/.env`)

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=agenda_virtual_v3

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=cambia-esto-por-un-secreto-seguro
```

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Tener un servidor MySQL 8 corriendo (local o Docker, ver abajo)
#    NO hace falta crear la base de datos a mano: se crea sola al arrancar.

# 3. Configurar backend/.env (credenciales de MySQL)

# 4. Arrancar (esto crea la BD/tablas si no existen y conserva los datos)
npm run dev     # con nodemon (recarga en caliente)
npm start       # producción
```

El servidor corre en `http://localhost:3000`. Al iniciar, ejecuta `init.sql`
(crea la BD/tablas solo si faltan) y prueba la conexión a la BD.

### MySQL con Docker

```bash
docker run -d \
  --name agenda_virtual_db \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=agenda_virtual_v3 \
  -p 3306:3306 \
  -v agenda_virtual_data:/var/lib/mysql \
  mysql:8 \
  --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

> Las credenciales coinciden con `backend/.env` (`DB_USER=root`, `DB_PASSWORD=root123`,
> `DB_NAME=agenda_virtual_v3`, `DB_PORT=3306`). No es necesario montar `init.sql` en el
> contenedor: el backend lo ejecuta automáticamente al arrancar. Los flags
> `--character-set-server` aseguran utf8mb4 también a nivel de servidor.
