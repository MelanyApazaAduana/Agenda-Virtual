<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <h2 class="text-xl font-bold text-gray-900">Nuevo presupuesto</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label class="label-campo">Monto total *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
            <input v-model="form.monto_total" type="number" step="0.01" min="0" class="input-base pl-12" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label class="label-campo">Límite personalizado (opcional)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
            <input v-model="form.limite_personalizado" type="number" step="0.01" min="0" class="input-base pl-12" placeholder="0.00" />
          </div>
          <p class="text-[11px] text-gray-400 mt-1">El nuevo presupuesto pasa a ser el vigente desde hoy.</p>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
        <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
        <button @click="guardar" class="btn-primario">Crear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['cerrar', 'guardar'])
const form = ref({ monto_total: null, limite_personalizado: null })

const guardar = () => {
  if (!form.value.monto_total || Number(form.value.monto_total) <= 0) { alert('El monto total debe ser mayor a 0'); return }
  emit('guardar', {
    monto_total: Number(form.value.monto_total),
    limite_personalizado: form.value.limite_personalizado ? Number(form.value.limite_personalizado) : null
  })
}
</script>
