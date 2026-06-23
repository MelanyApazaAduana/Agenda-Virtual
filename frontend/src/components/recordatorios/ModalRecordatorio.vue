<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <h2 class="text-xl font-bold text-gray-900">Nuevo recordatorio</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5">
        <div>
          <label class="label-campo">¿Para qué?</label>
          <div class="flex bg-gray-100 p-1 rounded-lg">
            <button v-for="t in tiposEntidad" :key="t.valor" type="button" @click="cambiarTipo(t.valor)"
              class="flex-1 py-1.5 text-sm font-medium rounded-md transition"
              :class="tipo === t.valor ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'">
              {{ t.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="label-campo">{{ tipo === 'evento' ? 'Evento' : 'Tarea' }}</label>
          <select v-model="entidadId" class="input-base appearance-none cursor-pointer">
            <option :value="null" disabled>Selecciona...</option>
            <option v-for="o in opciones" :key="o.id" :value="o.id">{{ o.titulo }}</option>
          </select>
        </div>

        <div>
          <label class="label-campo">Fecha y hora de envío</label>
          <input v-model="fechaEnvio" type="datetime-local" class="input-base" />
        </div>

        <div>
          <label class="label-campo">Mensaje (opcional)</label>
          <input v-model="mensaje" type="text" placeholder="Ej. Preparar materiales" class="input-base" />
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
        <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
        <button @click="guardar" class="btn-primario">Programar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { listarEventos } from '@/api/eventos'
import { listarTareas } from '@/api/tareas'

const emit = defineEmits(['cerrar', 'guardar'])

const tiposEntidad = [{ valor: 'evento', label: 'Evento' }, { valor: 'tarea', label: 'Tarea' }]
const tipo = ref('evento')
const entidadId = ref(null)
const fechaEnvio = ref(dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'))
const mensaje = ref('')

const eventos = ref([])
const tareas = ref([])
const opciones = computed(() => (tipo.value === 'evento' ? eventos.value : tareas.value))

onMounted(async () => {
  try {
    const [re, rt] = await Promise.all([listarEventos(), listarTareas()])
    eventos.value = re.data.data || []
    tareas.value = rt.data.data || []
  } catch (e) { /* ignora */ }
})

const cambiarTipo = (t) => { tipo.value = t; entidadId.value = null }

const guardar = () => {
  if (!entidadId.value) { ui.error(`Selecciona ${tipo.value === 'evento' ? 'un evento' : 'una tarea'}`); return }
  if (dayjs(fechaEnvio.value).isBefore(dayjs())) { ui.error('La fecha de envío debe ser futura'); return }
  const payload = {
    fecha_envio: dayjs(fechaEnvio.value).format('YYYY-MM-DD HH:mm:ss'),
    mensaje: mensaje.value || null
  }
  if (tipo.value === 'evento') payload.evento_id = entidadId.value
  else payload.tarea_id = entidadId.value
  emit('guardar', payload)
}
</script>
