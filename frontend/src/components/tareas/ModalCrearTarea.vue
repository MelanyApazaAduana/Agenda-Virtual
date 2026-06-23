<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all max-h-[92vh]">

      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between shrink-0">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">{{ esEdicion ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
          <p class="text-xs text-gray-500 mt-1 tracking-wide">Divide tus proyectos en pasos accionables</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto">
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre de la tarea</label>
          <input v-model="formulario.titulo" type="text" placeholder="Ej. Finalizar presentación"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Prioridad</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="p in prioridades" :key="p.valor" type="button" @click="formulario.prioridad = p.valor"
              :class="formulario.prioridad === p.valor ? p.activo : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-1.5 py-2 border rounded-lg transition font-medium text-xs">
              <span class="w-2 h-2 rounded-full" :class="formulario.prioridad === p.valor ? p.punto : 'bg-gray-400'"></span>
              {{ p.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha de vencimiento (opcional)</label>
          <input v-model="formulario.fechaLimite" type="datetime-local"
            class="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
        </div>

        <div v-if="esEdicion">
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estado</label>
          <select v-model="formulario.estado"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
            <option value="por_hacer">Por hacer</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Color</label>
          <SelectorColor v-model="formulario.color_hex" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Etiquetas</label>
          <EtiquetasSelector v-model="formulario.etiquetas" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción (opcional)</label>
          <textarea v-model="formulario.descripcion" rows="2" placeholder="Añade detalles sobre la tarea..."
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400 resize-none"></textarea>
        </div>

        <SelectorRecurrencia v-if="!esEdicion" v-model="formulario.recurrencia" :fecha-base="fechaPredeterminada" />
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-4 shrink-0 bg-white">
        <button v-if="esEdicion" @click="$emit('eliminar', valores.id)"
          class="text-sm font-bold text-red-600 hover:text-red-700 transition">
          Eliminar
        </button>
        <div class="flex items-center gap-4 ml-auto">
          <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button @click="guardar"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10">
            {{ esEdicion ? 'Guardar cambios' : 'Crear tarea' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import SelectorColor from '@/components/ui/SelectorColor.vue'
import EtiquetasSelector from '@/components/ui/EtiquetasSelector.vue'
import SelectorRecurrencia from '@/components/recurrencias/SelectorRecurrencia.vue'
import { obtenerIdsEtiquetas } from '@/utils/etiquetasSync'

const props = defineProps({
  modo: { type: String, default: 'crear' },
  valores: { type: Object, default: null },
  fechaPredeterminada: { type: String, default: null }
})
const emit = defineEmits(['cerrar', 'guardar', 'eliminar'])

const esEdicion = computed(() => props.modo === 'editar' && props.valores)

const prioridades = [
  { valor: 'baja', label: 'Baja', activo: 'bg-teal-50 border-teal-200 text-teal-700 ring-1 ring-teal-500', punto: 'bg-teal-500' },
  { valor: 'media', label: 'Media', activo: 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-500', punto: 'bg-orange-500' },
  { valor: 'alta', label: 'Alta', activo: 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500', punto: 'bg-red-600' },
  { valor: 'urgente', label: 'Urgente', activo: 'bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-500', punto: 'bg-purple-600' }
]

const fechaInicialLimite = props.fechaPredeterminada ? `${props.fechaPredeterminada}T12:00` : ''

const formulario = ref({
  titulo: '',
  prioridad: 'media',
  fechaLimite: fechaInicialLimite,
  estado: 'por_hacer',
  color_hex: '#10B981',
  etiquetas: [],
  descripcion: '',
  recurrencia: null
})

const etiquetasPrevias = ref([])

onMounted(async () => {
  if (esEdicion.value) {
    const v = props.valores
    formulario.value.titulo = v.titulo || ''
    formulario.value.prioridad = v.prioridad || 'media'
    formulario.value.fechaLimite = v.fecha_limite ? dayjs(v.fecha_limite).format('YYYY-MM-DDTHH:mm') : ''
    formulario.value.estado = v.estado || 'por_hacer'
    formulario.value.color_hex = v.color_hex || '#10B981'
    formulario.value.descripcion = v.descripcion || ''
    etiquetasPrevias.value = await obtenerIdsEtiquetas('tarea', v.id)
    formulario.value.etiquetas = [...etiquetasPrevias.value]
  }
})

const guardar = () => {
  if (!formulario.value.titulo.trim()) {
    ui.error('El nombre de la tarea es obligatorio')
    return
  }
  emit('guardar', {
    titulo: formulario.value.titulo.trim(),
    descripcion: formulario.value.descripcion || null,
    prioridad: formulario.value.prioridad,
    fecha_limite: formulario.value.fechaLimite ? dayjs(formulario.value.fechaLimite).format('YYYY-MM-DD HH:mm:ss') : null,
    estado: esEdicion.value ? formulario.value.estado : undefined,
    color_hex: formulario.value.color_hex,
    etiquetas: formulario.value.etiquetas,
    etiquetasPrevias: etiquetasPrevias.value,
    recurrencia: formulario.value.recurrencia
  })
}
</script>
