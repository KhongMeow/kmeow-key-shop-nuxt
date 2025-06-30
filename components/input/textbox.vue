<template>
  <div class="space-y-2">
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <Icon 
        v-if="icon"
        :name="icon" 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
      />
      <input
        :type="type" 
        :id="id" 
        :aria-describedby="ariaDescribedby" 
        :placeholder="placeholder" 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        :class="[inputClass, error ? 'border-red-500 focus:ring-red-500' : '', icon ? 'pl-10' : 'pl-4']"
      />
    </div>
    <p v-if="error" class="text-sm text-red-500 flex items-center gap-1">
      <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
      {{ error }}
    </p>
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
    },
    required: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  })

  const inputClass = 'w-full pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-500 dark:placeholder-gray-400'
</script>