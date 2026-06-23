<template>
  <div class="h-full flex bg-white">
    <!-- Columna horaria -->
    <main class="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
      <div class="px-6 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <h2 class="text-lg font-bold text-gray-900 capitalize">{{ foco.format('dddd, D [de] MMMM') }}</h2>
        <button @click="abrirCrear('evento', isoFoco)" class="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">+ Evento</button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="flex relative">
          <div class="w-20 shrink-0 border-r border-gray-200 bg-gray-50/30">
            <div v-for="h in horas" :key="h" class="border-b border-gray-100 flex justify-end pr-3 pt-1 text-[11px] text-gray-400 font-medium" :style="{ height: alturaHora + 'px' }">
              {{ formatoHora(h) }}
            </div>
          </div>
          <div class="flex-1 relative" @dblclick="abrirCrear('evento', isoFoco)">
            <div v-for="h in horas" :key="h" class="border-b border-gray-100" :style="{ height: alturaHora + 'px' }"></div>

            <div v-for="ev in eventosDelDia" :key="ev.id + '-' + ev.fecha_inicio"
              @click="editar('evento', ev)"
              class="absolute left-3 right-3 rounded-lg px-3 py-2 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition border-l-4"
              :style="{ top: ev.top + 'px', height: ev.alto + 'px', backgroundColor: (ev.color_hex || '#3B82F6') + '22', borderLeftColor: ev.color_hex || '#3B82F6' }">
              <p class="font-bold text-sm truncate" :style="{ color: ev.color_hex || '#1e3a8a' }">{{ ev.titulo }}</p>
              <p class="text-xs text-gray-500">{{ dayjs(ev.fecha_inicio).format('h:mm A') }} - {{ dayjs(ev.fecha_fin).format('h:mm A') }}</p>
              <p v-if="ev.ubicacion" class="text-xs text-gray-400 truncate mt-0.5">{{ ev.ubicacion }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Panel lateral: tareas y notas del día -->
    <aside class="w-80 bg-gray-50/30 flex flex-col h-full overflow-y-auto hidden xl:flex shrink-0">
      <div class="p-6 space-y-8">
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Tareas del día</h3>
            <button @click="abrirCrear('tarea', isoFoco)" class="text-xs text-teal-600 font-semibold hover:underline">+ Añadir</button>
          </div>
          <div class="space-y-3">
            <div v-for="t in tareasDelDia" :key="t.id" @click="editar('tarea', t)"
              class="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition">
              <span class="w-2.5 h-2.5 rounded-full mt-1 shrink-0" :style="{ backgroundColor: t.color_hex || '#10B981' }"></span>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-700 font-medium truncate" :class="{ 'line-through text-gray-400': t.estado === 'completada' }">{{ t.titulo }}</p>
                <p class="text-xs text-gray-400 capitalize">{{ t.prioridad }} · {{ t.estado.replace('_', ' ') }}</p>
              </div>
            </div>
            <p v-if="tareasDelDia.length === 0" class="text-sm text-gray-400 text-center py-2">Sin tareas</p>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Notas del día</h3>
            <button @click="abrirCrear('nota', isoFoco)" class="text-xs text-teal-600 font-semibold hover:underline">+ Añadir</button>
          </div>
          <div class="space-y-4">
            <div v-for="n in notasDelDia" :key="n.id" @click="editar('nota', n)"
              class="p-4 rounded-xl cursor-pointer hover:opacity-90 transition"
              :style="{ backgroundColor: (n.color_hex || '#F59E0B') + '22' }">
              <h4 class="text-sm font-bold mb-1" :style="{ color: n.color_hex || '#92400e' }">{{ n.titulo }}</h4>
              <p v-if="n.contenido" class="text-xs text-gray-600 leading-relaxed line-clamp-3">{{ n.contenido }}</p>
            </div>
            <p v-if="notasDelDia.length === 0" class="text-sm text-gray-400 text-center py-2">Sin notas</p>
          </div>
        </div>
      </div>
    </aside>

    <AppFab @crear="(tipo) => abrirCrear(tipo, isoFoco)" />

    <ModalCrearEvento v-if="modal.tipo === 'evento'" :modo="modal.modo" :valores="modal.valores" :fecha-predeterminada="modal.fechaPredeterminada"
      @cerrar="cerrarModal" @guardar="guardarEvento" @eliminar="eliminarEventoItem" />
    <ModalCrearTarea v-if="modal.tipo === 'tarea'" :modo="modal.modo" :valores="modal.valores" :fecha-predeterminada="modal.fechaPredeterminada"
      @cerrar="cerrarModal" @guardar="guardarTarea" @eliminar="eliminarTareaItem" />
    <ModalCrearNota v-if="modal.tipo === 'nota'" :modo="modal.modo" :valores="modal.valores"
      @cerrar="cerrarModal" @guardar="guardarNota" @eliminar="eliminarNotaItem" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useAgenda } from '@/composables/useAgenda'
import AppFab from '@/components/ui/AppFab.vue'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import ModalCrearNota from '@/components/notas/ModalCrearNota.vue'

const calStore = useCalendarioStore()
const { foco } = storeToRefs(calStore)

const {
  eventos, tareas, notas, modal,
  cargar, abrirCrear, editar, cerrarModal,
  guardarEvento, guardarTarea, guardarNota,
  eliminarEventoItem, eliminarTareaItem, eliminarNotaItem
} = useAgenda()

const alturaHora = 56
const horas = Array.from({ length: 24 }, (_, i) => i)

const isoFoco = computed(() => foco.value.format('YYYY-MM-DD'))
const formatoHora = (h) => dayjs().hour(h).minute(0).format('h A')

const eventosDelDia = computed(() =>
  eventos.value.map((e) => {
    const ini = dayjs(e.fecha_inicio)
    const fin = dayjs(e.fecha_fin)
    const top = (ini.hour() + ini.minute() / 60) * alturaHora
    const dur = Math.max(fin.diff(ini, 'minute') / 60, 0.5)
    return { ...e, top, alto: Math.max(dur * alturaHora, 28) }
  })
)
const tareasDelDia = computed(() => tareas.value)
const notasDelDia = computed(() => notas.value)

const cargarDia = () => {
  const iso = foco.value.format('YYYY-MM-DD')
  cargar(iso, iso)
}

onMounted(() => { calStore.setVista('dia'); cargarDia() })
watch(foco, cargarDia)
</script>
