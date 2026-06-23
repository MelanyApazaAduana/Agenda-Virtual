<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">

      <div class="px-6 pt-6 pb-2">
        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Registrar Ingreso</h2>
        <p class="text-xs text-gray-500 mt-1 tracking-wide">Controla tus finanzas con precisión</p>
      </div>

      <form @submit.prevent="guardarIngreso" class="p-6 space-y-5">
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Monto *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium text-sm">Bs.</span>
            <input v-model="formulario.monto" type="number" step="0.01" min="0" placeholder="0.00" required
              class="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha *</label>
          <input v-model="formulario.fecha" type="date" required
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fuente</label>
          <input v-model="formulario.fuente" type="text" placeholder="Salario, Freelance, Venta..."
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Presupuesto (opcional)</label>
          <select v-model="formulario.presupuesto_id"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
            <option :value="null">Ninguno</option>
            <option v-for="p in presupuestos" :key="p.id" :value="p.id">
              Bs. {{ formato(p.monto_total) }} · {{ formatoFecha(p.creado_en) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Detalle</label>
          <textarea v-model="formulario.detalle" rows="3" placeholder="Descripción opcional del ingreso..."
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 resize-none"></textarea>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{{ error }}</div>

        <div class="pt-4 border-t border-gray-200 flex justify-end items-center gap-6">
          <button type="button" @click="cancelar" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button type="submit" :disabled="enviando"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 disabled:opacity-50">
            {{ enviando ? 'Guardando...' : 'Guardar ingreso' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { crearIngreso } from '@/api/ingresos.js'
import { listarPresupuestos } from '@/api/presupuestos.js'

const router = useRouter()
const enviando = ref(false)
const error = ref('')
const presupuestos = ref([])

const formulario = ref({
  monto: null,
  fecha: dayjs().format('YYYY-MM-DD'),
  fuente: '',
  detalle: '',
  presupuesto_id: null
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

onMounted(async () => {
  try {
    const { data } = await listarPresupuestos()
    presupuestos.value = data.data || []
  } catch (e) {
    console.error('Error al cargar presupuestos:', e)
  }
})

const guardarIngreso = async () => {
  error.value = ''
  if (!formulario.value.monto || Number(formulario.value.monto) <= 0) {
    error.value = 'El monto es requerido y debe ser mayor a 0'
    return
  }
  enviando.value = true
  try {
    await crearIngreso({
      monto: Number(formulario.value.monto),
      fecha: formulario.value.fecha,
      fuente: formulario.value.fuente || null,
      detalle: formulario.value.detalle || null,
      presupuesto_id: formulario.value.presupuesto_id || null
    })
    router.push('/ingresos/reportes')
  } catch (e) {
    error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al registrar el ingreso'
  } finally {
    enviando.value = false
  }
}

const cancelar = () => router.push('/calendario')
</script>
