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
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="(r, idx) in formulario.recordatorios" :key="idx"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
              {{ r.cantidad }} {{ etiquetaUnidad(r.unidad, r.cantidad) }} antes
              <button type="button" @click="quitarRecordatorio(idx)" class="hover:text-teal-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
              </button>
            </span>
            <span v-if="formulario.recordatorios.length === 0" class="text-xs text-gray-400 py-1">Sin recordatorios</span>
          </div>
          <div class="flex items-center gap-2">
            <input v-model.number="nuevoRec.cantidad" type="number" min="1" class="input-base w-20 py-1.5" />
            <select v-model="nuevoRec.unidad" class="input-base w-auto py-1.5 appearance-none cursor-pointer">
              <option value="minutos">minutos</option>
              <option value="horas">horas</option>
              <option value="dias">días</option>
            </select>
            <span class="text-xs text-gray-400">antes</span>
            <button type="button" @click="agregarRecordatorio" class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">+ Añadir</button>
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
  recordatorios: [],
  recurrencia: null
})

const nuevoRec = ref({ cantidad: 15, unidad: 'minutos' })
const factorUnidad = { minutos: 1, horas: 60, dias: 1440 }
const etiquetaUnidad = (unidad, cantidad) => {
  const mapa = { minutos: 'min', horas: cantidad === 1 ? 'hora' : 'horas', dias: cantidad === 1 ? 'día' : 'días' }
  return mapa[unidad] || unidad
}
const agregarRecordatorio = () => {
  if (!nuevoRec.value.cantidad || nuevoRec.value.cantidad <= 0) return
  formulario.value.recordatorios.push({ cantidad: nuevoRec.value.cantidad, unidad: nuevoRec.value.unidad })
  nuevoRec.value = { cantidad: 15, unidad: 'minutos' }
}
const quitarRecordatorio = (idx) => formulario.value.recordatorios.splice(idx, 1)

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
    ui.error('El título es obligatorio')
    return
  }
  if (dayjs(formulario.value.fechaFin).isSame(dayjs(formulario.value.fechaInicio)) ||
      dayjs(formulario.value.fechaFin).isBefore(dayjs(formulario.value.fechaInicio))) {
    ui.error('La fecha de fin debe ser posterior a la de inicio')
    return
  }

  const recordatoriosMin = formulario.value.recordatorios.map((r) => r.cantidad * (factorUnidad[r.unidad] || 1))

  // La recurrencia arranca desde la fecha del propio evento
  const recurrencia = formulario.value.recurrencia
  if (recurrencia) {
    if (!recurrencia.fecha_fin) { ui.error('Indica hasta qué fecha se repite el evento'); return }
    recurrencia.fecha_inicio = aFechaSql(formulario.value.fechaInicio)
  }

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
    recurrencia
  })
}
</script>
