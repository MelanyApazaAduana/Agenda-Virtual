<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <h2 class="text-xl font-bold text-gray-900">{{ esEdicion ? 'Editar ingreso' : 'Nuevo ingreso' }}</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label class="label-campo">Monto *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
            <input v-model="form.monto" type="number" step="0.01" min="0" class="input-base pl-12" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label class="label-campo">Fecha *</label>
          <input v-model="form.fecha" type="date" class="input-base" />
        </div>
        <div>
          <label class="label-campo">Fuente</label>
          <input v-model="form.fuente" type="text" class="input-base" placeholder="Salario, Freelance, Venta..." />
        </div>
        <div>
          <label class="label-campo">Presupuesto (opcional)</label>
          <select v-model="form.presupuesto_id" class="input-base appearance-none cursor-pointer">
            <option :value="null">Ninguno</option>
            <option v-for="p in presupuestos" :key="p.id" :value="p.id">Bs. {{ formato(p.monto_total) }} · {{ formatoFecha(p.creado_en) }}</option>
          </select>
        </div>
        <div>
          <label class="label-campo">Detalle</label>
          <textarea v-model="form.detalle" rows="2" class="input-base resize-none" placeholder="Descripción opcional..."></textarea>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-4">
        <button v-if="esEdicion" @click="$emit('eliminar', valores.id)" class="text-sm font-bold text-red-600 hover:text-red-700">Eliminar</button>
        <div class="flex gap-4 ml-auto">
          <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
          <button @click="guardar" class="btn-primario">{{ esEdicion ? 'Guardar' : 'Registrar' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { listarPresupuestos } from '@/api/presupuestos'

const props = defineProps({
  modo: { type: String, default: 'crear' },
  valores: { type: Object, default: null }
})
const emit = defineEmits(['cerrar', 'guardar', 'eliminar'])

const esEdicion = computed(() => props.modo === 'editar' && props.valores)
const presupuestos = ref([])

const form = ref({
  monto: null,
  fecha: dayjs().format('YYYY-MM-DD'),
  fuente: '',
  detalle: '',
  presupuesto_id: null
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

onMounted(async () => {
  try { const { data } = await listarPresupuestos(); presupuestos.value = data.data || [] } catch (e) { /* ignora */ }
  if (esEdicion.value) {
    const v = props.valores
    form.value = {
      monto: v.monto,
      fecha: v.fecha ? dayjs(v.fecha).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      fuente: v.fuente || '',
      detalle: v.detalle || '',
      presupuesto_id: v.presupuesto_id || null
    }
  }
})

const guardar = () => {
  if (!form.value.monto || Number(form.value.monto) <= 0) { alert('El monto debe ser mayor a 0'); return }
  emit('guardar', {
    monto: Number(form.value.monto),
    fecha: form.value.fecha,
    fuente: form.value.fuente || null,
    detalle: form.value.detalle || null,
    presupuesto_id: form.value.presupuesto_id || null
  })
}
</script>
