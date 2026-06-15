<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'
import { useUsuarioStore } from './stores/usuarioStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const route = useRoute()

const layouts = { AuthLayout, DashboardLayout }
const currentLayout = computed(() => layouts[route.meta.layout] || DashboardLayout)

const usuarioStore = useUsuarioStore()
const { cargando } = storeToRefs(usuarioStore)

onMounted(async () => {
  await usuarioStore.verificarSesion()
})

</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
