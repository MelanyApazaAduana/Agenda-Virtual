// Expande una regla de recurrencia en ocurrencias concretas dentro de un rango.
// Trabaja con Date nativo (el backend no usa dayjs).

const dosDigitos = (n) => String(n).padStart(2, '0');

// Formatea un Date a 'YYYY-MM-DD HH:mm:ss'
const aTexto = (fecha) =>
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())} ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`;

// Calcula la i-ésima ocurrencia a partir del ancla según la regla.
const calcularOcurrencia = (ancla, regla, i) => {
    const fecha = new Date(ancla);
    if (regla.frecuencia_dias && Number(regla.frecuencia_dias) > 0) {
        fecha.setDate(fecha.getDate() + i * Number(regla.frecuencia_dias));
        return fecha;
    }
    switch (regla.intervalo) {
        case 'diario':  fecha.setDate(fecha.getDate() + i); break;
        case 'semanal': fecha.setDate(fecha.getDate() + i * 7); break;
        case 'mensual': fecha.setMonth(fecha.getMonth() + i); break;
        case 'anual':   fecha.setFullYear(fecha.getFullYear() + i); break;
        default:        fecha.setDate(fecha.getDate() + i * 7);
    }
    return fecha;
};

// Devuelve las ocurrencias (i >= 1) de la regla dentro de [rangoInicio, rangoFin].
// anclaInicio/anclaFin: fechas del evento/tarea base. anclaFin puede ser null (tareas).
export const generarOcurrencias = (anclaInicio, anclaFin, regla, rangoInicio, rangoFin) => {
    const ocurrencias = [];
    if (!anclaInicio || !regla) return ocurrencias;

    const inicio = new Date(anclaInicio);
    const fin = anclaFin ? new Date(anclaFin) : null;
    const duracionMs = fin ? fin.getTime() - inicio.getTime() : 0;

    const rangoIni = new Date(`${rangoInicio}T00:00:00`);
    const rangoFinDia = new Date(`${rangoFin}T23:59:59`);
    const reglaFin = regla.rec_fecha_fin ? new Date(regla.rec_fecha_fin) : null;

    // Tope de repeticiones: num_rec cuenta el ancla como la 1ª, así que generamos num_rec-1 extra.
    const maxExtra = regla.num_rec && Number(regla.num_rec) > 0 ? Number(regla.num_rec) - 1 : 500;

    for (let i = 1; i <= maxExtra; i++) {
        const occInicio = calcularOcurrencia(inicio, regla, i);
        if (occInicio > rangoFinDia) break;            // ya nos pasamos del rango visible
        if (reglaFin && occInicio > reglaFin) break;   // la regla terminó
        if (occInicio >= rangoIni) {
            const occFin = duracionMs ? new Date(occInicio.getTime() + duracionMs) : null;
            ocurrencias.push({
                fecha_inicio: aTexto(occInicio),
                fecha_fin: occFin ? aTexto(occFin) : null
            });
        }
    }
    return ocurrencias;
};

export default generarOcurrencias;
