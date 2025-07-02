<template>
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
    <div class="mx-auto">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:pencil-square" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Edit Slide Show</h1>
            </div>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Update your slide show with attractive visuals for the index page
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <NuxtLink 
              to="/dashboard/slides-show" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-2" />
              Back to Slides
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!data" class="flex items-center justify-center py-12 animate-fade-in-delay-1">
        <div class="text-center">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">Loading slide show...</p>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div v-else class="mb-8 animate-fade-in-delay-1">
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
      <form v-if="data" @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Form Cards Container -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Main Form Content -->
          <div class="xl:col-span-2 space-y-8">
            
            <!-- Slide Show Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-2">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
              <div class="p-6 sm:p-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Slide Show Information</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Essential slide show details</p>
                  </div>
                </div>
                
                <div class="w-full">
                  <InputTextbox
                    id="title"
                    v-model="title"
                    label="Slide Title"
                    placeholder="Enter an engaging title for your slide show"
                    icon="heroicons:tag"
                    :error="errors.title"
                    :required="true"
                    class="w-full"
                    :class="{ 'animate-shake': errors.title }"
                  />
                </div>
              </div>
            </div>

            <!-- Slide Image Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-3">
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
              <div class="p-6">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="heroicons:photo-20-solid" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Slide Image</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Upload slide image</p>
                  </div>
                </div>
                
                <InputImage
                  id="slideImage"
                  v-model="slideImage"
                  label="Upload Slide Image"
                  rule="JPG, JPEG, PNG • Max 5MB • Recommended: 1920x1080px"
                  :error="errors.slideImage"
                  :preview="imageUrl"
                  :max-size="5 * 1024 * 1024"
                  :allowed-types="['image/jpeg', 'image/jpg', 'image/png']"
                  @error="errors.slideImage = $event"
                  class="w-full"
                  :class="{ 'animate-shake': errors.slideImage }"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="xl:col-span-1 space-y-8">

            <!-- Form Summary Card -->
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-delay-4">
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">Slide Title</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="title ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="title ? 'text-green-500' : 'text-red-500'"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Slide Image</span>
                    <div class="flex items-center">
                      <Icon 
                        :name="(slideImage || imageUrl) ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" 
                        :class="(slideImage || imageUrl) ? 'text-green-500' : 'text-red-500'"
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
            to="/dashboard/slides-show"
            class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm text-center"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4 mr-2" />
            Cancel
          </NuxtLink>
          
          <button
            type="submit"
            :disabled="isEditing || !isFormValid"
            class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <Icon 
              v-if="isEditing" 
              name="heroicons:arrow-path-20-solid" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            <Icon 
              v-else 
              name="heroicons:pencil-square" 
              class="w-4 h-4 mr-2" 
            />
            {{ isEditing ? 'Updating Slide Show...' : 'Update Slide Show' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import type { SlideShow } from '~/types/slides-show';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard', 'permission'],
  requiredPermission: 'update-slide-show'
});

const title = ref('');
const slideImage = ref<File | undefined>(undefined);
const isEditing = ref(false);
const route = useRoute();
const slug = computed(() => route.params.slug);

const data = ref<SlideShow | null>(null);
const imageUrl = ref<string | null>(null);
const errors = reactive({
  title: '',
  slideImage: ''
});

// Computed properties
const isFormValid = computed(() => {
  return title.value && 
         !errors.title && 
         !errors.slideImage;
});

const formCompletionPercentage = computed(() => {
  const fields = [title.value, (slideImage.value || imageUrl.value)];
  const completedFields = fields.filter(field => field && field.toString().trim().length > 0).length;
  return Math.round((completedFields / fields.length) * 100);
});

onMounted(async () => {
  try {
    const response = await useApi<SlideShow[]>(`/slides-show/${slug.value}`, {
      method: 'GET',
    });

    data.value = Array.isArray(response) ? response[0] : response;
    if (data.value) {
      title.value = data.value.title;
      if (data.value.image) {
        imageUrl.value = useGetImageUrl(data.value.image);
      }
    }
  } catch (error) {
    console.error('Error loading slide show:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load slide show data',
      confirmButtonText: 'OK',
      ...getSwalTheme(),
    });
  }
});

const validateTitle = (newValue: string) => {
  if (!newValue.trim()) {
    errors.title = 'Title is required';
  } else if (newValue.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (newValue.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  } else {
    errors.title = '';
  }
};

const validateSlideImage = (newValue: File | undefined) => {
  if (newValue && newValue.size > 5 * 1024 * 1024) {
    errors.slideImage = 'Image size must be less than 5MB';
  } else if (newValue && !['image/jpeg', 'image/jpg', 'image/png'].includes(newValue.type)) {
    errors.slideImage = 'Only JPG, JPEG, and PNG images are allowed';
  } else {
    errors.slideImage = '';
  }
};

// Watchers for real-time validation
watch(title, validateTitle);
watch(slideImage, validateSlideImage);

const handleSubmit = async () => {
  validateTitle(title.value);
  validateSlideImage(slideImage.value);

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
    isEditing.value = true;
    
    const formData = new FormData();
    formData.append('title', title.value);
    if (slideImage.value) {
      formData.append('image', slideImage.value);
    }

    const response = await useApi<SlideShow>(`/slides-show/${slug.value}`, {
      method: 'PATCH',
      data: formData,
    });

    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'Slide Show Updated Successfully!',
        text: 'Your slide show has been updated on the index page',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      
      await navigateTo('/dashboard/slides-show');
    }
  } catch (err: any) {
    console.error('Error updating slide show:', err);
    
    let errorMessage = 'Failed to update slide show. Please try again.';
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

// Cleanup object URLs on unmount
onBeforeUnmount(() => {
  if (slideImage.value) {
    URL.revokeObjectURL(URL.createObjectURL(slideImage.value));
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