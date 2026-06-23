<template>
  <div>
    <label class="flex items-center justify-between cursor-pointer">
      <span class="label-campo mb-0">Repetir</span>
      <span class="relative inline-flex items-center">
        <input type="checkbox" :checked="activo" @change="alternar($event.target.checked)" class="sr-only peer">
        <span class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></span>
      </span>
    </label>

    <div v-if="activo" class="mt-3 grid grid-cols-2 gap-3 bg-gray-50/60 border border-gray-200 rounded-lg p-3">
      <div>
        <label class="label-campo">Intervalo</label>
        <select v-model="config.intervalo" @change="emitir" class="input-base appearance-none cursor-pointer">
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
          <option value="anual">Anual</option>
        </select>
      </div>
      <div>
        <label class="label-campo">Cada (días, opc.)</label>
        <input v-model.number="config.frecuencia_dias" @input="emitir" type="number" min="1" placeholder="Ej. 14" class="input-base" />
      </div>
      <div>
        <label class="label-campo">Desde</label>
        <input v-model="config.fecha_inicio" @input="emitir" type="date" class="input-base" />
      </div>
      <div>
        <label class="label-campo">Hasta (opc.)</label>
        <input v-model="config.fecha_fin" @input="emitir" type="date" class="input-base" />
      </div>
      <div class="col-span-2">
        <label class="label-campo">Nº de repeticiones (opc.)</label>
        <input v-model.number="config.num_rec" @input="emitir" type="number" min="1" placeholder="Ej. 10" class="input-base" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: { type: Object, default: null },
  fechaBase: { type: String, default: null }
})
const emit = defineEmits(['update:modelValue'])

const activo = ref(!!props.modelValue)
const config = ref({
  intervalo: props.modelValue?.intervalo || 'semanal',
  frecuencia_dias: props.modelValue?.frecuencia_dias || null,
  fecha_inicio: props.modelValue?.fecha_inicio || props.fechaBase || dayjs().format('YYYY-MM-DD'),
  fecha_fin: props.modelValue?.fecha_fin || null,
  num_rec: props.modelValue?.num_rec || null
})

const emitir = () => {
  if (!activo.value) { emit('update:modelValue', null); return }
  emit('update:modelValue', {
    intervalo: config.value.intervalo,
    frecuencia_dias: config.value.frecuencia_dias || null,
    fecha_inicio: config.value.fecha_inicio ? dayjs(config.value.fecha_inicio).format('YYYY-MM-DD HH:mm:ss') : null,
    fecha_fin: config.value.fecha_fin ? dayjs(config.value.fecha_fin).format('YYYY-MM-DD HH:mm:ss') : null,
    num_rec: config.value.num_rec || null
  })
}

const alternar = (val) => { activo.value = val; emitir() }
</script>
