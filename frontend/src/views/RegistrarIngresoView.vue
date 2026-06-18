<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">

      <div class="px-6 pt-6 pb-2">
        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Registrar Ingreso</h2>
        <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Controla tus finanzas con precisión</p>
      </div>

      <form @submit.prevent="guardarIngreso" class="p-6 space-y-5">

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
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fuente</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </span>
            <input v-model="formulario.fuente" type="text" placeholder="Salario, Freelance, Venta..."
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
          <div class="relative">
            <select v-model="formulario.categoria"
              class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
              <option value="">Seleccionar...</option>
              <option value="salario">Salario</option>
              <option value="freelance">Freelance</option>
              <option value="inversion">Inversión</option>
              <option value="venta">Venta</option>
              <option value="otros">Otros</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Detalle</label>
          <textarea v-model="formulario.detalle" rows="3" placeholder="Descripción opcional del ingreso..."
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400 resize-none"></textarea>
        </div>

        <div class="pt-4 border-t border-gray-200 flex justify-end items-center gap-6">
          <button type="button" @click="cancelar"
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 active:scale-[0.99]">
            Guardar Ingreso
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hoy = new Date().toISOString().split('T')[0]

const formulario = ref({
  monto: null,
  fecha: hoy,
  fuente: '',
  categoria: '',
  detalle: ''
})

const guardarIngreso = () => {
  if (!formulario.value.monto || Number(formulario.value.monto) <= 0) {
    alert('El monto es requerido y debe ser mayor a 0')
    return
  }
  console.log('--- INGRESO REGISTRADO ---')
  console.log('Monto:', formulario.value.monto)
  console.log('Fecha:', formulario.value.fecha)
  console.log('Fuente:', formulario.value.fuente)
  console.log('Categoría:', formulario.value.categoria)
  console.log('Detalle:', formulario.value.detalle)
  router.push('/calendario')
}

const cancelar = () => {
  router.push('/calendario')
}
</script>
