<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Edit Product' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isCreating">
        {{ isCreating ? 'Editing...' : 'Edit' }}
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
        :preview="imageUrl ?? undefined"
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
    requiredPermission: 'update-product'
  });

  const isDark = ref(false);
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

  onMounted(async () => {
    isDark.value = document.documentElement.classList.contains('dark');
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

  watch(name, validateName);
  watch(detail, validateDetail);
  watch(category, validateCategory);
  watch(description, validateDescription);
  watch(price, validatePrice);

  const handleSubmit = async () => {
    validateName(name.value);
    validateCategory(category.value);
    validateDetail(detail.value);
    validateDescription(description.value);
    validatePrice(price.value);

    if (!errors.name && !errors.category && !errors.detail && !errors.description && !errors.price && !errors.productImage) {
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
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product created successfully!',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
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