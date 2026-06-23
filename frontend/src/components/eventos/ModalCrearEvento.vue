<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all max-h-[92vh]">

      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between shrink-0">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">{{ esEdicion ? 'Editar Evento' : 'Nuevo Evento' }}</h2>
          <p class="text-xs text-gray-500 mt-1 tracking-wide">Perfecciona tu agenda con precisión</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto">
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Título del evento</label>
          <input v-model="formulario.titulo" type="text" placeholder="Reunión"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha inicio</label>
            <input v-model="formulario.fechaInicio" type="datetime-local"
              class="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha fin</label>
            <input v-model="formulario.fechaFin" type="datetime-local"
              class="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Lugar (opcional)</label>
          <input v-model="formulario.ubicacion" type="text" placeholder="Oruro"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción (opcional)</label>
          <textarea v-model="formulario.descripcion" rows="2" placeholder="Detalles del evento..."
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 placeholder-gray-400 resize-none"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Color</label>
          <SelectorColor v-model="formulario.color_hex" />
        </div>

        <div v-if="esEdicion">
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estado</label>
          <select v-model="formulario.estado"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
            <option value="">Automático (según fechas)</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
            <option value="pospuesto">Pospuesto</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Etiquetas</label>
          <EtiquetasSelector v-model="formulario.etiquetas" />
        </div>

        <div v-if="!esEdicion">
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recordatorios</label>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input type="checkbox" v-model="formulario.rec15" class="w-4 h-4 rounded accent-teal-700">
              <span class="text-sm text-gray-700 font-medium">15 min antes</span>
            </label>
            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input type="checkbox" v-model="formulario.rec60" class="w-4 h-4 rounded accent-teal-700">
              <span class="text-sm text-gray-700 font-medium">1 h antes</span>
            </label>
          </div>
        </div>

        <SelectorRecurrencia v-if="!esEdicion" v-model="formulario.recurrencia" :fecha-base="fechaBase" />
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
            {{ esEdicion ? 'Guardar cambios' : 'Guardar evento' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

const fechaBase = props.fechaPredeterminada || dayjs().format('YYYY-MM-DD')

const formulario = ref({
  titulo: '',
  fechaInicio: `${fechaBase}T09:00`,
  fechaFin: `${fechaBase}T10:00`,
  ubicacion: '',
  descripcion: '',
  color_hex: '#3B82F6',
  estado: '',
  etiquetas: [],
  rec15: false,
  rec60: false,
  recurrencia: null
})

const etiquetasPrevias = ref([])

onMounted(async () => {
  if (esEdicion.value) {
    const v = props.valores
    formulario.value.titulo = v.titulo || ''
    formulario.value.fechaInicio = v.fecha_inicio ? dayjs(v.fecha_inicio).format('YYYY-MM-DDTHH:mm') : formulario.value.fechaInicio
    formulario.value.fechaFin = v.fecha_fin ? dayjs(v.fecha_fin).format('YYYY-MM-DDTHH:mm') : formulario.value.fechaFin
    formulario.value.ubicacion = v.ubicacion || ''
    formulario.value.descripcion = v.descripcion || ''
    formulario.value.color_hex = v.color_hex || '#3B82F6'
    formulario.value.estado = ['completado', 'cancelado', 'pospuesto'].includes(v.estado) ? v.estado : ''
    etiquetasPrevias.value = await obtenerIdsEtiquetas('evento', v.id)
    formulario.value.etiquetas = [...etiquetasPrevias.value]
  }
})

const aFechaSql = (valor) => dayjs(valor).format('YYYY-MM-DD HH:mm:ss')

const guardar = () => {
  if (!formulario.value.titulo.trim()) {
    alert('El título es obligatorio')
    return
  }
  if (dayjs(formulario.value.fechaFin).isSame(dayjs(formulario.value.fechaInicio)) ||
      dayjs(formulario.value.fechaFin).isBefore(dayjs(formulario.value.fechaInicio))) {
    alert('La fecha de fin debe ser posterior a la de inicio')
    return
  }

  const recordatoriosMin = []
  if (formulario.value.rec15) recordatoriosMin.push(15)
  if (formulario.value.rec60) recordatoriosMin.push(60)

  emit('guardar', {
    titulo: formulario.value.titulo.trim(),
    descripcion: formulario.value.descripcion || null,
    fecha_inicio: aFechaSql(formulario.value.fechaInicio),
    fecha_fin: aFechaSql(formulario.value.fechaFin),
    ubicacion: formulario.value.ubicacion || null,
    color_hex: formulario.value.color_hex,
    estado: formulario.value.estado || undefined,
    etiquetas: formulario.value.etiquetas,
    etiquetasPrevias: etiquetasPrevias.value,
    recordatoriosMin,
    recurrencia: formulario.value.recurrencia
  })
}
</script>
