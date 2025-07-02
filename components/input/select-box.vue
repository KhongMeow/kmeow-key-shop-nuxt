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
    
    <!-- Main Select Container -->
    <div class="relative">
      <!-- Select Trigger -->
      <div
        :id="id"
        ref="selectTrigger"
        :class="inputClasses"
        :tabindex="disabled ? -1 : 0"
        @click="toggleDropdown"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-label="label"
      >
        <!-- Display selected value or placeholder -->
        <span 
          v-if="selectedOption" 
          :class="selectedTextClasses"
        >
          {{ selectedOption.label }}
        </span>
        <span 
          v-else
          :class="placeholderTextClasses"
        >
          {{ (isOpen || isFocused) ? placeholder : '\u00A0' }}
        </span>
      </div>
      
      <!-- Right Side Icons -->
      <div class="absolute inset-y-0 right-0 flex items-center pointer-events-none">
        <!-- Clear Button -->
        <button
          v-if="internalValue && !loading && !disabled"
          type="button"
          class="flex items-center justify-center mr-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all duration-200 pointer-events-auto"
          @click.stop="clearSelection"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
        </button>

        <!-- Loading indicator -->
        <div v-if="loading" class="mr-2 p-1">
          <Icon name="eos-icons:loading" class="w-4 h-4 text-blue-500 animate-spin" />
        </div>
        
        <!-- Dropdown Arrow -->
        <div class="flex items-center justify-center mr-3 p-1">
          <Icon 
            name="heroicons:chevron-down-20-solid"
            class="w-4 h-4 transition-all duration-300"
            :class="[
              error ? 'text-red-400' : isOpen ? 'text-blue-500' : 'text-gray-400',
              { 'rotate-180': isOpen }
            ]"
          />
        </div>
      </div>
      
      <!-- Focus Border Animation -->
      <div 
        :class="[
          'absolute inset-0 rounded-xl border-2 transition-all duration-300 pointer-events-none',
          isOpen && !error ? 'border-blue-500' : 'border-transparent'
        ]"
      />
    </div>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdown"
        class="fixed z-[9999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
        :style="dropdownStyle"
      >
        <!-- Search Input -->
        <div class="p-3 border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="text"
              placeholder="Search options..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="filterOptions"
              @keydown="handleSearchKeydown"
            />
          </div>
        </div>

        <!-- Search Results Header -->
        <div 
          v-if="searchTerm && filteredOptions.length > 0" 
          class="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"
        >
          <Icon name="heroicons:magnifying-glass" class="w-3 h-3 inline mr-2" />
          {{ filteredOptions.length }} result{{ filteredOptions.length !== 1 ? 's' : '' }} found
        </div>

        <div class="max-h-60 overflow-y-auto custom-scrollbar">
          <!-- No results message -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-6 py-8 text-center"
          >
            <div class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full">
              <Icon name="heroicons:magnifying-glass" class="w-6 h-6" />
            </div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">No options found</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Try adjusting your search term</p>
          </div>
          
          <!-- Options list -->
          <div class="py-1">
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              class="px-4 py-3 text-sm cursor-pointer transition-all duration-200 ease-out flex items-center justify-between group rounded m-1"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': option.value === internalValue,
                'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800': option.value !== internalValue,
                'bg-gray-100 dark:bg-gray-700': highlightedIndex === index && option.value !== internalValue
              }"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
            >
              <span class="flex-1 font-medium truncate pr-3">{{ option.label }}</span>
              
              <!-- Selected indicator -->
              <Icon
                v-if="option.value === internalValue"
                name="heroicons:check"
                class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
              />
            </div>
          </div>
        </div>

        <!-- Footer with keyboard shortcuts hint -->
        <div 
          v-if="filteredOptions.length > 0" 
          class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between"
        >
          <div class="flex items-center">
            <Icon name="heroicons:command-line" class="w-3 h-3 mr-1.5" />
            <span class="font-medium">Keyboard shortcuts</span>
          </div>
          <div class="flex items-center space-x-3 text-xs">
            <span class="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border text-gray-600 dark:text-gray-300">↑↓</span>
            <span class="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border text-gray-600 dark:text-gray-300">⏎</span>
            <span class="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border text-gray-600 dark:text-gray-300">Esc</span>
          </div>
        </div>
      </div>
    </Teleport>

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
import { defineProps, defineEmits, ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option...'
  },
  options: {
    type: Array as () => Array<{ value: string, label: string }>,
    default: () => []
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
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const internalValue = ref(props.modelValue)
const searchTerm = ref('')
const isOpen = ref(false)
const isFocused = ref(false)
const selectTrigger = ref<HTMLDivElement>()
const dropdown = ref<HTMLDivElement>()
const searchInput = ref<HTMLInputElement>()
const highlightedIndex = ref(-1)

// Dropdown positioning
const dropdownStyle = ref({})

const hasContent = computed(() => internalValue.value && internalValue.value.length > 0)

// Computed property to get the selected option
const selectedOption = computed(() => {
  return props.options.find(option => option.value === internalValue.value)
})

// Selected text classes
const selectedTextClasses = computed(() => [
  'block truncate font-medium',
  props.error 
    ? 'text-red-700 dark:text-red-300'
    : props.disabled
      ? 'text-gray-400 dark:text-gray-500'
      : 'text-gray-900 dark:text-white'
])

// Placeholder text classes
const placeholderTextClasses = computed(() => [
  'block truncate',
  props.error 
    ? 'text-red-400 dark:text-red-500'
    : props.disabled
      ? 'text-gray-300 dark:text-gray-600'
      : 'text-gray-400 dark:text-gray-500'
])

// Floating label classes
const labelClasses = computed(() => [
  'absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none',
  'text-sm font-medium z-10',
  (hasContent.value || isFocused.value || isOpen.value) ? [
    '-top-2.5 text-xs px-2 py-0.5 rounded-md',
    'bg-white dark:bg-gray-900',
    props.error 
      ? 'text-red-600 dark:text-red-400' 
      : (isFocused.value || isOpen.value)
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
        : 'text-gray-600 dark:text-gray-300'
  ] : [
    'top-3.5',
    props.error 
      ? 'text-red-500 dark:text-red-400'
      : 'text-gray-500 dark:text-gray-400'
  ]
])

// Input classes
const inputClasses = computed(() => [
  'w-full px-4 py-3.5 pr-20 text-sm transition-all duration-300 ease-out cursor-pointer',
  'border-2 rounded-xl outline-none',
  'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
  'leading-relaxed',
  
  // State-based styling
  props.error ? [
    'border-red-300 dark:border-red-600',
    'hover:border-red-400 dark:hover:border-red-500',
    'focus:border-red-500 dark:focus:border-red-400',
    'bg-red-50/50 dark:bg-red-900/10'
  ] : props.disabled ? [
    'border-gray-200 dark:border-gray-700',
    'bg-gray-50/50 dark:bg-gray-800/50',
    'cursor-not-allowed opacity-60'
  ] : (isFocused.value || isOpen.value) ? [
    'border-blue-300 dark:border-blue-600',
    'bg-white dark:bg-gray-900',
    'shadow-sm'
  ] : [
    'border-gray-200 dark:border-gray-700',
    'hover:border-gray-300 dark:hover:border-gray-600',
    'focus:border-blue-300 dark:focus:border-blue-600'
  ]
])

// Filtered options based on search term
const filteredOptions = computed(() => {
  if (!searchTerm.value) {
    return props.options
  }
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Calculate dropdown position
const calculateDropdownPosition = () => {
  if (!selectTrigger.value) return

  const rect = selectTrigger.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = 300 // approximate max height
  
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  
  // Position dropdown below if there's space, otherwise above
  const shouldPositionAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  
  dropdownStyle.value = {
    left: `${rect.left}px`,
    top: shouldPositionAbove ? `${rect.top - Math.min(dropdownHeight, spaceAbove - 10)}px` : `${rect.bottom + 4}px`,
    width: `${rect.width}px`,
    maxHeight: `${Math.min(dropdownHeight, shouldPositionAbove ? spaceAbove - 10 : spaceBelow - 10)}px`
  }
}

// Watch for external value changes
watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

// Watch for dropdown open to update position
watch(isOpen, (val) => {
  if (val) {
    calculateDropdownPosition()
    nextTick(() => {
      searchInput.value?.focus()
    })
    highlightedIndex.value = -1
  } else {
    searchTerm.value = ''
    highlightedIndex.value = -1
  }
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleFocus() {
  if (props.disabled) return
  isFocused.value = true
  emit('focus')
}

function handleBlur() {
  // Delay blur to allow for click events
  setTimeout(() => {
    isFocused.value = false
  }, 150)
  emit('blur')
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown()
      } else if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      selectTrigger.value?.focus()
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown()
      } else {
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      }
      break
  }
}

function handleSearchKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      selectTrigger.value?.focus()
      break
  }
}

function filterOptions() {
  highlightedIndex.value = -1
}

function selectOption(option: { value: string, label: string }) {
  internalValue.value = option.value
  isOpen.value = false
  emit('update:modelValue', option.value)
  selectTrigger.value?.focus()
}

function clearSelection() {
  internalValue.value = ''
  emit('update:modelValue', '')
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element
  if (
    !selectTrigger.value?.contains(target) &&
    !dropdown.value?.contains(target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', () => {
    if (isOpen.value) {
      calculateDropdownPosition()
    }
  })
  window.addEventListener('scroll', () => {
    if (isOpen.value) {
      calculateDropdownPosition()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* Custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgb(148 163 184), rgb(100 116 139));
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgb(100 116 139), rgb(71 85 105));
}

/* Dark mode scrollbar */
.dark .custom-scrollbar {
  scrollbar-color: rgb(75 85 99) transparent;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgb(75 85 99), rgb(55 65 81));
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgb(107 114 128), rgb(75 85 99));
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>