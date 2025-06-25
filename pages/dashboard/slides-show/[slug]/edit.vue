<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <HeaderPageHead title="Edit Slide Show" />

    <ButtonSubmit class="ml-auto" :disabled="isEditing">
      {{ isEditing ? 'Editing...' : 'Edit' }}
    </ButtonSubmit>

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
        :preview="imageUrl ?? undefined"
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
    requiredPermission: 'update-slide-show'
  });

  const title = ref('');
  const slideImage = ref<File | undefined>(undefined);
  let isEditing = ref(false);
  const route = useRoute();
  const slug = computed(() => route.params.slug);

  const data = ref<SlideShow | null>(null);
  const imageUrl = ref<string | null>(null);
  const errors = reactive({
    title: '',
    slideImage: ''
  });

  onMounted(async () => {
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
  });

  const validateTitle = async (newValue: string) => {
    errors.title = newValue ? '' : 'Title is required';
  };

  watch(title, validateTitle);

  const handleSubmit = async () => {
    validateTitle(title.value);

    if (!errors.title && !errors.slideImage) {
      try {
        isEditing.value = true;
        const response = await useApi<SlideShow[]>(`/slides-show/${slug.value}`, {
          method: 'PATCH',
          data: {
            title: title.value,
            image: slideImage.value ?? undefined,
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Slide show updated successfully!',
            timer: 2000,
            showConfirmButton: false,
            ...getSwalTheme(),
          });
          navigateTo('/dashboard/slides-show');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to update slide show',
          timer: 2000,
          showConfirmButton: false,
          ...getSwalTheme(),
        });
      } finally {
        isEditing.value = false;
      }
    }
  };
</script>

<style>

</style>