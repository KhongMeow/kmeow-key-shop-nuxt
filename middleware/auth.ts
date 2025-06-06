import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;

  const authStore = useAuthStore();

  const token = localStorage.getItem('access_token');
  if (token) {
    await authStore.getUser();
  }

  // After trying to load, if still no user, redirect
  if (!authStore.user) {
    return navigateTo('/auth/sign-in');
  }
});