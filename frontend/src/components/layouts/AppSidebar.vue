<template>
  <aside class="w-60 bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col shrink-0 h-full hidden md:flex">
    <!-- Marca -->
    <RouterLink to="/calendario" class="flex items-center gap-2.5 px-4 h-14 border-b border-[var(--border)] shrink-0 hover:bg-[var(--surface-1)] transition">
      <img src="/logo.svg" alt="" class="w-7 h-7 rounded-md ring-1 ring-[var(--ring-soft)]" />
      <div class="flex flex-col leading-none">
        <span class="text-[13px] font-semibold tracking-tight text-[var(--text)]">Agenda Virtual</span>
        <span class="text-[10px] text-[var(--text-4)] mt-1">Espacio personal</span>
      </div>
    </RouterLink>

    <div class="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 custom-scroll">

      <!-- Mini calendario -->
      <div>
        <h3 class="text-[10px] font-medium text-[var(--text-4)] uppercase tracking-[0.08em] mb-2.5 px-1.5">Mi calendario</h3>
        <div class="flex justify-between items-center mb-2.5 px-1.5">
          <span class="text-[11px] font-medium text-[var(--text-2)] capitalize">{{ mesLabel }}</span>
          <div class="flex items-center gap-0.5 text-[var(--text-4)]">
            <button @click="cambiarMes(-1)" class="w-5 h-5 rounded hover:bg-[var(--surface-strong)] hover:text-[var(--text-2)] transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 mx-auto"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clip-rule="evenodd" /></svg>
            </button>
            <button @click="cambiarMes(1)" class="w-5 h-5 rounded hover:bg-[var(--surface-strong)] hover:text-[var(--text-2)] transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 mx-auto"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] text-[var(--text-4)] font-medium mb-1">
          <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
        </div>
        <div class="grid grid-cols-7 text-center text-[11px] gap-y-1">
          <template v-for="(item, idx) in diasMini" :key="idx">
            <span v-if="item.fueraMes" class="text-[var(--text-4)] opacity-50">{{ item.dia }}</span>
            <span v-else @click="seleccionarDia(item)"
              class="cursor-pointer inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] transition"
              :class="item.esSeleccionado ? 'bg-[var(--accent)] text-white shadow-sm' : item.esHoy ? 'ring-1 ring-[var(--border-strong)] text-[var(--text)]' : 'text-[var(--text-3)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-2)]'">
              {{ item.dia }}
            </span>
          </template>
        </div>
      </div>

      <!-- Navegación principal (grupos desplegables) -->
      <nav class="space-y-2.5">
        <div v-for="grupo in grupos" :key="grupo.titulo">
          <button @click="alternarGrupo(grupo.titulo)"
            class="w-full flex items-center justify-between px-1.5 mb-1 group">
            <span class="text-[10px] font-medium text-[var(--text-4)] uppercase tracking-[0.08em]">{{ grupo.titulo }}</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
              class="w-3 h-3 text-[var(--text-4)] transition-transform" :class="gruposAbiertos[grupo.titulo] ? '' : '-rotate-90'">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="gruposAbiertos[grupo.titulo]" class="space-y-0.5">
            <RouterLink v-for="item in grupo.items" :key="item.to" :to="item.to"
              class="relative flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12.5px] font-medium transition"
              :class="rutaActiva(item.to) ? 'bg-[var(--surface-strong)] text-[var(--text)]' : 'text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-2)]'">
              <span v-html="item.icono" class="w-4 h-4 shrink-0 opacity-70"></span>
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Etiquetas -->
      <div>
        <div class="flex items-center justify-between px-1.5 mb-2">
          <h3 class="text-[10px] font-medium text-[var(--text-4)] uppercase tracking-[0.08em]">Mis etiquetas</h3>
          <button @click="etiquetasAbiertas = !etiquetasAbiertas" class="text-[var(--text-4)] hover:text-[var(--text-2)] transition p-0.5">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="w-3 h-3 transition-transform" :class="etiquetasAbiertas ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div v-show="etiquetasAbiertas" class="space-y-0.5 px-1.5">
          <div v-for="etiqueta in etiquetasStore.etiquetas" :key="etiqueta.id"
            class="group flex items-center gap-2 text-[12px] text-[var(--text-3)] py-1 rounded-md hover:bg-[var(--surface-2)] px-1 -mx-1 transition">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: etiqueta.color_hex || '#6B7280' }"></span>
            <span class="flex-1 truncate">{{ etiqueta.nombre }}</span>
            <button @click="borrarEtiqueta(etiqueta)" class="opacity-0 group-hover:opacity-100 text-[var(--text-4)] hover:text-[var(--red-text)] transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
            </button>
          </div>
          <p v-if="etiquetasStore.etiquetas.length === 0" class="text-[11px] text-[var(--text-4)] py-1">Aún no tienes etiquetas</p>
          <div class="flex items-center gap-1 mt-1.5">
            <input v-model="nuevaEtiqueta" @keyup.enter="crearEtiquetaRapida" type="text" placeholder="Nueva etiqueta..."
              maxlength="50" class="flex-1 min-w-0 px-2 py-1 bg-[var(--panel-2)] border border-[var(--border)] rounded-md text-[11px] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] transition" />
            <button @click="crearEtiquetaRapida" class="w-6 h-6 rounded-md text-[var(--text-4)] hover:text-[var(--text)] hover:bg-[var(--surface-strong)] transition">+</button>
          </div>
        </div>
      </div>

      <!-- Finanzas -->
      <div>
        <h3 class="text-[10px] font-medium text-[var(--text-4)] uppercase tracking-[0.08em] mb-2.5 px-1.5">Finanzas</h3>
        <div class="space-y-2">
          <router-link to="/presupuestos" class="block bg-[var(--surface-1)] border border-[var(--border)] rounded-lg px-3 py-2.5 hover:bg-[var(--surface-3)] transition">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] font-medium text-[var(--text-3)]">Presupuesto</span>
              <span class="text-[11px] font-semibold text-[var(--text)]">{{ finanzas.presupuesto ? 'Bs. ' + formato(finanzas.presupuesto.monto_total) : '—' }}</span>
            </div>
            <div class="h-1.5 bg-[var(--surface-strong)] rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="usoPresupuesto > 100 ? 'bg-[#eb5757]' : 'bg-[var(--success)]'" :style="{ width: Math.min(usoPresupuesto, 100) + '%' }"></div>
            </div>
          </router-link>
          <div class="bg-[#eb5757]/[0.06] border border-[#eb5757]/15 rounded-lg px-3 py-2.5">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-medium text-[var(--text-3)]">Gastos del mes</span>
              <span class="text-[11px] font-semibold text-[var(--text)]">Bs. {{ formato(finanzas.gastadoMes) }}</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <router-link to="/ingresos/registrar" class="flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium bg-[#4cb782]/10 text-[var(--green-text)] border border-[#4cb782]/20 hover:bg-[#4cb782]/15 transition">+ Ingreso</router-link>
          <router-link to="/gastos/registrar" class="flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium bg-[#eb5757]/10 text-[var(--red-text)] border border-[#eb5757]/20 hover:bg-[#eb5757]/15 transition">+ Gasto</router-link>
        </div>
        <router-link to="/reportes" class="flex items-center justify-center gap-1.5 py-1.5 mt-2 rounded-md text-[11px] font-medium bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-2)] transition">Reportes</router-link>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useEtiquetasStore } from '@/stores/etiquetasStore'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useFinanzasStore } from '@/stores/finanzasStore'
import { useUiStore } from '@/stores/uiStore'

const route = useRoute()
const calStore = useCalendarioStore()
const { foco } = storeToRefs(calStore)
const etiquetasStore = useEtiquetasStore()
const usuarioStore = useUsuarioStore()
const finanzas = useFinanzasStore()
const ui = useUiStore()

const rutaActiva = (to) => route.path === to

const gruposAbiertos = ref({ Agenda: true, Organizar: true, Finanzas: true, 'Más': true })
const alternarGrupo = (titulo) => { gruposAbiertos.value[titulo] = !gruposAbiertos.value[titulo] }

const grupos = computed(() => {
  const base = [
    { titulo: 'Agenda', color: '#3B82F6', items: [
      { label: 'Eventos', to: '/calendario', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.25 2A2.25 2.25 0 0 0 3 4.25v2.5h14v-2.5A2.25 2.25 0 0 0 14.75 2h-9.5Z" /><path d="M3 8.25v7.5A2.25 2.25 0 0 0 5.25 18h9.5A2.25 2.25 0 0 0 17 15.75v-7.5H3Zm3.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.5-1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm3.5 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>' },
      { label: 'Tareas', to: '/tareas', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6Z" /><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3Z" /></svg>' },
      { label: 'Notas', to: '/notas', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" /><path d="M6 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 9.75Zm0 3a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 12.75Z" /></svg>' }
    ] },
    { titulo: 'Organizar', color: '#8B5CF6', items: [
      { label: 'Etiquetas', to: '/etiquetas', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>' },
      { label: 'Recordatorios', to: '/recordatorios', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6Z" /><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3Z" /></svg>' },
      { label: 'Recurrencias', to: '/recurrencias', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.388A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" /></svg>' }
    ] },
    { titulo: 'Finanzas', color: '#10B981', items: [
      { label: 'Ingresos', to: '/ingresos', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.25a.75.75 0 0 1 1.5 0v.284c.582.063 1.11.315 1.48.69a.75.75 0 0 1-1.06 1.06c-.156-.156-.436-.25-.82-.276h-.018c-.331-.024-.767.163-1.014.458a.926.926 0 0 0 .146 1.262c.298.256.71.43 1.18.552.56.147 1.298.42 1.834.924.33.31.554.706.603 1.144.052.47-.082.931-.391 1.287a1.8 1.8 0 0 1-.754.524c.006.093.01.187.01.281a.75.75 0 0 1-1.5 0v-.006a3.023 3.023 0 0 1-.028-.058 2.954 2.954 0 0 1-.166-.377.75.75 0 0 1 1.39-.565c.052.131.114.244.174.33.039.054.073.095.096.119.038.04.055.053.068.06h.001c.015.01.037.02.076.03l.002.002a.75.75 0 0 1 .202-.096c.185-.075.424-.195.521-.364a.426.426 0 0 0 .09-.265c0-.085-.026-.19-.123-.3-.152-.176-.426-.313-.813-.425-.503-.147-1.487-.485-2.11-1.058a2.426 2.426 0 0 1-.497-2.763c.19-.398.496-.74.86-.98v-.221Z" clip-rule="evenodd" /></svg>' },
      { label: 'Gastos', to: '/gastos', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v.284c-.582.063-1.11.315-1.48.69a.75.75 0 0 0 1.06 1.06c.156-.156.436-.25.82-.276h.018c.331-.024.767.163 1.014.458.247.296.28.643.146 1.262-.133.62-.545 1.006-1.18 1.552-.56.147-1.298.42-1.834.924a1.926 1.926 0 0 0-.603 1.144c-.052.47.082.931.391 1.287.207.24.467.415.754.524a6.32 6.32 0 0 1-.01.281.75.75 0 0 0 1.5 0v-.006c.01-.019.02-.038.028-.058.036-.09.084-.214.166-.377a.75.75 0 0 0-1.39-.565c-.052.131-.114.244-.174.33-.039.054-.073.095-.096.119-.038.04-.055.053-.068.06h-.002c-.014.01-.037.02-.076.03a.75.75 0 0 0-.202-.096c-.185-.075-.424-.195-.521-.364a.426.426 0 0 1-.09-.265c0-.085.026-.19.123-.3.152-.176.426-.313.813-.425.503-.147 1.487-.485 2.11-1.058a2.426 2.426 0 0 0 .497-2.763c-.19-.398-.496-.74-.86-.98v-.221Z" clip-rule="evenodd" /></svg>' },
      { label: 'Presupuestos', to: '/presupuestos', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M1 4.5A1.5 1.5 0 0 1 2.5 3h15A1.5 1.5 0 0 1 19 4.5v.75a.75.75 0 0 1-.75.75H1.75A.75.75 0 0 1 1 5.25V4.5Z" /><path d="M1 10a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 10Z" /><path d="M1 14.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75v-.5Z" /></svg>' },
      { label: 'Reportes', to: '/reportes', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" /></svg>' },
      { label: 'R. Imprimible', to: '/reportes/economico', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0 1 18 8.653v4.097A2.25 2.25 0 0 1 15.75 15h-.128l.126.123a.75.75 0 0 1-.908 1.192l-2.452-2.377a.75.75 0 0 1 .034-1.09l1.244-1.207a.751.751 0 0 1 .527-.211c.383 0 .722.267.802.637l.055.188V8.653c0-.41-.33-.75-.75-.75H4.75c-.42 0-.75.34-.75.75v4.097c0 .414.336.75.75.75h5.25a.75.75 0 0 1 0 1.5H4.75A2.25 2.25 0 0 1 2.5 12.75V8.653c0-1.082.776-2.01 1.824-2.198A24.84 24.84 0 0 1 5 6.302V2.75Zm3.25 1.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clip-rule="evenodd" /></svg>' }
    ] },
    { titulo: 'Más', color: '#6B7280', items: [
      { label: 'Productividad', to: '/productividad', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 0 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06Zm9.9 0a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 3 8Zm14 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 17 8Zm-7 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-3.95 2.95a.75.75 0 0 1 1.06 0L8.17 14.06a.75.75 0 0 1-1.061 1.062l-1.06-1.061a.75.75 0 0 1 0-1.06Zm7.9 0a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061L13.94 14.95a.75.75 0 0 1 1.06 0ZM10 17a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>' }
    ] }
  ]
  if (usuarioStore.usuario?.rol === 'admin') {
    base[3].items.push({ label: 'Usuarios', to: '/usuarios', icono: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10.5 11c-1.508 0-3.086.363-4.088 1.144A3.267 3.267 0 0 0 5 14.5V16h10v-1.5c0-1.39-.561-2.646-1.412-3.356C13.086 11.363 11.508 11 10.5 11ZM4 11.5c.446 0 .876.055 1.288.16A4.22 4.22 0 0 0 4 14.5v1.5H2.5A1.5 1.5 0 0 1 1 14.5v-.5a2.5 2.5 0 0 1 2.5-2.5h.5ZM17.712 11.66c.412-.105.842-.16 1.288-.16h.5A2.5 2.5 0 0 1 22 14v.5a1.5 1.5 0 0 1-1.5 1.5H19v-1.5c0-.96-.36-1.837-.956-2.508a4.15 4.15 0 0 0-.332-.332Z" /></svg>' })
  }
  return base
})

const etiquetasAbiertas = ref(true)
const nuevaEtiqueta = ref('')
const miniFecha = ref(dayjs())

const mesLabel = computed(() => miniFecha.value.format('MMMM YYYY'))

const diasMini = computed(() => {
  const primer = miniFecha.value.startOf('month')
  const diasEnMes = primer.daysInMonth()
  const inicio = primer.day()
  const dias = []
  for (let i = 0; i < inicio; i++) {
    dias.push({ dia: primer.subtract(inicio - i, 'day').date(), fueraMes: true })
  }
  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = primer.date(i)
    dias.push({
      dia: i, fueraMes: false, fecha,
      esHoy: fecha.isSame(dayjs(), 'day'),
      esSeleccionado: fecha.isSame(foco.value, 'day')
    })
  }
  const resto = (7 - (dias.length % 7)) % 7
  for (let i = 1; i <= resto; i++) dias.push({ dia: i, fueraMes: true })
  return dias
})

const usoPresupuesto = computed(() => {
  const total = Number(finanzas.presupuesto?.monto_total || 0)
  return total ? Math.round((finanzas.gastadoMes / total) * 100) : 0
})

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const cambiarMes = (delta) => { miniFecha.value = miniFecha.value.add(delta, 'month') }
const seleccionarDia = (item) => { calStore.seleccionarFecha(item.fecha.format('YYYY-MM-DD')) }

const crearEtiquetaRapida = async () => {
  const nombre = nuevaEtiqueta.value.trim()
  if (!nombre) return
  try { await etiquetasStore.crear({ nombre }); nuevaEtiqueta.value = '' }
  catch (e) { ui.error(e.response?.data?.message || 'No se pudo crear la etiqueta') }
}

const borrarEtiqueta = async (etiqueta) => {
  if (!(await ui.confirmar(`¿Eliminar la etiqueta "${etiqueta.nombre}"?`))) return
  try { await etiquetasStore.eliminar(etiqueta.id) }
  catch (e) { ui.error('No se pudo eliminar la etiqueta') }
}

onMounted(() => {
  etiquetasStore.cargar()
  finanzas.cargar()
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 999px; }
.custom-scroll { scrollbar-width: thin; scrollbar-color: var(--scrollbar) transparent; }
</style>
