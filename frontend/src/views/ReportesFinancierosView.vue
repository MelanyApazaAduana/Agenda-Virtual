<template>
  <div class="flex flex-col h-full">
    <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0 border-b border-gray-100">
      <span class="font-bold text-lg tracking-wide text-gray-900">Reportes Financieros</span>
      <div class="flex items-center gap-3">
        <select v-model="mesSeleccionado" @change="cargarResumen"
          class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-1 focus:ring-black">
          <option v-for="m in meses" :key="m.valor" :value="m.valor">{{ m.label }}</option>
        </select>
        <select v-model="anioSeleccionado" @change="cargarResumen"
          class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-1 focus:ring-black">
          <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Resumen del período</h1>
          <p class="text-sm text-gray-500 mt-1">Visualiza tus ingresos, gastos y presupuesto</p>
        </div>

        <div v-if="cargando" class="text-center py-16 text-gray-400 text-sm">Cargando...</div>

        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ingresos</span>
              <p class="text-2xl font-bold text-emerald-600 mt-2">Bs. {{ formato(totalIngresos) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cantidadIngresos }} transacciones</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Gastos</span>
              <p class="text-2xl font-bold text-red-600 mt-2">Bs. {{ formato(totalGastos) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cantidadGastos }} movimientos</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Balance</span>
              <p class="text-2xl font-bold mt-2" :class="balance >= 0 ? 'text-gray-900' : 'text-red-600'">Bs. {{ formato(balance) }}</p>
              <p class="text-xs text-gray-500 mt-1">Ingresos menos gastos</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Presupuesto vigente</span>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ presupuesto ? 'Bs. ' + formato(presupuesto.monto_total) : '—' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ presupuesto ? 'Definido el ' + formatoFecha(presupuesto.creado_en) : 'Sin presupuesto' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Gastos por método de pago -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Gastos por método de pago</h3>
              <div class="space-y-4">
                <div v-for="m in porMetodo" :key="m.metodo_pago || 'sin'">
                  <div class="flex items-center justify-between text-sm mb-1.5">
                    <span class="font-medium text-gray-700">{{ etiquetaMetodo(m.metodo_pago) }}</span>
                    <span class="font-bold text-gray-900">Bs. {{ formato(m.monto_total) }}</span>
                  </div>
                  <div class="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div class="h-full rounded-full bg-red-400" :style="{ width: porcentaje(m.monto_total, totalGastos) + '%' }"></div>
                  </div>
                </div>
                <div v-if="porMetodo.length === 0" class="text-center py-6 text-gray-400 text-sm">No hay gastos en este período</div>
              </div>
            </div>

            <!-- Uso del presupuesto -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Uso del presupuesto</h3>
              <template v-if="presupuesto">
                <div class="flex items-end justify-between mb-2">
                  <div>
                    <p class="text-xs text-gray-500">Gastado</p>
                    <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(totalGastos) }}</p>
                  </div>
                  <p class="text-sm text-gray-500">de Bs. {{ formato(presupuesto.monto_total) }}</p>
                </div>
                <div class="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div class="h-full rounded-full transition-all" :class="usoPresupuesto > 100 ? 'bg-red-500' : 'bg-emerald-500'"
                    :style="{ width: Math.min(usoPresupuesto, 100) + '%' }"></div>
                </div>
                <p class="text-xs mt-2" :class="usoPresupuesto > 100 ? 'text-red-600 font-semibold' : 'text-gray-500'">
                  {{ usoPresupuesto }}% utilizado · Restante Bs. {{ formato(presupuesto.monto_total - totalGastos) }}
                </p>
              </template>
              <div v-else class="text-center py-6 text-gray-400 text-sm">
                No hay un presupuesto definido.
                <router-link to="/calendario" class="text-black font-semibold underline ml-1">Crea uno desde el panel financiero.</router-link>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
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

const balance = computed(() => Number(totalIngresos.value) - Number(totalGastos.value))
const usoPresupuesto = computed(() => {
  if (!presupuesto.value || !Number(presupuesto.value.monto_total)) return 0
  return Math.round((totalGastos.value / Number(presupuesto.value.monto_total)) * 100)
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')
const porcentaje = (valor, total) => (!total ? 0 : Math.round((Number(valor) / Number(total)) * 100))

const etiquetaMetodo = (m) => {
  if (!m) return 'Sin método'
  const mapa = { efectivo: 'Efectivo', tarjeta_debito: 'Tarjeta Débito', tarjeta_credito: 'Tarjeta Crédito', transferencia: 'Transferencia', qr: 'QR', otros: 'Otros' }
  return mapa[m] || m
}

const cargarResumen = async () => {
  cargando.value = true
  const mes = String(mesSeleccionado.value).padStart(2, '0')
  const fechaInicio = `${anioSeleccionado.value}-${mes}-01`
  const fechaFin = dayjs(fechaInicio).endOf('month').format('YYYY-MM-DD')

  try {
    const { data } = await obtenerResumenIngresos(anioSeleccionado.value, mesSeleccionado.value)
    const r = data.data?.resumen || {}
    totalIngresos.value = Number(r.total || 0)
    cantidadIngresos.value = Number(r.cantidad || 0)
  } catch (e) {
    totalIngresos.value = 0; cantidadIngresos.value = 0
  }

  try {
    const { data } = await obtenerResumenGastos(fechaInicio, fechaFin)
    totalGastos.value = Number(data.data?.total || 0)
    cantidadGastos.value = Number(data.data?.resumen?.total_gastos || 0)
    porMetodo.value = data.data?.por_metodo_pago || []
  } catch (e) {
    totalGastos.value = 0; cantidadGastos.value = 0; porMetodo.value = []
  }

  try {
    const { data } = await obtenerPresupuestoVigente(fechaFin)
    presupuesto.value = data.data || null
  } catch (e) {
    presupuesto.value = null
  }

  cargando.value = false
}

onMounted(cargarResumen)
</script>
