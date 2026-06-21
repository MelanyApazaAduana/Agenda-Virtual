<template>

    
    <span class="flex items-center gap-2 font-bold text-lg tracking-wide text-gray-900 shrink-0">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Agenda Virtual
    </span>

    <div class="flex-1 flex items-center justify-center gap-4 text-lg font-bold text-gray-800">
      <button @click="irAHoy" class="shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
      <button @click="mesAnterior" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
      <span class="min-w-[80px] text-center inline-block">{{ tituloMes }}</span>
      <button @click="mesSiguiente" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
    </div>

    <div class="flex items-center gap-5 shrink-0">
      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button
          @click="cambiarVista('dia')"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'dia' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Día</button>
        <button
          @click="cambiarVista('semana')"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'semana' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Semana</button>
        <button
          @click="cambiarVista('mes')"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'mes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Mes</button>
      </div>

      <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      <div ref="avatarRef" class="relative">
        <div
          @click="menuAbierto = !menuAbierto"
          class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"
        ></div>
        <Transition name="dropdown">
          <div
            v-if="menuAbierto"
            @click.stop
            class="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          >
            <button @click="emit('irAPerfil'); menuAbierto = false" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</button>
            <hr class="border-gray-100">
            <button @click="emit('cerrarSesion'); menuAbierto = false" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar Sesión</button>
          </div>
        </Transition>
      </div>
    </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['cambiarVista', 'irAPerfil', 'cerrarSesion'])

const menuAbierto = ref(false)
const avatarRef = ref(null)
onClickOutside(avatarRef, () => { menuAbierto.value = false })

const hoy = dayjs()
const añoVisible = ref(hoy.year())
const mesVisible = ref(hoy.month())

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const tituloMes = computed(() => `${meses[mesVisible.value]} ${añoVisible.value}`)

const vistaActual = ref('mes')

const cambiarVista = (vista) => {
  vistaActual.value = vista
  emit('cambiarVista', vista)
}

const irAHoy = () => {
  añoVisible.value = hoy.year()
  mesVisible.value = hoy.month()
}

const mesAnterior = () => {
  if (mesVisible.value === 0) {
    mesVisible.value = 11
    añoVisible.value--
  } else {
    mesVisible.value--
  }
}

const mesSiguiente = () => {
  if (mesVisible.value === 11) {
    mesVisible.value = 0
    añoVisible.value++
  } else {
    mesVisible.value++
  }
}
</script>
