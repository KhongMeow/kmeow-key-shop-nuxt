<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-[80vh]">
    <div class="text-center px-4">
      <div class="relative mb-6 sm:mb-8">
        <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto">
          <div class="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 border-4 sm:border-8 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin"></div>
          <div class="absolute inset-1 sm:inset-2 w-22 h-22 sm:w-28 sm:h-28 border-3 sm:border-6 border-transparent border-t-pink-400 border-l-cyan-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s"></div>
          <div class="absolute inset-3 sm:inset-6 w-18 h-18 sm:w-20 sm:h-20 border-2 sm:border-4 border-transparent border-t-yellow-400 border-b-green-400 rounded-full animate-spin" style="animation-duration: 2s"></div>
        </div>
      </div>
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-transparent mb-3">
        Amazing Loading...
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">Preparing something special for you...</p>
      <div class="mt-4 sm:mt-6 flex justify-center gap-2">
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-500 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  </div>

  <div v-else>
    <NavBar />
    <div id="blank" class="h-20 mb-4"></div>
    <div class="w-full flex justify-center">
      <div class="max-w-[81rem] w-[80%]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from '~/store/loadingStore';
import { useAuthStore } from '~/store/authStore';

const loadingStore = useLoadingStore();
const authStore = useAuthStore();

const isLoading = computed(() => loadingStore.isLoading);

// Initialize app in layout
onMounted(async () => {
  loadingStore.startLoading();
  
  try {
    await authStore.checkAuth();
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    loadingStore.stopLoading();
  }
});
</script>