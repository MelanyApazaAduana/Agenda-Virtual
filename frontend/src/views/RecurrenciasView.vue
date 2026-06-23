<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Recurrencias</h1>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    <div class="max-w-3xl">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Recurrencias</h2>
          <p class="text-sm text-gray-500 mt-1">Reglas de repetición reutilizables para eventos y tareas.</p>
        </div>
      </div>

      <div class="card p-6 mb-8">
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Nueva regla</h3>
        <SelectorRecurrencia v-model="nueva" mostrar-inicio />
        <div class="flex justify-end mt-4">
          <button @click="crear" :disabled="!nueva" class="btn-primario">Crear regla</button>
        </div>
      </div>

      <Spinner v-if="cargando" />
      <EstadoVacio v-else-if="recurrencias.length === 0" mensaje="No hay reglas de recurrencia" />
      <ul v-else class="space-y-2">
        <li v-for="r in recurrencias" :key="r.id" class="card p-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-900 capitalize">Cada {{ unidadTexto(r.intervalo) }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              Desde {{ formatoFecha(r.fecha_inicio) }}<span v-if="r.fecha_fin"> hasta {{ formatoFecha(r.fecha_fin) }}</span>
            </p>
          </div>
          <button @click="eliminar(r)" class="text-gray-300 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165" /></svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import SelectorRecurrencia from '@/components/recurrencias/SelectorRecurrencia.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'
import { listarRecurrencias, crearRecurrencia, eliminarRecurrencia } from '@/api/recurrencias'

const recurrencias = ref([])
const cargando = ref(true)
const nueva = ref(null)

const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')
const unidadTexto = (intervalo) => ({ diario: 'día', semanal: 'semana', mensual: 'mes', anual: 'año' }[intervalo] || intervalo)

const cargar = async () => {
  cargando.value = true
  try { const { data } = await listarRecurrencias(); recurrencias.value = data.data || [] }
  catch (e) { recurrencias.value = [] } finally { cargando.value = false }
}
onMounted(cargar)

const crear = async () => {
  if (!nueva.value) return
  try { await crearRecurrencia(nueva.value); nueva.value = null; await cargar() }
  catch (e) { ui.error(e.response?.data?.mensaje || 'No se pudo crear la regla') }
}

const eliminar = async (r) => {
  if (!(await ui.confirmar('¿Eliminar esta regla? Los eventos/tareas que la usan quedarán sin recurrencia.'))) return
  try { await eliminarRecurrencia(r.id); await cargar() } catch (e) { ui.error('Error') }
}
</script>
