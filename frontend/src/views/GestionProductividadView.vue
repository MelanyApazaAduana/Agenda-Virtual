<template>
  <header class="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Productividad</h1>
    <button @click="cargar" :disabled="cargando"
      class="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition disabled:opacity-50">
      Actualizar
    </button>
  </header>

  <div class="flex-1 overflow-y-auto p-8 space-y-6">

    <div v-if="cargando" class="flex items-center justify-center py-20 text-gray-400 gap-3">
      <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm">Cargando métricas...</span>
    </div>

    <template v-else-if="datos">
      <!-- KPIs de tareas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ kpi.label }}</p>
          <p class="text-3xl font-bold mt-2" :class="kpi.color">{{ kpi.valor }}</p>
          <p v-if="kpi.detalle" class="text-xs text-gray-500 mt-1">{{ kpi.detalle }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Tareas completadas por día -->
        <div class="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-bold text-gray-900">Tareas completadas</h3>
              <p class="text-xs text-gray-500 mt-0.5">Últimos 7 días</p>
            </div>
            <span class="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 rounded-lg px-3 py-1.5">
              {{ totalSemana }} en total
            </span>
          </div>

          <div class="h-48 flex items-end gap-3">
            <div v-for="(d, i) in datos.completadas_por_dia" :key="i" class="flex-1 flex flex-col items-center gap-2 group">
              <div class="w-full flex flex-col justify-end" style="height: 11rem">
                <div class="w-full rounded-t-md bg-teal-500 hover:bg-teal-600 transition-all relative"
                  :style="{ height: alturaBarra(d.total) }">
                  <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition">{{ d.total }}</span>
                </div>
              </div>
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ etiquetaDia(d.fecha) }}</span>
            </div>
          </div>

          <div class="mt-5 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p class="text-sm text-teal-800 font-medium">
              <template v-if="mejorDia">💡 Tu día más productivo de la semana fue <strong>{{ etiquetaDiaLarga(mejorDia.fecha) }}</strong> con {{ mejorDia.total }} {{ mejorDia.total === 1 ? 'tarea' : 'tareas' }}.</template>
              <template v-else>Aún no has completado tareas esta semana. ¡A por ello!</template>
            </p>
          </div>
        </div>

        <!-- Estado de tareas -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 class="font-bold text-gray-900 mb-1">Estado de tus tareas</h3>
          <p class="text-xs text-gray-500 mb-6">{{ datos.tareas.total }} tareas registradas</p>

          <div class="space-y-5 flex-1">
            <div v-for="seg in distribucionEstado" :key="seg.label">
              <div class="flex justify-between items-end mb-2">
                <p class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: seg.color }"></span>
                  {{ seg.label }}
                </p>
                <span class="font-bold text-sm text-gray-700">{{ seg.valor }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="h-2 rounded-full" :style="{ width: porcentaje(seg.valor, datos.tareas.total) + '%', backgroundColor: seg.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prioridades -->
        <div class="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-6">Carga por prioridad</h3>
          <div class="space-y-4">
            <div v-for="p in prioridades" :key="p.prioridad" class="flex items-center gap-3">
              <span class="w-16 text-xs font-bold capitalize" :class="p.texto">{{ p.prioridad }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2.5">
                <div class="h-2.5 rounded-full" :style="{ width: porcentaje(p.total, maxPrioridad) + '%', backgroundColor: p.color }"></div>
              </div>
              <span class="w-6 text-right text-xs font-bold text-gray-600">{{ p.total }}</span>
            </div>
          </div>
        </div>

        <!-- Resumen de eventos -->
        <div class="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-1">Resumen de eventos</h3>
          <p class="text-xs text-gray-500 mb-6">{{ datos.eventos.total }} eventos en tu agenda</p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="e in resumenEventos" :key="e.label" class="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
              <p class="text-2xl font-bold" :class="e.color">{{ e.valor }}</p>
              <p class="text-xs text-gray-500 font-medium mt-1">{{ e.label }}</p>
            </div>
          </div>
        </div>

      </div>
    </template>

    <div v-else class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      No se pudieron cargar las métricas de productividad.
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { obtenerResumenProductividad } from '@/api/productividad.js'
import { useUiStore } from '@/stores/uiStore'

const ui = useUiStore()
const cargando = ref(true)
const datos = ref(null)

const cargar = async () => {
  cargando.value = true
  try {
    const { data } = await obtenerResumenProductividad(7)
    datos.value = data.data
  } catch (error) {
    console.error('Error al cargar productividad:', error)
    datos.value = null
    ui.error('No se pudieron cargar las métricas')
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)

const kpis = computed(() => {
  const t = datos.value.tareas
  return [
    { label: 'Total tareas', valor: t.total, color: 'text-gray-900' },
    { label: 'Completadas', valor: t.completadas, color: 'text-teal-600', detalle: `${t.tasa_completado}% de cumplimiento` },
    { label: 'Pendientes', valor: t.pendientes, color: 'text-blue-600' },
    { label: 'Vencidas', valor: t.vencidas, color: 'text-red-600' }
  ]
})

const totalSemana = computed(() => datos.value.completadas_por_dia.reduce((s, d) => s + d.total, 0))
const maxDia = computed(() => Math.max(1, ...datos.value.completadas_por_dia.map((d) => d.total)))
const alturaBarra = (valor) => Math.max((valor / maxDia.value) * 100, 3) + '%'

const mejorDia = computed(() => {
  const dias = datos.value.completadas_por_dia.filter((d) => d.total > 0)
  if (!dias.length) return null
  return dias.reduce((mejor, d) => (d.total > mejor.total ? d : mejor))
})

const etiquetaDia = (fecha) => dayjs(fecha).format('dd')
const etiquetaDiaLarga = (fecha) => dayjs(fecha).format('dddd')

const distribucionEstado = computed(() => {
  const t = datos.value.tareas
  return [
    { label: 'Completadas', valor: t.completadas, color: '#10B981' },
    { label: 'En progreso', valor: t.en_progreso, color: '#3B82F6' },
    { label: 'Por hacer', valor: t.por_hacer, color: '#F59E0B' },
    { label: 'Vencidas', valor: t.vencidas, color: '#EF4444' },
    { label: 'Canceladas', valor: t.canceladas, color: '#9CA3AF' }
  ]
})

const coloresPrioridad = {
  urgente: { color: '#8B5CF6', texto: 'text-purple-600' },
  alta: { color: '#EF4444', texto: 'text-red-600' },
  media: { color: '#F59E0B', texto: 'text-orange-600' },
  baja: { color: '#14B8A6', texto: 'text-teal-600' }
}
const prioridades = computed(() =>
  datos.value.por_prioridad.map((p) => ({ ...p, ...(coloresPrioridad[p.prioridad] || { color: '#9CA3AF', texto: 'text-gray-500' }) }))
)
const maxPrioridad = computed(() => Math.max(1, ...datos.value.por_prioridad.map((p) => p.total)))

const resumenEventos = computed(() => {
  const e = datos.value.eventos
  return [
    { label: 'Pendientes', valor: e.pendientes, color: 'text-blue-600' },
    { label: 'En curso', valor: e.en_curso, color: 'text-indigo-600' },
    { label: 'Completados', valor: e.completados, color: 'text-teal-600' },
    { label: 'Vencidos', valor: e.vencidos, color: 'text-red-600' },
    { label: 'Pospuestos', valor: e.pospuestos, color: 'text-amber-600' },
    { label: 'Cancelados', valor: e.cancelados, color: 'text-gray-500' }
  ]
})

const porcentaje = (valor, total) => (!total ? 0 : Math.round((valor / total) * 100))
</script>
