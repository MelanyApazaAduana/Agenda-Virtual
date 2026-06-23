<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-5xl mx-auto space-y-6">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gastos</h1>
            <p class="text-sm text-gray-500 mt-1">Historial de tus egresos registrados</p>
          </div>
          <button @click="abrirCrear" class="btn-primario inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Registrar gasto
          </button>
        </div>

        <div class="card p-5 flex items-center justify-between">
          <span class="label-campo mb-0">Total registrado</span>
          <span class="text-2xl font-bold text-red-600">Bs. {{ formato(totalGastos) }}</span>
        </div>

        <div class="card overflow-hidden">
          <Spinner v-if="cargando" />
          <EstadoVacio v-else-if="gastos.length === 0" mensaje="Aún no has registrado gastos" />
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <tr>
                <th class="text-left px-5 py-3">Fecha</th>
                <th class="text-left px-5 py-3">Tarea</th>
                <th class="text-left px-5 py-3">Método de pago</th>
                <th class="text-right px-5 py-3">Monto</th>
                <th class="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="gasto in gastos" :key="gasto.id" class="hover:bg-gray-50/70 cursor-pointer" @click="editar(gasto)">
                <td class="px-5 py-3 text-gray-700">{{ formatoFecha(gasto.fecha) }}</td>
                <td class="px-5 py-3 text-gray-600">{{ gasto.tarea_titulo || '—' }}</td>
                <td class="px-5 py-3 text-gray-500">{{ etiquetaMetodo(gasto.metodo_pago) }}</td>
                <td class="px-5 py-3 text-right font-bold text-gray-900">Bs. {{ formato(gasto.monto) }}</td>
                <td class="px-5 py-3 text-right">
                  <button @click.stop="borrar(gasto)" class="text-gray-300 hover:text-red-500 transition" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ModalGasto v-if="modal.abierto" :modo="modal.modo" :valores="modal.valores"
      @cerrar="cerrar" @guardar="guardar" @eliminar="eliminarItem" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'
import ModalGasto from '@/components/finanzas/ModalGasto.vue'
import { listarGastos, crearGasto, actualizarGasto, eliminarGasto } from '@/api/gastos.js'

const cargando = ref(true)
const gastos = ref([])
const modal = ref({ abierto: false, modo: 'crear', valores: null })

const totalGastos = computed(() => gastos.value.reduce((s, g) => s + Number(g.monto || 0), 0))
const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

const etiquetaMetodo = (m) => {
  if (!m) return '—'
  const mapa = { efectivo: 'Efectivo', tarjeta_debito: 'Tarjeta Débito', tarjeta_credito: 'Tarjeta Crédito', transferencia: 'Transferencia', qr: 'QR', otros: 'Otros' }
  return mapa[m] || m
}

const cargar = async () => {
  cargando.value = true
  try { const { data } = await listarGastos(); gastos.value = data.data || [] }
  catch (e) { gastos.value = [] } finally { cargando.value = false }
}
onMounted(cargar)

const abrirCrear = () => { modal.value = { abierto: true, modo: 'crear', valores: null } }
const editar = (g) => { modal.value = { abierto: true, modo: 'editar', valores: g } }
const cerrar = () => { modal.value = { abierto: false, modo: 'crear', valores: null } }

const guardar = async (payload) => {
  try {
    if (modal.value.modo === 'editar') await actualizarGasto(modal.value.valores.id, payload)
    else await crearGasto(payload)
    cerrar(); await cargar()
  } catch (e) { alert(e.response?.data?.mensaje || 'No se pudo guardar el gasto') }
}

const eliminarItem = async (id) => {
  if (!confirm('¿Eliminar este gasto?')) return
  try { await eliminarGasto(id); cerrar(); await cargar() } catch (e) { alert('Error') }
}
const borrar = async (g) => {
  if (!confirm('¿Eliminar este gasto?')) return
  try { await eliminarGasto(g.id); await cargar() } catch (e) { alert('Error') }
}
</script>
