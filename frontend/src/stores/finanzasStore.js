import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { obtenerResumenGastos } from '../api/gastos'
import { obtenerMiPresupuesto } from '../api/presupuestos'

// Datos financieros compartidos: presupuesto único del usuario y gasto del mes.
export const useFinanzasStore = defineStore('finanzas', () => {
  const presupuesto = ref(null)
  const gastadoMes = ref(0)
  const cargando = ref(false)

  const cargar = async () => {
    cargando.value = true
    const inicio = dayjs().startOf('month').format('YYYY-MM-DD')
    const fin = dayjs().endOf('month').format('YYYY-MM-DD')
    try {
      const { data } = await obtenerResumenGastos(inicio, fin)
      gastadoMes.value = Number(data.data?.total || 0)
    } catch (e) {
      gastadoMes.value = 0
    }
    try {
      const { data } = await obtenerMiPresupuesto()
      presupuesto.value = data.data || null
    } catch (e) {
      presupuesto.value = null
    }
    cargando.value = false
  }

  return { presupuesto, gastadoMes, cargando, cargar }
})
