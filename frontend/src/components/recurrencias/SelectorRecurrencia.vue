<template>
  <div>
    <label class="flex items-center justify-between cursor-pointer">
      <span class="label-campo mb-0">Repetir</span>
      <span class="relative inline-flex items-center">
        <input type="checkbox" :checked="activo" @change="alternar($event.target.checked)" class="sr-only peer">
        <span class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></span>
      </span>
    </label>

    <div v-if="activo" class="mt-3 grid gap-3 bg-gray-50/60 border border-gray-200 rounded-lg p-3"
      :class="mostrarInicio ? 'grid-cols-3' : 'grid-cols-2'">
      <div>
        <label class="label-campo">Cada</label>
        <select v-model="config.intervalo" @change="emitir" class="input-base appearance-none cursor-pointer">
          <option value="diario">Día</option>
          <option value="semanal">Semana</option>
          <option value="mensual">Mes</option>
          <option value="anual">Año</option>
        </select>
      </div>
      <div v-if="mostrarInicio">
        <label class="label-campo">Desde</label>
        <input v-model="config.fecha_inicio" @input="emitir" type="date" class="input-base" />
      </div>
      <div>
        <label class="label-campo">Hasta *</label>
        <input v-model="config.fecha_fin" @input="emitir" type="date" class="input-base" />
      </div>
    </div>
    <p v-if="activo" class="text-[11px] text-gray-400 mt-1">
      Se crea una ocurrencia por {{ unidadTexto }} desde {{ mostrarInicio ? 'la fecha indicada' : 'la fecha del evento' }} hasta la fecha límite.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: { type: Object, default: null },
  fechaBase: { type: String, default: null },
  mostrarInicio: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const activo = ref(!!props.modelValue)
const config = ref({
  intervalo: props.modelValue?.intervalo || 'semanal',
  fecha_inicio: props.fechaBase || dayjs().format('YYYY-MM-DD'),
  fecha_fin: ''
})

const unidadTexto = computed(() => ({ diario: 'día', semanal: 'semana', mensual: 'mes', anual: 'año' }[config.value.intervalo] || 'periodo'))

const emitir = () => {
  if (!activo.value) { emit('update:modelValue', null); return }
  emit('update:modelValue', {
    intervalo: config.value.intervalo,
    fecha_inicio: config.value.fecha_inicio ? dayjs(config.value.fecha_inicio).format('YYYY-MM-DD HH:mm:ss') : null,
    fecha_fin: config.value.fecha_fin ? dayjs(config.value.fecha_fin).format('YYYY-MM-DD HH:mm:ss') : null
  })
}

const alternar = (val) => { activo.value = val; emitir() }
</script>
