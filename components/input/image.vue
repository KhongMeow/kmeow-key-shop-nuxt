<template>
  <div class="group relative mb-2">
    <!-- Floating Label -->
    <label 
      :for="id" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Main Upload Container -->
    <div class="relative">
      <div 
        :class="uploadContainerClasses"
        @dragover.prevent="handleDragEnter"
        @dragenter.prevent="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- Upload Area -->
        <div v-if="!preview" class="text-center py-8 px-6 relative">
          <!-- Upload Icon -->
          <div class="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300">
            <Icon 
              :name="isDragging ? 'heroicons:cloud-arrow-down' : 'heroicons:cloud-arrow-up'" 
              :class="[
                'transition-all duration-300 text-xl',
                isDragging 
                  ? 'text-blue-600 dark:text-blue-400 w-8 h-8' 
                  : 'text-gray-400 dark:text-gray-500 w-8 h-8 group-hover:text-blue-500 dark:group-hover:text-blue-400'
              ]"
            />
          </div>

          <!-- Upload Text -->
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ isDragging ? 'Drop to upload' : 'Upload your image' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ isDragging 
                ? 'Release to upload your image' 
                : 'Drag and drop or click to browse' 
              }}
            </p>
          </div>
          
          <!-- File Rules -->
          <div class="mt-4">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ rule }}</span>
          </div>

          <!-- Hidden File Input - Only active when no preview -->
          <input
            :id="id"
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            @focus="handleFocus"
            @blur="handleBlur"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            :disabled="disabled"
          />
        </div>
        
        <!-- Preview Area -->
        <div v-else class="p-4">
          <div class="flex justify-center">
            <div class="relative inline-block group">
              <!-- Image Preview -->
              <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <img 
                  :src="preview" 
                  :alt="fileName || 'Preview'" 
                  class="max-w-full max-h-64 transition-all duration-300 group-hover:scale-105"
                />
                
                <!-- Action Buttons Overlay -->
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    @click="triggerFileInput"
                    class="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 rounded-md text-xs font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Replace image"
                  >
                    Replace
                  </button>
                  
                  <button
                    type="button"
                    @click="removeImage"
                    class="px-3 py-1.5 bg-red-500/90 text-white rounded-md text-xs font-medium hover:bg-red-500 transition-colors"
                    title="Remove image"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <!-- Remove Button -->
              <button
                type="button"
                @click="removeImage"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>

          <!-- File Info -->
          <div v-if="fileName" class="mt-3 text-center">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ fileName }}
            </p>
            <div class="flex items-center justify-center gap-2 mt-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatFileSize(fileSize) }}
              </p>
              <span v-if="imageDimensions" class="text-xs text-gray-400 dark:text-gray-500">•</span>
              <p v-if="imageDimensions" class="text-xs text-gray-500 dark:text-gray-400">
                {{ imageDimensions }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden Replace File Input -->
      <input
        ref="replaceFileInput"
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="hidden"
        :disabled="disabled"
      />
    </div>
    
    <!-- Bottom Section -->
    <div v-if="error || helpText" class="mt-2 min-h-[20px]">
      <!-- Error Message -->
      <Transition name="error" mode="out-in">
        <div v-if="error" class="flex items-start gap-2 text-red-500 animate-shake">
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span class="text-sm font-medium">{{ error }}</span>
        </div>
        <!-- Help Text -->
        <div v-else-if="helpText" class="flex items-start gap-2 text-gray-500 dark:text-gray-400">
          <Icon name="heroicons:information-circle" class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span class="text-sm">{{ helpText }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
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
  helpText: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [File, null] as PropType<File | null>,
    default: null
  },
  preview: {
    type: [String, null] as PropType<string | null>,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 2 * 1024 * 1024 // 2MB
  },
  allowedTypes: {
    type: Array as PropType<string[]>,
    default: () => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'minimal', 'bordered'].includes(value)
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
  'error': [error: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const fileInput = ref<HTMLInputElement>()
const replaceFileInput = ref<HTMLInputElement>()
const isFocused = ref(false)
const isDragging = ref(false)
const preview = ref<string | null>(props.preview)
const fileName = ref<string>('')
const fileSize = ref<number>(0)
const imageDimensions = ref<string>('')

const hasContent = computed(() => !!preview.value)

const labelClasses = computed(() => [
  'absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none',
  'text-sm font-medium z-10',
  (hasContent.value || isFocused.value) ? [
    '-top-2.5 text-xs px-2 py-0.5 rounded-md',
    'bg-white dark:bg-gray-900',
    props.error 
      ? 'text-red-600 dark:text-red-400 bg-white dark:bg-gray-900' 
      : isFocused.value
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
        : 'text-gray-600 dark:text-gray-300'
  ] : [
    'top-3.5 text-gray-500 dark:text-gray-400'
  ]
])

const uploadContainerClasses = computed(() => [
  'w-full px-4 py-3.5 text-sm transition-all duration-300 ease-out',
  'border-2 rounded-xl outline-none',
  'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
  'font-medium leading-relaxed',
  'focus-within:outline-none overflow-hidden',
  
  // Variant-based base styling
  props.variant === 'minimal' ? [
    'border-0 border-b-2 rounded-none px-0 bg-transparent'
  ] : props.variant === 'bordered' ? [
    'border-2 bg-transparent'
  ] : [],
  
  // State-based styling
  props.error ? [
    'border-red-300 dark:border-red-600',
    'focus-within:border-red-500 dark:focus-within:border-red-400',
    'bg-red-50/50 dark:bg-red-900/10'
  ] : props.disabled ? [
    'border-gray-200 dark:border-gray-700',
    'bg-gray-50/50 dark:bg-gray-800/50',
    'cursor-not-allowed opacity-60'
  ] : isDragging.value ? [
    'border-blue-300 dark:border-blue-600',
    'bg-blue-50/50 dark:bg-blue-900/10'
  ] : isFocused.value ? [
    'border-blue-300 dark:border-blue-600',
    'bg-white dark:bg-gray-900'
  ] : [
    'border-gray-200 dark:border-gray-700',
    'hover:border-gray-300 dark:hover:border-gray-600',
    'focus-within:border-blue-300 dark:focus-within:border-blue-600'
  ]
])

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    removeImage()
    return
  }
  
  processFile(file)
}

function getImageDimensions(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve(`${img.width}x${img.height}`)
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      resolve('')
    }
    img.src = URL.createObjectURL(file)
  })
}

async function processFile(file: File) {
  // Validate file type
  if (!props.allowedTypes.includes(file.type)) {
    const allowedFormats = props.allowedTypes
      .map((type: string) => type.split('/')[1]?.toUpperCase())
      .filter(Boolean)
      .join(', ')
    emit('error', `Only ${allowedFormats} images are allowed.`)
    clearFileInputs()
    return
  }
  
  // Validate file size
  if (file.size > props.maxSize) {
    const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(1)
    emit('error', `Image size must be less than ${maxSizeMB}MB.`)
    clearFileInputs()
    return
  }

  // Clear any previous errors
  emit('error', '')
  
  // Clean up previous preview
  if (preview.value && preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
  
  // Create new preview
  preview.value = URL.createObjectURL(file)
  fileName.value = file.name
  fileSize.value = file.size
  
  // Get image dimensions
  imageDimensions.value = await getImageDimensions(file)
  
  emit('update:modelValue', file)
}

function removeImage() {
  // Clean up blob URL
  if (preview.value && preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
  
  // Reset all reactive state
  preview.value = null
  fileName.value = ''
  fileSize.value = 0
  imageDimensions.value = ''
  
  // Clear file inputs
  clearFileInputs()
  
  // Clear any drag state
  isDragging.value = false
  
  // Clear any focus state
  isFocused.value = false
  
  // Emit updates to parent
  emit('update:modelValue', null)
  emit('error', '')
}

function clearFileInputs() {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (replaceFileInput.value) {
    replaceFileInput.value.value = ''
  }
}

function triggerFileInput() {
  if (preview.value) {
    // When replacing, use the separate hidden input
    replaceFileInput.value?.click()
  } else {
    // When uploading initially, use the main input
    fileInput.value?.click()
  }
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function handleDragEnter() {
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  const currentTarget = event.currentTarget as Element | null
  if (currentTarget && !currentTarget.contains(event.relatedTarget as Node)) {
    isDragging.value = false
  }
}

// Watch for external modelValue changes
watch(() => props.modelValue, async (file) => {
  if (file) {
    // Clean up previous preview if it's a blob URL
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = URL.createObjectURL(file)
    fileName.value = file.name
    fileSize.value = file.size
    imageDimensions.value = await getImageDimensions(file)
  } else {
    // If modelValue is null, clear everything
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = props.preview || null
    fileName.value = ''
    fileSize.value = 0
    imageDimensions.value = ''
  }
})

// Watch for preview prop changes
watch(() => props.preview, (newPreview) => {
  if (!props.modelValue) {
    preview.value = newPreview
    fileName.value = ''
    fileSize.value = 0
    imageDimensions.value = ''
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (preview.value && preview.value.startsWith('blob:')) {
    URL.revokeObjectURL(preview.value)
  }
})
</script>

<style scoped>
/* Smooth animations */
.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Shake animation for errors */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.6s ease-in-out;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(12px);
  }
}
</style>