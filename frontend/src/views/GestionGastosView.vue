<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-5xl mx-auto space-y-6">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gastos</h1>
            <p class="text-sm text-gray-500 mt-1">Historial de tus egresos registrados</p>
          </div>
          <router-link to="/gastos/registrar"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Registrar gasto
          </router-link>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Total registrado</span>
          <span class="text-2xl font-bold text-gray-900">Bs. {{ formato(totalGastos) }}</span>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div v-if="cargando" class="p-8 text-center text-sm text-gray-400">Cargando...</div>

          <div v-else-if="gastos.length === 0" class="p-10 text-center text-gray-400 text-sm">
            Aún no has registrado gastos.
          </div>

          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <tr>
                <th class="text-left px-5 py-3">Fecha</th>
                <th class="text-left px-5 py-3">Categoría</th>
                <th class="text-left px-5 py-3">Método de pago</th>
                <th class="text-right px-5 py-3">Monto</th>
                <th class="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="gasto in gastos" :key="gasto.id" class="hover:bg-gray-50/70">
                <td class="px-5 py-3 text-gray-700">{{ formatoFecha(gasto.fecha) }}</td>
                <td class="px-5 py-3">
                  <span class="inline-flex items-center gap-2 text-gray-700">
                    <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: gasto.categoria_color || '#9CA3AF' }"></span>
                    {{ gasto.categoria_nombre || 'Sin categoría' }}
                  </span>
                </td>
                <td class="px-5 py-3 text-gray-500">{{ etiquetaMetodo(gasto.metodo_pago) }}</td>
                <td class="px-5 py-3 text-right font-bold text-gray-900">Bs. {{ formato(gasto.monto) }}</td>
                <td class="px-5 py-3 text-right">
                  <button @click="borrarGasto(gasto)" class="text-gray-300 hover:text-red-500 transition" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { listarGastos, eliminarGasto } from '@/api/gastos.js'

const cargando = ref(true)
const gastos = ref([])

const totalGastos = computed(() =>
  gastos.value.reduce((suma, g) => suma + Number(g.monto || 0), 0)
)

const formato = (n) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatoFecha = (fecha) => (fecha ? dayjs(fecha).format('DD/MM/YYYY') : '')

const etiquetaMetodo = (metodo) => {
  if (!metodo) return '—'
  const mapa = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta Débito',
    tarjeta_credito: 'Tarjeta Crédito',
    transferencia: 'Transferencia',
    paypal: 'PayPal',
    otros: 'Otros'
  }
  return mapa[metodo] || metodo
}

const cargarGastos = async () => {
  cargando.value = true
  try {
    const respuesta = await listarGastos()
    gastos.value = respuesta.data.data || []
  } catch (error) {
    console.error('Error al cargar gastos:', error)
    gastos.value = []
  } finally {
    cargando.value = false
  }
}

const borrarGasto = async (gasto) => {
  if (!confirm('¿Eliminar este gasto?')) return
  try {
    await eliminarGasto(gasto.id)
    gastos.value = gastos.value.filter((g) => g.id !== gasto.id)
  } catch (error) {
    console.error('Error al eliminar gasto:', error)
  }
}

onMounted(cargarGastos)
</script>
