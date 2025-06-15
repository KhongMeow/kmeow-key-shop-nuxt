<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Create Product' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isCreating">
        {{ isCreating ? 'Creating...' : 'Create' }}
      </ButtonSubmit>
    </header>
    <div class="flex-1 items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <InputTextbox
        label="Name"
        type="text"
        id="name"
        placeholder="Enter product name"
        v-model="name"
        :error="errors.name"
      />
      <InputSelectBox
        label="Category"
        id="category"
        v-model="category"
        :options="categories?.map(category => ({ value: String(category.slug), label: category.name }))"
        :error="errors.category"
        :placeholder="'Select a category...'"
      />
      <InputTextArea
        label="Details"
        v-model="detail"
        :error="errors.detail"
        id="detail"
        placeholder="Enter product detail"
      />
      <InputTextArea
        label="Description"
        v-model="description"
        :error="errors.description"
        id="description"
        placeholder="Enter product description"
      />
      <InputTextbox
        label="Price ($)"
        type="number"
        id="price"
        placeholder="Enter product price"
        v-model="price"
        :error="errors.price"
      />
      <InputImage
        label="Product Image"
        rule="Image are allowed! e.g. jpg, jpeg, png size must be less than 5MB"
        id="product-image"
        v-model="productImage"
        :error="errors.productImage"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import { InputImage } from '#components';
  import type { Product } from '~/types/products';
  import type { Category } from '~/types/categories';

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'create-product'
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
  const error = ref<string | null>(null);

  onMounted(async () => {
    await getCategories();
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
  
  const errors = reactive({
    name: '',
    category: '',
    detail: '',
    description: '',
    price: '',
    productImage: ''
  });

  const validateName = async (newValue: string) => {
    errors.name = newValue ? '' : 'Name is required';
  };

  const validateCategory = async (newValue: string | undefined) => {
    errors.category = newValue ? '' : 'Category is required';
  };

  const validateDetail = (newValue: string | undefined) => {
    errors.detail = newValue ? '' : 'Detail is required';
  };

  const validateDescription = (newValue: string | undefined) => {
    errors.description = newValue ? '' : 'Description is required';
  };

  const validatePrice = (newValue: string) => {
    errors.price = newValue ? '' : 'Price is required';
  };

  const validateProductImage = (newValue: File | undefined) => {
    errors.productImage = newValue ? '' : 'Product image is required';
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
    validateProductImage(productImage.value);

    if (!errors.name && !errors.category && !errors.detail && !errors.description && !errors.price && !errors.productImage) {
      try {
        isCreating.value = true;
        const response = await useApi<Product[]>(`/products`, {
          method: 'POST',
          data: {
            name: name.value,
            categorySlug: category.value,
            detail: detail.value,
            description: description.value,
            price: price.value ? Number(price.value) : undefined,
            image: productImage.value,
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product created successfully!',
            timer: 2000,
            showConfirmButton: false,
            ...getSwalTheme(),
          });
          navigateTo('/dashboard/products');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create product',
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