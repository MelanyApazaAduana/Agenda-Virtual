<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
    <div class="flex items-center gap-4">
      <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Users & Security</h1>
    </div>
    <div class="flex items-center gap-4">
      <button class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer shadow-sm"></button>
    </div>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Administración de Usuarios</h2>
        <p class="text-sm text-gray-500 mt-1">Manage organization members and system wide security policies.</p>
      </div>
      <button class="px-5 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Nuevo Usuario
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="font-bold text-gray-900">System Security / Users</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-4">Member</th>
                  <th scope="col" class="px-6 py-4">Role</th>
                  <th scope="col" class="px-6 py-4">Status</th>
                  <th scope="col" class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(user, index) in usuarios" :key="index" class="hover:bg-gray-50/50 transition">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                      {{ user.iniciales }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">{{ user.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-[11px] font-bold rounded-md bg-gray-100 text-gray-600 tracking-wide uppercase">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="flex items-center gap-1.5 text-xs font-bold text-teal-600">
                      <div class="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                      {{ user.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-gray-400 hover:text-black transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-500 font-medium">
            Showing {{ usuarios.length }} of 12 members
          </div>
        </div>
      </div>

      <div class="space-y-6">
        
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="font-bold text-gray-900">Audit Logs</h3>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex gap-4 relative">
              <div class="absolute left-1.5 top-5 bottom-0 w-px bg-gray-200"></div>
              <div class="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white relative z-10 mt-1 shrink-0"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Alex Morgan <span class="text-gray-500">logged in from 192.168.1.1</span></p>
                <p class="text-xs text-gray-400 mt-0.5">2 minutes ago</p>
              </div>
            </div>
            <div class="flex gap-4 relative">
              <div class="w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white relative z-10 mt-1 shrink-0"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Security Policy updated: <span class="text-gray-500">Auto-logout enabled</span></p>
                <p class="text-xs text-gray-400 mt-0.5">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Security Policies</h3>
            <button class="text-xs font-bold text-teal-600 hover:text-teal-700 transition">Edit</button>
          </div>
          <div class="p-6 space-y-6">
            
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900">Two-Factor Authentication</h4>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">Require all users to verify their identity via a secondary device or code.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input type="checkbox" v-model="politicas.twoFactor" class="sr-only peer">
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

            <hr class="border-gray-100">

            <div>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-bold text-gray-900">Auto-logout Period</h4>
                <span class="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">15m</span>
              </div>
              <p class="text-xs text-gray-500 mb-3">Automatically terminate inactive sessions.</p>
              <select class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:ring-1 focus:ring-black">
                <option>15 Minutes (Recommended)</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>

            <hr class="border-gray-100">

            <div class="flex items-center justify-between">
              <h4 class="text-sm font-bold text-gray-900">IP Restriction</h4>
              <button class="text-xs font-bold text-black border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                Configure Access
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const usuarios = ref([
  { iniciales: 'AM', nombre: 'Alex Morgan', email: 'alex@chronos.ai', rol: 'Admin', estado: 'Active' },
  { iniciales: 'SK', nombre: 'Sarah Klein', email: 'sarah@chronos.ai', rol: 'Editor', estado: 'Active' },
  { iniciales: 'JD', nombre: 'James Doe', email: 'j.doe@chronos.ai', rol: 'Viewer', estado: 'Active' }
])

const politicas = ref({
  twoFactor: true
})
</script>
