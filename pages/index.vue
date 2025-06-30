<template>
  <div class="min-h-screen">
    <div class="container mx-auto py-4 relative z-10">
      <div class="max-w-8xl mx-auto">
        <nav class="mb-8 sm:mb-10 lg:mb-12 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-white/40 dark:from-gray-800/40 dark:via-gray-800/60 dark:to-gray-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/60 dark:border-gray-700/60 shadow-2xl"></div>
          <ol class="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative z-10 overflow-x-auto">
            <li class="flex-shrink-0">
              <NuxtLink 
                to="/" 
                class="group flex items-center text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-all duration-300"
              >
                <Icon name="mdi:home-variant" class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                <span class="font-medium group-hover:font-semibold hidden sm:inline">Home</span>
              </NuxtLink>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>