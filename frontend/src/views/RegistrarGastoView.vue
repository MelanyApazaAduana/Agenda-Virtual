<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">

      <div class="px-6 pt-6 pb-2">
        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Registrar Gasto</h2>
        <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Lleva el control de tus egresos</p>
      </div>

      <form @submit.prevent="guardarGasto" class="p-6 space-y-5">

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Monto *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium text-sm">$</span>
            <input v-model="formulario.monto" type="number" step="0.01" min="0" placeholder="0.00" required
              class="w-full pl-8 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </span>
            <input v-model="formulario.fecha" type="date" required
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
          <div class="relative">
            <select v-model="formulario.categoria_id"
              class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
              <option :value="null">Sin categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Método de Pago</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </span>
            <select v-model="formulario.metodoPago"
              class="w-full pl-9 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
              <option value="">Seleccionar...</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta_debito">Tarjeta Débito</option>
              <option value="tarjeta_credito">Tarjeta Crédito</option>
              <option value="transferencia">Transferencia</option>
              <option value="paypal">PayPal</option>
              <option value="otros">Otros</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {{ error }}
        </div>

        <div class="pt-4 border-t border-gray-200 flex justify-end items-center gap-6">
          <button type="button" @click="cancelar"
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">
            Cancelar
          </button>
          <button type="submit" :disabled="enviando"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ enviando ? 'Guardando...' : 'Guardar Gasto' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { crearGasto } from '@/api/gastos.js'
import { listarCategoriasPorTipo, crearCategoriasPredeterminadas } from '@/api/categorias.js'

const router = useRouter()

const enviando = ref(false)
const error = ref('')
const categorias = ref([])

const hoy = new Date().toISOString().split('T')[0]

const formulario = ref({
  monto: null,
  fecha: hoy,
  categoria_id: null,
  metodoPago: ''
})

const cargarCategorias = async () => {
  try {
    let respuesta = await listarCategoriasPorTipo('gasto')
    let lista = respuesta.data.data || []

    // Si el usuario aún no tiene categorías, sembramos las predeterminadas
    if (lista.length === 0) {
      try {
        await crearCategoriasPredeterminadas()
        respuesta = await listarCategoriasPorTipo('gasto')
        lista = respuesta.data.data || []
      } catch (e) {
        // Si ya existían (u otro error), continuamos con lo que haya
      }
    }
    categorias.value = lista
  } catch (e) {
    console.error('Error al cargar categorías:', e)
    categorias.value = []
  }
}

onMounted(cargarCategorias)

const guardarGasto = async () => {
  error.value = ''
  if (!formulario.value.monto || Number(formulario.value.monto) <= 0) {
    error.value = 'El monto es requerido y debe ser mayor a 0'
    return
  }

  enviando.value = true
  try {
    await crearGasto({
      // Gasto general (no asociado a un evento/tarea)
      tipo_entidad: 'general',
      entidad_id: null,
      monto: Number(formulario.value.monto),
      fecha: formulario.value.fecha,
      categoria_id: formulario.value.categoria_id || null,
      metodo_pago: formulario.value.metodoPago || null
    })
    router.push('/gastos')
  } catch (e) {
    error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al registrar el gasto'
  } finally {
    enviando.value = false
  }
}

const cancelar = () => {
  router.push('/calendario')
}
</script>
