<template>
  <div class="min-h-full bg-slate-50 flex items-center justify-center p-6 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">

      <div class="px-6 pt-6 pb-2">
        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Registrar Gasto</h2>
        <p class="text-xs text-gray-500 mt-1 tracking-wide">Lleva el control de tus egresos</p>
      </div>

      <form @submit.prevent="guardarGasto" class="p-6 space-y-5">
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
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Método de pago</label>
          <select v-model="formulario.metodo_pago"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
            <option value="">Seleccionar...</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta_debito">Tarjeta Débito</option>
            <option value="tarjeta_credito">Tarjeta Crédito</option>
            <option value="transferencia">Transferencia</option>
            <option value="qr">QR</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tarea asociada (opcional)</label>
          <select v-model="formulario.tarea_id"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
            <option :value="null">Ninguna</option>
            <option v-for="t in tareas" :key="t.id" :value="t.id">{{ t.titulo }}</option>
          </select>
        </div>

        <p class="text-[11px] text-gray-400">Se vincula automáticamente a tu presupuesto.</p>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{{ error }}</div>

        <div class="pt-4 border-t border-gray-200 flex justify-end items-center gap-6">
          <button type="button" @click="cancelar" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button type="submit" :disabled="enviando"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 disabled:opacity-50">
            {{ enviando ? 'Guardando...' : 'Guardar gasto' }}
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
import { crearGasto } from '@/api/gastos.js'
import { listarTareas } from '@/api/tareas.js'

const router = useRouter()
const enviando = ref(false)
const error = ref('')
const tareas = ref([])

const formulario = ref({
  monto: null,
  fecha: dayjs().format('YYYY-MM-DD'),
  metodo_pago: '',
  tarea_id: null
})

onMounted(async () => {
  try {
    const rt = await listarTareas()
    tareas.value = rt.data.data || []
  } catch (e) {
    console.error('Error al cargar datos:', e)
  }
})

const guardarGasto = async () => {
  error.value = ''
  if (!formulario.value.monto || Number(formulario.value.monto) <= 0) {
    error.value = 'El monto es requerido y debe ser mayor a 0'
    return
  }
  enviando.value = true
  try {
    await crearGasto({
      monto: Number(formulario.value.monto),
      fecha: formulario.value.fecha,
      metodo_pago: formulario.value.metodo_pago || null,
      tarea_id: formulario.value.tarea_id || null
    })
    router.push('/gastos')
  } catch (e) {
    error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al registrar el gasto'
  } finally {
    enviando.value = false
  }
}

const cancelar = () => router.push('/gastos')
</script>
