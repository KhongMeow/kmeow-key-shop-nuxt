import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;

  const authStore = useAuthStore();

  const isAuthenticated = await authStore.checkAuth();

  if (isAuthenticated) {
    // Get required permission from route meta
    const requiredPermission = to.meta.requiredPermission as string;

    const hasPermission = authStore.user?.role.rolePermissions.some(
      rolePermission => rolePermission.permission.slug === requiredPermission
    );

    return hasPermission ? true : navigateTo('/errors/unauthorized');
  } else {
    return navigateTo('/auth/sign-in');
  }
});