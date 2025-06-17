import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  
  const router = useRouter();  
  const authStore = useAuthStore();

  const isAuthenticated = await authStore.checkAuth();
  if (isAuthenticated) {
    return router.back();
  }
});