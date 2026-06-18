<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans"
      @click.self="cerrar"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all"
      >
        <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 v-if="titulo" class="text-[22px] font-bold text-gray-900 leading-tight">{{ titulo }}</h2>
            <p v-if="subtitulo" class="text-xs text-gray-500 font-mono mt-1 tracking-wide">{{ subtitulo }}</p>
            <slot v-else name="header" />
          </div>
          <button
            @click="cerrar"
            class="text-gray-500 hover:text-gray-800 transition mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-gray-200 bg-gray-50/30 flex justify-end items-center gap-6"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  titulo: { type: String, default: '' },
  subtitulo: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const cerrar = () => {
  emit('update:modelValue', false)
}
</script>
