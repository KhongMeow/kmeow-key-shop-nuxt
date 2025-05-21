<template>
  <div>
    <NuxtLink to="/" class="text-blue-500 hover:underline">Home</NuxtLink>

    <p>categories: {{ categories }}</p>
  </div>
</template>

<script setup lang="ts">
  const { data: categories } = await useFetch(useRuntimeConfig().public.API_BASE_URL + '/categories')
</script>

<style>

</style>