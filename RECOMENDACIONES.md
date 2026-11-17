# Recomendaciones de mejora — Agenda Virtual

Análisis de errores lógicos y oportunidades de ampliación, ordenado de **mayor a menor prioridad**.
Referencias `archivo:línea` corresponden al estado del código al momento del análisis.

## Resumen

| Prioridad | Enfoque | Cantidad |
|-----------|---------|----------|
| Crítica | Seguridad, privacidad y control de acceso | 5 |
| Alta | Integridad de datos y lógica de negocio | 8 |
| Media | Consistencia funcional y UX | 7 |
| Baja | Mantenimiento y calidad | 4 |
| Ampliaciones | Nuevas funcionalidades | 10 |

---

## Prioridad crítica

### 1. `GET /recordatorios/pendientes` expone datos de todos los usuarios

- **Ubicación:** `backend/controllers/recordatorioController.js:337` → `backend/models/RecordatorioModel.js:221`
- **Problema:** el modelo consulta todos los recordatorios programados sin filtrar por `usuario_id` e incluye `usuario_correo` y `usuario_nombre`. Cualquier usuario autenticado puede leer los pendientes de los demás.
- **Recomendación:** filtrar por `usuario_id` en el endpoint de usuario y crear una ruta interna separada (token de cron) para el proceso global.
- [ ] Corregir

### 2. `PUT /eventos/estados/actualizar/global` accesible para cualquier sesión

- **Ubicación:** `backend/routes/eventoRoutes.js:21`, `backend/controllers/eventoController.js:416`
- **Problema:** solo exige autenticación y recalcula los estados de los eventos de **todos** los usuarios.
- **Recomendación:** restringir a rol administrador o exigir un secreto de cron; dejar el endpoint por usuario (`/estados/actualizar`) para el frontend.
- [ ] Corregir

### 3. Vínculo de etiquetas sin validar la entidad

- **Ubicación:** `backend/controllers/etiquetaController.js:160-188`, `backend/models/EntidadEtiquetaModel.js:44-65`
- **Problema:** se valida que la etiqueta sea del usuario, pero no que el evento/tarea/ingreso/gasto también lo sea. Esto permite vínculos entre inquilinos y, al listar entidades por etiqueta, expone títulos ajenos.
- **Recomendación:** validar la pertenencia de `(entidad_tipo, entidad_id)` antes de vincular/desvincular y filtrar las entidades por `usuario_id` en las consultas.
- [ ] Corregir

### 4. `/auth/dev-login` activo en cualquier entorno

- **Ubicación:** `backend/routes/authRoutes.js:146`
- **Problema:** crea e inicia sesión sin credenciales con solo invocar el endpoint.
- **Recomendación:** registrar la ruta solo si `NODE_ENV !== 'production'` o eliminarla del despliegue.
- [ ] Corregir

### 5. Configuración de sesión y CORS insegura para producción

- **Ubicación:** `backend/server.js:36-52`
- **Problema:** `MemoryStore` por defecto (pierde sesiones al reiniciar y no escala), `SESSION_SECRET` placeholder, `cookie.secure:false` y CORS fijo a `http://localhost:5173`.
- **Recomendación:** session store persistente (MySQL/Redis), secreto robusto por entorno, `secure`/`sameSite` en producción y orígenes CORS configurables.
- [ ] Corregir

---

## Prioridad alta

### 6. Recurrencias incompletas y con deriva mensual

- **Ubicación:** `backend/utils/recurrencia.js:28-48`
- **Problema:** `num_rec` y `frecuencia_dias` se guardan pero no se usan al materializar; solo se aplican `intervalo` y `fecha_fin`. Además `setMonth` deriva (31 de enero + 1 mes → 3 de marzo).
- **Recomendación:** respetar `num_rec` como tope de ocurrencias y `frecuencia_dias` para "cada N días"; calcular mensual conservando el día original o usando el último día del mes (clamp).
- [ ] Corregir

### 7. `fecha_completado` no se actualiza con el estado

- **Ubicación:** `backend/controllers/tareaController.js:164-173`, `backend/models/ProductividadModel.js:80-86`
- **Problema:** al pasar a `completada` no se asigna `fecha_completado`, así que la métrica de completadas por día queda incompleta. Al revertir el estado tampoco se limpia.
- **Recomendación:** setear `fecha_completado = NOW()` al completar y `NULL` al revertir; centralizar la regla en el modelo.
- [ ] Corregir

### 8. No se puede volver a un estado automático en eventos

- **Ubicación:** `backend/controllers/eventoController.js:232-252`, `backend/controllers/eventoController.js:344-351`
- **Problema:** una vez fijado `cancelado`, `completado` o `pospuesto`, no hay forma de regresar a `pendiente`, `en_curso` o `vencido`; el modal de edición no envía `estado`.
- **Recomendación:** aceptar un valor "automático" explícito (`estado: null`/`'auto'`) que fuerza el recálculo por fechas.
- [ ] Corregir

### 9. Falta validación de enums en actualizaciones

- **Ubicación:** `backend/controllers/tareaController.js:164`, `backend/controllers/eventoController.js:244-252`
- **Problema:** valores inválidos de `estado`/`prioridad` llegan a MySQL y producen error 500 en lugar de 400.
- **Recomendación:** validar contra la lista permitida antes de la consulta y devolver un mensaje claro.
- [ ] Corregir

### 10. Operaciones multi-paso sin transacción

- **Ubicación:** `backend/controllers/eventoController.js:84-107`, `backend/controllers/tareaController.js:40-63`, creación de ingresos/gastos con `PresupuestoModel.asegurar`
- **Problema:** si falla una inserción intermedia, quedan reglas de recurrencia o movimientos parciales.
- **Recomendación:** usar una conexión con `beginTransaction`/`commit`/`rollback` para el bloque completo.
- [ ] Corregir

### 11. Presupuesto sin historial pese al diseño

- **Ubicación:** `backend/models/PresupuestoModel.js:37-43`
- **Problema:** `establecer` actualiza la misma fila; el esquema sugiere un registro histórico.
- **Recomendación:** insertar una nueva versión y considerar vigente la última anterior a la fecha consultada (o corregir el esquema y la documentación si se prefiere una sola fila).
- [ ] Corregir

### 12. Vínculos de etiquetas huérfanos

- **Ubicación:** `backend/migrations/init.sql` (`entidad_etiquetas`), `backend/models/EntidadEtiquetaModel.js`
- **Problema:** no hay FK ni limpieza al eliminar eventos, tareas, ingresos o gastos; quedan filas huérfanas que aparecen sin descripción.
- **Recomendación:** eliminar los vínculos dentro de la transacción de borrado de cada entidad (o añadir triggers/limpieza programada).
- [ ] Corregir

### 13. Filtro `fecha_limite_desde` descartado en tareas

- **Ubicación:** `backend/controllers/tareaController.js:86-91`, `backend/models/TareaModel.js:52-60`
- **Problema:** el modelo soporta el filtro, pero el controlador no lo lee.
- **Recomendación:** añadirlo a la desestructuración y a `filtros`.
- [ ] Corregir

---

## Prioridad media

### 14. Días adyacentes del calendario sin datos

- **Ubicación:** `frontend/src/views/DashboardCalendarioView.vue:248-252`
- **Problema:** se carga solo el rango del mes, pero la grilla muestra días del mes anterior/siguiente, que aparecen vacíos.
- **Recomendación:** calcular el rango desde el primer día visible de la grilla hasta el último y cargar ese intervalo.
- [ ] Corregir

### 15. Criterio de "vencidas" distinto entre frontend y backend

- **Ubicación:** `frontend/src/views/GestionTareasView.vue:110`, `backend/models/ProductividadModel.js:16-20`, `backend/models/TareaModel.js:167-176`
- **Problema:** el frontend compara por día y el backend por timestamp exacto; una tarea puede aparecer vencida en una vista y no en otra.
- **Recomendación:** unificar el criterio (por ejemplo, comparar contra el inicio del día en ambos lados) o exponer el estado calculado desde el backend.
- [ ] Corregir

### 16. Notas asociadas a eventos futuros aparecen el día de creación

- **Ubicación:** `frontend/src/views/DashboardCalendarioView.vue:217`
- **Problema:** `notasDelDia` usa `fecha_creacion`; una nota ligada a un evento futuro se muestra en el día en que se escribió.
- **Recomendación:** si la nota tiene `evento_id`, ubicarla en la fecha del evento; si no, mantener `fecha_creacion`.
- [ ] Corregir

### 17. Indicador de carga inexistente en etiquetas

- **Ubicación:** `frontend/src/views/EtiquetasView.vue:22`, `frontend/src/stores/etiquetasStore.js:39`
- **Problema:** la vista usa `etiquetasStore.cargando`, pero el store expone `cargado`; el spinner nunca se muestra.
- **Recomendación:** añadir un estado `cargando` real al store o eliminar el spinner.
- [ ] Corregir

### 18. Errores silenciados en creación de recurrencias y etiquetas

- **Ubicación:** `frontend/src/composables/useAgenda.js` (`resolverRecurrenciaId`), `frontend/src/utils/etiquetasSync.js:24-25`
- **Problema:** los `.catch` devuelven `null` o se tragan el error; el evento/tarea se crea sin recurrencia o sin etiquetas y el usuario no se entera.
- **Recomendación:** propagar el error o mostrar una advertencia y ofrecer reintento.
- [ ] Corregir

### 19. Gestión de usuarios es solo maqueta

- **Ubicación:** `frontend/src/views/GestionUsuariosView.vue`
- **Problema:** la vista indica "Pendiente de API" y no existe CRUD de usuarios ni roles en el backend.
- **Recomendación:** implementar endpoints de administración (listar, cambiar rol/estado, eliminar) y conectarlos a la vista.
- [ ] Corregir

### 20. Riesgo de zona horaria

- **Ubicación:** `backend/config/database.js`, serialización JSON de fechas
- **Problema:** `DATETIME` de MySQL se interpreta como `Date` local y se serializa a UTC; en un servidor con otra zona los eventos se desplazan.
- **Recomendación:** fijar la zona horaria en la conexión y en el proceso, o almacenar/transportar ISO 8601 con offset de forma consistente.
- [ ] Corregir

---

## Prioridad baja

### 21. Tabla `historial_productividad` sin uso

- **Ubicación:** `backend/migrations/init.sql`, única escritura en `backend/scripts/seed.js:197`
- **Problema:** no hay modelo ni controlador que la mantenga.
- **Recomendación:** poblarla con un cron diario y usarla en reportes, o eliminarla del esquema para evitar deuda.
- [ ] Resolver

### 22. Falta paginación en listados

- **Ubicación:** controladores de eventos, tareas, notas, gastos e ingresos
- **Problema:** los listados devuelven todo; con datos reales crecerá el tiempo de respuesta y el payload.
- **Recomendación:** añadir `page`/`limit` y total en las respuestas más pesadas.
- [ ] Implementar

### 23. Sin validación centralizada de entrada

- **Problema:** cada controlador valida a mano y de forma desigual.
- **Recomendación:** adoptar `zod` o `express-validator` con esquemas por endpoint y un middleware de error común.
- [ ] Implementar

### 24. Índices y migraciones

- **Problema:** `init.sql` se ejecuta en cada arranque y no hay migraciones versionadas; conviene revisar índices para `usuario_id + estado` y rangos de fecha.
- **Recomendación:** introducir un runner de migraciones y añadir índices según las consultas más frecuentes.
- [ ] Implementar

---

## Ampliaciones funcionales

1. **Transacciones** en recurrencias, finanzas y borrados con vínculos.
2. **Recordatorios reales:** cron que marque `enviado` y envíe correo o notificación push (hoy solo se consultan).
3. **CRUD de usuarios y roles** conectado a la vista existente.
4. **Historial de presupuestos** con versión vigente por fecha.
5. **Uso de `historial_productividad`** con snapshot diario para reportes.
6. **Adjuntos en notas** (audio, imagen, documento): el esquema ya tiene columnas; falta validación de tipo/tamaño y acceso protegido.
7. **Búsqueda global** por texto además del filtro por etiqueta.
8. **Vista semana/día** en el calendario y carga de días adyacentes.
9. **Exportación de reportes** a PDF/CSV.
10. **Calidad:** tests unitarios (empezando por `recurrencia.js`), tests de integración de controladores, `helmet`, rate limiting y documentación OpenAPI.

---

## Plan sugerido

1. **Fase 1 — Seguridad:** puntos 1 a 5.
2. **Fase 2 — Integridad:** puntos 6 a 13 (con tests de recurrencia y completado de tareas).
3. **Fase 3 — Consistencia:** puntos 14 a 20.
4. **Fase 4 — Ampliaciones:** funcionalidades y mejoras de mantenimiento.
