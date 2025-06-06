import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;

  const authStore = useAuthStore();

  const token = localStorage.getItem('access_token');
  if (token) {
    await authStore.getUser();
  }

  // Get required permission from route meta
  const requiredPermission = to.meta.requiredPermission as string;

  const hasPermission = authStore.user?.role.rolePermissions.some(
    rolePermission => rolePermission.permission.slug === requiredPermission
  );

  return hasPermission ? true : navigateTo('/errors/unauthorized');
});