<template>
  <div class="group relative mb-4">
    <!-- Floating Label -->
    <label 
      :for="id" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Main Textarea Container -->
    <div class="relative">
      <!-- Textarea -->
      <textarea 
        :id="id" 
        :aria-describedby="ariaDescribedby" 
        :class="textareaClasses"
        :placeholder="isFocused ? placeholder : ''" 
        :value="modelValue" 
        :disabled="disabled"
        :rows="rows"
        :maxlength="maxLength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="textareaRef"
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
      
      <!-- Character Counter -->
      <div v-if="maxLength && showCharCount" class="flex justify-end mt-1">
        <span 
          :class="[
            'text-xs font-medium px-2 py-1 rounded-full transition-all duration-200',
            characterCount > maxLength * 0.9 
              ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' 
              : characterCount > maxLength * 0.7
                ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20'
                : 'text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'
          ]"
        >
          {{ characterCount }}/{{ maxLength }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
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
  helpText: {
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
  rows: {
    type: Number,
    default: 4
  },
  maxLength: {
    type: Number,
    default: null
  },
  showCharCount: {
    type: Boolean,
    default: true
  },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value) => ['none', 'both', 'horizontal', 'vertical'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'minimal', 'bordered'
    validator: (value) => ['default', 'minimal', 'bordered'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const textareaRef = ref(null)
const isFocused = ref(false)

const characterCount = computed(() => props.modelValue?.length || 0)
const hasContent = computed(() => props.modelValue && props.modelValue.length > 0)

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

const textareaClasses = computed(() => [
  'w-full px-4 py-3.5 text-sm transition-all duration-300 ease-out',
  'border-2 rounded-xl outline-none',
  'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
  'text-gray-900 dark:text-white',
  'placeholder-gray-400 dark:placeholder-gray-500',
  'font-medium leading-relaxed',
  
  // Resize classes
  {
    'resize-none': props.resize === 'none',
    'resize': props.resize === 'both',
    'resize-x': props.resize === 'horizontal',
    'resize-y': props.resize === 'vertical'
  },
  
  // Variant-based base styling
  props.variant === 'minimal' ? [
    'border-0 border-b-2 rounded-none px-0 bg-transparent'
  ] : props.variant === 'bordered' ? [
    'border-2 bg-transparent'
  ] : [],
  
  // State-based styling
  props.error ? [
    'border-red-300 dark:border-red-600',
    'focus:border-red-500 dark:focus:border-red-400',
    'bg-red-50/50 dark:bg-red-900/10'
  ] : props.disabled ? [
    'border-gray-200 dark:border-gray-700',
    'bg-gray-50/50 dark:bg-gray-800/50',
    'text-gray-400 dark:text-gray-500',
    'cursor-not-allowed opacity-60'
  ] : isFocused.value ? [
    'border-blue-300 dark:border-blue-600',
    'bg-white dark:bg-gray-900'
  ] : [
    'border-gray-200 dark:border-gray-700',
    'hover:border-gray-300 dark:hover:border-gray-600',
    'focus:border-blue-300 dark:focus:border-blue-600'
  ]
])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  autoResize()
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const autoResize = () => {
  if (textareaRef.value && props.resize === 'vertical') {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight + 2}px`
  }
}

// Watch for content changes to auto-resize
watch(() => props.modelValue, () => {
  nextTick(() => autoResize())
}, { immediate: true })
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

/* Enhanced scrollbar */
textarea::-webkit-scrollbar {
  width: 8px;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(12px);
  }
}
</style>