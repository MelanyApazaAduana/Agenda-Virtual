<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <AppHeader />
    </header>
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar/>
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layouts/AppSidebar.vue'
import AppHeader from '@/components/layouts/AppHeader.vue'
</script>
