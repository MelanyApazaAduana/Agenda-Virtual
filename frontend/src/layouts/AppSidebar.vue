<template>
  <aside class="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full hidden md:flex">

    <div class="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scroll">
      <button v-if="esRutaCalendario" @click="navegar('crear')" class="w-full bg-black text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-zinc-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nuevo
      </button>

      <div v-if="esRutaCalendario">
        <div class="flex justify-between items-center mb-3 px-1">
          <span class="text-xs font-bold text-gray-600">Octubre 2024</span>
          <div class="flex gap-2 text-gray-400">
            <button class="hover:text-gray-600 text-xs">&lt;</button>
            <button class="hover:text-gray-600 text-xs">&gt;</button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] text-gray-400 font-medium mb-1.5">
          <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
        </div>
        <div class="grid grid-cols-7 text-center text-[11px] gap-y-1.5 text-gray-600">
          <span class="text-gray-300">29</span><span class="text-gray-300">30</span>
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
          <span>13</span><span>14</span><span>15</span><span class="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto text-[10px]">16</span><span>17</span><span>18</span><span>19</span>
          <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
          <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span class="text-gray-300">1</span><span class="text-gray-300">2</span>
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

      <div v-if="esRutaCalendario">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">Mis Categorías</h3>
        <div class="space-y-1.5 px-1">
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked class="rounded text-black focus:ring-black accent-black w-3.5 h-3.5" />
            Todos
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked class="rounded text-teal-500 focus:ring-teal-500 accent-teal-500 w-3.5 h-3.5" />
            Personal
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked class="rounded text-indigo-600 focus:ring-indigo-600 accent-indigo-600 w-3.5 h-3.5" />
            Trabajo
          </label>
          <label class="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" class="rounded text-orange-400 focus:ring-orange-400 accent-orange-400 w-3.5 h-3.5" />
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
          <button class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ingreso
          </button>
          <button class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
            Egreso
          </button>
        </div>
      </div>
    </div>

    <div class="px-3 py-3 border-t border-gray-100 space-y-1">
      <button v-if="esRutaTareas" @click="abrirCreacionRapida" class="w-full bg-black text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-zinc-800 transition shadow-sm shadow-black/10">
        <span class="text-base leading-none">+</span> Creación Rápida
      </button>
      <button class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg w-full transition">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Ayuda
      </button>
      <button class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg w-full transition">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        Configuración
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { h } from 'vue'

const route = useRoute()
const router = useRouter()

const esRutaCalendario = computed(() => route.name === 'calendario')
const esRutaTareas = computed(() => route.name === 'tareas')

const navegar = (destino) => {
  if (destino === 'crear') return
  router.push({ name: destino })
}

const abrirCreacionRapida = () => {
  router.push({ name: 'tareas' })
}

const IconCalendario = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
}

const IconTareas = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
    ])
  }
}

const IconNotas = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
    ])
  }
}

const IconProductividad = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
    ])
  }
}

const IconUsuarios = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  }
}

const IconEventos = {
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
}

const navItems = computed(() => {
  const name = route.name

  if (name === 'calendario') {
    return [
      { label: 'Eventos', to: '/calendario', icon: IconEventos, active: true },
      { label: 'Tareas', to: '/tareas', icon: IconTareas, active: false },
      { label: 'Notas', to: '/notas', icon: IconNotas, active: false },
      { label: 'Productividad', to: '/productividad', icon: IconProductividad, active: false }
    ]
  }

  if (name === 'usuarios') {
    return [
      { label: 'Calendario', to: '/calendario', icon: IconCalendario, active: false },
      { label: 'Tareas', to: '/tareas', icon: IconTareas, active: false },
      { label: 'Usuarios', to: '/usuarios', icon: IconUsuarios, active: true }
    ]
  }

  return [
    { label: 'Calendario', to: '/calendario', icon: IconCalendario, active: false },
    { label: 'Tareas', to: '/tareas', icon: IconTareas, active: name === 'tareas' },
    { label: 'Notas', to: '/notas', icon: IconNotas, active: name === 'notas' },
    { label: 'Productividad', to: '/productividad', icon: IconProductividad, active: name === 'productividad' },
    { label: 'Usuarios', to: '/usuarios', icon: IconUsuarios, active: name === 'usuarios' }
  ]
})
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
