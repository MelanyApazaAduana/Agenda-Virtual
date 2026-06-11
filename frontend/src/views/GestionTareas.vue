<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-800">
    
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      
      <div class="h-20 flex items-center px-6 border-b border-gray-100">
        <div class="bg-black text-white p-2 rounded-lg mr-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-13.5H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        </div>
        <div>
          <h2 class="font-bold text-gray-900 leading-tight">Espacio de Trabajo</h2>
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Plan Empresaria</p>
        </div>
      </div>

      <nav class="p-4 flex-1 space-y-1 overflow-y-auto">
        <button @click="$emit('navegar', 'calendario')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Calendario
        </button>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg shadow-md">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          Tareas
        </a>
        <button @click="$emit('navegar', 'notas')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Notas
        </button>
        <button @click="$emit('navegar', 'productividad')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          Productividad
        </button>
        <button @click="$emit('navegar', 'usuarios')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          Usuarios
        </button>
      </nav>

      <div class="p-4 space-y-4 border-t border-gray-100">
        <button @click="abrirModalTarea" class="w-full bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-black/10">
          <span class="text-lg leading-none">+</span> Creación Rápida
        </button>
        <div class="space-y-1">
          <button class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg w-full transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ayuda
          </button>
          <button class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg w-full transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Configuración
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0 relative">
        <div class="flex items-center gap-6 flex-1">
          <span class="font-bold text-lg tracking-wide text-gray-900">Agenda Virtual</span>
          <div class="relative w-full max-w-md hidden lg:block">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </span>
            <input type="text" placeholder="Search tasks..." class="w-full bg-gray-100/80 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition placeholder-gray-400" />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button class="text-gray-400 hover:text-gray-600 transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg></button>
          <button class="text-gray-400 hover:text-gray-600 transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></button>
          <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm ml-2"></div>
        </div>
      </header>

      <div class="flex-1 overflow-x-auto overflow-y-hidden p-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Tareas</h1>
            <p class="text-sm text-gray-500 mt-1">Optimiza tu flujo de trabajo con precisión algorítmica</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
              Filtrar
            </button>
            <button class="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-zinc-800 transition shadow-sm shadow-black/10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>
              Prioridad
            </button>
          </div>
        </div>

        <div class="flex gap-6 h-[calc(100%-100px)] overflow-x-auto pb-4">
          
          <div class="w-80 shrink-0 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <h3 class="font-bold text-gray-900">Vencidos</h3>
              </div>
              <span class="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">{{ tareas.filter(t => t.estado === 'vencido').length }} TAREAS</span>
            </div>
            
            <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              <div v-for="tarea in tareas.filter(t => t.estado === 'vencido')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
                <label class="flex items-start gap-3">
                  <input type="checkbox" class="mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer" />
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ tarea.nombre }}</h4>
                    <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed">{{ tarea.descripcion }}</p>
                    <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-red-600 tracking-wider uppercase">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      {{ tarea.prioridad }} • {{ tarea.tiempo }}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="w-80 shrink-0 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-teal-500"></div>
                <h3 class="font-bold text-gray-900">En Proceso</h3>
              </div>
              <span class="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-100">{{ tareas.filter(t => t.estado === 'proceso').length }} TAREAS</span>
            </div>
            
            <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              <div v-for="tarea in tareas.filter(t => t.estado === 'proceso')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
                <label class="flex items-start gap-3">
                  <input type="checkbox" class="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" />
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ tarea.nombre }}</h4>
                    <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed">{{ tarea.descripcion }}</p>
                    <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-teal-600 tracking-wider uppercase">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      {{ tarea.prioridad }} • {{ tarea.tiempo }}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="w-80 shrink-0 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                <h3 class="font-bold text-gray-900">Próximos</h3>
              </div>
              <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">{{ tareas.filter(t => t.estado === 'proximo').length }} TAREAS</span>
            </div>
            
            <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              <div v-for="tarea in tareas.filter(t => t.estado === 'proximo')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
                <label class="flex items-start gap-3">
                  <input type="checkbox" class="mt-0.5 rounded border-gray-300 text-gray-600 focus:ring-gray-600 w-4 h-4 cursor-pointer" />
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ tarea.nombre }}</h4>
                    <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed">{{ tarea.descripcion }}</p>
                    <div v-if="tarea.tiempo" class="flex items-center gap-2 mt-4 text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                      {{ tarea.tiempo }}
                    </div>
                  </div>
                </label>
              </div>
            </div>
        </div>

        </div>
      </div>
    </main>

    <button @click="abrirModalTarea" class="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all z-50">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <ModalCrearTarea v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarTarea" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalCrearTarea from './ModalCrearTarea.vue'

defineEmits(['navegar'])

const mostrarModal = ref(false)

const tareas = ref([
  { id: 1, nombre: 'Finalizar Reporte Q3', descripcion: 'Revisión de métricas de eficiencia y proyección de crecimiento para...', prioridad: 'alta', estado: 'vencido', tiempo: '4h focus' },
  { id: 2, nombre: 'Auditoria de Seguridad', descripcion: 'Escaneo de vulnerabilidades en el módulo de autenticación.', prioridad: 'alta', estado: 'vencido', tiempo: '2h focus' },
  { id: 3, nombre: 'Diseño UI Dashboard', descripcion: '', prioridad: 'media', estado: 'proceso', tiempo: '3h focus' },
  { id: 4, nombre: 'Update Documentation', descripcion: '', prioridad: 'baja', estado: 'proceso', tiempo: '1h focus' },
  { id: 5, nombre: 'Workshop: IA Generativa', descripcion: 'Sesión técnica sobre integración de LLMs en el flujo productivo.', prioridad: 'baja', estado: 'proximo', tiempo: 'Mañana • 10:00 AM • 1.5h' },
  { id: 6, nombre: 'Re-arquitectura del Motor de Scheduling', descripcion: 'Proyecto crítico: Reducción de latencia en la asignación automática de slots.', prioridad: 'alta', estado: 'proximo', tiempo: '' }
])

let proxId = 7

const abrirModalTarea = () => {
  mostrarModal.value = true
}

const guardarTarea = (datos) => {
  tareas.value.push({
    id: proxId++,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    prioridad: datos.prioridad,
    estado: 'proceso',
    tiempo: datos.fechaVencimiento || 'Sin fecha'
  })
}
</script>

<style scoped>
/* Ocultar barra de desplazamiento para las columnas, manteniendo el diseño limpio */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>