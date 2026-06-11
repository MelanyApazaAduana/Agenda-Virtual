<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-800">
    
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      <div class="h-20 flex items-center px-6 border-b border-gray-100">
        <div class="bg-black text-white p-2 rounded-lg mr-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        </div>
        <div>
          <h2 class="font-bold text-gray-900 leading-tight">Workspace</h2>
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Enterprise Plan</p>
        </div>
      </div>
      <nav class="p-4 flex-1 space-y-1">
        <button @click="$emit('navegar', 'calendario')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Calendario
        </button>
        <button @click="$emit('navegar', 'tareas')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> Tareas
        </button>
        <button @click="$emit('navegar', 'notas')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Notas
        </button>
        <button class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg shadow-md w-full text-left">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> Productividad
        </button>
        <button @click="$emit('navegar', 'usuarios')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg> Usuarios
        </button>
      </nav>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0 relative border-b border-gray-100">
        <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Productivity</h1>
        <div class="flex items-center gap-4">
          <button class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
          </button>
          <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"></div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 space-y-6">
        
        <div class="bg-gradient-to-r from-slate-900 to-black rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center relative">
              <div class="w-3 h-3 bg-teal-400 rounded-full animate-ping absolute"></div>
              <div class="w-3 h-3 bg-teal-500 rounded-full relative z-10"></div>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Live Flow</h3>
              <p class="text-gray-400 text-sm">You are currently in your most productive window (10am-2pm).</p>
            </div>
          </div>
          <button class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition backdrop-blur-sm">
            Start Deep Work
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-gray-900">Peak Productivity Hours</h3>
              <select class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-1.5 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <div class="h-48 flex items-end gap-2 mb-4">
              <div class="flex-1 bg-gray-100 rounded-t-sm h-[30%] hover:bg-teal-100 transition relative group"></div>
              <div class="flex-1 bg-gray-100 rounded-t-sm h-[45%] hover:bg-teal-100 transition relative group"></div>
              <div class="flex-1 bg-teal-500 rounded-t-sm h-[90%] shadow-md relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">Deep Work</div>
              </div>
              <div class="flex-1 bg-gray-100 rounded-t-sm h-[60%] hover:bg-teal-100 transition relative group"></div>
              <div class="flex-1 bg-gray-100 rounded-t-sm h-[40%] hover:bg-teal-100 transition relative group"></div>
              <div class="flex-1 bg-gray-100 rounded-t-sm h-[20%] hover:bg-teal-100 transition relative group"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100 pt-3">
              <span>Mon</span><span>Tue</span><span class="text-teal-600">Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            
            <div class="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
              <p class="text-sm text-teal-800 font-medium">
                💡 Your productivity peaked during <strong>Deep Work sessions</strong> on Wednesday.
              </p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 class="font-bold text-gray-900 mb-6">Milestone Progress</h3>
            
            <div class="space-y-6 flex-1">
              <div>
                <div class="flex justify-between items-end mb-2">
                  <div>
                    <p class="text-sm font-bold text-gray-900">Project Orion Launch</p>
                    <p class="text-xs text-gray-500">82% Completed</p>
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
                    <p class="text-sm font-bold text-gray-900">Infrastructure Migration</p>
                    <p class="text-xs text-gray-500">45% Completed</p>
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
            <h3 class="font-bold text-gray-900 mb-1">Team Efficiency</h3>
            <p class="text-xs text-gray-500 mb-6">Top contributors this cycle based on completed tasks and focused hours.</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">SC</div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Sarah Chen</h4>
                  <p class="text-xs text-gray-500">24 Tasks • 18h Focus</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer relative overflow-hidden">
                <div class="absolute right-0 top-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">MVP</div>
                <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">MT</div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Marcus Thorne</h4>
                  <p class="text-xs text-gray-500">31 Tasks • 22h Focus</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-md transition bg-gray-50/50 hover:bg-white cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">AM</div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Alex Morgan</h4>
                  <p class="text-xs text-gray-500">18 Tasks • 15h Focus</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
defineEmits(['navegar'])
</script>