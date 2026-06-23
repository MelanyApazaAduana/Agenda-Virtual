<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col transform transition-all max-h-[92vh]">

      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="text-white p-1.5 rounded-lg shadow-sm" :style="{ backgroundColor: formulario.color_hex || '#F59E0B' }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h2 class="text-[18px] font-bold text-gray-900">{{ esEdicion ? 'Editar Nota' : 'Nueva Nota' }}</h2>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto">
        <div>
          <label class="label-campo">Título de la nota</label>
          <input v-model="formulario.titulo" type="text" placeholder="Ingresa un título descriptivo..." class="input-base" />
        </div>

        <div>
          <label class="label-campo">Color</label>
          <SelectorColor v-model="formulario.color_hex" />
        </div>

        <div>
          <label class="label-campo">Contenido</label>
          <textarea v-model="formulario.contenido" rows="5" placeholder="Empieza a escribir tus ideas aquí..." class="input-base resize-none"></textarea>
        </div>

        <div>
          <label class="label-campo">Vincular a</label>
          <div class="flex bg-gray-100 p-1 rounded-lg mb-2">
            <button v-for="t in tiposVinculo" :key="t.valor" type="button" @click="cambiarVinculo(t.valor)"
              class="flex-1 py-1.5 text-sm font-medium rounded-md transition"
              :class="vinculo === t.valor ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'">{{ t.label }}</button>
          </div>
          <select v-if="vinculo === 'evento'" v-model="formulario.evento_id" class="input-base appearance-none cursor-pointer">
            <option :value="null" disabled>Selecciona un evento...</option>
            <option v-for="e in eventos" :key="e.id" :value="e.id">{{ e.titulo }}</option>
          </select>
          <select v-if="vinculo === 'tarea'" v-model="formulario.tarea_id" class="input-base appearance-none cursor-pointer">
            <option :value="null" disabled>Selecciona una tarea...</option>
            <option v-for="t in tareas" :key="t.id" :value="t.id">{{ t.titulo }}</option>
          </select>
        </div>

        <div>
          <label class="label-campo">Archivos adjuntos</label>
          <div class="grid grid-cols-3 gap-2">
            <!-- Documento -->
            <div class="border border-gray-200 rounded-lg p-2 text-center">
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Documento</p>
              <template v-if="formulario.documento_url">
                <a :href="formulario.documento_url" target="_blank" class="text-xs text-teal-600 underline block truncate">Ver archivo</a>
                <button type="button" @click="formulario.documento_url = ''" class="text-[10px] text-red-500 mt-1">Quitar</button>
              </template>
              <label v-else class="cursor-pointer text-xs text-gray-500 hover:text-black">
                <span v-if="subiendo === 'documento'">Subiendo…</span>
                <span v-else>+ PDF, DOC, TXT</span>
                <input type="file" accept=".pdf,.txt,.doc,.docx,.odt,.rtf" class="hidden" @change="subir('documento', $event)" />
              </label>
            </div>
            <!-- Imagen -->
            <div class="border border-gray-200 rounded-lg p-2 text-center">
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Imagen</p>
              <template v-if="formulario.imagen_url">
                <img :src="formulario.imagen_url" alt="" class="w-full h-12 object-cover rounded mb-1" />
                <button type="button" @click="formulario.imagen_url = ''" class="text-[10px] text-red-500">Quitar</button>
              </template>
              <label v-else class="cursor-pointer text-xs text-gray-500 hover:text-black">
                <span v-if="subiendo === 'imagen'">Subiendo…</span>
                <span v-else>+ PNG, JPG</span>
                <input type="file" accept=".png,.jpg,.jpeg,.gif,.webp" class="hidden" @change="subir('imagen', $event)" />
              </label>
            </div>
            <!-- Audio -->
            <div class="border border-gray-200 rounded-lg p-2 text-center">
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Audio</p>
              <template v-if="formulario.audio_url">
                <audio :src="formulario.audio_url" controls class="w-full h-7"></audio>
                <button type="button" @click="formulario.audio_url = ''" class="text-[10px] text-red-500">Quitar</button>
              </template>
              <label v-else class="cursor-pointer text-xs text-gray-500 hover:text-black">
                <span v-if="subiendo === 'audio'">Subiendo…</span>
                <span v-else>+ MP3</span>
                <input type="file" accept=".mp3,.wav,.ogg,.m4a,.aac" class="hidden" @change="subir('audio', $event)" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div class="flex items-center gap-3">
          <button v-if="esEdicion" @click="$emit('eliminar', valores.id)" class="text-sm font-bold text-red-600 hover:text-red-700 transition">Eliminar</button>
          <span v-if="autoguardado" class="text-[11px] text-gray-400">Autoguardado ✓</span>
        </div>
        <div class="flex items-center gap-4">
          <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button @click="guardar" class="btn-primario">{{ esEdicion ? 'Guardar cambios' : 'Guardar nota' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, computed, onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import SelectorColor from '@/components/ui/SelectorColor.vue'
import { listarEventos } from '@/api/eventos'
import { listarTareas } from '@/api/tareas'
import { autoguardarNota } from '@/api/notas'
import { subirArchivo } from '@/api/uploads'

const props = defineProps({
  modo: { type: String, default: 'crear' },
  valores: { type: Object, default: null }
})
const emit = defineEmits(['cerrar', 'guardar', 'eliminar'])

const esEdicion = computed(() => props.modo === 'editar' && props.valores)
const tiposVinculo = [{ valor: 'ninguno', label: 'Ninguno' }, { valor: 'evento', label: 'Evento' }, { valor: 'tarea', label: 'Tarea' }]

const vinculo = ref('ninguno')
const eventos = ref([])
const tareas = ref([])
const autoguardado = ref(false)
const subiendo = ref(null)

const formulario = ref({
  titulo: '',
  contenido: '',
  color_hex: '#F59E0B',
  evento_id: null,
  tarea_id: null,
  audio_url: '',
  imagen_url: '',
  documento_url: ''
})

const subir = async (tipo, evento) => {
  const archivo = evento.target.files?.[0]
  if (!archivo) return
  subiendo.value = tipo
  try {
    const { data } = await subirArchivo(tipo, archivo)
    formulario.value[`${tipo}_url`] = data.data.url
  } catch (e) {
    ui.error(e.response?.data?.mensaje || 'No se pudo subir el archivo')
  } finally {
    subiendo.value = null
    evento.target.value = ''
  }
}

onMounted(async () => {
  try {
    const [re, rt] = await Promise.all([listarEventos(), listarTareas()])
    eventos.value = re.data.data || []
    tareas.value = rt.data.data || []
  } catch (e) { /* ignora */ }

  if (esEdicion.value) {
    const v = props.valores
    formulario.value = {
      titulo: v.titulo || '',
      contenido: v.contenido || '',
      color_hex: v.color_hex || '#F59E0B',
      evento_id: v.evento_id || null,
      tarea_id: v.tarea_id || null,
      audio_url: v.audio_url || '',
      imagen_url: v.imagen_url || '',
      documento_url: v.documento_url || ''
    }
    vinculo.value = v.evento_id ? 'evento' : v.tarea_id ? 'tarea' : 'ninguno'

    // Autoguardado en edición: actualiza el borrador al vuelo
    watchDebounced(formulario, async () => {
      if (!formulario.value.titulo.trim()) return
      try { await autoguardarNota({ id: v.id, ...construirPayload() }); autoguardado.value = true; setTimeout(() => (autoguardado.value = false), 1500) }
      catch (e) { /* ignora */ }
    }, { debounce: 900, deep: true })
  }
})

const cambiarVinculo = (t) => {
  vinculo.value = t
  if (t !== 'evento') formulario.value.evento_id = null
  if (t !== 'tarea') formulario.value.tarea_id = null
}

const construirPayload = () => ({
  titulo: formulario.value.titulo.trim(),
  contenido: formulario.value.contenido || null,
  color_hex: formulario.value.color_hex,
  evento_id: vinculo.value === 'evento' ? formulario.value.evento_id : null,
  tarea_id: vinculo.value === 'tarea' ? formulario.value.tarea_id : null,
  audio_url: formulario.value.audio_url || null,
  imagen_url: formulario.value.imagen_url || null,
  documento_url: formulario.value.documento_url || null
})

const guardar = () => {
  if (!formulario.value.titulo.trim()) { ui.error('El título de la nota es obligatorio'); return }
  emit('guardar', construirPayload())
}
</script>
