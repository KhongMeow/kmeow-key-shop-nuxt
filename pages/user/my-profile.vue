<template>
  <div>
    <h1 class="text-xl font-bold py-4">My Profile</h1>

    <div class="w-full flex bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-8 my-6">
      <form @submit.prevent="handleUpdateInfo" class="w-full">
        <header class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your account's profile information and email address.</p>
        </header>
        <div v-if="profile">
          <InputTextbox
            label="Full Name"
            type="text"
            id="full-name"
            ariaDescribedby="full-name-helper"
            placeholder="Enter your full name"
            v-model="profile.fullname"
          />
          <InputTextbox
            label="Email"
            type="email"
            id="email"
            ariaDescribedby="email-helper"
            placeholder="Enter your email"
            class="w-full mr-2"
            v-model="profile.email"
          />
        </div>
        <ButtonSubmit :disabled="authStore.isUpdating" type="submit">
          <span v-if="authStore.isUpdating">Saving...</span>
          <span v-else>Save</span>
        </ButtonSubmit>
      </form>
    </div>
  
    <div class="w-full flex bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-8 my-6">
      <form @submit.prevent="handleChangePassword" class="w-full">
        <header class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
        </header>
        <div v-if="profile">
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
        <ButtonSubmit :disabled="authStore.isChanging" type="submit">
          <span v-if="authStore.isChanging">Saving...</span>
          <span v-else>Save</span>
        </ButtonSubmit>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/authStore';

  const authStore = useAuthStore();
  type RolePermission = {
    permission: {
      slug: string;
    };
  };

  type Role = {
    rolePermissions: RolePermission[];
  };

  type User = {
    id: number;
    fullname: string;
    username: string;
    email: string;
    role: Role | Role[];
  };

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

  const profile = ref<User | null>(null);
  const error = ref<string | null>(null);

  definePageMeta({
    middleware: 'auth',
    title: 'My Profile',
  })

  const handleUpdateInfo = async () => {
    if (!profile.value) return;

    try {
      const updateResult = await authStore.updateUser(
        profile.value.id,
        profile.value.fullname,
        profile.value.email
      );
      // Only proceed if updateUser succeeded
      if (updateResult) {
        await authStore.getUser();
        error.value = null;
      }
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      error.value = err?.message || 'Unknown error';
    }
  };

  watch(() => changePasswordData.value.newPassword, validateNewPassword);
  watch(() => changePasswordData.value.confirmPassword, validateConfirmPassword);

  const handleChangePassword = async () => {
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

      // Clear the fields after successful change
      changePasswordData.value.currentPassword = '';
      changePasswordData.value.newPassword = '';
      changePasswordData.value.confirmPassword = '';
      error.value = null;
    } catch (err: any) {
      console.error('Failed to change password:', err);
      error.value = err?.message || 'Unknown error';
    }
  }

  onMounted(async () => {
    try {
      await authStore.getUser();
      if (authStore.user) {
        profile.value = {
          id: authStore.user.id,
          fullname: authStore.user.fullname,
          username: authStore.user.username,
          email: authStore.user.email,
          role: {
            rolePermissions: [] // Map or fetch permissions as needed
          }
        };
      } else {
        profile.value = null;
      }
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      error.value = err?.message || 'Unknown error';
    }
  });
</script>

<style>

</style>