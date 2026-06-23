<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Presupuestos</h1>
            <p class="text-sm text-gray-500 mt-1">Define y revisa el histórico de tus presupuestos</p>
          </div>
          <button @click="mostrarModal = true" class="btn-primario">+ Nuevo presupuesto</button>
        </div>

        <!-- Vigente -->
        <div class="card p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Presupuesto vigente</h3>
          <div v-if="finanzas.presupuestoVigente">
            <div class="flex items-end justify-between mb-2">
              <div>
                <p class="text-xs text-gray-500">Gastado este mes</p>
                <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(finanzas.gastadoMes) }}</p>
              </div>
              <p class="text-sm text-gray-500">de Bs. {{ formato(finanzas.presupuestoVigente.monto_total) }}</p>
            </div>
            <BarraProgreso :valor="finanzas.gastadoMes" :total="Number(finanzas.presupuestoVigente.monto_total)"
              :etiqueta="`${usoPct}% utilizado · Restante Bs. ${formato(finanzas.presupuestoVigente.monto_total - finanzas.gastadoMes)}`" />
          </div>
          <p v-else class="text-sm text-gray-400">Todavía no hay un presupuesto definido.</p>
        </div>

        <!-- Historial -->
        <div class="card overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest">Historial</h3></div>
          <Spinner v-if="cargando" />
          <EstadoVacio v-else-if="presupuestos.length === 0" mensaje="Sin presupuestos en el historial" />
          <ul v-else class="divide-y divide-gray-100">
            <li v-for="(p, i) in presupuestos" :key="p.id" class="flex items-center justify-between px-5 py-3">
              <div class="flex items-center gap-3">
                <span class="text-lg font-bold text-gray-900">Bs. {{ formato(p.monto_total) }}</span>
                <span v-if="i === 0" class="chip bg-emerald-100 text-emerald-700">Vigente</span>
                <span v-else class="chip bg-gray-100 text-gray-500">Histórico</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-gray-400">{{ formatoFecha(p.creado_en) }}</span>
                <button @click="eliminar(p)" class="text-gray-300 hover:text-red-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <ModalPresupuesto v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'
import BarraProgreso from '@/components/ui/BarraProgreso.vue'
import ModalPresupuesto from '@/components/finanzas/ModalPresupuesto.vue'
import { useFinanzasStore } from '@/stores/finanzasStore'
import { listarPresupuestos, crearPresupuesto, eliminarPresupuesto } from '@/api/presupuestos'

const finanzas = useFinanzasStore()
const presupuestos = ref([])
const cargando = ref(true)
const mostrarModal = ref(false)

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')
const usoPct = computed(() => {
  const t = Number(finanzas.presupuestoVigente?.monto_total || 0)
  return t ? Math.round((finanzas.gastadoMes / t) * 100) : 0
})

const cargar = async () => {
  cargando.value = true
  try { const { data } = await listarPresupuestos(); presupuestos.value = data.data || [] }
  catch (e) { presupuestos.value = [] } finally { cargando.value = false }
  await finanzas.cargar()
}
onMounted(cargar)

const guardar = async (payload) => {
  try { await crearPresupuesto(payload); mostrarModal.value = false; await cargar() }
  catch (e) { alert(e.response?.data?.mensaje || 'No se pudo crear el presupuesto') }
}

const eliminar = async (p) => {
  if (!confirm('¿Eliminar este presupuesto?')) return
  try { await eliminarPresupuesto(p.id); await cargar() } catch (e) { alert('Error') }
}
</script>
