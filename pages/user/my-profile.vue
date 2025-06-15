<template>
  <div class="px-2 sm:px-4 md:px-8 mx-auto">
    <h1 class="text-xl md:text-2xl font-bold py-4 text-center md:text-left">My Profile</h1>
    <div class="flex flex-row gap-6">
      <!-- Sidebar -->
      <aside
        class="group flex flex-col items-center md:items-stretch w-14 hover:w-44 md:w-64 md:hover:w-64 transition-all duration-200 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-2 md:p-4 h-fit"
      >
        <nav class="flex flex-col gap-2 w-full">
          <button
            class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
            :class="activeSection === 'profile' ? 'bg-gray-200 dark:bg-gray-700' : ''"
            @click="activeSection = 'profile'"
          >
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- Text, hidden by default, shown on hover or md+ -->
            <span class="hidden group-hover:inline md:inline transition-all">Profile Information</span>
          </button>
          <button
            class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
            :class="activeSection === 'password' ? 'bg-gray-200 dark:bg-gray-700' : ''"
            @click="activeSection = 'password'"
          >
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z" />
            </svg>
            <span class="hidden group-hover:inline md:inline transition-all">Update Password</span>
          </button>
        </nav>
      </aside>
      <!-- Main Content -->
      <main class="flex-1">
        <div
          v-if="activeSection === 'profile'"
          class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-6"
        >
          <form @submit.prevent="handleUpdateInfo" class="w-full">
            <header class="mb-6 md:mb-8">
              <h2 class="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your account's profile information and email address.</p>
            </header>
            <div v-if="profile" class="space-y-4">
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
                class="w-full"
                v-model="profile.email"
              />
            </div>
            <div class="mt-6 flex justify-end">
              <ButtonSubmit :disabled="authStore.isUpdating" type="submit" class="w-full sm:w-auto">
                <span v-if="authStore.isUpdating">Saving...</span>
                <span v-else>Save</span>
              </ButtonSubmit>
            </div>
          </form>
        </div>
        <div
          v-if="activeSection === 'password'"
          class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8"
        >
          <form @submit.prevent="handleChangePassword" class="w-full">
            <header class="mb-6 md:mb-8">
              <h2 class="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100">Update Password</h2>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
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
              <ButtonSubmit :disabled="authStore.isChanging" type="submit" class="w-full sm:w-auto">
                <span v-if="authStore.isChanging">Saving...</span>
                <span v-else>Save</span>
              </ButtonSubmit>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/authStore';

  const authStore = useAuthStore();
  const activeSection = ref<'profile' | 'password'>('profile');

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
      const response = await authStore.getUser();
      authStore.user ? profile.value = authStore.user : profile.value = null;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      error.value = err?.message || 'Unknown error';
    }
  });
</script>

<style>

</style>