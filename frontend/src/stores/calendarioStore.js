import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

// Estado compartido del calendario: fecha en foco y vista activa.
// Lo usan el header (navegación), el sidebar (mini-calendario) y las
// tres vistas de calendario (mes / semana / día) para mantenerse en sincronía.
export const useCalendarioStore = defineStore('calendario', () => {
  const fechaFoco = ref(dayjs().format('YYYY-MM-DD'))
  const vista = ref('mes') // 'mes' | 'semana' | 'dia'

  const foco = computed(() => dayjs(fechaFoco.value))
  const anio = computed(() => foco.value.year())
  const mes = computed(() => foco.value.month())

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const titulo = computed(() => {
    const f = foco.value
    if (vista.value === 'dia') {
      return f.format('D [de] MMMM YYYY')
    }
    if (vista.value === 'semana') {
      const inicio = f.startOf('week')
      const fin = f.endOf('week')
      return `${inicio.date()} - ${fin.date()} ${meses[fin.month()]} ${fin.year()}`
    }
    return `${meses[f.month()]} ${f.year()}`
  })

  const setVista = (v) => { vista.value = v }

  const seleccionarFecha = (fecha) => {
    fechaFoco.value = dayjs(fecha).format('YYYY-MM-DD')
  }

  const irHoy = () => {
    fechaFoco.value = dayjs().format('YYYY-MM-DD')
  }

  const unidad = () => (vista.value === 'mes' ? 'month' : vista.value === 'semana' ? 'week' : 'day')

  const anterior = () => {
    fechaFoco.value = foco.value.subtract(1, unidad()).format('YYYY-MM-DD')
  }

  const siguiente = () => {
    fechaFoco.value = foco.value.add(1, unidad()).format('YYYY-MM-DD')
  }

  return {
    fechaFoco,
    vista,
    foco,
    anio,
    mes,
    titulo,
    setVista,
    seleccionarFecha,
    irHoy,
    anterior,
    siguiente
  }
})
