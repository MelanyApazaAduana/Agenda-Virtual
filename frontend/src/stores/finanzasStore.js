import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { obtenerResumenGastos } from '../api/gastos'
import { obtenerPresupuestoVigente } from '../api/presupuestos'

// Datos financieros compartidos: presupuesto vigente y gasto del mes en curso.
// Lo consumen el widget del sidebar, PresupuestosView y ReportesView.
export const useFinanzasStore = defineStore('finanzas', () => {
  const presupuestoVigente = ref(null)
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
      const { data } = await obtenerPresupuestoVigente()
      presupuestoVigente.value = data.data || null
    } catch (e) {
      presupuestoVigente.value = null
    }
    cargando.value = false
  }

  return { presupuestoVigente, gastadoMes, cargando, cargar }
})
