<template>
  <div class="w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-8 rounded-xl">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:presentation-chart-bar" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Slide Show</h1>
              <p class="text-gray-600 dark:text-gray-400">Create your slide show for index page</p>
            </div>
          </div>
          <NuxtLink 
            to="/dashboard/slides-show" 
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            Back to Slides
          </NuxtLink>
        </div>
        <div class="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>
      <!-- Main Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <Icon name="heroicons:document-text" class="w-5 h-5" />
              Slide Show Details
            </h2>
          </div>
          <!-- Form Content -->
          <div class="p-6 space-y-6">
            <!-- Title Input -->
            <InputTextbox
              id="title"
              v-model="title"
              label="Title"
              placeholder="Enter an engaging title for your slide show"
              icon="heroicons:tag"
              :error="errors.title"
              :required="true"
            />
            <!-- Image Upload -->
            <InputImage
              id="slideImage"
              v-model="slideImage"
              label="Slide Image"
              rule="JPG, JPEG, PNG up to 5MB"
              :error="errors.slideImage"
              :required="true"
              :max-size="5 * 1024 * 1024"
              :allowed-types="['image/jpeg', 'image/jpg', 'image/png']"
              @error="errors.slideImage = $event"
            />
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4">
          <NuxtLink
            to="/dashboard/slides-show"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300
                  bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
            Cancel
          </NuxtLink>
          
          <button
            type="submit"
            :disabled="isCreating"
            class="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white
                  bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg
                  hover:from-blue-600 hover:to-purple-700 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 ease-in-out transform hover:scale-105
                  shadow-lg hover:shadow-xl"
          >
            <Icon 
              :name="isCreating ? 'heroicons:arrow-path' : 'heroicons:plus-circle'" 
              class="w-4 h-4"
              :class="{ 'animate-spin': isCreating }"
            />
            {{ isCreating ? 'Creating...' : 'Create Slide Show' }}
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
  requiredPermission: 'create-slide-show',
});

const title = ref('');
const slideImage = ref<File | undefined>(undefined);
const isCreating = ref(false);

const errors = reactive({
  title: '',
  slideImage: ''
});

const validateTitle = (newValue: string) => {
  if (!newValue.trim()) {
    errors.title = 'Title is required';
  } else {
    errors.title = '';
  }
};

const validateSlideImage = (newValue: File | undefined) => {
  if (!newValue) {
    errors.slideImage = 'Slide image is required';
  } else if (newValue.size > 5 * 1024 * 1024) {
    errors.slideImage = 'Image size must be less than 5MB';
  } else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(newValue.type)) {
    errors.slideImage = 'Only JPG, JPEG, and PNG images are allowed';
  } else {
    errors.slideImage = '';
  }
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    slideImage.value = file;
    validateSlideImage(file);
  }
};

const removeImage = () => {
  slideImage.value = undefined;
  validateSlideImage(undefined);
};

const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

watch(title, validateTitle);

const handleSubmit = async () => {
  validateTitle(title.value);
  validateSlideImage(slideImage.value);

  if (errors.title || errors.slideImage) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fix the errors before submitting',
      timer: 3000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
    return;
  }

  try {
    isCreating.value = true;
    
    const formData = new FormData();
    formData.append('title', title.value);
    if (slideImage.value) {
      formData.append('image', slideImage.value);
    }

    const response = await useApi<SlideShow>(`/slides-show`, {
      method: 'POST',
      data: formData,
    });

    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Slide show created successfully!',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      
      await navigateTo('/dashboard/slides-show');
    }
  } catch (err: any) {
    console.error('Error creating slide show:', err);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Failed to create slide show. Please try again.',
      confirmButtonText: 'OK',
      ...getSwalTheme(),
    });
  } finally {
    isCreating.value = false;
  }
};

// Cleanup object URLs on unmount
onBeforeUnmount(() => {
  if (slideImage.value) {
    URL.revokeObjectURL(getImagePreview(slideImage.value));
  }
});
</script>