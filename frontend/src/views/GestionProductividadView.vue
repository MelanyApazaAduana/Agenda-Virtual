<template>
  <header class="h-16 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
    <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Productividad</h1>
  </header>

  <div class="flex-1 overflow-y-auto p-8 space-y-6">
    
    <div class="bg-gradient-to-r from-slate-900 to-black rounded-2xl p-5 shadow-lg flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center relative">
          <div class="w-3 h-3 bg-teal-400 rounded-full animate-ping absolute"></div>
          <div class="w-3 h-3 bg-teal-500 rounded-full relative z-10"></div>
        </div>
        <div>
          <h3 class="text-white font-bold text-lg">Flujo Activo</h3>
          <p class="text-gray-400 text-sm">Actualmente estás en tu ventana más productiva (10am-2pm).</p>
        </div>
      </div>
      <button class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition backdrop-blur-sm">
        Iniciar Trabajo Profundo
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900">Horas Pico de Productividad</h3>
          <select class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-1.5 outline-none">
            <option>Esta Semana</option>
            <option>Semana Pasada</option>
          </select>
        </div>
        
        <div class="h-48 flex items-end gap-2 mb-4">
          <div class="flex-1 bg-gray-100 rounded-t-sm h-[30%] hover:bg-teal-100 transition relative group"></div>
          <div class="flex-1 bg-gray-100 rounded-t-sm h-[45%] hover:bg-teal-100 transition relative group"></div>
          <div class="flex-1 bg-teal-500 rounded-t-sm h-[90%] shadow-md relative group">
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">Trabajo Profundo</div>
          </div>
          <div class="flex-1 bg-gray-100 rounded-t-sm h-[60%] hover:bg-teal-100 transition relative group"></div>
          <div class="flex-1 bg-gray-100 rounded-t-sm h-[40%] hover:bg-teal-100 transition relative group"></div>
          <div class="flex-1 bg-gray-100 rounded-t-sm h-[20%] hover:bg-teal-100 transition relative group"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100 pt-3">
          <span>Lun</span><span>Mar</span><span class="text-teal-600">Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
        </div>
        
        <div class="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
          <p class="text-sm text-teal-800 font-medium">
            💡 Tu productividad alcanzó su punto máximo durante las sesiones de <strong>Trabajo Profundo</strong> el miércoles.
          </p>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
        <h3 class="font-bold text-gray-900 mb-6">Progreso de Hitos</h3>
        
        <div class="space-y-6 flex-1">
          <div>
            <div class="flex justify-between items-end mb-2">
              <div>
                <p class="text-sm font-bold text-gray-900">Lanzamiento Proyecto Orión</p>
                <p class="text-xs text-gray-500">82% Completado</p>
              </div>
              <span class="text-teal-600 font-bold text-sm">82%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="bg-teal-500 h-2 rounded-full" style="width: 82%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-end mb-2">
              <div>
                <p class="text-sm font-bold text-gray-900">Migración de Infraestructura</p>
                <p class="text-xs text-gray-500">45% Completado</p>
              </div>
              <span class="text-orange-500 font-bold text-sm">45%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full" style="width: 45%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 class="font-bold text-gray-900 mb-1">Eficiencia del Equipo</h3>
        <p class="text-xs text-gray-500 mb-6">Principales contribuyentes de este ciclo basado en tareas completadas y horas de enfoque.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">SC</div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm">Sarah Chen</h4>
              <p class="text-xs text-gray-500">24 Tareas • 18h Enfoque</p>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer relative overflow-hidden">
            <div class="absolute right-0 top-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">MVP</div>
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">MT</div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm">Marcus Thorne</h4>
              <p class="text-xs text-gray-500">31 Tareas • 22h Enfoque</p>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">AM</div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm">Alex Morgan</h4>
              <p class="text-xs text-gray-500">18 Tareas • 15h Enfoque</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>
