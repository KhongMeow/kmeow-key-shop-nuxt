<template>
  <div class="min-h-screen">
    <!-- Hero Carousel Section -->
    <div class="container mx-auto py-2 px-4 relative z-10">
      <div class="max-w-7xl mx-auto">
        <!-- Loading Skeleton -->
        <div v-if="pending" class="rounded-xl overflow-hidden shadow-2xl">
          <USkeleton class="h-96 w-full" />
        </div>
        
        <!-- Carousel -->
        <div v-else-if="slidesShow?.length" class="relative group">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 leading-tight sm:leading-tight md:leading-tight lg:leading-tight px-2 sm:px-0">
              Welcome to <span class="bg-gradient-to-r from-blue-500 to-yellow-600 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">K'meow Key Shop</span>
            </h1>
          </div>
          <UCarousel 
            v-slot="{ item }" 
            loop 
            arrows 
            dots 
            :autoplay="{ delay: 4000 }" 
            :items="slidesShow" 
          >
            <div class="relative rounded-xl overflow-hidden">
              <img 
                :src="useGetImageUrl(item.image)" 
                :alt="item.title || 'Slide image'"
                class="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </UCarousel>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <p class="text-slate-600 dark:text-slate-400">No slides available</p>
        </div>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-8xl mx-auto text-center">
        <!-- <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Discover amazing deals on premium software keys and digital products. 
          Your trusted marketplace for authentic licenses and digital downloads.
        </p> -->
        <div class="text-center mb-16 animate-fade-in-up">
          <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">🔥 Top Rated Products</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover our best-selling software keys and digital products
          </p>
        </div>
      </div>
      
      <div class="max-w-8xl mx-auto">
        <div v-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
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
              <div 
                v-if="!product?.image || imageErrors[product.slug]"
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
              >
                <div class="text-center">
                  <Icon name="mdi:image-off-outline" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">No Image Available</p>
                </div>
              </div>
              
              <!-- Product Image -->
              <img 
                v-else
                :src="useGetImageUrl(product.image)" 
                :alt="product?.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                @error="handleImageError(product.slug)"
                @load="handleImageLoad(product.slug)"
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
                  :to="`/products/${product?.category.slug}/${product.slug}`"
                  class="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Icon name="mdi:eye" class="w-6 h-6" />
                </NuxtLink>
              </div>

              <!-- Stock Badge -->
              <div v-if="product?.stock > 0" class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ product.stock }} in stock
              </div>

              <!-- Category Badge -->
              <div class="absolute top-4 left-4 bg-violet-500 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ product.category?.name }}
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <NuxtLink 
                :to="`/products/${product?.category.slug}/${product?.slug}`"
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
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            to="/products" 
            size="lg" 
            class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            variant="solid"
          >
            Browse Products
            <UIcon name="i-heroicons-arrow-right" class="ml-2" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Why Choose Us?
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Experience the difference with our premium service and commitment to excellence
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="group text-center p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
            <div class="relative mb-6">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UIcon name="i-heroicons-shield-check" class="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div class="absolute inset-0 bg-green-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-800 dark:text-white">100% Authentic</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Genuine software keys and digital products with lifetime validity guarantee</p>
          </div>
          
          <div class="group text-center p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
            <div class="relative mb-6">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UIcon name="i-heroicons-bolt" class="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-800 dark:text-white">Lightning Fast</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Instant delivery to your email within seconds of successful payment</p>
          </div>
          
          <div class="group text-center p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
            <div class="relative mb-6">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UIcon name="i-heroicons-heart" class="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <div class="absolute inset-0 bg-red-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-800 dark:text-white">Expert Support</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">24/7 dedicated customer support team ready to help with any questions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '~/store/cartStore';
import type { Product } from '~/types/products';
import type { SlideShow } from '~/types/slides-show';

// Define Category type (adjust based on your API structure)
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  product_count?: number;
}

const slidesShow = ref<SlideShow[] | undefined>(undefined);
const categories = ref<Category[] | undefined>(undefined);
const products = ref<Product[] | undefined>(undefined);
const pending = ref(true);
const categoriesPending = ref(true);

onMounted(async () => {
  try {
    // Fetch slides and categories in parallel
    const [slidesResponse, categoriesResponse, productsResponse] = await Promise.all([
      useApi<SlideShow[]>(`/slides-show`, { method: 'GET' }),
      useApi<Category[]>(`/categories`, { method: 'GET' }),
      useApi<Product[]>(`/products?limit=12&order=scaleRating&direction=desc&hideSoldOut=true`, { method: 'GET' })
    ]);
    
    slidesShow.value = slidesResponse;
    categories.value = categoriesResponse;
    products.value = productsResponse;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    pending.value = false;
    categoriesPending.value = false;
  }
});

const imageErrors = ref<Record<string, boolean>>({});

const handleImageError = (productSlug: string) => {
  imageErrors.value[productSlug] = true;
};

const handleImageLoad = (productSlug: string) => {
  imageErrors.value[productSlug] = false;
};

const addToCart = (product: Product) => {
  const cart = useCartStore();
  cart.addToCart(product.slug, 1);
};

const getStarWidth = (starIndex: number, rating: number) => {
  if (rating >= starIndex) {
    return '100%';
  } else if (rating > starIndex - 1) {
    return `${(rating - (starIndex - 1)) * 100}%`;
  } else {
    return '0%';
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Enhanced line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>