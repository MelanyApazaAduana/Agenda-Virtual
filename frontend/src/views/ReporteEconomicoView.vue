<template>
  <div class="flex flex-col h-full">
    <header class="h-14 bg-white flex items-center justify-between px-8 shrink-0 border-b border-gray-100 no-print">
      <span class="font-bold text-lg tracking-wide text-gray-900">Reporte Económico</span>
      <div class="flex items-center gap-3">
        <label class="text-xs text-gray-500 font-medium">Desde</label>
        <input type="date" v-model="fechaDesde" class="input-base w-auto py-1.5" />
        <label class="text-xs text-gray-500 font-medium">Hasta</label>
        <input type="date" v-model="fechaHasta" class="input-base w-auto py-1.5" />
        <button @click="generar" class="btn-primario text-sm" :disabled="cargando">Generar</button>
        <button @click="imprimir" class="btn-secundario text-sm">Imprimir</button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-6xl mx-auto">
        <Spinner v-if="cargando" />

        <div v-else-if="movimientos.length === 0 && generado" class="card p-12 text-center">
          <p class="text-gray-500 text-lg">No hay movimientos en el rango seleccionado.</p>
        </div>

        <template v-else-if="movimientos.length > 0">
          <div class="reporte-contenido">
            <div class="text-center mb-6 print-only">
              <h2 class="text-xl font-bold text-gray-900">Reporte Económico</h2>
              <p class="text-sm text-gray-500">Del {{ formatoFecha(fechaDesde) }} al {{ formatoFecha(fechaHasta) }}</p>
              <hr class="my-3 border-gray-300" />
            </div>

            <div class="card overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th class="text-left px-5 py-3">Fecha</th>
                    <th class="text-left px-5 py-3">Tipo</th>
                    <th class="text-left px-5 py-3">Descripción</th>
                    <th class="text-right px-5 py-3">Monto Ingreso</th>
                    <th class="text-right px-5 py-3">Monto Salida</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(mov, idx) in movimientos" :key="idx" class="hover:bg-gray-50/70">
                    <td class="px-5 py-3 text-gray-700">{{ formatoFecha(mov.fecha) }}</td>
                    <td class="px-5 py-3">
                      <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        :class="mov.tipo === 'ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        {{ mov.tipo === 'ingreso' ? 'Ingreso' : 'Salida' }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-gray-700">{{ mov.descripcion }}</td>
                    <td class="px-5 py-3 text-right font-bold text-emerald-600">
                      <template v-if="Number(mov.monto_ingreso) > 0">Bs. {{ formato(mov.monto_ingreso) }}</template>
                    </td>
                    <td class="px-5 py-3 text-right font-bold text-red-600">
                      <template v-if="Number(mov.monto_salida) > 0">Bs. {{ formato(mov.monto_salida) }}</template>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-100 text-sm font-bold">
                  <tr>
                    <td colspan="3" class="px-5 py-4 text-gray-800 text-right">Totales</td>
                    <td class="px-5 py-4 text-right text-emerald-700">Bs. {{ formato(totalIngresos) }}</td>
                    <td class="px-5 py-4 text-right text-red-700">Bs. {{ formato(totalSalidas) }}</td>
                  </tr>
                  <tr class="border-t border-gray-300">
                    <td colspan="3" class="px-5 py-4 text-gray-800 text-right">Balance</td>
                    <td colspan="2" class="px-5 py-4 text-right" :class="balance >= 0 ? 'text-gray-900' : 'text-red-700'">
                      Bs. {{ formato(balance) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="text-center text-xs text-gray-400 mt-4 print-only">
              Generado el {{ generadoEn }} · Agenda Virtual
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/Spinner.vue'
import { obtenerMovimientos } from '@/api/reportes.js'

const cargando = ref(false)
const generado = ref(false)
const movimientos = ref([])
const totalIngresos = ref(0)
const totalSalidas = ref(0)
const balance = ref(0)
const generadoEn = ref('')

const ahora = new Date()
const fechaDesde = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const fechaHasta = ref(dayjs().format('YYYY-MM-DD'))

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

const generar = async () => {
  if (!fechaDesde.value || !fechaHasta.value) return
  cargando.value = true
  generado.value = true
  try {
    const { data } = await obtenerMovimientos(fechaDesde.value, fechaHasta.value)
    const d = data.data || {}
    movimientos.value = d.movimientos || []
    totalIngresos.value = Number(d.total_ingresos || 0)
    totalSalidas.value = Number(d.total_salidas || 0)
    balance.value = Number(d.balance || 0)
    generadoEn.value = dayjs().format('DD/MM/YYYY HH:mm')
  } catch (e) {
    movimientos.value = []
    totalIngresos.value = 0
    totalSalidas.value = 0
    balance.value = 0
  }
  cargando.value = false
}

const imprimir = () => window.print()
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  body { background: white; }
  .reporte-contenido { margin: 0; padding: 0; }
}
@media screen {
  .print-only { display: none; }
}
</style>