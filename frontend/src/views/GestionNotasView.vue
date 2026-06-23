<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Notas</h1>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Todas las Notas</h2>
        <p class="text-sm text-gray-500 mt-1">Captura ideas, organiza tu conocimiento.</p>
      </div>
      <div class="relative w-full max-w-xs">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </span>
        <input v-model="busqueda" type="text" placeholder="Buscar notas..." class="w-full bg-gray-100/80 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition placeholder-gray-400" />
      </div>
    </div>

    <div v-if="cargando" class="text-center py-16 text-gray-400 text-sm">Cargando...</div>

    <div v-else-if="notasFiltradas.length === 0" class="text-center py-16 text-gray-400">
      <p class="text-sm">No hay notas todavía. Crea la primera con el botón +.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="nota in notasFiltradas" :key="nota.id"
        @click="editarNota(nota)"
        class="border rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
        :style="{ backgroundColor: (nota.color_hex || '#F59E0B') + '14', borderColor: (nota.color_hex || '#F59E0B') + '40' }">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: nota.color_hex || '#F59E0B' }"></span>
          <h3 class="font-bold text-gray-900 truncate">{{ nota.titulo }}</h3>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-wrap">{{ nota.contenido }}</p>
        <div class="flex items-center justify-between mt-4">
          <p class="text-xs text-gray-400">{{ formatoFecha(nota.fecha_modificacion) }}</p>
          <span v-if="nota.evento_titulo || nota.tarea_titulo" class="text-[10px] text-gray-500 bg-white/60 px-2 py-0.5 rounded-full truncate max-w-[120px]">
            {{ nota.evento_titulo || nota.tarea_titulo }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <ModalCrearNota v-if="modal.tipo" :modo="modal.modo" :valores="modal.valores"
    @cerrar="cerrarModal" @guardar="guardarNota" @eliminar="eliminarNotaItem" />

  <AppFab tipo="nota" @crear="abrirCrear" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import AppFab from '@/components/ui/AppFab.vue'
import ModalCrearNota from '@/components/notas/ModalCrearNota.vue'
import { listarNotas, crearNota, actualizarNota, eliminarNota } from '@/api/notas.js'

const cargando = ref(true)
const busqueda = ref('')
const notas = ref([])
const modal = ref({ tipo: null, modo: 'crear', valores: null })

const cargarNotas = async () => {
  cargando.value = true
  try {
    const { data } = await listarNotas()
    notas.value = data.data || []
  } catch (error) {
    console.error('Error al cargar notas:', error)
    notas.value = []
  } finally {
    cargando.value = false
  }
}
onMounted(cargarNotas)

const notasFiltradas = computed(() => {
  if (!busqueda.value) return notas.value
  const q = busqueda.value.toLowerCase()
  return notas.value.filter(n => n.titulo?.toLowerCase().includes(q) || n.contenido?.toLowerCase().includes(q))
})

const formatoFecha = (fecha) => (fecha ? dayjs(fecha).format('DD/MM/YYYY HH:mm') : '')

const abrirCrear = () => { modal.value = { tipo: 'nota', modo: 'crear', valores: null } }
const editarNota = (nota) => { modal.value = { tipo: 'nota', modo: 'editar', valores: nota } }
const cerrarModal = () => { modal.value = { tipo: null, modo: 'crear', valores: null } }

const guardarNota = async (payload) => {
  try {
    if (modal.value.modo === 'editar') {
      await actualizarNota(modal.value.valores.id, payload)
    } else {
      await crearNota(payload)
    }
    cerrarModal(); await cargarNotas()
  } catch (error) {
    alert(error.response?.data?.message || 'Error al guardar la nota')
  }
}

const eliminarNotaItem = async (id) => {
  if (!confirm('¿Eliminar esta nota?')) return
  try { await eliminarNota(id); cerrarModal(); await cargarNotas() }
  catch (e) { alert('No se pudo eliminar la nota') }
}
</script>
