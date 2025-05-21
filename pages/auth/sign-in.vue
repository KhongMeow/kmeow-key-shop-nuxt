<template>
  <div class="flex items-center justify-center min-h-screen w-screen">
    <form @submit.prevent="handleSubmit" class="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <img src="/assets/kmeowkeyshop_logo.png" alt="Kmeowkeyshop Logo" class="max-w-[4rem] sm:max-w-[5rem] mx-auto" />
      <hr class="my-6 border-gray-300 dark:border-gray-700" />
      <InputTextbox
        label="Username or Email"
        type="text"
        id="username-or-email"
        ariaDescribedby="username-or-email-helper"
        placeholder="Enter your username or email"
        v-model="usernameOrEmail"
        :error="errors.usernameOrEmail"
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
      <div class="flex justify-end">
        <p class="hover:cursor-pointer hover:text-blue-500 text-center text-sm font-medium dark:text-white">Forgot password?</p>
      </div>
      <div v-if="authStore.signInError" id="error" class="my-4 bg-gray-200 p-4 rounded-lg text-center dark:bg-gray-700">
        <p class="text-red-500 text-sm font-medium dark:text-red-400">{{ authStore.signInError }}</p>
      </div>
      <ButtonSubmit class="w-full my-4" :disabled="authStore.isLoading">
        <span v-if="authStore.isLoading">Signing In...</span>
        <span v-else>Sign In</span>
      </ButtonSubmit>
      <div class="flex justify-center">
        <p class="text-center text-sm font-medium dark:text-white">Don't you have account?</p>
        <NuxtLink to="/auth/sign-up" class="hover:cursor-pointer hover:text-blue-500 px-2 text-center text-sm font-bold dark:text-white">Sign Up</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

definePageMeta({
  layout: false
});

const usernameOrEmail = ref('');
const password = ref('');
const error = ref('');

const authStore = useAuthStore();

const errors = reactive({
  usernameOrEmail: '',
  password: ''
});

const validateUsernameOrEmail = async (newValue: string) => {
  errors.usernameOrEmail = newValue ? '' : 'Username or Email is required';
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

watch(usernameOrEmail, validateUsernameOrEmail);
watch(password, validatePassword);

const handleSubmit = async () => {
  error.value = '';

  await validateUsernameOrEmail(usernameOrEmail.value);
  await validatePassword(password.value);

  if (!errors.usernameOrEmail && !errors.password) {
    try {
      await authStore.signIn({
        usernameOrEmail: usernameOrEmail.value,
        password: password.value
      });
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred.';
      }
      console.error('Sign-in error:', err);
    }
  }
}
</script>