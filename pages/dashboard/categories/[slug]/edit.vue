<template>
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
    <div class="mx-auto">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:pencil-square-20-solid" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Edit Category</h1>
            </div>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Update category information and settings
            </p>
          </div>
          <div class="flex items-center space-x-3">
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
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Main Form Content -->
          <div class="xl:col-span-2 space-y-8">
            
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
                
                <div class="space-y-4">
                  <InputTextbox
                    label="Category Name"
                    type="text"
                    id="name"
                    placeholder="Enter category name"
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
          <div class="xl:col-span-1 space-y-8">
            
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
                  <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Category Name</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="name ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="name ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Form Valid</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="isFormValid ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="isFormValid ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
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
            :disabled="isEditing"
          >
            <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2" />
            Reset Changes
          </button>
          
          <ButtonSubmit 
            class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg" 
            :disabled="isEditing || !isFormValid"
          >
            <Icon 
              v-if="isEditing" 
              name="heroicons:arrow-path-20-solid" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            <Icon 
              v-else 
              name="heroicons:pencil-square-20-solid" 
              class="w-4 h-4 mr-2" 
            />
            {{ isEditing ? 'Updating Category...' : 'Update Category' }}
          </ButtonSubmit>
        </div>
      </form>

      <!-- Enhanced Loading Overlay -->
      <div 
        v-if="isLoading" 
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:arrow-path-20-solid" class="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading Category</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch the category data...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import type { Category } from '~/types/categories';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard', 'permission'],
  requiredPermission: 'update-category',
});

// Reactive data
const name = ref('');
const isEditing = ref(false);
const isLoading = ref(false);
const route = useRoute();
const slug = computed(() => route.params.slug);

const data = ref<Category | null>(null);
const originalName = ref('');

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

// Lifecycle
onMounted(async () => {
  await loadCategory();
});

// Methods
async function loadCategory() {
  try {
    isLoading.value = true;
    const response = await useApi<Category[]>(`/categories/${slug.value}`, {
      method: 'GET',
    });

    data.value = Array.isArray(response) ? response[0] : response;
    if (data.value) {
      name.value = data.value.name;
      originalName.value = data.value.name;
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error Loading Category',
      text: err.response?.data?.message || 'Failed to load category data',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
  } finally {
    isLoading.value = false;
  }
}

// Validation functions
const validateName = (newValue: string) => {
  if (!newValue || newValue.trim().length === 0) {
    errors.name = 'Category name is required';
  } else if (newValue.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters';
  } else if (newValue.trim().length > 50) {
    errors.name = 'Category name cannot exceed 50 characters';
  } else {
    errors.name = '';
  }
};

// Watchers for real-time validation
watch(name, validateName);

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Reset form
const resetForm = () => {
  Swal.fire({
    title: 'Reset Changes?',
    text: 'This will restore the original category name',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reset',
    cancelButtonText: 'Cancel',
    ...getSwalTheme(),
  }).then((result) => {
    if (result.isConfirmed) {
      name.value = originalName.value;
      
      // Clear errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
      });

      Swal.fire({
        icon: 'success',
        title: 'Changes Reset',
        text: 'Form has been restored to original values',
        timer: 1500,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
    }
  });
};

// Form submission
const handleSubmit = async () => {
  // Validate all fields
  validateName(name.value);

  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Form Invalid',
      text: 'Please fix the errors before submitting',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
    return;
  }

  try {
    isEditing.value = true;
    const response = await useApi<Category[]>(`/categories/${slug.value}`, {
      method: 'PATCH',
      data: {
        name: name.value.trim(),
      },
    });

    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'Category Updated Successfully!',
        text: 'The category has been updated with the new information',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      
      await navigateTo('/dashboard/categories');
    }
  } catch (err: any) {
    console.error('Update category error:', err);
    
    let errorMessage = 'Failed to update category. Please try again.';
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
      confirmButtonText: 'Try Again',
      ...getSwalTheme(),
    });
  } finally {
    isEditing.value = false;
  }
};

// Prevent accidental navigation
onBeforeRouteLeave((to, from, next) => {
  const hasChanges = name.value.trim() !== originalName.value.trim();
  
  if (hasChanges && !isEditing.value) {
    Swal.fire({
      title: 'Unsaved Changes',
      text: 'You have unsaved changes. Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Leave Without Saving',
      cancelButtonText: 'Stay',
      ...getSwalTheme(),
    }).then((result) => {
      if (result.isConfirmed) {
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

/* Responsive grid improvements */
@media (max-width: 1279px) {
  .xl\:col-span-2 {
    grid-column: span 1;
  }
  .xl\:col-span-1 {
    grid-column: span 1;
  }
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