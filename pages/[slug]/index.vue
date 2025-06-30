<template>
  <div class="min-h-screen">
    <div class="container mx-auto py-6 relative z-10">
      <!-- Enhanced Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[80vh]">
        <div class="text-center px-4">
          <div class="relative mb-8">
            <div class="w-32 h-32 mx-auto">
              <div class="absolute inset-0 w-32 h-32 border-8 border-transparent border-t-violet-500 border-r-purple-500 rounded-full animate-spin shadow-lg"></div>
              <div class="absolute inset-2 w-28 h-28 border-6 border-transparent border-t-pink-400 border-l-cyan-400 rounded-full animate-spin shadow-md" style="animation-direction: reverse; animation-duration: 1.5s"></div>
              <div class="absolute inset-6 w-20 h-20 border-4 border-transparent border-t-yellow-400 border-b-green-400 rounded-full animate-spin" style="animation-duration: 2s"></div>
            </div>
          </div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Loading Amazing Products
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Discovering the perfect items for you...</p>
          <div class="mt-6 flex justify-center gap-2">
            <div class="w-3 h-3 bg-violet-500 rounded-full animate-bounce shadow-lg"></div>
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce shadow-lg" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce shadow-lg" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>

      <!-- Enhanced Breadcrumb -->
      <div class="max-w-8xl mx-auto">
        <nav class="mb-12 relative group">
          <div class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-gray-700/60 shadow-xl group-hover:shadow-2xl transition-all duration-300"></div>
          <ol class="flex items-center space-x-4 px-6 py-4 relative z-10">
            <li>
              <NuxtLink 
                to="/" 
                class="group/link flex items-center text-gray-700 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 transition-all duration-300"
              >
                <Icon name="mdi:home-variant" class="w-5 h-5 mr-2 group-hover/link:scale-110 transition-transform" />
                <span class="font-medium group-hover/link:font-semibold">Home</span>
              </NuxtLink>
            </li>
            <li><Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" /></li>
            <li>
              <span class="text-violet-600 dark:text-violet-400 font-semibold">
                {{ category?.name }}
              </span>
            </li>
          </ol>
        </nav>

        <!-- Category Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {{ category?.name }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our curated collection of premium products
          </p>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          <div 
            v-for="product in products"
            :key="product.slug"
            class="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <!-- Sold Out Overlay -->
            <div v-if="product?.stock === 0" class="absolute z-20 inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center rounded-3xl">
              <div class="text-center">
                <Icon name="mdi:package-variant-closed" class="w-16 h-16 text-red-400 mx-auto mb-2" />
                <p class="text-white text-xl font-bold">Sold Out</p>
              </div>
            </div>

            <!-- Product Image -->
            <div class="relative aspect-square overflow-hidden">
              <img 
                :src="getImageUrl(product?.image)" 
                :alt="product?.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              >
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Action Buttons -->
              <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  @click="addToCart(product)"
                  class="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-violet-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  :disabled="product?.stock === 0"
                >
                  <Icon name="solar:cart-plus-bold" class="w-6 h-6" />
                </button>
                <NuxtLink 
                  :to="`/${route.params.slug}/${product.slug}`"
                  class="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Icon name="mdi:eye" class="w-6 h-6" />
                </NuxtLink>
              </div>

              <!-- Stock Badge -->
              <div v-if="product?.stock > 0" class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ product.stock }} in stock
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <NuxtLink 
                :to="`/${route.params.slug}/${product?.slug}`"
                class="block group/title"
              >
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover/title:text-violet-600 dark:group-hover/title:text-violet-400 transition-colors duration-300 line-clamp-2">
                  {{ product?.name }}
                </h3>
              </NuxtLink>
              
              <!-- Rating -->
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center">
                  <div 
                    v-for="star in 5" 
                    :key="star"
                    class="relative w-4 h-4"
                  >
                    <Icon 
                      name="mdi:star" 
                      class="absolute w-4 h-4 text-gray-300 dark:text-gray-600"
                    />
                    <div 
                      class="absolute overflow-hidden"
                      :style="{ width: getStarWidth(star, product?.scaleRating || 0) }"
                    >
                      <Icon 
                        name="mdi:star" 
                        class="w-4 h-4 text-yellow-500"
                      />
                    </div>
                  </div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  ({{ product?.scaleRating}})
                </span>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  ${{ product?.price }}
                </div>
                <button 
                  @click="addToCart(product)"
                  class="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
                  :disabled="product?.stock === 0"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Pagination -->
        <div v-if="!isLoading && products && products.length > 0" class="flex justify-center">
          <UPagination 
            v-model:page="page" 
            :items-per-page="pageSize" 
            :total="totalItems"
            class="pagination-enhanced"
          />
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && (!products || products.length === 0)" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <Icon name="mdi:package-variant" class="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Products Found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
              We couldn't find any products in this category at the moment.
            </p>
            <NuxtLink 
              to="/"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
            >
              <Icon name="mdi:arrow-left" class="w-5 h-5 mr-2" />
              Back to Home
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products';
import type { Category } from '~/types/categories';
import { useCartStore } from '~/store/cartStore';

const isLoading = ref(false);
const category = ref<Category | null>(null);
const products = ref<Product[] | null>(null);
const route = useRoute();
const config = useRuntimeConfig();

const page = ref(1);
const pageSize = ref(12); // Increased page size for better grid layout
const totalItems = ref(0);

const addToCart = (product: Product) => {
  const cart = useCartStore();
  cart.addToCart(product.slug, 1);
  
  // Add success feedback
  // You can add a toast notification here
};

function getImageUrl(image: string | undefined) {
  if (!image) return '';
  return config.public.API_BASE_URL + image;
}

const getStarWidth = (starIndex: number, rating: number) => {
  if (rating >= starIndex) {
    return '100%';
  } else if (rating > starIndex - 1) {
    return `${(rating - (starIndex - 1)) * 100}%`;
  } else {
    return '0%';
  }
};

watch(page, async () => {
  await fetchProducts();
});

const fetchProducts = async () => {
  try {
    const slug = route.params.slug;

    const response = await useApi<Product[]>(`/products?categorySlug=${slug}&limit=${pageSize.value}&page=${page.value}&order=scaleRating&direction=desc&hideSoldOut=true`, {
      method: 'GET',
    });
    
    products.value = response;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
};

onMounted(async () => {
  try {
    const slug = route.params.slug;
    
    if (!category.value) {
      const categoryResponse = await useApi<Category>(`/categories/${slug}`, {
        method: 'GET'
      });
      category.value = categoryResponse;
    }

    const countResponse = await useApi<Product[]>(`/products?categorySlug=${slug}&hideSoldOut=true`, {
      method: 'GET',
    });
    totalItems.value = countResponse.length;

    await fetchProducts();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>

</style>