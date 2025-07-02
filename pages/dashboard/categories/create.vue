<template>
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
    <div class="mx-auto">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:plus-20-solid" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Create Category</h1>
            </div>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Add a new category to organize your products effectively
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Save Draft Button -->
            <button
              type="button"
              @click="saveDraft"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
              :disabled="isCreating"
            >
              <Icon name="heroicons:document-duplicate-20-solid" class="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <NuxtLink 
              to="/dashboard/categories" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-2" />
              Back to Categories
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-8 animate-fade-in-delay-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Form Completion</span>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ formCompletionPercentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${formCompletionPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Form Cards Container -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Form Content -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Category Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-2">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
              <div class="p-6 sm:p-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:tag-20-solid" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Category Information</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Essential category details</p>
                  </div>
                </div>
                
                <div class="space-y-6">
                  <InputTextbox
                    label="Category Name"
                    type="text"
                    id="name"
                    placeholder="Enter a descriptive category name"
                    v-model="name"
                    :error="errors.name"
                    class="w-full"
                    :class="{ 'animate-shake': errors.name }"
                  />
                  
                  <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div class="flex items-start">
                      <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div class="text-sm">
                        <p class="text-blue-800 dark:text-blue-200 font-medium mb-1">Category Name Guidelines</p>
                        <ul class="text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Use clear, descriptive names</li>
                          <li>• Keep it concise (2-20 characters recommended)</li>
                          <li>• Avoid special characters</li>
                          <li>• Use proper capitalization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            
            <!-- Form Summary Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-3">
              <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1"></div>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
                    <Icon name="heroicons:clipboard-document-check-20-solid" class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Form Summary</h3>
                </div>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Category Name</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="name ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="name ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p><strong>Character Count:</strong> {{ name.length }}/50</p>
                      <p><strong>Status:</strong> 
                        <span :class="isFormValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                          {{ isFormValid ? 'Ready to submit' : 'Incomplete' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-4">
              <div class="bg-gradient-to-r from-green-500 to-green-600 h-1"></div>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
                </div>
                
                <div class="space-y-3">
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Category will appear as:</p>
                    <div class="flex items-center space-x-2">
                      <Icon name="heroicons:tag-20-solid" class="w-4 h-4 text-gray-500" />
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ name || 'Category Name' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Enhanced Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end animate-fade-in-delay-5">
          <button
            type="button"
            @click="resetForm"
            class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            :disabled="isCreating"
          >
            <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2" />
            Reset Form
          </button>
          
          <ButtonSubmit 
            class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg" 
            :disabled="isCreating || !isFormValid"
          >
            <Icon 
              v-if="isCreating" 
              name="heroicons:arrow-path-20-solid" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            <Icon 
              v-else 
              name="heroicons:plus-20-solid" 
              class="w-4 h-4 mr-2" 
            />
            {{ isCreating ? 'Creating Category...' : 'Create Category' }}
          </ButtonSubmit>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import type { Category } from '~/types/categories';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard', 'permission'],
  requiredPermission: 'create-category',
});

// Reactive data
const name = ref('');
const isCreating = ref(false);

// Form validation errors
const errors = reactive({
  name: '',
});

// Computed properties
const isFormValid = computed(() => {
  return name.value && name.value.trim().length > 0 && !errors.name;
});

const formCompletionPercentage = computed(() => {
  return name.value && name.value.trim().length > 0 ? 100 : 0;
});

// Validation functions
const validateName = (newValue: string) => {
  if (!newValue || newValue.trim().length === 0) {
    errors.name = 'Category name is required';
  } else if (newValue.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters long';
  } else if (newValue.trim().length > 50) {
    errors.name = 'Category name must be less than 50 characters';
  } else {
    errors.name = '';
  }
};

// Watchers for real-time validation
watch(name, validateName);

// Save draft functionality
const saveDraft = () => {
  const draftData = {
    name: name.value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('category-draft', JSON.stringify(draftData));
  
  Swal.fire({
    icon: 'success',
    title: 'Draft Saved',
    text: 'Your progress has been saved locally',
    timer: 2000,
    showConfirmButton: false,
    ...getSwalTheme(),
  });
};

// Form submission
const handleSubmit = async () => {
  validateName(name.value);

  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Form Incomplete',
      text: 'Please fill in the category name and fix any errors',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
    return;
  }

  try {
    isCreating.value = true;
    
    const response = await useApi<Category[]>(`/categories`, {
      method: 'POST',
      data: {
        name: name.value.trim(),
      },
    });

    if (response) {
      // Clear saved draft
      localStorage.removeItem('category-draft');
      
      await Swal.fire({
        icon: 'success',
        title: 'Category Created Successfully!',
        text: 'Your category has been added to the system',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      
      await navigateTo('/dashboard/categories');
    }
  } catch (err: any) {
    console.error('Create category error:', err);
    
    let errorMessage = 'Failed to create category. Please try again.';
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Creation Failed',
      text: errorMessage,
      confirmButtonText: 'Try Again',
      ...getSwalTheme(),
    });
  } finally {
    isCreating.value = false;
  }
};

// Reset form
const resetForm = () => {
  Swal.fire({
    title: 'Reset Form?',
    text: 'This will clear all entered information',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reset',
    cancelButtonText: 'Cancel',
    ...getSwalTheme(),
  }).then((result) => {
    if (result.isConfirmed) {
      name.value = '';
      
      // Clear errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
      });

      // Clear saved draft
      localStorage.removeItem('category-draft');

      Swal.fire({
        icon: 'success',
        title: 'Form Reset',
        text: 'All fields have been cleared',
        timer: 1500,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
    }
  });
};

// Load draft on mount
onMounted(() => {
  const savedDraft = localStorage.getItem('category-draft');
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft);
      Swal.fire({
        title: 'Load Saved Draft?',
        text: 'We found a previously saved draft. Would you like to load it?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Load Draft',
        cancelButtonText: 'Start Fresh',
        ...getSwalTheme(),
      }).then((result) => {
        if (result.isConfirmed) {
          name.value = draftData.name || '';
        } else {
          localStorage.removeItem('category-draft');
        }
      });
    } catch (error) {
      localStorage.removeItem('category-draft');
    }
  }
});

// Prevent accidental navigation
onBeforeRouteLeave((to, from, next) => {
  const hasContent = name.value && name.value.trim().length > 0;
  
  if (hasContent && !isCreating.value) {
    Swal.fire({
      title: 'Unsaved Changes',
      text: 'You have unsaved changes. Do you want to save as draft before leaving?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Save & Leave',
      denyButtonText: 'Leave Without Saving',
      cancelButtonText: 'Stay',
      ...getSwalTheme(),
    }).then((result) => {
      if (result.isConfirmed) {
        saveDraft();
        next();
      } else if (result.isDenied) {
        next();
      } else {
        next(false);
      }
    });
  } else {
    next();
  }
});
</script>

<style scoped>
/* Enhanced animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-delay-1 {
  animation: fadeIn 0.6s ease-out 0.1s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.animate-fade-in-delay-3 {
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.animate-fade-in-delay-4 {
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.animate-fade-in-delay-5 {
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Enhanced form styling */
:deep(.form-input:focus) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-1 {
    gap: 1rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
  
  .sm\:p-8 {
    padding: 1.5rem;
  }
}
</style>