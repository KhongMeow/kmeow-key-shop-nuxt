<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div 
        class="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8
              hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200
              bg-gray-50 dark:bg-gray-700/50"
        :class="{ 'border-red-500': error }"
      >
        <div v-if="!preview" class="text-center">
          <Icon name="heroicons:photo" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drop your image here or click to browse
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500">
            {{ rule }}
          </p>
        </div>
        
        <div v-else class="text-center">
          <div class="relative inline-block">
            <img 
              :src="preview" 
              alt="Preview" 
              class="max-w-full max-h-48 rounded-lg shadow-md"
            />
            <button
              type="button"
              @click="removeImage"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                    hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
          <p v-if="fileName" class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ fileName }}</p>
        </div>
        
        <input
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-500 flex items-center gap-1">
      <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

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
  },
  required: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 2 * 1024 * 1024 // 2MB
  },
  allowedTypes: {
    type: Array as PropType<string[]>,
    default: () => ['image/jpeg', 'image/png', 'image/webp']
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const preview = ref<string | null>(props.preview)
const fileName = ref<string>('')

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file type
    if (!props.allowedTypes.includes(file.type)) {
      emit('error', `Only ${props.allowedTypes.map((type: string) => type.split('/')[1].toUpperCase()).join(', ')} images are allowed.`)
      target.value = ''
      return
    }
    
    // Validate file size
    if (file.size > props.maxSize) {
      const maxSizeMB = props.maxSize / (1024 * 1024)
      emit('error', `Image size must be less than ${maxSizeMB}MB.`)
      target.value = ''
      return
    }

    // Clear any previous errors
    emit('error', '')
    
    // Create preview
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    
    preview.value = URL.createObjectURL(file)
    fileName.value = file.name
    emit('update:modelValue', file)
  } else {
    removeImage()
  }
}

function removeImage() {
  if (preview.value && preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
  preview.value = props.preview || null
  fileName.value = ''
  emit('update:modelValue', null)
}

// Watch for external modelValue changes
watch(() => props.modelValue, (file) => {
  if (file) {
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = URL.createObjectURL(file)
    fileName.value = file.name
  } else if (!props.preview) {
    removeImage()
  }
})

// Watch for preview prop changes
watch(() => props.preview, (newPreview) => {
  if (!props.modelValue) {
    preview.value = newPreview
    fileName.value = ''
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (preview.value && preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
})
</script>