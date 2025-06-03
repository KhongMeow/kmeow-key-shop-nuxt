import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run this middleware on the client
  if (!process.client) return;

  const authStore = useAuthStore();

  // If user is not loaded, try to load from token
  if (!authStore.user) {
    const token = localStorage.getItem('access_token');
    if (token) {
      await authStore.getUser();
    }
  }

  // After trying to load, if still no user, redirect
  if (!authStore.user) {
    return navigateTo('/auth/sign-in');
  }
});