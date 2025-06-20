<template>
  <div class="flex items-center justify-center min-h-screen w-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-xs sm:max-w-sm mx-auto m-4 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div class="flex items-center justify-center mb-6">
        <div class="bg-green-500 rounded-full p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      </div>
      <h1 class="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Verification Email
      </h1>
      <p class="text-center text-sm font-medium text-gray-600 dark:text-gray-300 mb-6">
        We have sent a verification code to
        <span class="block font-bold text-gray-800 dark:text-white">{{ email }}</span>
        Please enter the code below to verify your email.
      </p>
      <div class="flex justify-center gap-2 mb-4">
        <input
          v-for="(digit, index) in verifyCode"
          :key="index"
          ref="codeInputs"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          :disabled="isDisabled(index)"
          class="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          v-model="verifyCode[index]"
          @input="onInput(index)"
          @paste="onPaste"
          @keydown.backspace="onBackspace(index, $event)"
        />
      </div>
      <div class="flex justify-center items-center mb-4">
        <p class="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          Didn't receive the code?
        </p>
        <button
          :disabled="isResending"
          :class="{
            'hover:cursor-pointer hover:text-blue-500': !isResending,
            'opacity-50 cursor-not-allowed': isResending
          }"
          class="text-blue-600 dark:text-blue-400 px-2 text-center text-sm font-bold"
          @click="resendVerificationEmail"
        >
          <span v-if="!isResending">Resend code</span>
          <span v-else>Sending...</span>
        </button>
      </div>
      <div v-if="authStore.signUpError" id="error" class="my-4 items-center bg-red-50 border border-red-200 p-4 rounded-lg text-justify dark:bg-red-900/20 dark:border-red-800">
        <p class="text-red-600 text-sm text-center font-medium dark:text-red-400">
          {{ authStore.signUpError }}
        </p>
      </div>
      <ButtonSubmit :disabled="isVerifying || !isCodeComplete" class="w-full my-4" @click="verifyEmail">
        <span v-if="isVerifying">Loading...</span>
        <span v-else>Verify</span>
      </ButtonSubmit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import { useAuthStore } from '~/store/authStore';

definePageMeta({
  layout: false,
  middleware: 'authenticated'
});

const authStore = useAuthStore();
const state = window.history.state

// Get data from route query or state
const action = ref(state?.action || '');
const fullName = ref(state?.fullName || '');
const username = ref(state?.username || '');
const email = ref(state?.email || '');
const password = ref(state?.password || '');

const verifyCode = ref(['', '', '', '', '', '']); // Array for 6 digits
const codeInputs = ref<HTMLInputElement[]>([]);

const isResending = ref(false);
const isVerifying = ref(false);

const isCodeComplete = computed(() => {
  return verifyCode.value.every(digit => digit !== '');
});

// Disable the next input if the previous one is blank
const isDisabled = (index: number) => {
  if (index === 0) return false; // First input is always enabled
  return verifyCode.value[index - 1] === ''; // Disable if the previous input is blank
};

const onInput = (index: number) => {
  verifyCode.value[index] = verifyCode.value[index].replace(/[^0-9]/g, '');
  if (verifyCode.value[index].length > 1) {
    verifyCode.value[index] = verifyCode.value[index].slice(0, 1); // Ensure only one digit
  }
  if (index < verifyCode.value.length - 1 && verifyCode.value[index] !== '') {
    // Move to the next input
    const nextInput = codeInputs.value[index + 1];
    nextInput?.focus();
  }

  // Check if all inputs are filled
  if (isCodeComplete.value) {
    verifyEmail(); // Automatically submit when all 6 digits are entered
  }
};

const onPaste = (event: ClipboardEvent) => {
  const pastedData = event.clipboardData?.getData('text') || '';
  if (/^\d{6}$/.test(pastedData)) {
    // Ensure the pasted data is exactly 6 digits
    for (let i = 0; i < verifyCode.value.length; i++) {
      verifyCode.value[i] = pastedData[i] || ''; // Populate each input field
    }

    // Automatically submit if all inputs are filled
    if (isCodeComplete.value) {
      verifyEmail();
    }
  }
  event.preventDefault(); // Prevent the default paste behavior
};

const onBackspace = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && verifyCode.value[index] === '' && index > 0) {
    // Move to the previous input
    const prevInput = codeInputs.value[index - 1];
    prevInput?.focus();
  }
};

const resendVerificationEmail = async () => {
  try {
    isResending.value = true;
    authStore.signUpError = ''; // Clear previous errors

    await authStore.sendVerifyCode(email.value);
  } catch (error) {
    if (error instanceof Error) {
      authStore.signUpError = error.message;
    } else {
      authStore.signUpError = 'An unexpected error occurred.';
    }
    console.error('Resend verification error:', error);
  } finally {
    isResending.value = false;
  }
};

const verifyEmail = async () => {
  if (!isCodeComplete.value) return;
  
  try {
    isVerifying.value = true;
    authStore.signUpError = ''; // Clear previous errors

    const code = verifyCode.value.join('');
    
    await authStore.verificationEmail(email.value, code);
    if (action.value === 'sign-up') {
      await authStore.signUp(fullName.value, username.value, email.value, password.value);
    } else if (action.value === 'forgot-password') {
      try {
        const response = await authStore.forgotPassword(email.value);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message,
          showConfirmButton: true,
          ...getSwalTheme(),
        });
      } catch (error) {
        if (error instanceof Error) {
          authStore.signUpError = error.message;
        } else {
          authStore.signUpError = 'An unexpected error occurred.';
        }
        console.error('Reset password error:', error);
      }
    }

    await navigateTo('/auth/sign-in');
  } catch (error) {
    if (error instanceof Error) {
      authStore.signUpError = error.message;
    } else {
      authStore.signUpError = 'An unexpected error occurred.';
    }
    console.error('Verification error:', error);
  } finally {
    isVerifying.value = false;
  }
};
</script>