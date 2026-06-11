<template>
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
</template>

<script setup>
</script>
