<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Etiquetas</h1>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Etiquetas</h2>
      <p class="text-sm text-gray-500 mt-1">Organiza y encuentra todo lo etiquetado en un solo lugar.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Lista de etiquetas -->
      <div class="lg:col-span-1 card p-5 h-fit">
        <div class="flex items-center gap-2 mb-4">
          <input v-model="nuevaEtiqueta" @keyup.enter="crear" type="text" maxlength="50" placeholder="Nueva etiqueta..."
            class="flex-1 input-base" />
          <SelectorColor v-model="colorNueva" />
        </div>
        <button @click="crear" class="btn-primario w-full mb-4">+ Crear etiqueta</button>

        <Spinner v-if="etiquetasStore.cargando" />
        <EstadoVacio v-else-if="etiquetasStore.etiquetas.length === 0" mensaje="Aún no tienes etiquetas" />
        <ul v-else class="space-y-1">
          <li v-for="et in etiquetasStore.etiquetas" :key="et.id"
            @click="seleccionar(et)"
            class="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition"
            :class="seleccionada?.id === et.id ? 'bg-gray-100' : 'hover:bg-gray-50'">
            <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: et.color_hex || '#6B7280' }"></span>
            <span class="flex-1 text-sm font-medium text-gray-700 truncate">{{ et.nombre }}</span>
            <button @click.stop="borrar(et)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Resultados de la etiqueta seleccionada -->
      <div class="lg:col-span-2 card p-6">
        <div v-if="!seleccionada" class="text-center py-16 text-gray-400">
          <p class="text-sm">Selecciona una etiqueta para ver todo lo asociado.</p>
        </div>
        <template v-else>
          <div class="flex items-center gap-2 mb-6">
            <span class="w-3.5 h-3.5 rounded-full" :style="{ backgroundColor: seleccionada.color_hex || '#6B7280' }"></span>
            <h3 class="text-lg font-bold text-gray-900">{{ seleccionada.nombre }}</h3>
            <span class="text-sm text-gray-400 ml-1">· {{ entidades.length }} elementos</span>
          </div>

          <Spinner v-if="cargandoEntidades" />
          <EstadoVacio v-else-if="entidades.length === 0" mensaje="Nada etiquetado con esta etiqueta aún" />
          <div v-else class="space-y-6">
            <div v-for="grupo in grupos" :key="grupo.tipo" v-show="grupo.items.length">
              <h4 class="text-xs font-bold uppercase tracking-wider mb-2" :class="grupo.color">{{ grupo.titulo }} ({{ grupo.items.length }})</h4>
              <ul class="space-y-1.5">
                <li v-for="it in grupo.items" :key="grupo.tipo + '-' + it.entidad_id"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border-l-4" :style="{ borderLeftColor: grupo.hex }">
                  <span class="text-sm text-gray-800 truncate">{{ it.descripcion || (grupo.titulo + ' #' + it.entidad_id) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, computed, onMounted } from 'vue'
import { useEtiquetasStore } from '@/stores/etiquetasStore'
import { listarEntidadesPorEtiqueta } from '@/api/etiquetas'
import SelectorColor from '@/components/ui/SelectorColor.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'

const etiquetasStore = useEtiquetasStore()
const nuevaEtiqueta = ref('')
const colorNueva = ref('#4F46E5')
const seleccionada = ref(null)
const entidades = ref([])
const cargandoEntidades = ref(false)

const defsGrupo = [
  { tipo: 'evento', titulo: 'Eventos', color: 'text-blue-600', hex: '#3B82F6' },
  { tipo: 'tarea', titulo: 'Tareas', color: 'text-emerald-600', hex: '#10B981' },
  { tipo: 'ingreso', titulo: 'Ingresos', color: 'text-emerald-700', hex: '#22C55E' },
  { tipo: 'gasto', titulo: 'Gastos', color: 'text-red-600', hex: '#EF4444' }
]

const grupos = computed(() =>
  defsGrupo.map((g) => ({ ...g, items: entidades.value.filter((e) => e.entidad_tipo === g.tipo) }))
)

onMounted(() => etiquetasStore.cargar(true))

const crear = async () => {
  const nombre = nuevaEtiqueta.value.trim()
  if (!nombre) return
  try {
    await etiquetasStore.crear({ nombre, color_hex: colorNueva.value })
    nuevaEtiqueta.value = ''
  } catch (e) {
    ui.error(e.response?.data?.message || 'No se pudo crear la etiqueta')
  }
}

const borrar = async (et) => {
  if (!(await ui.confirmar(`¿Eliminar la etiqueta "${et.nombre}"?`))) return
  try {
    await etiquetasStore.eliminar(et.id)
    if (seleccionada.value?.id === et.id) { seleccionada.value = null; entidades.value = [] }
  } catch (e) {
    ui.error('No se pudo eliminar la etiqueta')
  }
}

const seleccionar = async (et) => {
  seleccionada.value = et
  cargandoEntidades.value = true
  try {
    const { data } = await listarEntidadesPorEtiqueta(et.id)
    entidades.value = data.data || []
  } catch (e) {
    entidades.value = []
  } finally {
    cargandoEntidades.value = false
  }
}
</script>
