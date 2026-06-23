<template>
  <aside class="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full hidden md:flex">
    <!-- Marca -->
    <RouterLink to="/calendario" class="flex items-center gap-2.5 px-4 h-14 border-b border-gray-100 shrink-0 hover:opacity-80 transition">
      <img src="/logo.svg" alt="" class="w-7 h-7 rounded-lg" />
      <span class="font-bold text-sm tracking-wide text-gray-900">Agenda Virtual</span>
    </RouterLink>

    <div class="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scroll">

      <!-- Navegación principal (grupos desplegables) -->
      <nav class="space-y-2">
        <div v-for="grupo in grupos" :key="grupo.titulo">
          <button @click="alternarGrupo(grupo.titulo)"
            class="w-full flex items-center justify-between px-1 mb-1 group">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ grupo.titulo }}</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
              class="w-3 h-3 text-gray-400 transition-transform" :class="gruposAbiertos[grupo.titulo] ? '' : '-rotate-90'">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="gruposAbiertos[grupo.titulo]" class="space-y-0.5">
            <RouterLink v-for="item in grupo.items" :key="item.to" :to="item.to"
              class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
              :class="rutaActiva(item.to) ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'">
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: grupo.color }"></span>
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Mini calendario -->
      <div>
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">Mi Calendario</h3>
        <div class="flex justify-between items-center mb-3 px-1">
          <span class="text-xs font-bold text-gray-600 capitalize">{{ mesLabel }}</span>
          <div class="flex gap-2 text-gray-400">
            <button @click="cambiarMes(-1)" class="hover:text-gray-600 text-xs">&lt;</button>
            <button @click="cambiarMes(1)" class="hover:text-gray-600 text-xs">&gt;</button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] text-gray-400 font-medium mb-1.5">
          <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
        </div>
        <div class="grid grid-cols-7 text-center text-[11px] gap-y-1.5 text-gray-600">
          <template v-for="(item, idx) in diasMini" :key="idx">
            <span v-if="item.fueraMes" class="text-gray-300">{{ item.dia }}</span>
            <span v-else @click="seleccionarDia(item)"
              class="cursor-pointer inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]"
              :class="item.esSeleccionado ? 'bg-black text-white' : item.esHoy ? 'ring-1 ring-gray-400' : 'hover:bg-gray-100'">
              {{ item.dia }}
            </span>
          </template>
        </div>
      </div>

      <!-- Etiquetas -->
      <div>
        <div class="flex items-center justify-between px-1 mb-2.5">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mis Etiquetas</h3>
          <button @click="etiquetasAbiertas = !etiquetasAbiertas" class="text-gray-400 hover:text-gray-600 transition p-0.5">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="w-3 h-3 transition-transform" :class="etiquetasAbiertas ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div v-show="etiquetasAbiertas" class="space-y-1 px-1">
          <div v-for="etiqueta in etiquetasStore.etiquetas" :key="etiqueta.id"
            class="group flex items-center gap-2 text-xs text-gray-600 py-0.5">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: etiqueta.color_hex || '#6B7280' }"></span>
            <span class="flex-1 truncate">{{ etiqueta.nombre }}</span>
            <button @click="borrarEtiqueta(etiqueta)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
            </button>
          </div>
          <p v-if="etiquetasStore.etiquetas.length === 0" class="text-[11px] text-gray-400 py-1">Aún no tienes etiquetas</p>
          <div class="flex items-center gap-1 mt-1">
            <input v-model="nuevaEtiqueta" @keyup.enter="crearEtiquetaRapida" type="text" placeholder="Nueva..."
              maxlength="50" class="flex-1 min-w-0 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] outline-none focus:ring-1 focus:ring-black" />
            <button @click="crearEtiquetaRapida" class="text-gray-400 hover:text-black text-sm px-1">+</button>
          </div>
        </div>
      </div>

      <!-- Finanzas -->
      <div>
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Finanzas</h3>
        <div class="space-y-2.5">
          <router-link to="/presupuestos" class="block bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-medium text-gray-500">Presupuesto</span>
              <span class="text-xs font-bold text-gray-900">{{ finanzas.presupuesto ? 'Bs. ' + formato(finanzas.presupuesto.monto_total) : '—' }}</span>
            </div>
            <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="usoPresupuesto > 100 ? 'bg-red-500' : 'bg-emerald-500'" :style="{ width: Math.min(usoPresupuesto, 100) + '%' }"></div>
            </div>
          </router-link>
          <div class="bg-red-50 rounded-xl px-3 py-2.5">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-medium text-gray-500">Gastos del mes</span>
              <span class="text-xs font-bold text-gray-900">Bs. {{ formato(finanzas.gastadoMes) }}</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2.5">
          <router-link to="/ingresos/registrar" class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition">+ Ingreso</router-link>
          <router-link to="/gastos/registrar" class="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition">+ Gasto</router-link>
        </div>
        <router-link to="/reportes" class="flex items-center justify-center gap-1.5 py-2 mt-2 rounded-xl text-[11px] font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition">Reportes</router-link>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useEtiquetasStore } from '@/stores/etiquetasStore'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useFinanzasStore } from '@/stores/finanzasStore'
import { useUiStore } from '@/stores/uiStore'

const route = useRoute()
const calStore = useCalendarioStore()
const { foco } = storeToRefs(calStore)
const etiquetasStore = useEtiquetasStore()
const usuarioStore = useUsuarioStore()
const finanzas = useFinanzasStore()
const ui = useUiStore()

const rutaActiva = (to) => route.path === to

const gruposAbiertos = ref({ Agenda: true, Organizar: true, Finanzas: true, 'Más': true })
const alternarGrupo = (titulo) => { gruposAbiertos.value[titulo] = !gruposAbiertos.value[titulo] }

const grupos = computed(() => {
  const base = [
    { titulo: 'Agenda', color: '#3B82F6', items: [
      { label: 'Calendario', to: '/calendario' },
      { label: 'Tareas', to: '/tareas' },
      { label: 'Notas', to: '/notas' }
    ] },
    { titulo: 'Organizar', color: '#8B5CF6', items: [
      { label: 'Etiquetas', to: '/etiquetas' },
      { label: 'Recordatorios', to: '/recordatorios' },
      { label: 'Recurrencias', to: '/recurrencias' }
    ] },
    { titulo: 'Finanzas', color: '#10B981', items: [
      { label: 'Ingresos', to: '/ingresos' },
      { label: 'Gastos', to: '/gastos' },
      { label: 'Presupuestos', to: '/presupuestos' },
      { label: 'Reportes', to: '/reportes' }
    ] },
    { titulo: 'Más', color: '#6B7280', items: [
      { label: 'Productividad', to: '/productividad' }
    ] }
  ]
  if (usuarioStore.usuario?.rol === 'admin') {
    base[3].items.push({ label: 'Usuarios', to: '/usuarios' })
  }
  return base
})

const etiquetasAbiertas = ref(true)
const nuevaEtiqueta = ref('')
const miniFecha = ref(dayjs())

const mesLabel = computed(() => miniFecha.value.format('MMMM YYYY'))

const diasMini = computed(() => {
  const primer = miniFecha.value.startOf('month')
  const diasEnMes = primer.daysInMonth()
  const inicio = primer.day()
  const dias = []
  for (let i = 0; i < inicio; i++) {
    dias.push({ dia: primer.subtract(inicio - i, 'day').date(), fueraMes: true })
  }
  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = primer.date(i)
    dias.push({
      dia: i, fueraMes: false, fecha,
      esHoy: fecha.isSame(dayjs(), 'day'),
      esSeleccionado: fecha.isSame(foco.value, 'day')
    })
  }
  const resto = (7 - (dias.length % 7)) % 7
  for (let i = 1; i <= resto; i++) dias.push({ dia: i, fueraMes: true })
  return dias
})

const usoPresupuesto = computed(() => {
  const total = Number(finanzas.presupuesto?.monto_total || 0)
  return total ? Math.round((finanzas.gastadoMes / total) * 100) : 0
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const cambiarMes = (delta) => { miniFecha.value = miniFecha.value.add(delta, 'month') }
const seleccionarDia = (item) => { calStore.seleccionarFecha(item.fecha.format('YYYY-MM-DD')) }

const crearEtiquetaRapida = async () => {
  const nombre = nuevaEtiqueta.value.trim()
  if (!nombre) return
  try { await etiquetasStore.crear({ nombre }); nuevaEtiqueta.value = '' }
  catch (e) { ui.error(e.response?.data?.message || 'No se pudo crear la etiqueta') }
}

const borrarEtiqueta = async (etiqueta) => {
  if (!(await ui.confirmar(`¿Eliminar la etiqueta "${etiqueta.nombre}"?`))) return
  try { await etiquetasStore.eliminar(etiqueta.id) }
  catch (e) { ui.error('No se pudo eliminar la etiqueta') }
}

onMounted(() => {
  etiquetasStore.cargar()
  finanzas.cargar()
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
.custom-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
</style>
