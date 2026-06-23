<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div class="max-w-5xl mx-auto space-y-6">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Ingresos</h1>
            <p class="text-sm text-gray-500 mt-1">Tus entradas de dinero registradas</p>
          </div>
          <button @click="abrirCrear" class="btn-primario">+ Registrar ingreso</button>
        </div>

        <div class="card p-5 flex items-center justify-between">
          <span class="label-campo mb-0">Total registrado</span>
          <span class="text-2xl font-bold text-emerald-600">Bs. {{ formato(total) }}</span>
        </div>

        <div class="card overflow-hidden">
          <Spinner v-if="cargando" />
          <EstadoVacio v-else-if="ingresos.length === 0" mensaje="Aún no has registrado ingresos" />
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <tr>
                <th class="text-left px-5 py-3">Fecha</th>
                <th class="text-left px-5 py-3">Fuente</th>
                <th class="text-left px-5 py-3">Detalle</th>
                <th class="text-right px-5 py-3">Monto</th>
                <th class="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="ing in ingresos" :key="ing.id" class="hover:bg-gray-50/70 cursor-pointer" @click="editar(ing)">
                <td class="px-5 py-3 text-gray-700">{{ formatoFecha(ing.fecha) }}</td>
                <td class="px-5 py-3 text-gray-700">{{ ing.fuente || '—' }}</td>
                <td class="px-5 py-3 text-gray-500 truncate max-w-[200px]">{{ ing.detalle || '—' }}</td>
                <td class="px-5 py-3 text-right font-bold text-emerald-600">Bs. {{ formato(ing.monto) }}</td>
                <td class="px-5 py-3 text-right">
                  <button @click.stop="borrar(ing)" class="text-gray-300 hover:text-red-500 transition" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ModalIngreso v-if="modal.abierto" :modo="modal.modo" :valores="modal.valores"
      @cerrar="cerrar" @guardar="guardar" @eliminar="eliminarItem" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/Spinner.vue'
import EstadoVacio from '@/components/ui/EstadoVacio.vue'
import ModalIngreso from '@/components/finanzas/ModalIngreso.vue'
import { listarIngresos, crearIngreso, actualizarIngreso, eliminarIngreso } from '@/api/ingresos'

const ingresos = ref([])
const cargando = ref(true)
const modal = ref({ abierto: false, modo: 'crear', valores: null })

const total = computed(() => ingresos.value.reduce((s, i) => s + Number(i.monto || 0), 0))
const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatoFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

const cargar = async () => {
  cargando.value = true
  try { const { data } = await listarIngresos(); ingresos.value = data.data || [] }
  catch (e) { ingresos.value = [] } finally { cargando.value = false }
}
onMounted(cargar)

const abrirCrear = () => { modal.value = { abierto: true, modo: 'crear', valores: null } }
const editar = (ing) => { modal.value = { abierto: true, modo: 'editar', valores: ing } }
const cerrar = () => { modal.value = { abierto: false, modo: 'crear', valores: null } }

const guardar = async (payload) => {
  try {
    if (modal.value.modo === 'editar') await actualizarIngreso(modal.value.valores.id, payload)
    else await crearIngreso(payload)
    cerrar(); await cargar()
  } catch (e) { alert(e.response?.data?.mensaje || 'No se pudo guardar el ingreso') }
}

const eliminarItem = async (id) => {
  if (!confirm('¿Eliminar este ingreso?')) return
  try { await eliminarIngreso(id); cerrar(); await cargar() } catch (e) { alert('Error') }
}
const borrar = async (ing) => {
  if (!confirm('¿Eliminar este ingreso?')) return
  try { await eliminarIngreso(ing.id); await cargar() } catch (e) { alert('Error') }
}
</script>
