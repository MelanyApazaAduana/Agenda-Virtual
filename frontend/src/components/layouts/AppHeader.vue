<template>
  <div class="flex items-center gap-2 shrink-0 text-[13px]">
    <span class="text-[var(--text-4)]">Agenda</span>
    <span class="text-[var(--text-4)]">/</span>
    <span class="text-[var(--text)] font-medium tracking-tight">{{ seccion }}</span>
  </div>

  <div v-if="esCalendario" class="flex-1 flex items-center justify-center gap-1.5">
    <button @click="calStore.irHoy" class="shrink-0 px-2.5 py-1 text-[12px] font-medium text-[var(--text-2)] bg-[var(--surface-2)] border border-[var(--border)] rounded-md hover:bg-[var(--surface-strong)] hover:text-[var(--text)] transition">Hoy</button>
    <button @click="calStore.anterior" class="p-1.5 text-[var(--text-4)] hover:text-[var(--text-2)] rounded-md hover:bg-[var(--surface-hover)] transition">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clip-rule="evenodd" /></svg>
    </button>
    <span class="min-w-[190px] text-center inline-block capitalize text-[13px] font-medium tracking-tight text-[var(--text)]">{{ calStore.titulo }}</span>
    <button @click="calStore.siguiente" class="p-1.5 text-[var(--text-4)] hover:text-[var(--text-2)] rounded-md hover:bg-[var(--surface-hover)] transition">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" /></svg>
    </button>
  </div>

  <div class="flex items-center gap-4 shrink-0">
    <div v-if="esCalendario" class="flex bg-[var(--surface-2)] border border-[var(--border)] p-0.5 rounded-md">
      <button v-for="v in vistas" :key="v.valor" @click="cambiarVista(v.valor)"
        class="px-3 py-1 text-[12px] font-medium rounded-[5px] transition"
        :class="calStore.vista === v.valor ? 'bg-[var(--surface-active)] text-[var(--text)] shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'">
        {{ v.label }}
      </button>
    </div>

    <button @click="tema.alternar()" :title="tema.tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      :aria-label="tema.tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      class="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-3)] border border-transparent hover:text-[var(--text)] hover:bg-[var(--surface-hover)] hover:border-[var(--border)] transition">
      <svg v-if="tema.tema === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    </button>

    <div ref="avatarRef" class="relative">
      <div @click="menuAbierto = !menuAbierto"
        class="w-7 h-7 bg-gradient-to-br from-[#7c8cf8] to-[#5e6ad2] rounded-full cursor-pointer ring-1 ring-[var(--ring-soft)] shadow-sm hover:ring-[var(--ring-strong)] transition"></div>
      <Transition name="dropdown">
        <div v-if="menuAbierto" @click.stop
          class="absolute right-0 top-10 w-44 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-lg py-1 z-50">
          <button @click="emit('irAPerfil'); menuAbierto = false" class="w-full text-left px-3 py-1.5 text-[12px] text-[var(--text-2)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] transition">Mi Perfil</button>
          <hr class="border-[var(--border)]">
          <button @click="emit('cerrarSesion'); menuAbierto = false" class="w-full text-left px-3 py-1.5 text-[12px] text-[var(--red-text)] hover:bg-[#eb5757]/10 transition">Cerrar Sesión</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useTemaStore } from '@/stores/temaStore'

const emit = defineEmits(['irAPerfil', 'cerrarSesion'])
const route = useRoute()
const router = useRouter()
const calStore = useCalendarioStore()
const tema = useTemaStore()

const secciones = {
  '/calendario': 'Calendario',
  '/semanal': 'Semana',
  '/diario': 'Día',
  '/tareas': 'Tareas',
  '/notas': 'Notas',
  '/etiquetas': 'Etiquetas',
  '/recordatorios': 'Recordatorios',
  '/recurrencias': 'Recurrencias',
  '/ingresos': 'Ingresos',
  '/ingresos/registrar': 'Nuevo ingreso',
  '/gastos': 'Gastos',
  '/gastos/registrar': 'Nuevo gasto',
  '/presupuestos': 'Presupuestos',
  '/reportes': 'Reportes',
  '/reportes/economico': 'Reporte económico',
  '/productividad': 'Productividad',
  '/usuarios': 'Usuarios'
}
const seccion = computed(() => secciones[route.path] || 'Agenda')
const esCalendario = computed(() => ['/calendario', '/semanal', '/diario'].includes(route.path))

const menuAbierto = ref(false)
const avatarRef = ref(null)
onClickOutside(avatarRef, () => { menuAbierto.value = false })

const vistas = [
  { valor: 'dia', label: 'Día' },
  { valor: 'semana', label: 'Semana' },
  { valor: 'mes', label: 'Mes' }
]

const rutas = { dia: '/diario', semana: '/semanal', mes: '/calendario' }

const cambiarVista = (vista) => {
  calStore.setVista(vista)
  const destino = rutas[vista]
  if (destino && router.currentRoute.value.path !== destino) {
    router.push(destino)
  }
}
</script>
