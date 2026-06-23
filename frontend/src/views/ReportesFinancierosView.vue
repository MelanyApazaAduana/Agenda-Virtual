<template>
  <div class="flex flex-col h-full">
    <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0 border-b border-gray-100">
      <span class="font-bold text-lg tracking-wide text-gray-900">Reportes Financieros</span>
      <div class="flex items-center gap-3">
        <select v-model="mesSeleccionado" @change="cargar" class="input-base w-auto py-1.5">
          <option v-for="m in meses" :key="m.valor" :value="m.valor">{{ m.label }}</option>
        </select>
        <select v-model="anioSeleccionado" @change="cargar" class="input-base w-auto py-1.5">
          <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Resumen del período</h1>
          <p class="text-sm text-gray-500 mt-1">Ingresos, gastos y uso del presupuesto.</p>
        </div>

        <Spinner v-if="cargando" />
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="card p-5">
              <span class="label-campo">Ingresos</span>
              <p class="text-2xl font-bold text-emerald-600 mt-2">Bs. {{ formato(totalIngresos) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cantidadIngresos }} transacciones</p>
            </div>
            <div class="card p-5">
              <span class="label-campo">Gastos</span>
              <p class="text-2xl font-bold text-red-600 mt-2">Bs. {{ formato(totalGastos) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cantidadGastos }} movimientos</p>
            </div>
            <div class="card p-5">
              <span class="label-campo">Balance</span>
              <p class="text-2xl font-bold mt-2" :class="balance >= 0 ? 'text-gray-900' : 'text-red-600'">Bs. {{ formato(balance) }}</p>
              <p class="text-xs text-gray-500 mt-1">Ingresos menos gastos</p>
            </div>
            <div class="card p-5">
              <span class="label-campo">Presupuesto vigente</span>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ presupuesto ? 'Bs. ' + formato(presupuesto.monto_total) : '—' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ presupuesto ? 'Definido el ' + formatoFecha(presupuesto.creado_en) : 'Sin presupuesto' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Ingresos vs Gastos</h3>
              <GraficoBarras :datos="[
                { etiqueta: 'Ingresos', valor: totalIngresos, color: '#10B981' },
                { etiqueta: 'Gastos', valor: totalGastos, color: '#EF4444' }
              ]" />
            </div>

            <div class="card p-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Gastos por método de pago</h3>
              <GraficoDonut :datos="datosMetodo" />
            </div>
          </div>

          <div class="card p-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Uso del presupuesto</h3>
            <div v-if="presupuesto">
              <div class="flex items-end justify-between mb-2">
                <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(totalGastos) }}</p>
                <p class="text-sm text-gray-500">de Bs. {{ formato(presupuesto.monto_total) }}</p>
              </div>
              <BarraProgreso :valor="totalGastos" :total="Number(presupuesto.monto_total)"
                :etiqueta="`${usoPct}% utilizado · Restante Bs. ${formato(presupuesto.monto_total - totalGastos)}`" />
            </div>
            <p v-else class="text-sm text-gray-400">No hay un presupuesto definido.
              <router-link to="/presupuestos" class="text-black font-semibold underline ml-1">Crea uno aquí.</router-link>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/Spinner.vue'
import GraficoBarras from '@/components/ui/GraficoBarras.vue'
import GraficoDonut from '@/components/ui/GraficoDonut.vue'
import BarraProgreso from '@/components/ui/BarraProgreso.vue'
import { obtenerResumenIngresos } from '@/api/ingresos.js'
import { obtenerResumenGastos } from '@/api/gastos.js'
import { obtenerPresupuestoVigente } from '@/api/presupuestos.js'

const cargando = ref(true)
const totalIngresos = ref(0)
const cantidadIngresos = ref(0)
const totalGastos = ref(0)
const cantidadGastos = ref(0)
const porMetodo = ref([])
const presupuesto = ref(null)

const ahora = new Date()
const mesSeleccionado = ref(ahora.getMonth() + 1)
const anioSeleccionado = ref(ahora.getFullYear())

const meses = [
  { label: 'Enero', valor: 1 }, { label: 'Febrero', valor: 2 }, { label: 'Marzo', valor: 3 },
  { label: 'Abril', valor: 4 }, { label: 'Mayo', valor: 5 }, { label: 'Junio', valor: 6 },
  { label: 'Julio', valor: 7 }, { label: 'Agosto', valor: 8 }, { label: 'Septiembre', valor: 9 },
  { label: 'Octubre', valor: 10 }, { label: 'Noviembre', valor: 11 }, { label: 'Diciembre', valor: 12 }
]
const anios = []
for (let a = ahora.getFullYear() - 3; a <= ahora.getFullYear() + 1; a++) anios.push(a)

const etiquetaMetodo = (m) => {
  if (!m) return 'Sin método'
  const mapa = { efectivo: 'Efectivo', tarjeta_debito: 'Tarjeta Débito', tarjeta_credito: 'Tarjeta Crédito', transferencia: 'Transferencia', qr: 'QR', otros: 'Otros' }
  return mapa[m] || m
}

const datosMetodo = computed(() => porMetodo.value.map((m) => ({ etiqueta: etiquetaMetodo(m.metodo_pago), valor: Number(m.monto_total) || 0 })))
const balance = computed(() => Number(totalIngresos.value) - Number(totalGastos.value))
const usoPct = computed(() => {
  const t = Number(presupuesto.value?.monto_total || 0)
  return t ? Math.round((totalGastos.value / t) * 100) : 0
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

const cargar = async () => {
  cargando.value = true
  const mes = String(mesSeleccionado.value).padStart(2, '0')
  const inicio = `${anioSeleccionado.value}-${mes}-01`
  const fin = dayjs(inicio).endOf('month').format('YYYY-MM-DD')

  try {
    const { data } = await obtenerResumenIngresos(anioSeleccionado.value, mesSeleccionado.value)
    const r = data.data?.resumen || {}
    totalIngresos.value = Number(r.total || 0)
    cantidadIngresos.value = Number(r.cantidad || 0)
  } catch (e) { totalIngresos.value = 0; cantidadIngresos.value = 0 }

  try {
    const { data } = await obtenerResumenGastos(inicio, fin)
    totalGastos.value = Number(data.data?.total || 0)
    cantidadGastos.value = Number(data.data?.resumen?.total_gastos || 0)
    porMetodo.value = data.data?.por_metodo_pago || []
  } catch (e) { totalGastos.value = 0; cantidadGastos.value = 0; porMetodo.value = [] }

  try {
    const { data } = await obtenerPresupuestoVigente(fin)
    presupuesto.value = data.data || null
  } catch (e) { presupuesto.value = null }

  cargando.value = false
}

onMounted(cargar)
</script>
