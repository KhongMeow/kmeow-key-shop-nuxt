<template>
  <div class="mb-6 relative">
    <label v-if="label" class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      {{ label }}
    </label>
    
    <!-- Search Input -->
    <div class="relative group">
      <input
        ref="searchInput"
        type="text"
        v-model="searchTerm"
        :placeholder="selectedOption?.label || placeholder || 'Search or select an option...'"
        class="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl shadow-sm transition-all duration-200 ease-in-out placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:hover:border-gray-500 dark:focus:ring-blue-500"
        :class="{
          'pr-12': true,
          'ring-2 ring-blue-500 border-transparent': isOpen,
          'border-red-300 focus:ring-red-500 dark:border-red-600': error
        }"
        @focus="openDropdown"
        @blur="closeDropdown"
        @input="filterOptions"
      />
      
      <!-- Dropdown Arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <Icon 
          name="heroicons:chevron-down-20-solid"
          class="w-5 h-5 text-gray-400 transition-all duration-300 ease-in-out group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
          :class="{ 'rotate-180 text-blue-500 dark:text-blue-400': isOpen }"
        />
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="absolute inset-y-0 right-12 flex items-center pr-2">
        <Icon 
          name="eos-icons:loading"
          class="w-4 h-4 text-blue-500"
        />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isOpen"
        class="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-gray-800 dark:border-gray-600 backdrop-blur-sm overflow-hidden"
        :style="{ width: dropdownWidth + 'px' }"
      >
        <!-- Search Results Header -->
        <div v-if="searchTerm && filteredOptions.length > 0" class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
          {{ filteredOptions.length }} result{{ filteredOptions.length !== 1 ? 's' : '' }} found
        </div>

        <div class="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600">
          <!-- No results message -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-4 py-8 text-center"
          >
            <div class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600 flex items-center justify-center">
              <Icon 
                name="heroicons:magnifying-glass-20-solid"
                class="w-8 h-8"
              />
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No options found</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search term</p>
          </div>
          
          <!-- Options list -->
          <div
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="px-4 py-3 text-sm cursor-pointer transition-all duration-150 ease-in-out flex items-center justify-between group relative hover:overflow-hidden"
            :class="{
              'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300': option.value === internalValue,
              'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700': option.value !== internalValue,
              'border-b border-gray-100 dark:border-gray-700': index < filteredOptions.length - 1
            }"
            @mousedown.prevent="selectOption(option)"
          >
            <span class="flex-1 font-medium">{{ option.label }}</span>
            
            <!-- Selected indicator -->
            <div
              v-if="option.value === internalValue"
              class="flex items-center ml-3"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <Icon 
                name="heroicons:check-20-solid"
                class="w-4 h-4 text-blue-500 dark:text-blue-400"
              />
            </div>
          </div>
        </div>

        <!-- Footer with keyboard shortcuts hint -->
        <div v-if="filteredOptions.length > 0" class="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl flex items-center">
          <Icon 
            name="heroicons:information-circle-20-solid"
            class="w-3 h-3 mr-1"
          />
          Use ↑↓ arrows to navigate, Enter to select, Escape to close
        </div>
      </div>
    </Transition>

    <!-- Error message with icon -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-1 opacity-0"
    >
      <div v-if="error" class="flex items-center mt-2 text-red-600 dark:text-red-400">
        <Icon 
          name="heroicons:exclamation-circle-20-solid"
          class="w-4 h-4 mr-2 flex-shrink-0"
        />
        <p class="text-sm font-medium">{{ error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch, computed, nextTick, onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  label: { type: String },
  placeholder: { type: String },
  options: {
    type: Array as () => Array<{ value: string, label: string }>,
    default: () => []
  },
  error: { type: String },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const searchTerm = ref('')
const isOpen = ref(false)
const searchInput = ref<HTMLInputElement>()

// Dropdown width and position
const dropdownWidth = ref(0)

function updateDropdownPosition() {
  if (searchInput.value) {
    const rect = searchInput.value.getBoundingClientRect()
    dropdownWidth.value = rect.width
  }
}

// Computed property to get the selected option
const selectedOption = computed(() => {
  return props.options.find(option => option.value === internalValue.value)
})

// Filtered options based on search term
const filteredOptions = computed(() => {
  if (!searchTerm.value) {
    return props.options
  }
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Watch for external value changes
watch(() => props.modelValue, (val) => {
  internalValue.value = val
  updateSearchTerm()
})

// Watch for dropdown open to update position
watch(isOpen, (val) => {
  if (val) {
    nextTick(updateDropdownPosition)
  }
})

// Update search term when value changes
function updateSearchTerm() {
  if (!isOpen.value) {
    searchTerm.value = selectedOption.value?.label || ''
  }
}

function openDropdown() {
  isOpen.value = true
  searchTerm.value = ''
  nextTick(() => {
    searchInput.value?.focus()
    updateDropdownPosition()
  })
}

function closeDropdown() {
  setTimeout(() => {
    isOpen.value = false
    updateSearchTerm()
  }, 150)
}

function filterOptions() {
  // The filtering is handled by the computed property
}

function selectOption(option: { value: string, label: string }) {
  internalValue.value = option.value
  searchTerm.value = option.label
  isOpen.value = false
  searchInput.value?.blur()
  emit('update:modelValue', option.value)
}

// Initialize search term
updateSearchTerm()

onMounted(() => {
  updateDropdownPosition()
  window.addEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}
</style>