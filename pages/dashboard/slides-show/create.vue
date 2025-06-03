<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Create Slide Show' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isCreating">
        {{ isCreating ? 'Creating...' : 'Create' }}
      </ButtonSubmit>
    </header>
    <div class="flex-1 items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <InputTextbox
        label="Title"
        type="text"
        id="title"
        placeholder="Enter slide show title"
        v-model="title"
        :error="errors.title"
      />
      <InputImage
        label="Slide Image"
        rule="Image are allowed! e.g. jpg, jpeg, png size must be less than 5MB"
        id="slide-image"
        v-model="slideImage"
        :error="errors.slideImage"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import { InputImage } from '#components';
  import type { SlideShow } from '~/types/slides-show';

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'create-slide-show',
  });
  
  const isDark = ref(false);
  const title = ref('');
  const slideImage = ref<File | undefined>(undefined);
  let isCreating = ref(false);

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });
  
  const errors = reactive({
    title: '',
    slideImage: ''
  });

  const validateTitle = async (newValue: string) => {
    errors.title = newValue ? '' : 'Title is required';
  };

  const validateSlideImage = (newValue: File | undefined) => {
    errors.slideImage = newValue ? '' : 'Slide image is required';
  };

  watch(title, validateTitle);
  watch(slideImage, validateSlideImage);

  const handleSubmit = async () => {
    validateTitle(title.value);
    validateSlideImage(slideImage.value);

    if (!errors.title && !errors.slideImage) {
      try {
        isCreating.value = true;
        const response = await useApi<SlideShow[]>(`/slides-show`, {
          method: 'POST',
          data: {
            title: title.value,
            image: slideImage.value
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Slide show created successfully!',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
          navigateTo('/dashboard/slides-show');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create slide show',
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? '#1a202c' : '#fff',
          color: isDark ? '#fff' : '#1a202c',
        });
      } finally {
        isCreating.value = false;
      }
    }
  };
</script>

<style>

</style>