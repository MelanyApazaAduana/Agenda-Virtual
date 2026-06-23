<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Recordatorios</h1>
    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" v-model="soloPendientes" @change="cargar" class="rounded accent-black w-4 h-4" />
        Solo pendientes
      </label>
      <button @click="limpiarViejos" class="text-xs font-semibold text-gray-500 hover:text-gray-800 transition">Limpiar viejos</button>
    </div>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Recordatorios</h2>
        <p class="text-sm text-gray-500 mt-1">Tus alertas programadas para eventos y tareas.</p>
      </div>
    </div>

    <Spinner v-if="cargando" />
    <EstadoVacio v-else-if="recordatorios.length === 0" mensaje="No tienes recordatorios" />
    <div v-else class="space-y-3 max-w-3xl">
      <div v-for="r in recordatorios" :key="r.id" class="card p-4 flex items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <ChipEstado :estado="r.estado" tipo="recordatorio" />
            <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{{ r.entidad_tipo }}</span>
          </div>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ r.entidad_titulo || 'Sin título' }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ formatoFecha(r.fecha_envio) }}<span v-if="r.mensaje"> · {{ r.mensaje }}</span></p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button v-if="r.estado === 'programado' || r.estado === 'pospuesto'" @click="marcar(r)" title="Marcar leído"
            class="p-2 text-gray-400 hover:text-emerald-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </button>
          <button v-if="r.estado !== 'cancelado'" @click="posponer(r)" title="Posponer"
            class="p-2 text-gray-400 hover:text-amber-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </button>
          <button v-if="r.estado !== 'cancelado'" @click="cancelar(r)" title="Cancelar"
            class="p-2 text-gray-400 hover:text-red-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <button @click="eliminar(r)" title="Eliminar" class="p-2 text-gray-300 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <button @click="mostrarModal = true" class="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
  </button>

  <ModalRecordatorio v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardar" />
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import ChipEstado from '@/components/ui/ChipEstado.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'
import ModalRecordatorio from '@/components/recordatorios/ModalRecordatorio.vue'
import {
  listarRecordatorios, crearRecordatorio, marcarRecordatorioLeido,
  posponerRecordatorio, cancelarRecordatorio, eliminarRecordatorio
} from '@/api/recordatorios'
import api from '@/api/axios'

const recordatorios = ref([])
const cargando = ref(true)
const soloPendientes = ref(false)
const mostrarModal = ref(false)

const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY HH:mm') : '')

const cargar = async () => {
  cargando.value = true
  try {
    const filtros = soloPendientes.value ? { solo_pendientes: 'true' } : {}
    const { data } = await listarRecordatorios(filtros)
    recordatorios.value = data.data || []
  } catch (e) {
    recordatorios.value = []
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)

const guardar = async (payload) => {
  try { await crearRecordatorio(payload); mostrarModal.value = false; await cargar() }
  catch (e) { ui.error(e.response?.data?.mensaje || e.response?.data?.message || 'No se pudo crear el recordatorio') }
}

const marcar = async (r) => { try { await marcarRecordatorioLeido(r.id); await cargar() } catch (e) { ui.error('Error') } }
const cancelar = async (r) => { try { await cancelarRecordatorio(r.id); await cargar() } catch (e) { ui.error('Error') } }

const posponer = async (r) => {
  const valor = prompt('Nueva fecha y hora (YYYY-MM-DD HH:mm):', dayjs(r.fecha_envio).add(1, 'day').format('YYYY-MM-DD HH:mm'))
  if (!valor) return
  if (dayjs(valor).isBefore(dayjs())) { ui.error('Debe ser una fecha futura'); return }
  try { await posponerRecordatorio(r.id, dayjs(valor).format('YYYY-MM-DD HH:mm:ss')); await cargar() }
  catch (e) { ui.error(e.response?.data?.mensaje || 'No se pudo posponer') }
}

const eliminar = async (r) => {
  if (!(await ui.confirmar('¿Eliminar este recordatorio?'))) return
  try { await eliminarRecordatorio(r.id); await cargar() } catch (e) { ui.error('Error') }
}

const limpiarViejos = async () => {
  if (!(await ui.confirmar('¿Eliminar los recordatorios leídos/cancelados de más de 30 días?'))) return
  try { await api.delete('/recordatorios/limpiar/viejos'); await cargar() } catch (e) { ui.error('Error') }
}
</script>
