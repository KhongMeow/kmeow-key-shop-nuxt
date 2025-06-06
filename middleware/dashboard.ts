import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run this middleware on the client
  if (!process.client) return;

  const authStore = useAuthStore();

  const token = localStorage.getItem('access_token');
  if (token) {
    await authStore.getUser();
  }

  if (!authStore.user?.role.rolePermissions.some((rolePermission) => rolePermission.permission.slug === 'access-dashboard')) {
    return navigateTo('/auth/sign-in');
  }
});