<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import DashboardCalendario from './components/DashboardCalendario.vue'
import GestionTareas from './components/GestionTareas.vue'
import GestionNotas from './components/GestionNotas.vue'
import GestionProductividad from './components/GestionProductividad.vue'
import GestionUsuarios from './components/GestionUsuarios.vue'

const usuario = ref(null)
const vista = ref('calendario')

const manejarLogin = (user) => {
  usuario.value = user
}

const navegar = (destino) => {
  vista.value = destino
}
</script>

<template>
  <Login v-if="!usuario" @login-success="manejarLogin" />
  <DashboardCalendario v-else-if="vista === 'calendario'" @navegar="navegar" />
  <GestionTareas v-else-if="vista === 'tareas'" @navegar="navegar" />
  <GestionNotas v-else-if="vista === 'notas'" @navegar="navegar" />
  <GestionProductividad v-else-if="vista === 'productividad'" @navegar="navegar" />
  <GestionUsuarios v-else-if="vista === 'usuarios'" @navegar="navegar" />
</template>
