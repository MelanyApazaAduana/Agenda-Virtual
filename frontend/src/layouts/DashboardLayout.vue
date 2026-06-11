<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-800">
    <AppSidebar />
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
