<template>
  <RouterLink to="/calendario" class="flex items-center gap-2 font-bold text-lg tracking-wide text-gray-900 shrink-0 hover:opacity-80 transition">
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Agenda Virtual
  </RouterLink>

  <div class="flex-1 flex items-center justify-center gap-4 text-lg font-bold text-gray-800">
    <button @click="calStore.irHoy" class="shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
    <button @click="calStore.anterior" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
    <span class="min-w-[180px] text-center inline-block capitalize">{{ calStore.titulo }}</span>
    <button @click="calStore.siguiente" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
  </div>

  <div class="flex items-center gap-5 shrink-0">
    <div class="flex bg-gray-100 p-1 rounded-lg">
      <button v-for="v in vistas" :key="v.valor" @click="cambiarVista(v.valor)"
        class="px-4 py-1.5 text-sm font-medium rounded-md transition"
        :class="calStore.vista === v.valor ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">
        {{ v.label }}
      </button>
    </div>

    <div ref="avatarRef" class="relative">
      <div @click="menuAbierto = !menuAbierto"
        class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"></div>
      <Transition name="dropdown">
        <div v-if="menuAbierto" @click.stop
          class="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <button @click="emit('irAPerfil'); menuAbierto = false" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</button>
          <hr class="border-gray-100">
          <button @click="emit('cerrarSesion'); menuAbierto = false" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar Sesión</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useCalendarioStore } from '@/stores/calendarioStore'

const emit = defineEmits(['irAPerfil', 'cerrarSesion'])
const router = useRouter()
const calStore = useCalendarioStore()

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
