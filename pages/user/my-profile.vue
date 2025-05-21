<template>
  <div>
    <h1>My Profile</h1>
    <div v-if="authStore.isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <pre>{{ profile }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

  const authStore = useAuthStore();
  const profile = ref<{} | null>(null);

  const error = ref<string | null>(null);

  onMounted(async () => {
    try {
      await authStore.getUser();
      profile.value = authStore.user; // or the correct property holding the user profile
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      error.value = err?.message || 'Unknown error';
    }
  });
</script>

<style>

</style>