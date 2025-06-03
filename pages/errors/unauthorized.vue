<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative overflow-hidden">
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 opacity-30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-purple-400 to-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="relative z-10">
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div class="bg-red-100 dark:bg-red-900 rounded-full p-4 mb-4 shadow-lg ring-4 ring-red-200 dark:ring-red-800 animate-bounce-slow">
          <svg class="w-16 h-16 text-red-500 drop-shadow-lg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <h1 class="text-5xl font-black text-gray-800 dark:text-gray-100 mb-2 drop-shadow-lg tracking-tight">401</h1>
        <h1 class="text-5xl font-black text-gray-800 dark:text-gray-100 mb-2 drop-shadow-lg tracking-tight">Unauthorized</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xs italic">
          Sorry, you do not have permission to access this page.
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 transition-all duration-200 ring-2 ring-blue-200 dark:ring-blue-900"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
  title: 'Unauthorized - 401',
  meta: {
    description: 'You do not have permission to access this page.'
  }
})
</script>

<style>
/* Fade-in animation for card */
@media (prefers-reduced-motion: no-preference) {
  .animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fade-in {
    0% { opacity: 0; transform: scale(0.97) translateY(30px);}
    100% { opacity: 1; transform: scale(1) translateY(0);}
  }
  .animate-bounce-slow {
    animation: bounce-slow 2.2s infinite alternate cubic-bezier(.68,-0.55,.27,1.55);
  }
  @keyframes bounce-slow {
    0% { transform: translateY(0);}
    100% { transform: translateY(-12px);}
  }
}
</style>