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
          <div class="max-w-4xl mx-auto text-center pb-2">
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
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Discover amazing deals on premium software keys and digital products. 
          Your trusted marketplace for authentic licenses and digital downloads.
        </p>
        
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

// SEO Meta
useSeoMeta({
  title: "K'eow Key Shop - Premium Software Keys & Digital Products",
  description: 'Your trusted marketplace for authentic software licenses and digital downloads. Get instant delivery and 24/7 support.',
  ogTitle: "K'eow Key Shop - Premium Software Keys & Digital Products",
  ogDescription: 'Your trusted marketplace for authentic software licenses and digital downloads.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
});

const slidesShow = ref<SlideShow[] | undefined>(undefined);
const categories = ref<Category[] | undefined>(undefined);
const pending = ref(true);
const categoriesPending = ref(true);

onMounted(async () => {
  try {
    // Fetch slides and categories in parallel
    const [slidesResponse, categoriesResponse] = await Promise.all([
      useApi<SlideShow[]>(`/slides-show`, { method: 'GET' }),
      useApi<Category[]>(`/categories`, { method: 'GET' })
    ]);
    
    slidesShow.value = slidesResponse;
    categories.value = categoriesResponse;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    pending.value = false;
    categoriesPending.value = false;
  }
});
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