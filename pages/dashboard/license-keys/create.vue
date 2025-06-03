<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Create License Key' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isCreating">
        {{ isCreating ? 'Creating...' : 'Create' }}
      </ButtonSubmit>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3.5 overflow-x-auto">
      <InputTextbox
        label="Key"
        type="text"
        id="key"
        placeholder="Enter key of the license"
        v-model="key"
        :error="errors.key"
      />
      <InputSelectBox
        label="Product"
        id="product"
        v-model="product"
        :options="products?.map(product => ({ value: String(product.slug), label: product.name }))"
        :error="errors.product"
        :placeholder="'Select a product...'"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import type { LicenseKey } from '~/types/license-keys';
  import type { Product } from '~/types/products';

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard'],
    meta: {
      requiredPermissions: ['create-license-key']
    }
  });
  
  const isDark = ref(false);
  const key = ref('');
  const product = ref<string | undefined>(undefined);
  const products = ref<Product[] | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let isCreating = ref(false);
  
  const errors = reactive({
    key: '',
    product: '',
  });

  onMounted(async () => {
    isDark.value = document.documentElement.classList.contains('dark');
    await getProducts();
  });

  async function getProducts() {
    try {
      isLoading.value = true;
      const response = await useApi<Product[]>(`/products`, {
        method: 'GET',
      });
      products.value = response;
      product.value = '';
      error.value = null;
    } catch (err: any) {
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  const validateKey = async (newValue: string) => {
    errors.key = newValue ? '' : 'Key is required';
  };

  const validateProduct = async (newValue: string | undefined) => {
    errors.product = newValue ? '' : 'Product is required';
  };

  watch(key, validateKey);
  watch(product, validateProduct);

  const handleSubmit = async () => {
    validateKey(key.value);
    validateProduct(product.value);

    if (!errors.key && !errors.product) {
      try {
        isCreating.value = true;
        const response = await useApi<LicenseKey[]>(`/license-keys`, {
          method: 'POST',
          data: {
            key: key.value,
            productSlug: product.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'License Key created successfully!',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
          navigateTo('/dashboard/license-keys');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create License Key',
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