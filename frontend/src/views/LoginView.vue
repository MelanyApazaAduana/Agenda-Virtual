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

          <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ errorMsg }}
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
              :disabled="cargando"
              class="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ cargando ? 'Conectando...' : 'Ingresar' }}
            </button>

            <button 
              v-else
              type="submit" 
              class="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-[0.99] transition-all">
              Crear Cuenta
            </button>
          </div>

        </form>

          <div class="flex items-center gap-3 my-5">
            <span class="flex-1 h-px bg-gray-200"></span>
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">o continúa con</span>
            <span class="flex-1 h-px bg-gray-200"></span>
          </div>

          <button
            type="button"
            @click="iniciarSesionGoogle"
            class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            <span>Iniciar sesión con Google</span>
          </button>
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
import { devLogin } from '@/api/auth.js'
import { useUsuarioStore } from '@/stores/usuarioStore'

const router = useRouter()
const store = useUsuarioStore()

const pestanaActual = ref('login')
const nombreCompleto = ref('')
const correo = ref('')
const contrasena = ref('')
const mostrarContrasena = ref(false)
const cargando = ref(false)
const errorMsg = ref('')

const manejarFormulario = async () => {
  errorMsg.value = ''

  if (pestanaActual.value === 'login') {
    cargando.value = true
    try {
      const respuesta = await devLogin()
      if (respuesta.data.success) {
        store.establecerUsuario(respuesta.data.data)
        router.push('/calendario')
      }
    } catch (e) {
      errorMsg.value = 'Error al conectar con el servidor'
    } finally {
      cargando.value = false
    }
  } else {
    alert('Modo registro: usa el login de desarrollo por ahora')
  }
}

const iniciarSesionGoogle = () => {
  window.location.href = 'http://localhost:3000/auth/google'
}
</script>
