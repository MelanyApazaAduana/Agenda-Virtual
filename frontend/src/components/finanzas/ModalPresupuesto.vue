<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="cerrable && $emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ titulo }}</h2>
          <p v-if="!cerrable" class="text-xs text-gray-500 mt-1">Define tu presupuesto para empezar a controlar tus finanzas.</p>
        </div>
        <button v-if="cerrable" @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label class="label-campo">Monto total *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
            <input v-model="form.monto_total" type="number" step="0.01" min="0" class="input-base pl-12" placeholder="0.00" autofocus />
          </div>
        </div>
        <div>
          <label class="label-campo">Límite personalizado (opcional)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Bs.</span>
            <input v-model="form.limite_personalizado" type="number" step="0.01" min="0" class="input-base pl-12" placeholder="0.00" />
          </div>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
        <button v-if="cerrable" @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
        <button @click="guardar" class="btn-primario">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps({
  valores: { type: Object, default: null },
  cerrable: { type: Boolean, default: true }
})
const emit = defineEmits(['cerrar', 'guardar'])
const ui = useUiStore()

const titulo = computed(() => (props.cerrable ? 'Editar presupuesto' : 'Bienvenido 👋'))
const form = ref({ monto_total: null, limite_personalizado: null })

onMounted(() => {
  if (props.valores) {
    form.value.monto_total = Number(props.valores.monto_total) > 0 ? props.valores.monto_total : null
    form.value.limite_personalizado = props.valores.limite_personalizado || null
  }
})

const guardar = () => {
  if (!form.value.monto_total || Number(form.value.monto_total) <= 0) { ui.error('El monto total debe ser mayor a 0'); return }
  emit('guardar', {
    monto_total: Number(form.value.monto_total),
    limite_personalizado: form.value.limite_personalizado ? Number(form.value.limite_personalizado) : null
  })
}
</script>
