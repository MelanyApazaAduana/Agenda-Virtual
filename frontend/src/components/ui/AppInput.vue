<template>
  <div>
    <label
      v-if="label"
      :for="idUnico"
      class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2"
    >
      {{ label }}<span v-if="requerido" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <span
        v-if="$slots.icono"
        class="absolute left-3 text-gray-400 pointer-events-none"
      >
        <slot name="icono" />
      </span>

      <input
        v-if="tipo !== 'textarea'"
        :id="idUnico"
        :type="tipo"
        :value="modelValue"
        :placeholder="placeholder"
        :required="requerido"
        :disabled="desactivado"
        :class="[
          'w-full bg-gray-50/50 border rounded-lg outline-none transition text-sm placeholder-gray-400',
          $slots.icono ? 'pl-9' : 'pl-4',
          'pr-4 py-2.5',
          error
            ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500 text-red-800'
            : 'border-gray-200 focus:bg-white focus:ring-1 focus:ring-black focus:border-black text-gray-800'
        ]"
        @input="actualizar"
        @blur="$emit('blur', $event)"
      />

      <textarea
        v-else
        :id="idUnico"
        :value="modelValue"
        :placeholder="placeholder"
        :required="requerido"
        :disabled="desactivado"
        rows="3"
        :class="[
          'w-full bg-gray-50/50 border rounded-lg outline-none transition text-sm placeholder-gray-400 resize-none px-4 py-2.5',
          error
            ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500 text-red-800'
            : 'border-gray-200 focus:bg-white focus:ring-1 focus:ring-black focus:border-black text-gray-800'
        ]"
        @input="actualizar"
        @blur="$emit('blur', $event)"
      />
    </div>

    <p v-if="error" class="mt-1.5 text-xs font-medium text-red-500">{{ error }}</p>
    <p v-else-if="ayuda" class="mt-1.5 text-xs text-gray-400">{{ ayuda }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  tipo: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  requerido: { type: Boolean, default: false },
  desactivado: { type: Boolean, default: false },
  error: { type: String, default: '' },
  ayuda: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const idUnico = computed(() => `input_${Math.random().toString(36).slice(2, 9)}`)

const actualizar = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>
