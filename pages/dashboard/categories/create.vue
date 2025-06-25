<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <HeaderPageHead title="Create Category" />

    <ButtonSubmit class="ml-auto" :disabled="isCreating">
      {{ isCreating ? 'Creating...' : 'Create' }}
    </ButtonSubmit>

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
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'create-category',
  });
  
  const name = ref('');
  let isCreating = ref(false);
  
  const errors = reactive({
    name: '',
  });

  const validateName = async (newValue: string) => {
    errors.name = newValue ? '' : 'Name is required';
  };

  watch(name, validateName);

  const handleSubmit = async () => {
    validateName(name.value);

    if (!errors.name) {
      try {
        isCreating.value = true;
        const response = await useApi<Category[]>(`/categories`, {
          method: 'POST',
          data: {
            name: name.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Category created successfully!',
            timer: 2000,
            showConfirmButton: false,
            ...getSwalTheme(),
          });
          navigateTo('/dashboard/categories');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create Category',
          timer: 2000,
          showConfirmButton: false,
          ...getSwalTheme(),
        });
      } finally {
        isCreating.value = false;
      }
    }
  };
</script>

<style>

</style>