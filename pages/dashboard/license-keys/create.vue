<template>
  <div class="bg-gray-50 dark:bg-gray-800 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
    <div class="mx-auto">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:key-20-solid" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Create License Key</h1>
            </div>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Add a new license key to your inventory with product association
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <NuxtLink 
              to="/dashboard/license-keys" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-2" />
              Back to License Keys
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
            
            <!-- License Key Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-2">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
              <div class="p-6 sm:p-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:key-20-solid" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">License Key Details</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Essential license key information</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
                  <div class="lg:col-span-2 mb-4">
                    <InputTextbox
                      label="License Key"
                      type="text"
                      id="key"
                      placeholder="Enter unique license key (e.g., XXXX-XXXX-XXXX-XXXX)"
                      v-model="key"
                      :error="errors.key"
                      class="w-full"
                      :class="{ 'animate-shake': errors.key }"
                    />
                  </div>
                  
                  <div class="lg:col-span-2">
                    <InputSelectBox
                      label="Associated Product"
                      id="product"
                      v-model="product"
                      :options="products?.map(product => ({ value: String(product.slug), label: product.name }))"
                      :error="errors.product"
                      :placeholder="'Choose a product...'"
                      :loading="isLoading"
                      class="w-full"
                      :class="{ 'animate-shake': errors.product }"
                    />
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">License Key</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="key ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="key ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Product</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="product ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="product ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions Card -->
            <!-- <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-4">
              <div class="bg-gradient-to-r from-green-500 to-green-600 h-1"></div>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                    <Icon name="heroicons:bolt-20-solid" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                </div>
                
                <div class="space-y-3">
                  <button
                    type="button"
                    @click="generateRandomKey"
                    class="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-all duration-200"
                    :disabled="isCreating"
                  >
                    <Icon name="heroicons:sparkles-20-solid" class="w-4 h-4 mr-2" />
                    Generate Random Key
                  </button>
                </div>
              </div>
            </div> -->

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
              name="heroicons:key-20-solid" 
              class="w-4 h-4 mr-2" 
            />
            {{ isCreating ? 'Creating License Key...' : 'Create License Key' }}
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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading Products</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch the latest products...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import type { LicenseKey } from '~/types/license-keys';
import type { Product } from '~/types/products';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard', 'permission'],
  requiredPermission: 'create-license-key',
});

// Reactive data
const key = ref('');
const product = ref<string | undefined>(undefined);
const products = ref<Product[] | undefined>(undefined);
const isLoading = ref(false);
const error = ref<string | null>(null);
let isCreating = ref(false);

// Form validation errors
const errors = reactive({
  key: '',
  product: '',
});

// Computed properties
const isFormValid = computed(() => {
  return key.value && 
         product.value &&
         !errors.key && 
         !errors.product;
});

const formCompletionPercentage = computed(() => {
  const fields = [key.value, product.value];
  const completedFields = fields.filter(field => field && field.toString().trim().length > 0).length;
  return Math.round((completedFields / fields.length) * 100);
});

// Lifecycle
onMounted(async () => {
  await getProducts();
});

// Methods
async function getProducts() {
  try {
    isLoading.value = true;
    const response = await useApi<Product[]>(`/products`, {
      method: 'GET',
    });
    products.value = response;
    error.value = null;
  } catch (err: any) {
    error.value = err?.message || 'Unknown error';
    Swal.fire({
      icon: 'error',
      title: 'Error Loading Products',
      text: 'Failed to load products. Please refresh the page.',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
  } finally {
    isLoading.value = false;
  }
}

// Validation functions
const validateKey = (newValue: string) => {
  if (!newValue || newValue.trim().length === 0) {
    errors.key = 'License key is required';
  } else {
    errors.key = '';
  }
};

const validateProduct = (newValue: string | undefined) => {
  errors.product = newValue ? '' : 'Product selection is required';
};

// Watchers for real-time validation
watch(key, validateKey);
watch(product, validateProduct);

// Generate random key
const generateRandomKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  
  let randomKey = '';
  for (let i = 0; i < segments; i++) {
    if (i > 0) randomKey += '-';
    for (let j = 0; j < segmentLength; j++) {
      randomKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  key.value = randomKey;
  
  Swal.fire({
    icon: 'success',
    title: 'Key Generated',
    text: 'Random license key has been generated',
    timer: 1500,
    showConfirmButton: false,
    ...getSwalTheme(),
  });
};

// Form submission
const handleSubmit = async () => {
  // Validate all fields
  validateKey(key.value);
  validateProduct(product.value);

  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Form Incomplete',
      text: 'Please fill in all required fields and fix any errors',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
    return;
  }

  try {
    isCreating.value = true;
    const response = await useApi<LicenseKey[]>(`/license-keys`, {
      method: 'POST',
      data: {
        key: key.value.trim(),
        productSlug: product.value,
      },
    });

    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'License Key Created Successfully!',
        text: 'Your license key has been added to the inventory',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      
      await navigateTo('/dashboard/license-keys');
    }
  } catch (err: any) {
    console.error('Create license key error:', err);
    
    let errorMessage = 'Failed to create license key. Please try again.';
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
      key.value = '';
      product.value = undefined;
      
      // Clear errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
      });

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