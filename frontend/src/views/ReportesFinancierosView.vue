<template>
  <div class="flex flex-col h-full">
    <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0">
      <div class="flex items-center gap-6 flex-1">
        <span class="font-bold text-lg tracking-wide text-gray-900">Agenda Virtual</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-sm text-gray-400" v-if="cargando">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando...
        </div>
        <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm ml-2"></div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-6xl mx-auto space-y-8">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Reportes Financieros</h1>
            <p class="text-sm text-gray-500 mt-1">Visualiza tus ingresos, gastos y tendencias</p>
          </div>
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
        </div>

        <div v-if="!cargando" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ingresos</span>
              <span class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(resumenIngresos) }}</p>
            <p class="text-xs text-gray-500 mt-1">Total ingresos del período</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Gastos</span>
              <span class="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.281 5.941" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">Bs. 0.00</p>
            <p class="text-xs text-gray-500 mt-1">Módulo de gastos próximamente</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Balance</span>
              <span class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(resumenIngresos) }}</p>
            <p class="text-xs text-gray-500 mt-1">Balance actual (solo ingresos)</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ingresos × Mes</span>
              <span class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
              </span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ totalIngresos }}</p>
            <p class="text-xs text-gray-500 mt-1">transacciones en el período</p>
          </div>
        </div>

        <div v-if="!cargando" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Ingresos por categoría</h3>
              <span class="text-[11px] text-gray-400 font-medium">Total: Bs. {{ formato(totalPorCategoria) }}</span>
            </div>
            <div class="space-y-4">
              <div v-for="cat in ingresosPorCategoria" :key="cat.categoria_nombre || 'sin-categoria'">
                <div class="flex items-center justify-between text-sm mb-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.categoria_color || '#6B7280' }"></div>
                    <span class="font-medium text-gray-700">{{ cat.categoria_nombre || 'Sin categoría' }}</span>
                  </div>
                  <span class="font-bold text-gray-900">Bs. {{ formato(cat.total) }}</span>
                </div>
                <div class="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: porcentaje(cat.total, totalPorCategoria) + '%', backgroundColor: cat.categoria_color || '#6B7280' }"
                  ></div>
                </div>
                <span class="text-[11px] text-gray-400 mt-0.5 block">{{ porcentaje(cat.total, totalPorCategoria) }}% del total</span>
              </div>
              <div v-if="ingresosPorCategoria.length === 0" class="text-center py-6 text-gray-400 text-sm">
                No hay ingresos en este período
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Ingresos por evento</h3>
              <span class="text-[11px] text-gray-400 font-medium">Total: Bs. {{ formato(totalPorEvento) }}</span>
            </div>
            <div class="space-y-3">
              <div v-for="ev in ingresosPorEvento" :key="ev.evento_titulo || 'sin-evento'" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-gray-700">{{ ev.evento_titulo || 'Sin evento' }}</p>
                  <p class="text-xs text-gray-400">{{ ev.total_transacciones }} transacciones</p>
                </div>
                <span class="font-bold text-gray-900">Bs. {{ formato(ev.total) }}</span>
              </div>
              <div v-if="ingresosPorEvento.length === 0" class="text-center py-6 text-gray-400 text-sm">
                No hay ingresos vinculados a eventos
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerResumenIngresos } from '@/api/ingresos.js'

const cargando = ref(true)
const resumen = ref(null)
const ingresosPorCategoria = ref([])
const ingresosPorEvento = ref([])

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
for (let a = ahora.getFullYear() - 3; a <= ahora.getFullYear() + 1; a++) {
  anios.push(a)
}

const resumenIngresos = computed(() => {
  return resumen.value?.resumen?.total_ingresos || resumen.value?.resumen?.sum || 0
})

const totalIngresos = computed(() => {
  return resumen.value?.resumen?.total || 0
})

const totalPorCategoria = computed(() => {
  return ingresosPorCategoria.value.reduce((s, c) => s + (c.total || 0), 0)
})

const totalPorEvento = computed(() => {
  return ingresosPorEvento.value.reduce((s, e) => s + (e.total || 0), 0)
})

const formato = (n) => {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const porcentaje = (valor, total) => {
  if (!total) return 0
  return Math.round((valor / total) * 100)
}

const cargarResumen = async () => {
  cargando.value = true
  try {
    const respuesta = await obtenerResumenIngresos(anioSeleccionado.value, mesSeleccionado.value)
    const data = respuesta.data.data
    resumen.value = data
    ingresosPorCategoria.value = data.por_categoria || []
    ingresosPorEvento.value = data.por_evento || []
  } catch (error) {
    console.error('Error al cargar resumen:', error)
    resumen.value = null
    ingresosPorCategoria.value = []
    ingresosPorEvento.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarResumen()
})
</script>
