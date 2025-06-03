<template>
  <div class="h-full bg-gray-200 dark:bg-gray-900 dark:text-white min-h-screen relative overflow-hidden">
    <!-- Decorative blurred gradient shapes -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 opacity-30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-purple-400 to-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
    <NuxtLoadingIndicator />
    <UiProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UiProvider>
  </div>
</template>

<script setup lang="ts">

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