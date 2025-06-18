import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi';
import type { User } from '~/types/users';

type Credentials = {
  usernameOrEmail: string;
  password: string;
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const isChanging = ref<boolean>(false);
  const signInError = ref<string | null>(null);
  const signUpError = ref<string | null>(null);

  if (process.client) {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      accessToken.value = storedToken;
      getUser();
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    }
  }

  async function checkAuth() {
    if (process.client) {
      const access = !!localStorage.getItem('access_token');
      if (access) {
        try {
          await getUser();
          return true;
        } catch (error: any) {
          const hasRefresh = !!localStorage.getItem('refresh_token');
          if (hasRefresh) {
            return await refreshToken();
          }
        }
      }else {
        const hasRefresh = !!localStorage.getItem('refresh_token');
        if (hasRefresh) {
          return await refreshToken();
        }
        return false;
      }
    }
    return false;
  }

  async function refreshToken() {
    try {
      const response = await useApi<{ accessToken: string, refreshToken:string }>('/authentication/refresh-tokens', {
        method: 'POST',
        data: {
          refreshToken: localStorage.getItem('refresh_token'),
        },
      });
      accessToken.value = response.accessToken;
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
  }

  async function signOut() {
    try {
      await useApi('/authentication/sign-out', {
        method: 'POST',
        data: {
          refresh_token: localStorage.getItem('refresh_token'),
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      accessToken.value = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return navigateTo('/auth/sign-in');
    }
  }

  async function signIn({ usernameOrEmail, password }: Credentials) {
    isLoading.value = true;
    signInError.value = null;
    try {
      const signIn = await useApi<{ accessToken: string; refreshToken: string }>('/authentication/sign-in', {
        method: 'POST',
        data: { usernameOrEmail, password },
      });
      localStorage.setItem('access_token', signIn.accessToken);
      localStorage.setItem('refresh_token', signIn.refreshToken);
      accessToken.value = signIn.accessToken;
      
      await getUser();
      
      return navigateTo('/');
    } catch (error: any) {
      signInError.value = error?.response?.data?.message || 'Sign-in failed';
      return Promise.reject(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createTempUser(fullName: string, username: string, email: string, password: string) {
    signUpError.value = null;
    try {
      isLoading.value = true;

      // Store user details in cookies for 10 minutes
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
      document.cookie = `fullName=${encodeURIComponent(fullName)}; expires=${expirationTime}; path=/`;
      document.cookie = `username=${encodeURIComponent(username)}; expires=${expirationTime}; path=/`;
      document.cookie = `email=${encodeURIComponent(email)}; expires=${expirationTime}; path=/`;
      document.cookie = `password=${encodeURIComponent(password)}; expires=${expirationTime}; path=/`;

      // Send verification code to email
      await sendVerifyCode(email);
    } catch (error: any) {
      signUpError.value = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function getTempUser() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const fullName = cookies['fullName'] || '';
    const username = cookies['username'] || '';
    const email = cookies['email'] || '';
    const password = cookies['password'] || '';

    return { fullName, username, email, password };
  }

  async function sendVerifyCode(email: string) {
    signUpError.value = '';
    try {
      isLoading.value = true;
      await useApi('/authentication/send-verification-email', {
        method: 'POST',
        data: { email },
      });
    } catch (error: any) {
      signUpError.value = error?.response?.data?.message || 'Failed to send verification code';
      throw new Error(signUpError.value || 'Failed to send verification code');
    } finally {
      isLoading.value = false;
    }
  }

  async function verificationEmail(email: string, code: string) {
    signUpError.value = '';
    try {
      isLoading.value = true;
      await useApi('/authentication/verify-email', {
        method: 'POST',
        data: { email, code },
      });

      // After verification, get temp user and sign up
      const tempUser = await getTempUser();
      await signUp(tempUser.fullName, tempUser.username, tempUser.email, tempUser.password);

      // Clear cookies after successful sign-up
      document.cookie = 'fullName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Redirect to sign-in page
      navigateTo('/auth/sign-in');
    } catch (error: any) {
      signUpError.value = error?.response?.data?.message || (error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function signUp(fullName: string, username: string, email: string, password: string) {
    signUpError.value = '';
    try {
      isLoading.value = true;
      await useApi('/authentication/sign-up', {
        method: 'POST',
        data: { fullname: fullName, username, email, password },
      });
      navigateTo('/auth/sign-in');
    } catch (error: any) {
      signUpError.value = error?.response?.data?.message || (error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function getUser() {
    try {
      isLoading.value = true;
      const response = await useApi<User>('/users/my-profile', {
        method: 'GET',
      });
      user.value = response;

      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('Error fetching user:', error);
      user.value = null;
      localStorage.removeItem('user');
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(fullname: string, email: string) {
    try {
      isUpdating.value = true;
      const response = await useApi<User>(`/users`, {
        method: 'PATCH',
        data: { fullname, email },
      });
      if (response) {
        user.value = response;
      }
      if (response) {
        user.value = response;
        localStorage.setItem('user', JSON.stringify(response)); // Update localStorage
      }
      return response;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    } finally {
      isUpdating.value = false;
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      isChanging.value = true;
      const response = await useApi<User>(`/users/change-password`, {
        method: 'POST',
        data: { currentPassword, newPassword },
      });
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      return null;
    } finally {
      isChanging.value = false;
    }
  }

  function checkPermission(permission: string) {
    if (!user.value || !user.value.role || !user.value.role.rolePermissions) {
      return false;
    }
    return user.value.role.rolePermissions.some(
      (rolePermission) => rolePermission.permission.slug === permission
    );
  }

  return {
    user,
    accessToken,
    isLoading,
    isUpdating,
    isChanging,
    signInError,
    signUpError,
    signIn,
    signUp,
    signOut,
    createTempUser,
    getTempUser,
    sendVerifyCode,
    verificationEmail,
    getUser,
    checkAuth,
    refreshToken,
    updateUser,
    changePassword,
    checkPermission,
  };
});