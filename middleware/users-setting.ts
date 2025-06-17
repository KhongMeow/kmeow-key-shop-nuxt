import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run this middleware on the client
  if (!process.client) return;

  const authStore = useAuthStore();

  const isAuthenticated = await authStore.checkAuth();

  if (isAuthenticated) {
    if (!authStore.user?.role.rolePermissions.some((rolePermission) => rolePermission.permission.slug === 'access-users-setting')) {
      return navigateTo('/auth/sign-in');
    }
  } else {
    return navigateTo('/auth/sign-in');
  }
});