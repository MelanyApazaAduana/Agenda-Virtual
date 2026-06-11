<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
    
    <div class="flex flex-col items-center mb-6 text-center">
      <div class="bg-black text-white p-3 rounded-2xl shadow-md mb-3 flex items-center justify-center w-12 h-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-wide">Agenda Virtual</h1>
      <p class="text-sm text-gray-500 mt-1">Sueña en grande, actua en pequeño</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">
      
      <div class="flex border-b border-gray-200 text-center text-xs font-bold tracking-widest uppercase">
        <button 
          type="button"
          @click="pestanaActual = 'login'" 
          :class="pestanaActual === 'login' ? 'border-b-2 border-black text-black' : 'text-gray-400'"
          class="w-1/2 py-4 transition-colors">
          Iniciar Sesión
        </button>
        <button 
          type="button"
          @click="pestanaActual = 'registro'" 
          :class="pestanaActual === 'registro' ? 'border-b-2 border-black text-black' : 'text-gray-400'"
          class="w-1/2 py-4 transition-colors">
          Registrarse
        </button>
      </div>

      <div class="p-8">
        <form @submit.prevent="manejarFormulario" class="space-y-5">
          
          <div v-if="pestanaActual === 'registro'">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Nombre Completo
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </span>
              <input 
                v-model="nombreCompleto"
                type="text" 
                placeholder="Melany Apaza" 
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm tracking-wide text-gray-700 placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                :required="pestanaActual === 'registro'"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Correo Electrónico
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <input 
                v-model="correo"
                type="email" 
                placeholder="nombre@gmail.com" 
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm tracking-wide text-gray-700 placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Contraseña
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
              <input 
                v-model="contrasena"
                :type="mostrarContrasena ? 'text' : 'password'" 
                placeholder="••••••••" 
                class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-sm tracking-wide text-gray-700 placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                required
              />
              <button 
                type="button"
                @click="mostrarContrasena = !mostrarContrasena"
                class="absolute right-3 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="pestanaActual === 'login'" class="text-left">
            <a href="#" class="text-xs font-semibold text-teal-600 hover:underline">
              Olvidaste tu contraseña?
            </a>
          </div>

          <div class="pt-2">
            <button 
              v-if="pestanaActual === 'login'"
              type="submit" 
              class="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-[0.99] transition-all">
              Ingresar
            </button>

            <button 
              v-else
              type="submit" 
              class="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-[0.99] transition-all">
              Crear Cuenta
            </button>
          </div>

        </form>
      </div>
    </div>

    <div class="absolute bottom-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pestanaActual = ref('login')
const nombreCompleto = ref('')
const correo = ref('')
const contrasena = ref('')
const mostrarContrasena = ref(false)

const manejarFormulario = () => {
  if (pestanaActual.value === 'login') {
    if (correo.value === 'melany@ejemplo.com' && contrasena.value === 'melany') {
      router.push('/calendario')
    } else {
      alert('Credenciales incorrectas')
    }
  } else {
    console.log('--- ENVIANDO NUEVO REGISTRO ---')
    console.log('Nombre:', nombreCompleto.value)
    console.log('Correo:', correo.value)
    console.log('Contraseña:', contrasena.value)
  }
}
</script>
