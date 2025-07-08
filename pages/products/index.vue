<template>
  <div class="container mx-auto py-6 relative z-10">
    <!-- Enhanced Loading State -->
    <div v-if="isLoading && products.length === 0" class="flex justify-center items-center min-h-[80vh]">
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

    <!-- Main Content -->
    <div v-else class="max-w-8xl mx-auto">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          All Products
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our complete collection of premium digital products
        </p>
      </div>

      <!-- Category Filter -->
      <div class="mb-8 px-4 sm:px-0">
        <!-- Mobile horizontal scroll view -->
        <div class="sm:hidden">
          <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <button
              @click="filterByCategory(null)"
              :class="[
                'flex-shrink-0 px-4 py-2.5 rounded-full font-medium transition-all duration-300 text-sm whitespace-nowrap',
                selectedCategory === null
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              ]"
            >
              All Categories
            </button>
            <button
              v-for="category in categories"
              :key="category.slug"
              @click="filterByCategory(category.slug)"
              :class="[
                'flex-shrink-0 px-4 py-2.5 rounded-full font-medium transition-all duration-300 text-sm whitespace-nowrap',
                selectedCategory === category.slug
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
          <!-- Scroll indicator for mobile -->
          <div class="flex justify-center mt-2">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>

        <!-- Desktop/Tablet flex wrap view -->
        <div class="hidden sm:flex flex-wrap justify-center gap-3 lg:gap-4">
          <button
            @click="filterByCategory(null)"
            :class="[
              'px-4 py-3 lg:px-6 lg:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm lg:text-base',
              selectedCategory === null
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md'
            ]"
          >
            All Categories
          </button>
          <button
            v-for="category in categories"
            :key="category.slug"
            @click="filterByCategory(category.slug)"
            :class="[
              'px-4 py-3 lg:px-6 lg:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm lg:text-base',
              selectedCategory === category.slug
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
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

      <!-- Load More Indicator -->
      <div v-if="isLoadingMore" class="flex justify-center items-center py-8">
        <div class="text-center">
          <div class="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading more products...</p>
        </div>
      </div>

      <!-- End of Products Indicator -->
      <div v-if="hasReachedEnd && products.length > 0" class="text-center py-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-green-500" />
          <span class="text-gray-600 dark:text-gray-400">You've seen all products!</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && (!products || products.length === 0)" class="flex justify-center items-center">
        <div class="text-center max-w-4xl mx-auto px-4 sm:px-6 mt-28">
          <!-- Epic 404 Illustration - Responsive -->
          <div class="relative mb-8 sm:mb-12">
            <!-- Floating background elements -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-indigo-200/30 via-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <!-- Main container with floating elements -->
            <div class="relative inline-block">
              <!-- Smaller 404 text with gradient - Responsive -->
              <div class="text-[4rem] sm:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-black text-transparent bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-200 dark:from-indigo-800 dark:via-purple-700 dark:to-pink-800 bg-clip-text opacity-20 select-none animate-pulse">
                404
              </div>

              <!-- Floating animated elements - Responsive -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative animate-float">
                  <!-- Main icon with enhanced styling -->
                  <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <Icon name="mdi:package-variant-closed-remove" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                  </div>

                  <!-- Enhanced floating particles - Responsive -->
                  <div class="absolute -top-3 sm:-top-5 -right-3 sm:-right-5 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg"></div>
                  <div class="absolute -bottom-5 sm:-bottom-7 -left-5 sm:-left-7 w-3 h-3 sm:w-5 sm:h-5 bg-gradient-to-br from-pink-400 to-red-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 0.5s"></div>
                  <div class="absolute top-1 sm:top-2 left-10 sm:left-14 lg:left-16 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 1s"></div>
                  <div class="absolute -top-1 sm:-top-3 left-5 sm:left-7 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 1.5s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced error message content - Responsive -->
          <div class="space-y-6 sm:space-y-8">
            <!-- Main heading -->
            <div class="space-y-3 sm:space-y-5">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                {{ selectedCategory ? 'No Products in This Category' : 'Oops! Product Lost in Space' }}
              </h1>
              <p class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
                {{ selectedCategory 
                  ? `No products found in the "${getSelectedCategoryName()}" category. Try exploring other categories!`
                  : 'The product you\'re searching for has taken an unexpected journey into the digital cosmos. Let\'s help you navigate back to amazing deals!'
                }}
              </p>
            </div>

            <!-- Enhanced helpful suggestions - Responsive -->
            <div class="bg-gradient-to-br from-white/80 via-gray-50/80 to-white/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg sm:shadow-xl border border-gray-200/50 dark:border-gray-600/50">
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 sm:mb-8">What would you like to do?</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <!-- Enhanced go back button - Responsive -->
                <button 
                  @click="$router.go(-1)"
                  class="group flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-102 sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-xl border border-white/20"
                >
                  <Icon name="mdi:arrow-left-circle" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform group-hover:-translate-x-1 sm:group-hover:-translate-x-2 group-hover:scale-110" />
                  <div class="text-left">
                    <span class="font-black text-base sm:text-lg lg:text-xl block">Go Back</span>
                    <span class="text-xs sm:text-sm opacity-90">Return to previous page</span>
                  </div>
                </button>

                <!-- Enhanced browse all products - Responsive -->
                <NuxtLink 
                  to="/"
                  class="group flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-102 sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-xl border border-white/20"
                >
                  <Icon name="mdi:view-grid-plus" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <div class="text-left">
                    <span class="font-black text-base sm:text-lg lg:text-xl block">Browse Products</span>
                    <span class="text-xs sm:text-sm opacity-90">Discover amazing deals</span>
                  </div>
                </NuxtLink>
              </div>

              <!-- Show all categories button when filtered -->
              <div v-if="selectedCategory" class="mt-4 sm:mt-6">
                <button
                  @click="filterByCategory(null)"
                  class="w-full group flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-102 sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-xl border border-white/20"
                >
                  <Icon name="mdi:view-grid" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform group-hover:scale-110" />
                  <div class="text-center">
                    <span class="font-black text-base sm:text-lg lg:text-xl block">View All Categories</span>
                    <span class="text-xs sm:text-sm opacity-90">See all available products</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <Icon name="mdi:arrow-up" class="w-6 h-6 mx-auto" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products';
import { useCartStore } from '~/store/cartStore';

interface Category {
  slug: string;
  name: string;
}

const isLoading = ref(true);
const isLoadingMore = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const selectedCategory = ref<string | null>(null);
const config = useRuntimeConfig();

// Pagination
const page = ref(1);
const pageSize = ref(12);
const hasReachedEnd = ref(false);
const showScrollTop = ref(false);
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

const getSelectedCategoryName = () => {
  if (!selectedCategory.value) return '';
  const category = categories.value.find(cat => cat.slug === selectedCategory.value);
  return category?.name || '';
};

const fetchCategories = async () => {
  try {
    const response = await useApi<Category[]>('/categories', {
      method: 'GET',
    });
    categories.value = response;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
};

const filterByCategory = async (categorySlug: string | null) => {
  selectedCategory.value = categorySlug;
  page.value = 1;
  hasReachedEnd.value = false;
  await fetchProducts(1, false);
};

const fetchProducts = async (pageNum: number = 1, append: boolean = false) => {
  try {
    if (pageNum === 1) {
      isLoading.value = true;
    } else {
      isLoadingMore.value = true;
    }

    let url = `/products?limit=${pageSize.value}&page=${page.value}&order=scaleRating&direction=desc&hideSoldOut=true`;
    
    if (selectedCategory.value) {
      url += `&categorySlug=${selectedCategory.value}`;
    }

    const response = await useApi<Product[]>(url, {
      method: 'GET',
    });
    
    if (response.length === 0) {
      hasReachedEnd.value = true;
      if (!append) {
        products.value = [];
      }
      return;
    }

    if (append) {
      products.value = [...products.value, ...response];
    } else {
      products.value = response;
    }

    // Check if we got fewer products than requested (last page)
    if (response.length < pageSize.value) {
      hasReachedEnd.value = true;
    }
  } catch (err) {
    console.error('Failed to fetch products:', err);
    if (!append) {
      products.value = [];
    }
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const loadMore = async () => {
  if (isLoadingMore.value || hasReachedEnd.value) return;
  
  page.value++;
  await fetchProducts(page.value, true);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Scroll event handler
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;
  
  // Check if user is near bottom of page for infinite scroll
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.offsetHeight;
  
  if (scrollTop + windowHeight >= docHeight - 200 && !isLoadingMore.value && !hasReachedEnd.value) {
    loadMore();
  }
};

// Setup scroll listeners
const setupScrollListeners = () => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  }
};

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchProducts(1, false)
  ]);
  setupScrollListeners();
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for mobile category filter */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}

/* Smooth scrolling for mobile categories */
.scrollbar-hide {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Enhanced mobile responsive styles */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>