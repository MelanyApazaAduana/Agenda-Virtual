import dotenv from 'dotenv';
import { inicializarBaseDeDatos } from '../config/initDb.js';
import promisePool from '../config/database.js';

dotenv.config();

const CORREO = 'melanyapazaduana@gmail.com';

const pad = (n) => String(n).padStart(2, '0');
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const addDays = (n) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + n);
  return d;
};
const fDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fDT = (offset, hora, minuto = 0) => `${fDate(addDays(offset))} ${pad(hora)}:${pad(minuto)}:00`;

async function obtenerUsuario() {
  const [rows] = await promisePool.query('SELECT id, nombre FROM usuarios WHERE correo = ?', [CORREO]);
  if (rows.length === 0) throw new Error(`No existe el usuario ${CORREO}`);
  return rows[0];
}

async function seed() {
  await inicializarBaseDeDatos();
  const usuario = await obtenerUsuario();
  const uid = usuario.id;

  const etiquetasDef = [
    ['Trabajo', '#4F46E5'],
    ['Personal', '#10B981'],
    ['Estudio', '#8B5CF6'],
    ['Finanzas', '#22C55E'],
    ['Urgente', '#EF4444'],
    ['Salud', '#06B6D4'],
  ];
  const etiqueta = {};
  for (const [nombre, color] of etiquetasDef) {
    const [r] = await promisePool.query(
      'INSERT INTO etiquetas (usuario_id, nombre, color_hex) VALUES (?, ?, ?)',
      [uid, nombre, color]
    );
    etiqueta[nombre] = r.insertId;
  }

  const [recSemanal] = await promisePool.query(
    `INSERT INTO recurrencias (usuario_id, intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec)
     VALUES (?, 'semanal', 7, ?, ?, NULL)`,
    [uid, fDT(2, 8), fDT(60, 8)]
  );
  const [recMensual] = await promisePool.query(
    `INSERT INTO recurrencias (usuario_id, intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec)
     VALUES (?, 'mensual', 30, ?, ?, 6)`,
    [uid, fDT(5, 9), fDT(180, 9)]
  );

  const eventosDef = [
    ['Reunión con cliente', 'Presentación de propuesta y revisión de requerimientos.', -9, 10, 'Sala de reuniones', 'completado', null],
    ['Almuerzo familiar', 'Almuerzo en casa de los abuelos.', -6, 13, 'Casa de los abuelos', 'completado', null],
    ['Clase de yoga', 'Clase semanal de yoga y estiramiento.', -4, 7, 'Centro Wellness', 'completado', recSemanal.insertId],
    ['Examen de matemáticas', 'Examen final del segundo parcial.', -2, 8, 'Aula 204', 'completado', null],
    ['Entrevista de trabajo', 'Entrevista técnica para puesto de desarrolladora.', 1, 11, 'Oficina central', 'pendiente', null],
    ['Viaje a Santa Cruz', 'Salida de viaje por vacaciones familiares.', 3, 6, 'Terminal de buses', 'pendiente', recMensual.insertId],
    ['Cumpleaños de mamá', 'Cena y celebración en familia.', 5, 19, 'Restaurante El Buen Sabor', 'pendiente', null],
    ['Revisión médica', 'Chequeo general y control de laboratorio.', 7, 9, 'Clínica San Martín', 'pendiente', null],
    ['Taller de fotografía', 'Taller práctico de fotografía digital.', 9, 15, 'Centro Cultural', 'pendiente', null],
    ['Reunión de proyecto final', 'Avance del proyecto integrador del semestre.', 11, 17, 'Sala virtual', 'pendiente', null],
    ['Cena con amigos', 'Encuentro mensual con amigos de la universidad.', 13, 20, 'Pizzería La Terraza', 'pendiente', null],
    ['Pago de matrícula', 'Pago correspondiente al siguiente semestre.', 15, 10, 'Banco Nacional', 'pendiente', recMensual.insertId],
    ['Conferencia de tecnología', 'Charla sobre inteligencia artificial aplicada.', 18, 9, 'Auditorio principal', 'pendiente', null],
    ['Partido de fútbol', 'Partido amistoso del equipo del barrio.', 20, 16, 'Cancha Municipal', 'pospuesto', null],
    ['Trámite bancario', 'Apertura de cuenta de ahorros.', 23, 11, 'Sucursal centro', 'cancelado', null],
  ];

  const eventoIds = [];
  for (const [titulo, descripcion, offset, hora, ubicacion, estado, rec] of eventosDef) {
    let ini;
    let fin;
    if (offset === 0) {
      ini = fDT(0, 8);
      fin = fDT(0, 18);
    } else {
      ini = fDT(offset, hora);
      fin = fDT(offset, hora + 2);
    }
    const [r] = await promisePool.query(
      `INSERT INTO eventos (usuario_id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, color_hex, estado, recurrencia_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, titulo, descripcion, ini, fin, ubicacion, estado === 'completado' ? '#10B981' : '#3B82F6', estado, rec]
    );
    eventoIds.push(r.insertId);
  }

  const tareasDef = [
    ['Enviar informe mensual', 'Consolidar métricas del mes y enviarlas al jefe.', 1, 17, 'por_hacer', 'alta', null],
    ['Comprar víveres', 'Compra semanal para la casa.', 2, 18, 'por_hacer', 'media', null],
    ['Estudiar para el examen', 'Repasar capítulos 1 al 5.', 3, 21, 'en_progreso', 'urgente', null],
    ['Llamar al banco', 'Consultar saldo y estado de cuenta.', -3, 12, 'completada', 'alta', -3],
    ['Ordenar la habitación', 'Organizar ropa y escritorio.', -5, 16, 'completada', 'baja', -5],
    ['Preparar exposición', 'Armar diapositivas de la presentación.', 4, 20, 'en_progreso', 'alta', null],
    ['Pagar servicio de internet', 'Transferencia mensual del servicio.', 6, 10, 'por_hacer', 'urgente', null, recMensual.insertId],
    ['Hacer ejercicio', 'Rutina de 30 minutos de cardio.', 0, 18, 'por_hacer', 'media', null],
    ['Actualizar currículum', 'Agregar experiencia y proyectos recientes.', 8, 15, 'por_hacer', 'alta', null],
    ['Regar las plantas', 'Regar todas las plantas del patio.', -1, 9, 'completada', 'baja', -1],
    ['Revisar correos pendientes', 'Responder mensajes sin leer.', 1, 9, 'por_hacer', 'media', null],
    ['Planificar el viaje', 'Reservar hospedaje y transporte.', 2, 14, 'en_progreso', 'media', null],
    ['Lavar el auto', 'Lavado completo por dentro y por fuera.', 5, 11, 'cancelada', 'baja', null],
    ['Terminar proyecto de curso', 'Cerrar la entrega final del proyecto.', 10, 22, 'por_hacer', 'urgente', null],
    ['Comprar regalo de cumpleaños', 'Elegir y comprar el regalo de mamá.', 4, 16, 'por_hacer', 'alta', null],
  ];

  const tareaIds = [];
  for (const [titulo, descripcion, offset, hora, estado, prioridad, compOffset, rec] of tareasDef) {
    const completado = compOffset === null || compOffset === undefined ? null : fDT(compOffset, hora);
    const [r] = await promisePool.query(
      `INSERT INTO tareas (usuario_id, titulo, descripcion, fecha_limite, fecha_completado, estado, prioridad, color_hex, recurrencia_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, titulo, descripcion, fDT(offset, hora), completado, estado, prioridad, '#10B981', rec || null]
    );
    tareaIds.push(r.insertId);
  }

  const [presRes] = await promisePool.query(
    'INSERT INTO presupuestos (usuario_id, monto_total, limite_personalizado) VALUES (?, ?, ?)',
    [uid, 6000.0, 5500.0]
  );
  const presupuestoId = presRes.insertId;

  const ingresosDef = [
    [3500.0, 'Salario', -25, 'Sueldo mensual'],
    [800.0, 'Freelance', -18, 'Diseño de página web'],
    [600.0, 'Venta de celular', -12, 'Venta de equipo usado'],
    [1200.0, 'Beca universitaria', -8, 'Beca de excelencia académica'],
    [150.0, 'Reembolso', -5, 'Reembolso de gastos de viaje'],
    [400.0, 'Clases particulares', -2, 'Clases de matemáticas'],
  ];
  const ingresoIds = [];
  for (const [monto, fuente, offset, detalle] of ingresosDef) {
    const [r] = await promisePool.query(
      'INSERT INTO ingresos (usuario_id, presupuesto_id, monto, fuente, fecha, detalle) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, presupuestoId, monto, fuente, fDate(addDays(offset)), detalle]
    );
    ingresoIds.push(r.insertId);
  }

  const gastosDef = [
    [250.0, -20, 'Tarjeta', null, 'Supermercado'],
    [80.0, -15, 'Efectivo', null, 'Transporte'],
    [120.0, -10, 'Transferencia', tareaIds[6], 'Internet'],
    [180.0, -7, 'Tarjeta', null, 'Libros'],
    [90.0, -4, 'Efectivo', null, 'Comida'],
    [220.0, -1, 'Tarjeta', null, 'Ropa'],
  ];
  const gastoIds = [];
  for (const [monto, offset, metodo, tareaId, _concepto] of gastosDef) {
    const [r] = await promisePool.query(
      'INSERT INTO gastos (usuario_id, presupuesto_id, tarea_id, monto, fecha, metodo_pago) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, presupuestoId, tareaId, monto, fDT(offset, 12, 30), metodo]
    );
    gastoIds.push(r.insertId);
  }

  const notasDef = [
    ['Ideas para el proyecto', 'Aplicar arquitectura MVC y usar MySQL para la persistencia.', eventoIds[9], null, '#F59E0B'],
    ['Resumen de la reunión', 'El cliente aprobó el diseño y pidió ajustes en el informe.', eventoIds[0], null, '#3B82F6'],
    ['Lista de compras', 'Leche, arroz, huevos, café, frutas y verduras.', null, null, '#10B981'],
    ['Apuntes del examen', 'Repasar derivadas, integrales y teoremas fundamentales.', null, tareaIds[2], '#8B5CF6'],
    ['Direcciones y contactos', 'Dirección de la clínica y teléfono del taller.', null, null, '#06B6D4'],
    ['Presupuesto del viaje', 'Hospedaje 800, transporte 400 y alimentación 300.', eventoIds[5], null, '#22C55E'],
    ['Receta de cocina', 'Receta de tallarines con salsa de tomate y albahaca.', null, null, '#EF4444'],
    ['Recordatorios personales', 'Renovar licencia y agendar cita dental.', null, tareaIds[8], '#F59E0B'],
  ];
  for (const [titulo, contenido, eventoId, tareaId, color] of notasDef) {
    await promisePool.query(
      'INSERT INTO notas (usuario_id, evento_id, tarea_id, titulo, contenido, color_hex) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, eventoId, tareaId, titulo, contenido, color]
    );
  }

  const recordatoriosDef = [
    [eventoIds[4], null, 1, 9, 'Entrevista de trabajo hoy a las 11:00'],
    [eventoIds[6], null, 4, 18, 'Cumpleaños de mamá mañana'],
    [eventoIds[7], null, 6, 20, 'Revisión médica programada'],
    [null, tareaIds[0], 1, 8, 'Recuerda enviar el informe mensual'],
    [null, tareaIds[6], 5, 9, 'Pagar el servicio de internet hoy'],
    [null, tareaIds[13], 9, 20, 'Entrega del proyecto de curso mañana'],
  ];
  for (const [eventoId, tareaId, offset, hora, mensaje] of recordatoriosDef) {
    await promisePool.query(
      `INSERT INTO recordatorios (usuario_id, evento_id, tarea_id, fecha_envio, mensaje, estado)
       VALUES (?, ?, ?, ?, ?, 'programado')`,
      [uid, eventoId, tareaId, fDT(offset, hora), mensaje]
    );
  }

  const vinculos = [
    [etiqueta['Trabajo'], 'evento', eventoIds[0]],
    [etiqueta['Trabajo'], 'evento', eventoIds[9]],
    [etiqueta['Personal'], 'evento', eventoIds[1]],
    [etiqueta['Salud'], 'evento', eventoIds[7]],
    [etiqueta['Estudio'], 'evento', eventoIds[3]],
    [etiqueta['Trabajo'], 'tarea', tareaIds[0]],
    [etiqueta['Estudio'], 'tarea', tareaIds[2]],
    [etiqueta['Urgente'], 'tarea', tareaIds[6]],
    [etiqueta['Personal'], 'tarea', tareaIds[1]],
    [etiqueta['Finanzas'], 'ingreso', ingresoIds[0]],
    [etiqueta['Finanzas'], 'ingreso', ingresoIds[1]],
    [etiqueta['Finanzas'], 'gasto', gastoIds[0]],
    [etiqueta['Salud'], 'gasto', gastoIds[3]],
  ];
  for (const [eid, tipo, entId] of vinculos) {
    await promisePool.query(
      'INSERT INTO entidad_etiquetas (etiqueta_id, entidad_tipo, entidad_id) VALUES (?, ?, ?)',
      [eid, tipo, entId]
    );
  }

  const totales = { eventos: eventosDef.length, tareas: tareasDef.length, notas: notasDef.length, ingresos: ingresosDef.length, gastos: gastosDef.length };
  const total = Object.values(totales).reduce((a, b) => a + b, 0);

  console.log(`Datos cargados para ${usuario.nombre} <${CORREO}> (ID ${uid}).`);
  console.log(`Registros nuevos: ${total}`);
  console.log(`  Eventos: ${totales.eventos} | Tareas: ${totales.tareas} | Notas: ${totales.notas} | Ingresos: ${totales.ingresos} | Gastos: ${totales.gastos}`);
  console.log(`  Apoyo: ${etiquetasDef.length} etiquetas, 2 recurrencias, ${recordatoriosDef.length} recordatorios, ${vinculos.length} vínculos.`);

  await promisePool.end();
}

seed().catch(async (err) => {
  console.error('Error al cargar datos:', err.message);
  try { await promisePool.end(); } catch {}
  process.exit(1);
});
