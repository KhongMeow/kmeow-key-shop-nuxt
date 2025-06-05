<template>
  <div class="mb-4 relative">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
    
    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        type="text"
        v-model="searchTerm"
        :placeholder="selectedOption?.label || placeholder || 'Select an option...'"
        class="bg-gray-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
        @focus="openDropdown"
        @blur="closeDropdown"
        @input="filterOptions"
      />
      <!-- Dropdown Arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg 
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-show="isOpen"
      class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 max-h-60 overflow-y-auto min-w-full"
    >
      <!-- No results message -->
      <div
        v-if="filteredOptions.length === 0"
        class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
      >
        No options found
      </div>
      
      <!-- Options list -->
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between whitespace-nowrap"
        :class="{
          'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300': option.value === internalValue
        }"
        @mousedown.prevent="selectOption(option)"
      >
        <span>{{ option.label }}</span>
        <!-- Checkmark for selected option -->
        <svg
          v-if="option.value === internalValue"
          class="w-4 h-4 ml-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-sm font-medium dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
// ...existing code...
import { defineProps, defineEmits, ref, watch, computed, nextTick } from 'vue'

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
const searchTerm = ref('')
const isOpen = ref(false)
const searchInput = ref<HTMLInputElement>()

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
  })
}

function closeDropdown() {
  setTimeout(() => {
    isOpen.value = false
    updateSearchTerm()
  }, 150) // Small delay to allow option selection
}

function filterOptions() {
  // The filtering is handled by the computed property
}

function selectOption(option: { value: string, label: string }) {
  internalValue.value = option.value
  searchTerm.value = option.label
  isOpen.value = false
  // Remove focus from the input to close cursor
  searchInput.value?.blur()
  emit('update:modelValue', option.value)
}

// Initialize search term
updateSearchTerm()
</script>