<template>
  <div class="flex items-center justify-center min-h-screen w-screen">
    <form @submit.prevent="handleSubmit" class="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <img src="/assets/kmeowkeyshop_logo.png" alt="Kmeowkeyshop Logo" class="max-w-[4rem] sm:max-w-[5rem] mx-auto" />
      <hr class="my-6 border-gray-300 dark:border-gray-700" />
      
      <h2 class="text-xl font-bold text-center mb-4 dark:text-white">Forgot Password</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>
      
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
      
      <div v-if="error" id="error" class="my-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
        <p class="text-red-500 text-sm font-medium dark:text-red-400">{{ error }}</p>
      </div>
      
      <ButtonSubmit class="w-full my-4" :disabled="isLoading">
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send Verification Code</span>
      </ButtonSubmit>
      
      <div class="flex justify-center">
        <p class="text-center text-sm font-medium dark:text-white">Remember your password?</p>
        <NuxtLink to="/auth/sign-in" class="hover:cursor-pointer hover:text-blue-500 px-2 text-center text-sm font-bold dark:text-white">Sign In</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

definePageMeta({
  layout: false,
  middleware: 'authenticated'
});

const email = ref('');
const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const authStore = useAuthStore();

const errors = reactive({
  email: ''
});

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
          
          if (response && response.message) {
            errors.email = '';
          } else {
            errors.email = 'Email does not exist';
          }
        } catch (error) {
          errors.email = 'Unable to verify email address';
        }
      }
    }
  };

watch(email, validateEmail);

const handleSubmit = async () => {
  error.value = '';
  successMessage.value = '';

  await validateEmail(email.value);

  if (!errors.email) {
    try {
      isLoading.value = true;
      
      // Send verification code for password reset
      await authStore.sendVerifyCode(email.value);
      
      // Navigate to verification page with email context
      navigateTo({
        path: '/auth/verification-email',
        state: {
          action: 'forgot-password',
          email: email.value
        }
      });
      
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred.';
      }
      console.error('Password reset error:', err);
    } finally {
      isLoading.value = false;
    }
  }
}
</script>