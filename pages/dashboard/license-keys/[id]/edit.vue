<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Edit Categories' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isEditing">
        {{ isEditing ? 'Editing...' : 'Edit' }}
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
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'update-license-key'
  });

  const key = ref('');
  const product = ref<string | undefined>(undefined);
  const products = ref<Product[] | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let isEditing = ref(false);
  const route = useRoute();
  const id = computed(() => route.params.id);

  const data = ref<LicenseKey | null>(null);
  const errors = reactive({
    key: '',
    product: '',
  });

  onMounted(async () => {
    await [getProducts(), getLicenseKey()];
  });

  async function getLicenseKey() {
    try {
      const response = await useApi<LicenseKey[]>(`/license-keys/${id.value}`, {
        method: 'GET',
      });

      data.value = Array.isArray(response) ? response[0] : response;
      if (data.value) {
        key.value = data.value.key;
        product.value = data.value.product?.slug;
      }
    } catch (err: any) {
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

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
        isEditing.value = true;
        const response = await useApi<LicenseKey[]>(`/license-keys/${id.value}`, {
          method: 'PATCH',
          data: {
            key: key.value,
            productSlug: product.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'License Key updated successfully!',
            timer: 2000,
            showConfirmButton: false,
            ...getSwalTheme(),
          });
          navigateTo('/dashboard/license-keys');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to update license key',
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