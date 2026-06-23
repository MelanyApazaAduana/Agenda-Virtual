// Genera las fechas de una recurrencia. El único criterio es el intervalo
// (diario/semanal/mensual/anual) y el rango [ancla, fecha_fin]. La fecha de
// inicio (ancla) es la del propio evento/tarea; se generan ocurrencias a partir
// de ahí, una por intervalo, hasta la fecha_fin (incluida).

const dosDigitos = (n) => String(n).padStart(2, '0');

const aTexto = (fecha) =>
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())} ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`;

// Devuelve un nuevo Date = ancla + i intervalos
const avanzar = (ancla, intervalo, i) => {
    const fecha = new Date(ancla);
    switch (intervalo) {
        case 'diario':  fecha.setDate(fecha.getDate() + i); break;
        case 'semanal': fecha.setDate(fecha.getDate() + i * 7); break;
        case 'mensual': fecha.setMonth(fecha.getMonth() + i); break;
        case 'anual':   fecha.setFullYear(fecha.getFullYear() + i); break;
        default:        fecha.setDate(fecha.getDate() + i * 7);
    }
    return fecha;
};

// Genera TODAS las ocurrencias (i >= 1) desde el ancla hasta fechaFin (incluida).
// anclaInicio: fecha del evento/tarea. anclaFin: fecha fin del evento (null en tareas).
// Devuelve [{ fecha_inicio, fecha_fin }]. Tope de seguridad para evitar series enormes.
export const generarFechas = (anclaInicio, intervalo, fechaFin, anclaFin = null, maxOcurrencias = 500) => {
    const fechas = [];
    if (!anclaInicio || !fechaFin || !intervalo) return fechas;

    const inicio = new Date(anclaInicio);
    const fin = anclaFin ? new Date(anclaFin) : null;
    const duracionMs = fin ? fin.getTime() - inicio.getTime() : 0;

    const limite = new Date(fechaFin);
    limite.setHours(23, 59, 59, 999);

    for (let i = 1; i <= maxOcurrencias; i++) {
        const occInicio = avanzar(inicio, intervalo, i);
        if (occInicio > limite) break;
        const occFin = duracionMs ? new Date(occInicio.getTime() + duracionMs) : null;
        fechas.push({
            fecha_inicio: aTexto(occInicio),
            fecha_fin: occFin ? aTexto(occFin) : null
        });
    }
    return fechas;
};

export default generarFechas;
