<template>
  <div class="mb-4">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">{{ label }}</label>
    <input
      class="bg-gray-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      aria-describedby="file_input_help"
      id="file_input"
      type="file"
      accept="image/*"
      @change="onFileChange"
    >
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">{{ rule }}</p>
    <p v-if="error" class="text-red-500 text-sm font-medium dark:text-red-400">{{ error }}</p>
    <div v-if="preview" class="mt-2">
      <img :src="preview" alt="Image preview" style="max-height: 500px;" class="rounded border" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    rule: {
      type: String,
      required: true
    },
    error: {
      type: String,
      default: ''
    },
    modelValue: {
      type: File,
      default: null
    },
    preview: {
      type: String,
      default: null
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const preview = ref<string | null>(props.preview) // Use prop as initial value

  function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!validTypes.includes(file.type)) {
        emit('update:modelValue', null)
        preview.value = props.preview // fallback to prop
        alert('Only JPG, PNG, and WEBP images are allowed.')
        return
      }
      if (file.size > maxSize) {
        emit('update:modelValue', null)
        preview.value = props.preview // fallback to prop
        alert('Image size must be less than 2MB.')
        return
      }

      preview.value = URL.createObjectURL(file)
      emit('update:modelValue', file)
    } else {
      preview.value = props.preview // fallback to prop
      emit('update:modelValue', null)
    }
  }

  // Watch for external modelValue changes to update preview
  watch(() => props.modelValue, (file) => {
    if (file) {
      preview.value = URL.createObjectURL(file)
    } else {
      preview.value = props.preview // fallback to prop
    }
  })

  // Watch for preview prop changes
  watch(() => props.preview, (newPreview) => {
    if (!props.modelValue) {
      preview.value = newPreview
    }
  })
</script>

<style>

</style>