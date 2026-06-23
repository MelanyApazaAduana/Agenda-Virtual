<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Mi presupuesto</h1>
          <p class="text-sm text-gray-500 mt-1">Tu presupuesto único. Cada ingreso y gasto se liga a él automáticamente.</p>
        </div>

        <Spinner v-if="cargando" />
        <template v-else>
          <div class="card p-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Uso del mes</h3>
            <div class="flex items-end justify-between mb-2">
              <div>
                <p class="text-xs text-gray-500">Gastado este mes</p>
                <p class="text-2xl font-bold text-gray-900">Bs. {{ formato(finanzas.gastadoMes) }}</p>
              </div>
              <p class="text-sm text-gray-500">de Bs. {{ formato(montoTotal) }}</p>
            </div>
            <BarraProgreso :valor="finanzas.gastadoMes" :total="montoTotal"
              :etiqueta="`${usoPct}% utilizado · Restante Bs. ${formato(Math.max(montoTotal - finanzas.gastadoMes, 0))}`" />
          </div>

          <div class="card p-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Editar presupuesto</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-campo">Monto total</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
                  <input v-model="form.monto_total" type="number" step="0.01" min="0" class="input-base pl-12" />
                </div>
              </div>
              <div>
                <label class="label-campo">Límite personalizado (opcional)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
                  <input v-model="form.limite_personalizado" type="number" step="0.01" min="0" class="input-base pl-12" />
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button @click="guardar" class="btn-primario">Guardar cambios</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Spinner from '@/components/ui/Spinner.vue'
import BarraProgreso from '@/components/ui/BarraProgreso.vue'
import { useFinanzasStore } from '@/stores/finanzasStore'
import { useUiStore } from '@/stores/uiStore'
import { obtenerMiPresupuesto, establecerMiPresupuesto } from '@/api/presupuestos'

const finanzas = useFinanzasStore()
const ui = useUiStore()
const cargando = ref(true)
const form = ref({ monto_total: null, limite_personalizado: null })

const montoTotal = computed(() => Number(finanzas.presupuesto?.monto_total || 0))
const usoPct = computed(() => (montoTotal.value ? Math.round((finanzas.gastadoMes / montoTotal.value) * 100) : 0))
const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const cargar = async () => {
  cargando.value = true
  try {
    const { data } = await obtenerMiPresupuesto()
    form.value.monto_total = Number(data.data?.monto_total) || null
    form.value.limite_personalizado = data.data?.limite_personalizado || null
  } catch (e) { /* ignora */ }
  await finanzas.cargar()
  cargando.value = false
}
onMounted(cargar)

const guardar = async () => {
  if (!form.value.monto_total || Number(form.value.monto_total) <= 0) { ui.error('El monto total debe ser mayor a 0'); return }
  try {
    await establecerMiPresupuesto({
      monto_total: Number(form.value.monto_total),
      limite_personalizado: form.value.limite_personalizado ? Number(form.value.limite_personalizado) : null
    })
    await finanzas.cargar()
    ui.exito('Presupuesto actualizado')
  } catch (e) {
    ui.error(e.response?.data?.mensaje || 'No se pudo actualizar el presupuesto')
  }
}
</script>
