<template>
  <div class="flex flex-col h-full">
    <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0">
      <div class="flex items-center gap-6 flex-1">
        <span class="font-bold text-lg tracking-wide text-gray-900">Agenda Virtual</span>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-gray-400 hover:text-gray-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
        </button>
        <button class="text-gray-400 hover:text-gray-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
        </button>
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
          <div class="flex bg-gray-100 p-1 rounded-lg">
            <button
              v-for="p in periodos" :key="p.valor"
              @click="periodoActivo = p.valor"
              class="px-4 py-1.5 text-sm font-medium rounded-md transition"
              :class="periodoActivo === p.valor ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
            >{{ p.label }}</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ingresos</span>
              <span class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">${{ formato(resumen.ingresos) }}</p>
            <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span :class="resumen.variacionIngresos >= 0 ? 'text-emerald-600' : 'text-red-500'" class="font-bold">{{ resumen.variacionIngresos >= 0 ? '+' : '' }}{{ resumen.variacionIngresos }}%</span>
              vs período anterior
            </p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Gastos</span>
              <span class="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.281 5.941" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">${{ formato(resumen.gastos) }}</p>
            <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span :class="resumen.variacionGastos <= 0 ? 'text-emerald-600' : 'text-red-500'" class="font-bold">{{ resumen.variacionGastos >= 0 ? '+' : '' }}{{ resumen.variacionGastos }}%</span>
              vs período anterior
            </p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Balance</span>
              <span class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold" :class="resumen.balance >= 0 ? 'text-gray-900' : 'text-red-600'">${{ formato(resumen.balance) }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="font-bold" :class="resumen.balance >= 0 ? 'text-emerald-600' : 'text-red-500'">{{ resumen.balance >= 0 ? 'Superávit' : 'Déficit' }}</span>
              {{ resumen.balance >= 0 ? 'ahorrado' : 'perdido' }} en el período
            </p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Presupuesto</span>
              <span class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ resumen.presupuestoUsado }}%</p>
            <div class="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="barraPresupuestoColor" :style="{ width: resumen.presupuestoUsado + '%' }"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">${{ formato(resumen.presupuestoGastado) }} de ${{ formato(resumen.presupuestoTotal) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Gastos por categoría</h3>
              <span class="text-[11px] text-gray-400 font-medium">Total: ${{ formato(totalGastosCategorias) }}</span>
            </div>
            <div class="space-y-4">
              <div v-for="cat in gastosPorCategoria" :key="cat.nombre">
                <div class="flex items-center justify-between text-sm mb-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                    <span class="font-medium text-gray-700">{{ cat.nombre }}</span>
                  </div>
                  <span class="font-bold text-gray-900">${{ formato(cat.monto) }}</span>
                </div>
                <div class="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: porcentaje(cat.monto, totalGastosCategorias) + '%', backgroundColor: cat.color }"
                  ></div>
                </div>
                <span class="text-[11px] text-gray-400 mt-0.5 block">{{ porcentaje(cat.monto, totalGastosCategorias) }}% del total</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Tendencia mensual</h3>
              <div class="flex items-center gap-3 text-[11px] font-bold">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Ingresos</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-400"></span> Gastos</span>
              </div>
            </div>
            <div class="flex items-end justify-between gap-3 h-48">
              <div v-for="mes in tendenciaMensual" :key="mes.mes" class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div class="w-full flex flex-col items-center justify-end gap-0.5 h-40">
                  <div
                    class="w-full rounded-t-sm transition-all"
                    :style="{ height: barraAltura(mes.ingresos, maxTendencia) + '%', backgroundColor: '#10B981' }"
                  ></div>
                  <div
                    class="w-full rounded-t-sm transition-all"
                    :style="{ height: barraAltura(mes.gastos, maxTendencia) + '%', backgroundColor: '#F87171' }"
                  ></div>
                </div>
                <span class="text-[11px] font-medium text-gray-500 mt-1">{{ mes.mes }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Ahorro mensual</h3>
            <span class="text-[11px] text-gray-400 font-medium">Saldo acumulado: ${{ formato(datosAhorro.acumulado) }}</span>
          </div>
          <div class="flex items-end justify-between gap-3 h-40">
            <div v-for="item in datosAhorro.mensual" :key="item.mes" class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                class="w-full rounded-t-md transition-all"
                :style="{ height: barraAltura(Math.abs(item.ahorro), maxAhorro) + '%', backgroundColor: item.ahorro >= 0 ? '#10B981' : '#EF4444' }"
              ></div>
              <span class="text-[10px] font-bold" :class="item.ahorro >= 0 ? 'text-emerald-600' : 'text-red-500'">${{ formato(item.ahorro) }}</span>
              <span class="text-[11px] font-medium text-gray-500">{{ item.mes }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const periodos = [
  { label: 'Este Mes', valor: 'mes' },
  { label: 'Este Año', valor: 'año' },
  { label: 'Personalizado', valor: 'personalizado' }
]
const periodoActivo = ref('mes')

const formato = (n) => {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const porcentaje = (valor, total) => {
  if (!total) return 0
  return Math.round((valor / total) * 100)
}

const resumen = ref({
  ingresos: 4850.00,
  gastos: 3120.50,
  balance: 1729.50,
  variacionIngresos: 12.5,
  variacionGastos: 8.3,
  presupuestoUsado: 62,
  presupuestoGastado: 3120.50,
  presupuestoTotal: 5000.00
})

const gastosPorCategoria = ref([
  { nombre: 'Alimentación', monto: 890.00, color: '#F97316' },
  { nombre: 'Transporte', monto: 420.50, color: '#3B82F6' },
  { nombre: 'Servicios', monto: 650.00, color: '#8B5CF6' },
  { nombre: 'Entretenimiento', monto: 340.00, color: '#EC4899' },
  { nombre: 'Salud', monto: 280.00, color: '#10B981' },
  { nombre: 'Educación', monto: 540.00, color: '#F59E0B' }
])

const totalGastosCategorias = computed(() => {
  return gastosPorCategoria.value.reduce((sum, c) => sum + c.monto, 0)
})

const tendenciaMensual = ref([
  { mes: 'Ene', ingresos: 4200, gastos: 3800 },
  { mes: 'Feb', ingresos: 3800, gastos: 3400 },
  { mes: 'Mar', ingresos: 5100, gastos: 4200 },
  { mes: 'Abr', ingresos: 4600, gastos: 3900 },
  { mes: 'May', ingresos: 4900, gastos: 3500 },
  { mes: 'Jun', ingresos: 4850, gastos: 3120 }
])

const maxTendencia = computed(() => {
  let max = 0
  tendenciaMensual.value.forEach(m => {
    if (m.ingresos > max) max = m.ingresos
    if (m.gastos > max) max = m.gastos
  })
  return max * 1.15
})

const datosAhorro = ref({
  acumulado: 5290.00,
  mensual: [
    { mes: 'Ene', ahorro: 400 },
    { mes: 'Feb', ahorro: 400 },
    { mes: 'Mar', ahorro: 900 },
    { mes: 'Abr', ahorro: 700 },
    { mes: 'May', ahorro: 1400 },
    { mes: 'Jun', ahorro: 1730 }
  ]
})

const maxAhorro = computed(() => {
  let max = 0
  datosAhorro.value.mensual.forEach(m => {
    const v = Math.abs(m.ahorro)
    if (v > max) max = v
  })
  return max * 1.15
})

const barraAltura = (valor, max) => {
  if (!max) return 0
  return Math.round((valor / max) * 100)
}

const barraPresupuestoColor = computed(() => {
  const usado = resumen.value.presupuestoUsado
  if (usado >= 90) return 'bg-red-500'
  if (usado >= 70) return 'bg-amber-500'
  return 'bg-emerald-500'
})
</script>
