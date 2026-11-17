import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { inicializarBaseDeDatos } from '../config/initDb.js';
import promisePool from '../config/database.js';

dotenv.config();

const USUARIO_DEMO = {
  nombre: 'Usuario Demo',
  correo: 'demo@agenda.local',
  contrasena: 'demo1234',
  rol: 'usuario',
};

const hoy = new Date();
const isoDate = (d) => d.toISOString().slice(0, 10);
const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};
const dt = (d, h = 9, m = 0) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())} ${pad(x.getHours())}:${pad(x.getMinutes())}:00`;
};

async function obtenerOCrearUsuario() {
  const [rows] = await promisePool.query('SELECT id FROM usuarios WHERE correo = ?', [USUARIO_DEMO.correo]);
  if (rows.length > 0) {
    const id = rows[0].id;
    await promisePool.query('DELETE FROM usuarios WHERE id = ?', [id]); // cascada limpia todo lo del demo
  }
  const hash = await bcrypt.hash(USUARIO_DEMO.contrasena, 10);
  const [res] = await promisePool.query(
    `INSERT INTO usuarios (nombre, correo, contrasena, rol, estado, ultimo_acceso)
     VALUES (?, ?, ?, ?, TRUE, NOW())`,
    [USUARIO_DEMO.nombre, USUARIO_DEMO.correo, hash, USUARIO_DEMO.rol]
  );
  return res.insertId;
}

async function seed() {
  await inicializarBaseDeDatos();
  const uid = await obtenerOCrearUsuario();

  // Etiquetas
  const etiquetasDef = [
    ['Trabajo', '#4F46E5'],
    ['Personal', '#10B981'],
    ['Urgente', '#EF4444'],
    ['Estudio', '#8B5CF6'],
    ['Finanzas', '#22C55E'],
  ];
  const etiquetaIds = {};
  for (const [nombre, color] of etiquetasDef) {
    const [r] = await promisePool.query(
      'INSERT INTO etiquetas (usuario_id, nombre, color_hex) VALUES (?, ?, ?)',
      [uid, nombre, color]
    );
    etiquetaIds[nombre] = r.insertId;
  }

  // Recurrencia
  const [recRes] = await promisePool.query(
    `INSERT INTO recurrencias (usuario_id, intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec)
     VALUES (?, 'semanal', 7, ?, ?, NULL)`,
    [uid, dt(hoy, 8, 0), dt(addDays(hoy, 60), 8, 0)]
  );
  const recurrenciaId = recRes.insertId;

  // Eventos
  const eventos = [
    { titulo: 'Reunión de equipo', descripcion: 'Revisión semanal de avances del proyecto.', ini: dt(addDays(hoy, 1), 10, 0), fin: dt(addDays(hoy, 1), 11, 0), ubicacion: 'Sala virtual', color: '#3B82F6', estado: 'pendiente', rec: null },
    { titulo: 'Cita médica', descripcion: 'Chequeo general anual.', ini: dt(addDays(hoy, 3), 9, 0), fin: dt(addDays(hoy, 3), 10, 0), ubicacion: 'Clínica Central', color: '#F59E0B', estado: 'pendiente', rec: null },
    { titulo: 'Clase de inglés', descripcion: 'Clase semanal nivel intermedio.', ini: dt(addDays(hoy, 2), 18, 0), fin: dt(addDays(hoy, 2), 19, 30), ubicacion: 'Academia', color: '#8B5CF6', estado: 'pendiente', rec: recurrenciaId },
    { titulo: 'Entrega de informe', descripcion: 'Informe mensual completado.', ini: dt(addDays(hoy, -5), 14, 0), fin: dt(addDays(hoy, -5), 15, 0), ubicacion: 'Oficina', color: '#10B981', estado: 'completado', rec: null },
  ];
  const eventoIds = [];
  for (const e of eventos) {
    const [r] = await promisePool.query(
      `INSERT INTO eventos (usuario_id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, color_hex, estado, recurrencia_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, e.titulo, e.descripcion, e.ini, e.fin, e.ubicacion, e.color, e.estado, e.rec]
    );
    eventoIds.push(r.insertId);
  }

  // Tareas
  const tareas = [
    { titulo: 'Preparar presentación', descripcion: 'Diapositivas para la reunión del equipo.', limite: dt(addDays(hoy, 1), 8, 0), estado: 'en_progreso', prioridad: 'alta', color: '#EF4444' },
    { titulo: 'Pagar servicios', descripcion: 'Luz, agua e internet.', limite: dt(addDays(hoy, 2), 12, 0), estado: 'por_hacer', prioridad: 'urgente', color: '#F59E0B' },
    { titulo: 'Leer capítulo 4', descripcion: 'Libro de gestión de proyectos.', limite: dt(addDays(hoy, 5), 20, 0), estado: 'por_hacer', prioridad: 'media', color: '#10B981' },
    { titulo: 'Organizar escritorio', descripcion: 'Tarea completada de ejemplo.', limite: dt(addDays(hoy, -2), 17, 0), estado: 'completada', prioridad: 'baja', color: '#3B82F6', completado: dt(addDays(hoy, -2), 16, 30) },
  ];
  const tareaIds = [];
  for (const t of tareas) {
    const [r] = await promisePool.query(
      `INSERT INTO tareas (usuario_id, titulo, descripcion, fecha_limite, fecha_completado, estado, prioridad, color_hex)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, t.titulo, t.descripcion, t.limite, t.completado || null, t.estado, t.prioridad, t.color]
    );
    tareaIds.push(r.insertId);
  }

  // Presupuesto
  const [pRes] = await promisePool.query(
    'INSERT INTO presupuestos (usuario_id, monto_total, limite_personalizado) VALUES (?, ?, ?)',
    [uid, 5000.00, 4500.00]
  );
  const presupuestoId = pRes.insertId;

  // Ingresos
  const ingresos = [
    { monto: 3000.00, fuente: 'Salario', fecha: isoDate(addDays(hoy, -10)), detalle: 'Pago mensual' },
    { monto: 500.00, fuente: 'Freelance', fecha: isoDate(addDays(hoy, -3)), detalle: 'Proyecto web' },
    { monto: 150.00, fuente: 'Venta', fecha: isoDate(addDays(hoy, -1)), detalle: 'Venta de artículo usado' },
  ];
  const ingresoIds = [];
  for (const i of ingresos) {
    const [r] = await promisePool.query(
      'INSERT INTO ingresos (usuario_id, presupuesto_id, monto, fuente, fecha, detalle) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, presupuestoId, i.monto, i.fuente, i.fecha, i.detalle]
    );
    ingresoIds.push(r.insertId);
  }

  // Gastos
  const gastos = [
    { tarea_id: tareaIds[1], monto: 120.00, fecha: dt(addDays(hoy, -7), 11, 0), metodo: 'Transferencia' },
    { tarea_id: null, monto: 45.50, fecha: dt(addDays(hoy, -4), 13, 30), metodo: 'Efectivo' },
    { tarea_id: null, monto: 80.00, fecha: dt(addDays(hoy, -2), 19, 0), metodo: 'Tarjeta' },
  ];
  const gastoIds = [];
  for (const g of gastos) {
    const [r] = await promisePool.query(
      'INSERT INTO gastos (usuario_id, presupuesto_id, tarea_id, monto, fecha, metodo_pago) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, presupuestoId, g.tarea_id, g.monto, g.fecha, g.metodo]
    );
    gastoIds.push(r.insertId);
  }

  // Notas
  await promisePool.query(
    `INSERT INTO notas (usuario_id, evento_id, tarea_id, titulo, contenido, color_hex)
     VALUES (?, ?, NULL, ?, ?, ?)`,
    [uid, eventoIds[0], 'Agenda de reunión', '1. Revisar avances\n2. Bloqueos\n3. Próximos pasos', '#F59E0B']
  );
  await promisePool.query(
    `INSERT INTO notas (usuario_id, evento_id, tarea_id, titulo, contenido, color_hex)
     VALUES (?, NULL, ?, ?, ?, ?)`,
    [uid, tareaIds[0], 'Ideas para presentación', 'Usar gráficos comparativos y demo en vivo.', '#10B981']
  );
  await promisePool.query(
    `INSERT INTO notas (usuario_id, evento_id, tarea_id, titulo, contenido, color_hex)
     VALUES (?, NULL, NULL, ?, ?, ?)`,
    [uid, 'Lista de compras', 'Leche, café, frutas y materiales de oficina.', '#3B82F6']
  );

  // Recordatorios (fechas futuras)
  await promisePool.query(
    `INSERT INTO recordatorios (usuario_id, evento_id, tarea_id, fecha_envio, mensaje, estado)
     VALUES (?, ?, NULL, ?, ?, 'programado')`,
    [uid, eventoIds[0], dt(addDays(hoy, 1), 9, 0), 'Recordatorio: reunión de equipo en 1 hora']
  );
  await promisePool.query(
    `INSERT INTO recordatorios (usuario_id, evento_id, tarea_id, fecha_envio, mensaje, estado)
     VALUES (?, NULL, ?, ?, ?, 'programado')`,
    [uid, tareaIds[1], dt(addDays(hoy, 2), 9, 0), 'No olvides pagar los servicios hoy']
  );

  // Vincular etiquetas (pivote polimórfico)
  const vinculos = [
    [etiquetaIds['Trabajo'], 'evento', eventoIds[0]],
    [etiquetaIds['Trabajo'], 'tarea', tareaIds[0]],
    [etiquetaIds['Urgente'], 'tarea', tareaIds[1]],
    [etiquetaIds['Estudio'], 'evento', eventoIds[2]],
    [etiquetaIds['Estudio'], 'tarea', tareaIds[2]],
    [etiquetaIds['Finanzas'], 'ingreso', ingresoIds[0]],
    [etiquetaIds['Finanzas'], 'gasto', gastoIds[0]],
  ];
  for (const [eid, tipo, entId] of vinculos) {
    await promisePool.query(
      'INSERT INTO entidad_etiquetas (etiqueta_id, entidad_tipo, entidad_id) VALUES (?, ?, ?)',
      [eid, tipo, entId]
    );
  }

  // Historial de productividad (últimos 7 días)
  for (let i = 6; i >= 0; i--) {
    const f = isoDate(addDays(hoy, -i));
    const creadas = 1 + (i % 3);
    const completadas = i % 2 === 0 ? 1 : 0;
    const vencidas = i === 3 ? 1 : 0;
    await promisePool.query(
      `INSERT INTO historial_productividad (usuario_id, fecha, tareas_creadas, tareas_completadas, tareas_vencidas)
       VALUES (?, ?, ?, ?, ?)`,
      [uid, f, creadas, completadas, vencidas]
    );
  }

  console.log('Datos de ejemplo insertados correctamente.');
  console.log(`Usuario demo: ${USUARIO_DEMO.correo} / ${USUARIO_DEMO.contrasena}`);
  console.log(`Resumen: ${etiquetasDef.length} etiquetas, ${eventos.length} eventos, ${tareas.length} tareas, ${ingresos.length} ingresos, ${gastos.length} gastos, 3 notas, 2 recordatorios.`);
  await promisePool.end();
}

seed().catch(async (err) => {
  console.error('Error al sembrar datos:', err.message);
  try { await promisePool.end(); } catch {}
  process.exit(1);
});
