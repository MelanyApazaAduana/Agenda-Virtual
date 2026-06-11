<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'

const route = useRoute()

const layouts = { AuthLayout, DashboardLayout }
const currentLayout = computed(() => layouts[route.meta.layout] || DashboardLayout)
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
