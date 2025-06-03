<template>
  <div class="mb-4">
    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
    <select
      id="countries"
      class="bg-gray-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      v-model="internalValue"
      @change="emitChange"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-sm font-medium dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  label: { type: String },
  placeholder: { type: String },
  options: {
    type: Array as () => Array<{ value: string, label: string }>,
    default: () => []
  },
  error: { type: String }
})

const emit = defineEmits(['update:modelValue'])
const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

function emitChange() {
  emit('update:modelValue', internalValue.value)
}
</script>