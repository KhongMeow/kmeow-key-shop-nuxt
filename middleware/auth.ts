import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;

  const authStore = useAuthStore();

  const isAuthenticated = await authStore.checkAuth();
  if (!isAuthenticated) {
    return navigateTo('/auth/sign-in');
  }
});