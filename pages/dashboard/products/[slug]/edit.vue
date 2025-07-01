<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
    <div class="mx-auto">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:pencil-square-20-solid" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
            </div>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Update product information and manage inventory details
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <NuxtLink 
              to="/dashboard/products" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-2" />
              Back to Products
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
            
            <!-- Basic Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-2">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
              <div class="p-6 sm:p-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Essential product details</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="lg:col-span-2">
                    <InputTextbox
                      label="Product Name"
                      type="text"
                      id="name"
                      placeholder="Enter a compelling product name"
                      v-model="name"
                      :error="errors.name"
                      class="w-full"
                      :class="{ 'animate-shake': errors.name }"
                    />
                  </div>
                  
                  <div class="lg:col-span-1">
                    <InputSelectBox
                      label="Category"
                      id="category"
                      v-model="category"
                      :options="categories?.map(category => ({ value: String(category.slug), label: category.name }))"
                      :error="errors.category"
                      :placeholder="'Choose a category...'"
                      :loading="isLoading"
                      class="w-full"
                      :class="{ 'animate-shake': errors.category }"
                    />
                  </div>
                  
                  <div class="lg:col-span-1">
                    <InputTextbox
                      label="Price (USD)"
                      type="number"
                      id="price"
                      placeholder="0.00"
                      v-model="price"
                      :error="errors.price"
                      step="0.01"
                      min="0"
                      class="w-full"
                      :class="{ 'animate-shake': errors.price }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Details Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-3">
              <div class="bg-gradient-to-r from-green-500 to-green-600 h-1"></div>
              <div class="p-6 sm:p-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Product Details</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Detailed product information</p>
                  </div>
                </div>
                
                <div class="space-y-6">
                  <div class="lg:col-span-1">
                    <InputTextArea
                      label="Technical Detail"
                      v-model="detail"
                      :error="errors.detail"
                      id="detail"
                      placeholder="Product technical specifications, compatibility, and requirements..."
                      class="w-full"
                      :class="{ 'animate-shake': errors.detail }"
                    />
                  </div>
                  
                  <div class="lg:col-span-1">
                    <InputTextArea
                      label="Marketing Description"
                      v-model="description"
                      :error="errors.description"
                      id="description"
                      placeholder="Product features, benefits, and unique selling points..."
                      class="w-full"
                      :class="{ 'animate-shake': errors.description }"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Sidebar -->
          <div class="xl:col-span-1 space-y-8">
            
            <!-- Product Image Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-4">
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
              <div class="p-6">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:photo-20-solid" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Product Image</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Upload new image</p>
                  </div>
                </div>
                
                <InputImage
                  label="Upload Product Image"
                  rule="JPG, JPEG, PNG • Max 5MB • Recommended: 1024x1024px"
                  id="product-image"
                  v-model="productImage"
                  :error="errors.productImage"
                  :preview="imageUrl ?? undefined"
                  class="w-full"
                  :class="{ 'animate-shake': errors.productImage }"
                />
              </div>
            </div>

            <!-- Form Summary Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-5">
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">Product Name</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="name ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="name ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="category ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="category ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Price</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="price ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="price ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Descriptions</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="(detail && description) ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="(detail && description) ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Current Image</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="(productImage || imageUrl) ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="(productImage || imageUrl) ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Enhanced Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end animate-fade-in-delay-6">
          <NuxtLink
            to="/dashboard/products"
            class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm text-center"
          >
            <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-2" />
            Cancel
          </NuxtLink>
          
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
              name="heroicons:pencil-20-solid" 
              class="w-4 h-4 mr-2" 
            />
            {{ isCreating ? 'Updating Product...' : 'Update Product' }}
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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading Product</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch the product details...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import { InputImage } from '#components';
  import type { Product } from '~/types/products';
  import type { Category } from '~/types/categories';

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'update-product'
  });

  const name = ref('');
  const category = ref<string | undefined>(undefined);
  const detail = ref<string | undefined>(undefined);
  const description = ref<string | undefined>(undefined);
  const price = ref<string>('');
  const categories = ref<Category[] | undefined>(undefined);
  const productImage = ref<File | undefined>(undefined);
  let isLoading = ref(false);
  let isCreating = ref(false);
  const route = useRoute();
  const slug = computed(() => route.params.slug);
  const error = ref<string | null>(null);

  const data = ref<Product | null>(null);
  const imageUrl = ref<string | null>(null);
  const errors = reactive({
    name: '',
    category: '',
    detail: '',
    description: '',
    price: '',
    productImage: ''
  });

  // Computed properties
  const isFormValid = computed(() => {
    return name.value && 
           category.value && 
           detail.value && 
           description.value && 
           price.value &&
           !errors.name && 
           !errors.category && 
           !errors.detail && 
           !errors.description && 
           !errors.price && 
           !errors.productImage;
  });

  const formCompletionPercentage = computed(() => {
    const fields = [name.value, category.value, detail.value, description.value, price.value, (productImage.value || imageUrl.value)];
    const completedFields = fields.filter(field => field && field.toString().trim().length > 0).length;
    return Math.round((completedFields / fields.length) * 100);
  });

  onMounted(async () => {
    await getCategories();
    const response = await useApi<Product[]>(`/products/${slug.value}`, {
      method: 'GET',
    });

    data.value = Array.isArray(response) ? response[0] : response;
    if (data.value) {
      name.value = data.value.name;
      category.value = data.value.category?.slug;
      detail.value = data.value.detail;
      description.value = data.value.description;
      price.value = String(data.value.price);
      if (data.value.image) {
        imageUrl.value = useGetImageUrl(data.value.image);
      }
    }
  })

  async function getCategories() {
    try {
      isLoading.value = true;
      const response = await useApi<Category[]>(`/categories`, {
        method: 'GET',
      });
      categories.value = response;
      category.value = '';
      error.value = null;
    } catch (err: any) {
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  // Validation functions
  const validateName = (newValue: string) => {
    if (!newValue || newValue.trim().length === 0) {
      errors.name = 'Product name is required';
    } else {
      errors.name = '';
    }
  };

  const validateCategory = (newValue: string | undefined) => {
    errors.category = newValue ? '' : 'Category selection is required';
  };

  const validateDetail = (newValue: string | undefined) => {
    if (!newValue || newValue.trim().length === 0) {
      errors.detail = 'Technical detail is required';
    } else {
      errors.detail = '';
    }
  };

  const validateDescription = (newValue: string | undefined) => {
    if (!newValue || newValue.trim().length === 0) {
      errors.description = 'Marketing Description is required';
    } else {
      errors.description = '';
    }
  };

  const validatePrice = (newValue: string) => {
    if (!newValue) {
      errors.price = 'Price is required';
    } else {
      const numPrice = Number(newValue);
      if (isNaN(numPrice)) {
        errors.price = 'Price must be a valid number';
      } else if (numPrice <= 0) {
        errors.price = 'Price must be greater than 0';
      } else if (numPrice > 99999.99) {
        errors.price = 'Price cannot exceed $99,999.99';
      } else {
        errors.price = '';
      }
    }
  };

  const validateProductImage = (newValue: File | undefined) => {
    if (newValue) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!allowedTypes.includes(newValue.type)) {
        errors.productImage = 'Only JPG, JPEG, and PNG files are allowed';
      } else if (newValue.size > maxSize) {
        errors.productImage = 'Image size must be less than 5MB';
      } else {
        errors.productImage = '';
      }
    } else {
      errors.productImage = '';
    }
  };

  watch(name, validateName);
  watch(detail, validateDetail);
  watch(category, validateCategory);
  watch(description, validateDescription);
  watch(price, validatePrice);
  watch(productImage, validateProductImage);

  const handleSubmit = async () => {
    validateName(name.value);
    validateCategory(category.value);
    validateDetail(detail.value);
    validateDescription(description.value);
    validatePrice(price.value);

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
      const response = await useApi<Product[]>(`/products/${slug.value}`, {
        method: 'PATCH',
        data: {
          name: name.value,
          categorySlug: category.value,
          detail: detail.value,
          description: description.value,
          price: price.value ? Number(price.value) : undefined,
          image: productImage.value ?? undefined,
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response) {
        await Swal.fire({
          icon: 'success',
          title: 'Product Updated Successfully!',
          text: 'Your product has been updated in the inventory',
          timer: 2000,
          showConfirmButton: false,
          ...getSwalTheme(),
        });
        navigateTo('/dashboard/products');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to update product. Please try again.';
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
      isCreating.value = false;
    }
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

.animate-fade-in-delay-6 {
  animation: fadeIn 0.6s ease-out 0.6s both;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Enhanced form styling */
:deep(.form-input:focus) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom scrollbar */
:deep(textarea::-webkit-scrollbar) {
  width: 8px;
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