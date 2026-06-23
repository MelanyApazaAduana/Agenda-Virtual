<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <AppHeader @cerrarSesion="cerrarSesion" @irAPerfil="irAPerfil" />
    </header>
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar/>
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>

    <!-- Al entrar, si el presupuesto está en 0 se pide definirlo -->
    <ModalPresupuesto v-if="pedirPresupuesto" :valores="finanzas.presupuesto" :cerrable="false" @guardar="guardarPresupuesto" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layouts/AppSidebar.vue'
import AppHeader from '@/components/layouts/AppHeader.vue'
import ModalPresupuesto from '@/components/finanzas/ModalPresupuesto.vue'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useFinanzasStore } from '@/stores/finanzasStore'
import { useUiStore } from '@/stores/uiStore'
import { establecerMiPresupuesto } from '@/api/presupuestos'

const router = useRouter()
const usuarioStore = useUsuarioStore()
const finanzas = useFinanzasStore()
const ui = useUiStore()

const pedirPresupuesto = ref(false)

const cerrarSesion = () => usuarioStore.cerrarSesion()
const irAPerfil = () => router.push('/usuarios')

onMounted(async () => {
  await finanzas.cargar()
  if (!finanzas.presupuesto || Number(finanzas.presupuesto.monto_total) <= 0) {
    pedirPresupuesto.value = true
  }
})

const guardarPresupuesto = async (datos) => {
  try {
    await establecerMiPresupuesto(datos)
    await finanzas.cargar()
    pedirPresupuesto.value = false
    ui.exito('¡Presupuesto definido!')
  } catch (e) {
    ui.error(e.response?.data?.mensaje || 'No se pudo guardar el presupuesto')
  }
}
</script>
