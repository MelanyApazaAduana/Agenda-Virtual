<template>
  <aside class="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full hidden md:flex">

    <div class="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scroll">

      <div>
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">Mi Calendario</h3>
        <div class="flex justify-between items-center mb-3 px-1">
          <span class="text-xs font-bold text-gray-600">{{ mesActualLabel }}</span>
          <div class="flex gap-2 text-gray-400">
            <button @click="cambiarMesMini(-1)" class="hover:text-gray-600 text-xs">&lt;</button>
            <button @click="cambiarMesMini(1)" class="hover:text-gray-600 text-xs">&gt;</button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] text-gray-400 font-medium mb-1.5">
          <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
        </div>
        <div class="grid grid-cols-7 text-center text-[11px] gap-y-1.5 text-gray-600">
          <template v-for="(item, idx) in diasMiniCalendario" :key="idx">
            <span v-if="item.fueraMes" class="text-gray-300">{{ item.dia }}</span>
            <span v-else
              @click="seleccionarDiaMini(item.dia)"
              class="cursor-pointer inline-flex items-center justify-center"
              :class="[
                item.esSeleccionado
                  ? 'bg-black text-white rounded-full w-5 h-5 text-[10px]'
                  : item.esHoy
                    ? 'bg-gray-900 text-white rounded-full w-5 h-5 text-[10px]'
                    : 'hover:text-gray-900'
              ]"
            >{{ item.dia }}</span>
          </template>
        </div>
      </div>

      <nav class="space-y-0.5">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-1.5 text-xs font-medium border-l-2 w-full text-left transition"
          :class="item.active ? 'border-black text-black font-semibold' : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'"
        >
          <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" :class="item.active ? 'text-black' : 'text-gray-400'" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div>
        <div class="flex items-center justify-between px-1 mb-2.5">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mis Categorías</h3>
          <button @click="categoriasAbiertas = !categoriasAbiertas" class="text-gray-400 hover:text-gray-600 transition p-0.5">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="w-3 h-3 transition-transform" :class="categoriasAbiertas ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div v-show="categoriasAbiertas" class="space-y-1.5 px-1">
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" :checked="categoriasSeleccionadas.Todos" @change="toggleCategoria('Todos')" class="rounded text-black focus:ring-black accent-black w-3.5 h-3.5" />
            Todos
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" :checked="categoriasSeleccionadas.Personal" @change="toggleCategoria('Personal')" class="rounded text-teal-500 focus:ring-teal-500 accent-teal-500 w-3.5 h-3.5" />
            Personal
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" :checked="categoriasSeleccionadas.Trabajo" @change="toggleCategoria('Trabajo')" class="rounded text-indigo-600 focus:ring-indigo-600 accent-indigo-600 w-3.5 h-3.5" />
            Trabajo
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" :checked="categoriasSeleccionadas.Estudio" @change="toggleCategoria('Estudio')" class="rounded text-orange-400 focus:ring-orange-400 accent-orange-400 w-3.5 h-3.5" />
            Estudio
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Finanzas</h3>
        <div class="space-y-2.5">
          <div class="bg-green-50 rounded-xl px-3 py-2.5">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-medium text-gray-500">Total cuenta</span>
              <span class="text-xs font-bold text-gray-900">$12,500.00</span>
            </div>
            <div class="h-1.5 bg-green-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full" style="width: 75%"></div>
            </div>
          </div>
          <div class="bg-red-50 rounded-xl px-3 py-2.5">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-medium text-gray-500">Egresos del mes</span>
              <span class="text-xs font-bold text-gray-900">$3,200.00</span>
            </div>
            <div class="h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div class="h-full bg-red-400 rounded-full" style="width: 40%"></div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2.5">
          <router-link to="/ingresos/registrar" class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ingreso
          </router-link>
          <router-link to="/gastos/registrar" class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
            Gastos
          </router-link>
        </div>
      </div>
    </div>

    <div class="px-3 py-3 border-t border-gray-100 space-y-1">
      <button class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg w-full transition">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Ayuda
      </button>

    </div>
  </aside>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { h } from 'vue'
import dayjs from 'dayjs'

const route = useRoute()

const diaSeleccionadoMini = ref(null)
const categoriasAbiertas = ref(true)
const categoriasSeleccionadas = reactive({
  Todos: true,
  Personal: true,
  Trabajo: true,
  Estudio: false
})

const toggleCategoria = (nombre) => {
  if (nombre === 'Todos') {
    const nuevoEstado = !categoriasSeleccionadas.Todos
    Object.keys(categoriasSeleccionadas).forEach(key => {
      categoriasSeleccionadas[key] = nuevoEstado
    })
  } else {
    categoriasSeleccionadas[nombre] = !categoriasSeleccionadas[nombre]
    const todasSeleccionadas = Object.keys(categoriasSeleccionadas)
      .filter(k => k !== 'Todos')
      .every(k => categoriasSeleccionadas[k])
    categoriasSeleccionadas.Todos = todasSeleccionadas
  }
}

const ahora = dayjs()
const mesMini = ref(ahora.month())
const anioMini = ref(ahora.year())

const mesActualLabel = computed(() => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${meses[mesMini.value]} ${anioMini.value}`
})

const diasMiniCalendario = computed(() => {
  const primerDia = dayjs(new Date(anioMini.value, mesMini.value, 1))
  const diasEnMes = primerDia.daysInMonth()
  const diaSemanaInicio = primerDia.day()
  const dias = []

  for (let i = 0; i < diaSemanaInicio; i++) {
    const diaAnterior = primerDia.subtract(diaSemanaInicio - i, 'day')
    dias.push({ dia: diaAnterior.date(), fueraMes: true, esHoy: false, esSeleccionado: false })
  }

  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = dayjs(new Date(anioMini.value, mesMini.value, i))
    dias.push({
      dia: i,
      fueraMes: false,
      esHoy: fecha.isSame(ahora, 'day'),
      esSeleccionado: diaSeleccionadoMini.value === i
    })
  }

  const resto = 7 - (dias.length % 7)
  if (resto < 7) {
    for (let i = 1; i <= resto; i++) {
      dias.push({ dia: i, fueraMes: true, esHoy: false, esSeleccionado: false })
    }
  }

  return dias
})

const seleccionarDiaMini = (dia) => {
  diaSeleccionadoMini.value = diaSeleccionadoMini.value === dia ? null : dia
}

const cambiarMesMini = (delta) => {
  mesMini.value += delta
  if (mesMini.value > 11) { mesMini.value = 0; anioMini.value++ }
  else if (mesMini.value < 0) { mesMini.value = 11; anioMini.value-- }
}

const iconos = {
  calendario: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ]),
  tareas: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
  ]),
  notas: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
  ]),
  productividad: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
  ]),
  reportes: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' })
  ]),
  usuarios: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ])
}

const navItems = computed(() => [
  { label: 'Eventos', to: '/calendario', icon: iconos.calendario, active: route.name === 'calendario' },
  { label: 'Tareas', to: '/tareas', icon: iconos.tareas, active: route.name === 'tareas' },
  { label: 'Notas', to: '/notas', icon: iconos.notas, active: route.name === 'notas' },
  { label: 'Productividad', to: '/productividad', icon: iconos.productividad, active: route.name === 'productividad' },
  { label: 'Reportes Financieros', to: '/ingresos/reportes', icon: iconos.reportes, active: route.name === 'reportes-financieros' },
  { label: 'Usuarios', to: '/usuarios', icon: iconos.usuarios, active: route.name === 'usuarios' }
])
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 3px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
</style>
