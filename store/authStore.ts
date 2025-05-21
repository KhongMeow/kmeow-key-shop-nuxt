import { defineStore } from 'pinia'
import { useApi } from '~/composables/userApi';

type User = {
  id: number;
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: Role;
};

type Role = {
  id: number;
  name: string;
  slug: string;
};

type permission = {
  id: number;
  name: string;
  slug: string;
};

type rolePermission = {
  id: number;
  role_id: number;
  permission_id: number;
};

type Credentials = {
  usernameOrEmail: string;
  password: string;
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const signInError = ref<string | null>(null);
  const signUpError = ref<string | null>(null);


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
      localStorage.removeItem('refresh_token');
      return navigateTo('/auth');
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
      localStorage.setItem('refresh_token', signIn.refreshToken);
      accessToken.value = signIn.accessToken;
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
      const response = await useApi<User>('/users/my-profile', {
        method: 'GET',
      });
      user.value = response;
    } catch (error) {
      console.error('Error fetching user:', error);
      user.value = null;
    }
  }

  return {
    user,
    accessToken,
    isLoading,
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
  };
});
