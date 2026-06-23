<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Cabecera de días -->
    <div class="flex border-b border-gray-200 bg-white sticky top-0 z-20">
      <div class="w-16 shrink-0 border-r border-gray-200"></div>
      <div class="flex-1 grid grid-cols-7">
        <div v-for="dia in dias" :key="dia.iso"
          @click="irADia(dia)"
          class="text-center py-3 border-r border-gray-200 last:border-0 flex flex-col items-center cursor-pointer hover:bg-gray-50">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ dia.nombre }}</span>
          <span class="text-xl mt-1" :class="dia.esHoy ? 'bg-black text-white w-8 h-8 flex items-center justify-center rounded-full' : 'text-gray-700 font-medium'">
            {{ dia.numero }}
          </span>
        </div>
      </div>
    </div>

    <!-- Franja de tareas / notas (sin hora específica) -->
    <div class="flex border-b border-gray-200 bg-gray-50/40 shrink-0">
      <div class="w-16 shrink-0 border-r border-gray-200 text-[10px] text-gray-400 font-medium flex items-center justify-center py-1 text-center">Todo el día</div>
      <div class="flex-1 grid grid-cols-7">
        <div v-for="dia in dias" :key="'ad-' + dia.iso" class="border-r border-gray-200 last:border-0 p-1 space-y-1 min-h-[40px]">
          <div v-for="t in tareasDia(dia.fecha)" :key="'t' + t.id + '-' + t.fecha_limite" @click="editar('tarea', t)"
            class="text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer font-medium"
            :style="{ backgroundColor: (t.color_hex || '#10B981') + '22', color: t.color_hex || '#047857' }">
            ✓ {{ t.titulo }}
          </div>
          <div v-for="n in notasDia(dia.fecha)" :key="'n' + n.id" @click="editar('nota', n)"
            class="text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer font-medium"
            :style="{ backgroundColor: (n.color_hex || '#F59E0B') + '22', color: n.color_hex || '#92400e' }">
            ✎ {{ n.titulo }}
          </div>
        </div>
      </div>
    </div>

    <!-- Rejilla horaria -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex relative">
        <div class="w-16 shrink-0 border-r border-gray-200 bg-gray-50/30">
          <div v-for="h in horas" :key="h" class="border-b border-gray-100 flex justify-center pt-1 text-[11px] text-gray-400 font-medium" :style="{ height: alturaHora + 'px' }">
            {{ formatoHora(h) }}
          </div>
        </div>
        <div class="flex-1 grid grid-cols-7">
          <div v-for="dia in dias" :key="'col-' + dia.iso" class="border-r border-gray-200 last:border-0 relative"
            @dblclick="crearEnDia(dia)">
            <div v-for="h in horas" :key="h" class="border-b border-gray-100" :style="{ height: alturaHora + 'px' }"></div>

            <div v-for="ev in eventosDia(dia.fecha)" :key="ev.id + '-' + ev.fecha_inicio"
              @click="editar('evento', ev)"
              class="absolute left-1 right-1 rounded px-2 py-1 text-[11px] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition border-l-4"
              :style="{ top: ev.top + 'px', height: ev.alto + 'px', backgroundColor: (ev.color_hex || '#3B82F6') + '22', borderLeftColor: ev.color_hex || '#3B82F6' }">
              <p class="font-bold truncate" :style="{ color: ev.color_hex || '#1e3a8a' }">{{ ev.titulo }}</p>
              <p class="text-gray-500 truncate">{{ formatoRango(ev) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFab @crear="(tipo) => abrirCrear(tipo, hoyIso)" />

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
import { useRouter } from 'vue-router'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useAgenda } from '@/composables/useAgenda'
import AppFab from '@/components/ui/AppFab.vue'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import ModalCrearNota from '@/components/notas/ModalCrearNota.vue'

const router = useRouter()
const calStore = useCalendarioStore()
const { foco } = storeToRefs(calStore)

const {
  eventos, tareas, notas, modal,
  cargar, abrirCrear, editar, cerrarModal,
  guardarEvento, guardarTarea, guardarNota,
  eliminarEventoItem, eliminarTareaItem, eliminarNotaItem
} = useAgenda()

const alturaHora = 48
const horas = Array.from({ length: 24 }, (_, i) => i)
const hoyIso = dayjs().format('YYYY-MM-DD')

const nombresDia = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const inicioSemana = computed(() => foco.value.startOf('week'))

const dias = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const fecha = inicioSemana.value.add(i, 'day')
    return {
      fecha, iso: fecha.format('YYYY-MM-DD'),
      nombre: nombresDia[fecha.day()], numero: fecha.date(),
      esHoy: fecha.isSame(dayjs(), 'day')
    }
  })
)

const formatoHora = (h) => dayjs().hour(h).minute(0).format('h A')
const formatoRango = (ev) => `${dayjs(ev.fecha_inicio).format('h:mm A')} - ${dayjs(ev.fecha_fin).format('h:mm A')}`

const mismaFecha = (valor, fecha) => valor && dayjs(valor).isSame(fecha, 'day')

const eventosDia = (fecha) =>
  eventos.value
    .filter((e) => mismaFecha(e.fecha_inicio, fecha))
    .map((e) => {
      const ini = dayjs(e.fecha_inicio)
      const fin = dayjs(e.fecha_fin)
      const top = (ini.hour() + ini.minute() / 60) * alturaHora
      const dur = Math.max(fin.diff(ini, 'minute') / 60, 0.5)
      return { ...e, top, alto: Math.max(dur * alturaHora, 24) }
    })

const tareasDia = (fecha) => tareas.value.filter((t) => mismaFecha(t.fecha_limite, fecha))
const notasDia = (fecha) => notas.value.filter((n) => mismaFecha(n.fecha_creacion, fecha))

const cargarSemana = () => {
  const inicio = inicioSemana.value.format('YYYY-MM-DD')
  const fin = inicioSemana.value.add(6, 'day').format('YYYY-MM-DD')
  cargar(inicio, fin)
}

const irADia = (dia) => {
  calStore.seleccionarFecha(dia.iso)
  calStore.setVista('dia')
  router.push('/diario')
}
const crearEnDia = (dia) => abrirCrear('evento', dia.iso)

onMounted(() => { calStore.setVista('semana'); cargarSemana() })
watch(foco, cargarSemana)
</script>
