<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="$emit('cerrar')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col transform transition-all max-h-[92vh]">

      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="text-white p-1.5 rounded-lg shadow-sm" :style="{ backgroundColor: formulario.color_hex || '#F59E0B' }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h2 class="text-[18px] font-bold text-gray-900">{{ esEdicion ? 'Editar Nota' : 'Nueva Nota' }}</h2>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto">
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Título de la nota</label>
          <input v-model="formulario.titulo" type="text" placeholder="Ingresa un título descriptivo..."
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-800 placeholder-gray-300" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Color</label>
          <SelectorColor v-model="formulario.color_hex" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Contenido</label>
          <textarea v-model="formulario.contenido" rows="6" placeholder="Empieza a escribir tus ideas aquí..."
            class="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm text-gray-800 placeholder-gray-300 resize-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition"></textarea>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
        <button v-if="esEdicion" @click="$emit('eliminar', valores.id)"
          class="text-sm font-bold text-red-600 hover:text-red-700 transition">
          Eliminar
        </button>
        <div class="flex items-center gap-4 ml-auto">
          <button @click="$emit('cerrar')" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button @click="guardar"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10">
            {{ esEdicion ? 'Guardar cambios' : 'Guardar nota' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SelectorColor from '@/components/ui/SelectorColor.vue'

const props = defineProps({
  modo: { type: String, default: 'crear' },
  valores: { type: Object, default: null }
})
const emit = defineEmits(['cerrar', 'guardar', 'eliminar'])

const esEdicion = computed(() => props.modo === 'editar' && props.valores)

const formulario = ref({
  titulo: '',
  contenido: '',
  color_hex: '#F59E0B'
})

onMounted(() => {
  if (esEdicion.value) {
    const v = props.valores
    formulario.value.titulo = v.titulo || ''
    formulario.value.contenido = v.contenido || ''
    formulario.value.color_hex = v.color_hex || '#F59E0B'
  }
})

const guardar = () => {
  if (!formulario.value.titulo.trim()) {
    alert('El título de la nota es obligatorio')
    return
  }
  emit('guardar', {
    titulo: formulario.value.titulo.trim(),
    contenido: formulario.value.contenido || null,
    color_hex: formulario.value.color_hex
  })
}
</script>
