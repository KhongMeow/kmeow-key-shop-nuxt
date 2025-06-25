<template>
  <header class="flex items-center justify-between border-none p-4">
    <h1 class="text-xl md:text-2xl font-bold">{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
  }>();
</script>