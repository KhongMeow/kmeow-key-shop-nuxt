<template>
  <div>
    <h1 class="text-xl font-bold py-4">{{ 'Dashboard' }}</h1>

    <div v-if="authStore.isLoading">Loading...</div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard']
  });

  const authStore = useAuthStore();
</script>

<style>

</style>