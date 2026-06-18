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
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Estadísticas de Productividad</h1>
            <p class="text-sm text-gray-500 mt-1">Mide tu rendimiento y mantén la racha</p>
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
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Racha Actual</span>
              <span class="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-orange-600"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>
              </span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ racha.actual }}<span class="text-lg font-medium text-gray-400 ml-1">días</span></p>
            <p class="text-xs text-gray-500 mt-1">Racha máxima: <span class="font-bold text-gray-700">{{ racha.maxima }} días</span></p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tareas Completadas</span>
              <span class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ resumen.tareasCompletadas }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ resumen.tareasCreadas }} creadas · {{ resumen.tareasVencidas }} vencidas</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Eventos Creados</span>
              <span class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              </span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ resumen.eventosCreados }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ resumen.eventosAsistidos }} asistidos</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tiempo Promedio</span>
              <span class="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-violet-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ resumen.tiempoPromedio }}<span class="text-lg font-medium text-gray-400 ml-1">hrs</span></p>
            <p class="text-xs text-gray-500 mt-1">por tarea completada</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Tendencia Semanal</h3>
            <div class="flex items-end justify-between gap-3 h-48">
              <div v-for="dia in tendenciaSemanal" :key="dia.nombre" class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span class="text-[10px] font-bold text-gray-500">{{ dia.tareas }}</span>
                <div
                  class="w-full rounded-t-md transition-all"
                  :style="{ height: barraAltura(dia.tareas, maxSemanal) + '%', backgroundColor: dia.color }"
                ></div>
                <span class="text-[11px] font-medium text-gray-500 mt-1">{{ dia.nombre }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Tendencia Mensual</h3>
            <div class="flex items-end justify-between gap-3 h-48">
              <div v-for="mes in tendenciaMensual" :key="mes.nombre" class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span class="text-[10px] font-bold text-gray-500">{{ mes.tareas }}</span>
                <div
                  class="w-full rounded-t-md transition-all"
                  :style="{ height: barraAltura(mes.tareas, maxMensual) + '%', backgroundColor: '#3B82F6' }"
                ></div>
                <span class="text-[11px] font-medium text-gray-500 mt-1">{{ mes.nombre }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Calendario de Contribuciones</h3>
            <div class="flex items-center gap-2 text-[11px] text-gray-400">
              <span>Menos</span>
              <div v-for="n in 5" :key="n" class="w-3.5 h-3.5 rounded-sm" :style="{ backgroundColor: nivelesColor[n] }"></div>
              <span>Más</span>
            </div>
          </div>
          <div class="overflow-x-auto pb-2">
            <div class="flex gap-1" style="min-width: 720px;">
              <div v-for="(semana, idx) in contribuciones" :key="idx" class="flex flex-col gap-1">
                <div
                  v-for="(dia, didx) in semana" :key="didx"
                  class="w-3.5 h-3.5 rounded-sm cursor-pointer transition-colors"
                  :style="{ backgroundColor: nivelContribucion(dia) }"
                  :title="dia.titulo"
                ></div>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-4">Últimos 6 meses de actividad</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const periodos = [
  { label: 'Semanal', valor: 'semanal' },
  { label: 'Mensual', valor: 'mensual' },
  { label: 'Anual', valor: 'anual' }
]
const periodoActivo = ref('semanal')

const racha = ref({
  actual: 12,
  maxima: 47
})

const resumen = ref({
  tareasCompletadas: 38,
  tareasCreadas: 52,
  tareasVencidas: 7,
  eventosCreados: 14,
  eventosAsistidos: 11,
  tiempoPromedio: 2.4
})

const tendenciaSemanal = ref([
  { nombre: 'Lun', tareas: 5, color: '#10B981' },
  { nombre: 'Mar', tareas: 8, color: '#10B981' },
  { nombre: 'Mié', tareas: 6, color: '#10B981' },
  { nombre: 'Jue', tareas: 10, color: '#10B981' },
  { nombre: 'Vie', tareas: 4, color: '#10B981' },
  { nombre: 'Sáb', tareas: 3, color: '#F59E0B' },
  { nombre: 'Dom', tareas: 2, color: '#F59E0B' }
])

const maxSemanal = computed(() => {
  let max = 0
  tendenciaSemanal.value.forEach(d => { if (d.tareas > max) max = d.tareas })
  return max * 1.2
})

const tendenciaMensual = ref([
  { nombre: 'Ene', tareas: 22 },
  { nombre: 'Feb', tareas: 18 },
  { nombre: 'Mar', tareas: 30 },
  { nombre: 'Abr', tareas: 26 },
  { nombre: 'May', tareas: 35 },
  { nombre: 'Jun', tareas: 38 }
])

const maxMensual = computed(() => {
  let max = 0
  tendenciaMensual.value.forEach(m => { if (m.tareas > max) max = m.tareas })
  return max * 1.2
})

const barraAltura = (valor, max) => {
  if (!max) return 0
  return Math.round((valor / max) * 100)
}

const nivelesColor = ['#F0F0F0', '#C6E48B', '#7BC96F', '#239A3B', '#196127']

const nivelContribucion = (dia) => {
  if (!dia.count || dia.count === 0) return nivelesColor[0]
  if (dia.count <= 3) return nivelesColor[1]
  if (dia.count <= 6) return nivelesColor[2]
  if (dia.count <= 9) return nivelesColor[3]
  return nivelesColor[4]
}

const contribuciones = ref([])
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const generarContribuciones = () => {
  const semanas = 26
  const resultado = []
  for (let s = 0; s < semanas; s++) {
    const semana = []
    for (let d = 0; d < 7; d++) {
      const count = Math.random() < 0.45 ? Math.floor(Math.random() * 12) : 0
      semana.push({
        count,
        titulo: `${count} tareas completadas · ${diasSemana[d]}`
      })
    }
    resultado.push(semana)
  }
  contribuciones.value = resultado
}

generarContribuciones()
</script>
