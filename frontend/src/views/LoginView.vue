<template>
  <div class="min-h-screen bg-[var(--bg)] relative flex flex-col items-center justify-center p-4 font-sans overflow-hidden">

    <!-- Resplandor de fondo -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(94,106,210,0.16),transparent_70%)]"></div>

    <div class="relative z-10 w-full max-w-[360px]">

      <div class="flex flex-col items-center mb-7 text-center">
        <img src="/logo.svg" alt="Agenda Virtual" class="w-12 h-12 mb-4 rounded-xl ring-1 ring-[var(--ring-soft)] shadow-[0_24px_48px_-24px_rgba(94,106,210,0.7)]" />
        <h1 class="text-[20px] font-semibold tracking-tight text-[var(--text)]">Agenda Virtual</h1>
        <p class="text-[12px] text-[var(--text-4)] mt-1.5">Sueña en grande, actúa en pequeño</p>
      </div>

      <div class="bg-[var(--panel)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-elevada)] overflow-hidden">

        <div class="flex gap-1 p-1 bg-[var(--surface-1)] border-b border-[var(--border)]">
          <button
            type="button"
            @click="pestanaActual = 'login'"
            :class="pestanaActual === 'login' ? 'bg-[var(--surface-strong)] text-[var(--text)]' : 'text-[var(--text-4)] hover:text-[var(--text-2)]'"
            class="flex-1 py-1.5 rounded-md text-[12px] font-medium transition">
            Iniciar sesión
          </button>
          <button
            type="button"
            @click="pestanaActual = 'registro'"
            :class="pestanaActual === 'registro' ? 'bg-[var(--surface-strong)] text-[var(--text)]' : 'text-[var(--text-4)] hover:text-[var(--text-2)]'"
            class="flex-1 py-1.5 rounded-md text-[12px] font-medium transition">
            Registrarse
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="manejarFormulario" class="space-y-4">

            <div v-if="pestanaActual === 'registro'">
              <label class="block text-[11px] font-medium text-[var(--text-3)] mb-1.5">Nombre completo</label>
              <div class="relative flex items-center">
                <span class="absolute left-3 text-[var(--text-4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
                <input
                  v-model="nombreCompleto"
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full pl-9 pr-3 py-2 bg-[var(--panel-2)] border border-[var(--border)] rounded-md text-[13px] text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(94,106,210,0.2)] transition"
                  :required="pestanaActual === 'registro'"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-medium text-[var(--text-3)] mb-1.5">Correo electrónico</label>
              <div class="relative flex items-center">
                <span class="absolute left-3 text-[var(--text-4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  v-model="correo"
                  type="email"
                  placeholder="nombre@gmail.com"
                  class="w-full pl-9 pr-3 py-2 bg-[var(--panel-2)] border border-[var(--border)] rounded-md text-[13px] text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(94,106,210,0.2)] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-medium text-[var(--text-3)] mb-1.5">Contraseña</label>
              <div class="relative flex items-center">
                <span class="absolute left-3 text-[var(--text-4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  v-model="contrasena"
                  :type="mostrarContrasena ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-9 pr-9 py-2 bg-[var(--panel-2)] border border-[var(--border)] rounded-md text-[13px] text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(94,106,210,0.2)] transition"
                  required
                />
                <button
                  type="button"
                  @click="mostrarContrasena = !mostrarContrasena"
                  class="absolute right-2.5 text-[var(--text-4)] hover:text-[var(--text-2)] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMsg" class="bg-[#eb5757]/10 border border-[#eb5757]/25 text-[var(--red-text-strong)] text-[12px] rounded-md px-3 py-2">
              {{ errorMsg }}
            </div>

            <div v-if="pestanaActual === 'login'" class="text-left">
              <a href="#" class="text-[11px] text-[var(--text-3)] hover:text-[var(--text-2)] transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div class="pt-1">
              <button
                v-if="pestanaActual === 'login'"
                type="submit"
                :disabled="cargando"
                class="w-full py-2.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-14px_rgba(94,106,210,0.9)] active:translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ cargando ? 'Conectando...' : 'Ingresar' }}
              </button>

              <button
                v-else
                type="submit"
                class="w-full py-2.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-14px_rgba(94,106,210,0.9)] active:translate-y-px transition">
                Crear cuenta
              </button>
            </div>

          </form>

          <div class="flex items-center gap-3 my-5">
            <span class="flex-1 h-px bg-[var(--border)]"></span>
            <span class="text-[10px] uppercase tracking-[0.08em] text-[var(--text-4)]">o continúa con</span>
            <span class="flex-1 h-px bg-[var(--border)]"></span>
          </div>

          <button
            type="button"
            @click="iniciarSesionGoogle"
            class="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-[var(--border)] rounded-md text-[13px] font-medium text-[var(--text-2)] bg-[var(--surface-1)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] active:translate-y-px transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-4 h-4">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            <span>Iniciar sesión con Google</span>
          </button>
        </div>
      </div>

      <p class="text-center text-[10px] text-[var(--text-4)] mt-6">Agenda Virtual · Gestión personal</p>
    </div>

    <button type="button" @click="tema.alternar()"
      :title="tema.tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      :aria-label="tema.tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      class="absolute bottom-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--surface-hover)] cursor-pointer transition">
      <svg v-if="tema.tema === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, registrar } from '@/api/auth.js'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useTemaStore } from '@/stores/temaStore'

const router = useRouter()
const store = useUsuarioStore()
const tema = useTemaStore()

const pestanaActual = ref('login')
const nombreCompleto = ref('')
const correo = ref('')
const contrasena = ref('')
const mostrarContrasena = ref(false)
const cargando = ref(false)
const errorMsg = ref('')

// Cada rol entra a su dashboard correspondiente
const rutaSegunRol = (usuario) => (usuario?.rol === 'admin' ? '/usuarios' : '/calendario')

const manejarFormulario = async () => {
  errorMsg.value = ''
  cargando.value = true

  try {
    let respuesta
    if (pestanaActual.value === 'login') {
      respuesta = await login(correo.value, contrasena.value)
    } else {
      respuesta = await registrar({
        nombre: nombreCompleto.value,
        correo: correo.value,
        contrasena: contrasena.value
      })
    }

    if (respuesta.data.success) {
      const usuario = respuesta.data.data
      store.establecerUsuario(usuario)
      router.push(rutaSegunRol(usuario))
    }
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al conectar con el servidor'
  } finally {
    cargando.value = false
  }
}

const iniciarSesionGoogle = () => {
  window.location.href = '/auth/google'
}
</script>
