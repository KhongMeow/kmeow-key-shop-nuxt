<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Edit Categories' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isEditing">
        {{ isEditing ? 'Editing...' : 'Edit' }}
      </ButtonSubmit>
    </header>
    <div class="flex-1 items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <InputTextbox
        label="Name"
        type="text"
        id="name"
        placeholder="Enter category name"
        v-model="name"
        :error="errors.name"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import type { Category } from '~/types/categories';
  
  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard'],
    meta: {
      requiredPermissions: ['update-category'],
    },
  });

  const isDark = ref(false);
  const name = ref('');
  let isEditing = ref(false);
  const route = useRoute();
  const slug = computed(() => route.params.slug);

  const data = ref<Category | null>(null);
  const errors = reactive({
    name: '',
  });

  onMounted(async () => {
    isDark.value = document.documentElement.classList.contains('dark');
    const response = await useApi<Category[]>(`/categories/${slug.value}`, {
      method: 'GET',
    });

    data.value = Array.isArray(response) ? response[0] : response;
    if (data.value) {
      name.value = data.value.name;
    }
  });

  const validateName = async (newValue: string) => {
    errors.name = newValue ? '' : 'Name is required';
  };

  watch(name, validateName);

  const handleSubmit = async () => {
    validateName(name.value);

    if (!errors.name) {
      try {
        isEditing.value = true;
        const response = await useApi<Category[]>(`/categories/${slug.value}`, {
          method: 'PATCH',
          data: {
            name: name.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Category updated successfully!',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
          navigateTo('/dashboard/categories');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to update category',
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? '#1a202c' : '#fff',
          color: isDark ? '#fff' : '#1a202c',
        });
      } finally {
        isEditing.value = false;
      }
    }
  };
</script>

<style>

</style>