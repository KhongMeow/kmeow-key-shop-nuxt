<template>
  <div class="mb-4">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
    <input 
      :type="type" 
      :id="id" 
      :aria-describedby="ariaDescribedby" 
      :class="[inputClass, error ? 'border-red-500' : '']" 
      :placeholder="placeholder" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
    <p v-if="error" class="text-red-500 text-sm font-medium dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      required: true
    },
    ariaDescribedby: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  const inputClass = 'bg-gray-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
</script>