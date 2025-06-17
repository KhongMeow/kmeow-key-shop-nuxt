<template>
  <form @submit.prevent="handleChangePassword" class="w-full">
    <header class="mb-6 md:mb-8">
      <h2 class="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100">Change Password</h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Ensure your account is using a long, random password to stay secure.
      </p>
    </header>
    <div v-if="profile" class="space-y-4">
      <InputTextbox
        label="Current Password"
        type="password"
        id="current-password"
        ariaDescribedby="current-password-helper"
        placeholder="Enter your current password"
        v-model="changePasswordData.currentPassword"
        :error="errors.currentPassword"
      />
      <InputTextbox
        label="New Password"
        type="password"
        id="new-password"
        ariaDescribedby="new-password-helper"
        placeholder="Enter new password"
        v-model="changePasswordData.newPassword"
        :error="errors.newPassword"
      />
      <InputTextbox
        label="Confirm Password"
        type="password"
        id="confirm-password"
        ariaDescribedby="confirm-password-helper"
        placeholder="Enter confirm password"
        v-model="changePasswordData.confirmPassword"
        :error="errors.confirmPassword"
      />
    </div>
    <div class="mt-6 flex justify-end">
      <ButtonSubmit :disabled="isChanging" type="submit" class="w-full sm:w-auto">
        <span v-if="isChanging">Saving...</span>
        <span v-else>Save</span>
      </ButtonSubmit>
    </div>
  </form>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import { useAuthStore } from '~/store/authStore';
import type { User } from '~/types/users';

  definePageMeta({
    layout: 'user-sidebar-left',
    middleware: ['auth'],
  })

  const authStore = useAuthStore();
  const profile = ref<User | null>(null);
  const error = ref<string | null>(null);
  const isChanging = ref(false);
  
  type ChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const changePasswordData = ref<ChangePassword>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const errors = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  onMounted(async () => {
    try {
      const response = await authStore.getUser();
      authStore.user ? profile.value = authStore.user : profile.value = null;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      error.value = err?.message || 'Unknown error';
    }
  });

  const validateNewPassword = async (newValue: string) => {
    if (!newValue) {
      errors.newPassword = 'Password is required';
    } else if (newValue.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else {
      errors.newPassword = '';
    }
  };

  const validateConfirmPassword = async (newValue: string) => {
    if (!newValue) {
      errors.confirmPassword = 'Confirm Password is required';
    } else {
      if (newValue !== changePasswordData.value.newPassword) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        errors.confirmPassword = '';
      }
    }
  };

  watch(() => changePasswordData.value.newPassword, validateNewPassword);
  watch(() => changePasswordData.value.confirmPassword, validateConfirmPassword);
  const handleChangePassword = async () => {
    isChanging.value = true;
    try {
      await validateNewPassword(changePasswordData.value.newPassword);
      await validateConfirmPassword(changePasswordData.value.confirmPassword);

      if (errors.newPassword || errors.confirmPassword) {
        throw new Error('Please fix the errors before submitting.');
      }

      await authStore.changePassword(
        changePasswordData.value.currentPassword,
        changePasswordData.value.newPassword
      );

      Swal.fire({
        icon: 'success',
        title: 'Password Changed Successfully',
        text: 'Your password has been changed successfully.',
        showConfirmButton: false,
        timer: 2000,
        ...getSwalTheme(),
      })

      // Clear the fields after successful change
      changePasswordData.value.currentPassword = '';
      changePasswordData.value.newPassword = '';
      changePasswordData.value.confirmPassword = '';
      error.value = null;
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error Changing Password',
        text: err?.message || 'An error occurred while changing your password.',
        showConfirmButton: true,
        ...getSwalTheme(),
      });
      error.value = err?.message || 'Unknown error';
    } finally {
      isChanging.value = false;
    }
  }
</script>

<style>

</style>