<template>
  <div class="h-full bg-gray-200 dark:bg-gray-900 dark:text-white min-h-screen relative overflow-hidden">
    <!-- Background Pattern -->
    <!-- <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.15)_1px,transparent_0)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.1)_1px,transparent_0)]"></div> -->
    
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s"></div>
    </div>
    <NuxtLoadingIndicator />
    <UiProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UiProvider>
  </div>
</template>

<script setup lang="ts">
  // SEO Meta
  useSeoMeta({
    title: "K'eow Key Shop - Premium Software Keys & Digital Products",
    description: 'Your trusted marketplace for authentic software licenses and digital downloads. Get instant delivery and 24/7 support.',
    ogTitle: "K'eow Key Shop - Premium Software Keys & Digital Products",
    ogDescription: 'Your trusted marketplace for authentic software licenses and digital downloads.',
  });
</script>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>