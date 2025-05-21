<template>
  <div class="flex items-center justify-center min-h-screen w-screen">
    <form @submit.prevent="handleSubmit" class="w-full max-w-xs sm:max-w-sm mx-auto m-4 p-4 sm:p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
      <img src="/assets/kmeowkeyshop_logo.png" alt="Kmeowkeyshop Logo" class="max-w-[4rem] sm:max-w-[5rem] mx-auto" />
      <hr class="my-4 sm:my-6 border-gray-300 dark:border-gray-700" />
      <InputTextbox
        label="Full Name"
        type="text"
        id="Full Name"
        ariaDescribedby="full-name-helper"
        placeholder="Enter your full name"
        v-model="fullName"
        :error="errors.fullName"
      />
      <InputTextbox
        label="Username"
        type="text"
        id="username"
        ariaDescribedby="username-helper"
        placeholder="Enter your username"
        v-model="username"
        :error="errors.username"
      />
      <InputTextbox
          label="Email"
          type="email"
          id="email"
          ariaDescribedby="email-helper"
          placeholder="Enter your email"
          class="w-full mr-2"
          v-model="email"
          :error="errors.email"
        />
      <InputTextbox
        label="Password"
        type="password"
        id="password"
        ariaDescribedby="password-helper"
        placeholder="Enter your password"
        v-model="password"
        :error="errors.password"
      />
      <InputTextbox
        label="Confirm Password"
        type="password"
        id="confirm-password"
        ariaDescribedby="confirm-password-helper"
        placeholder="Enter your password again"
        v-model="confirmPassword"
        :error="errors.confirmPassword"
      />
      <div v-if="authStore.signUpError" id="error" class="my-4 bg-gray-200 p-4 rounded-lg text-justify dark:bg-gray-700">
        <p class="text-red-500 text-sm font-medium dark:text-red-400">{{ authStore.signUpError }}</p>
      </div>
      <ButtonSubmit :disabled="isSigningUp" class="w-full my-4">
        <span v-if="isSigningUp">Loading...</span>
        <span v-else>Sign Up</span>
      </ButtonSubmit>
      <div class="flex justify-center">
        <p class="text-center text-sm font-medium dark:text-white">Do you have an account?</p>
        <NuxtLink to="/auth/sign-in" class="hover:cursor-pointer hover:text-blue-500 px-2 text-center text-sm font-bold dark:text-white">Sign In</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

  definePageMeta({
    layout: false
  });

  const fullName = ref('');
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');

  const authStore = useAuthStore();

  const isSigningUp = ref(false);

  const errors = reactive({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateFullName = async (newValue: string) => {
    errors.fullName = newValue ? '' : 'Full Name is required';
  };

  const validateUsername = async (newValue: string) => {
    const usernamePattern = /^[a-z0-9-]+$/;
    if (!newValue) {
      errors.username = 'Username is required';
    } else {
      if (!usernamePattern.test(newValue)) {
        errors.username = 'Username can only contain lowercase letters, numbers, and hyphens';
      } else {
        try {
          const response = await useApi<{ message?: string }>(
            '/users/is-exist-username',
            {
              method: 'POST',
              data: { username: newValue }
            }
          );
          errors.username = response && response.message ? response.message : '';
        } catch (error) {
          errors.username = '';
        }
      }
    }
  };

  const validateEmail = async (newValue: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!newValue) {
      errors.email = 'Email is required';
    } else {
      if (!emailPattern.test(newValue)) {
        errors.email = 'Email must be a valid email address';
      } else {
        try {
          const response = await useApi<{ message?: string }>(
            '/users/is-exist-email',
            {
              method: 'POST',
              data: { email: newValue }
            }
          );
          errors.email = response && response.message ? response.message : '';
        } catch (error) {
          errors.email = '';
        }
      }
    }
  };

  const validatePassword = async (newValue: string) => {
    if (!newValue) {
      errors.password = 'Password is required';
    } else if (newValue.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else {
      errors.password = '';
    }
  };

  const validateConfirmPassword = async (newValue: string) => {
    if (!newValue) {
      errors.confirmPassword = 'Confirm Password is required';
    } else {
      if (newValue !== password.value) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        errors.confirmPassword = '';
      }
    }
  };

  watch(fullName, validateFullName);
  watch(username, validateUsername);
  watch(email, validateEmail);
  watch(password, validatePassword);
  watch(confirmPassword, validateConfirmPassword);

  const handleSubmit = async () => {
    validateFullName(fullName.value);
    validateUsername(username.value);
    validateEmail(email.value);
    validatePassword(password.value);

    if (!errors.fullName && !errors.username && !errors.email && !errors.password && !errors.confirmPassword) {
      try {
        isSigningUp.value = true;

        await authStore.createTempUser(fullName.value, username.value, email.value, password.value);

        navigateTo('/auth/verification-email');
      } catch (err) {
        if (err instanceof Error) {
          authStore.signUpError = err.message;
        } else {
          authStore.signUpError = 'An unexpected error occurred.';
        }
        console.error('Sign-up error:', err);
      } finally {
        isSigningUp.value = false;
      }
    }
  };
</script>