<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">

      <div class="px-6 pt-6 pb-2">
        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Asignar Presupuesto</h2>
        <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Planifica tus límites financieros</p>
      </div>

      <form @submit.prevent="guardarPresupuesto" class="p-6 space-y-5">

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Período *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </span>
            <select v-model="formulario.periodoTipo"
              class="w-full pl-9 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha Inicio *</label>
            <input v-model="formulario.fechaInicio" type="date" required
              class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha Fin *</label>
            <input v-model="formulario.fechaFin" type="date" required
              class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Monto Total *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium text-sm">$</span>
            <input v-model="formulario.montoTotal" type="number" step="0.01" min="0" placeholder="0.00" required
              class="w-full pl-8 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Límite Personalizado</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium text-sm">$</span>
            <input v-model="formulario.limitePersonalizado" type="number" step="0.01" min="0" placeholder="Opcional"
              class="w-full pl-8 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 flex justify-end items-center gap-6">
          <button type="button" @click="cancelar"
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 active:scale-[0.99]">
            Guardar Presupuesto
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

const hoy = new Date()
const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0]
const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0]

const formulario = ref({
  periodoTipo: 'mensual',
  fechaInicio: inicioMes,
  fechaFin: finMes,
  montoTotal: null,
  limitePersonalizado: null
})

const guardarPresupuesto = () => {
  if (!formulario.value.montoTotal || Number(formulario.value.montoTotal) <= 0) {
    alert('El monto total es requerido y debe ser mayor a 0')
    return
  }
  if (new Date(formulario.value.fechaFin) <= new Date(formulario.value.fechaInicio)) {
    alert('La fecha fin debe ser posterior a la fecha de inicio')
    return
  }
  console.log('--- PRESUPUESTO ASIGNADO ---')
  console.log('Período:', formulario.value.periodoTipo)
  console.log('Fecha Inicio:', formulario.value.fechaInicio)
  console.log('Fecha Fin:', formulario.value.fechaFin)
  console.log('Monto Total:', formulario.value.montoTotal)
  console.log('Límite Personalizado:', formulario.value.limitePersonalizado || 'Sin límite')
  router.push('/calendario')
}

const cancelar = () => {
  router.push('/calendario')
}
</script>
