<template>
  <div class="px-2 sm:px-4 md:px-8 mx-auto">
    <h1 class="text-xl md:text-2xl font-bold py-4">My Profile</h1>
    <div class="flex flex-row gap-6">
      <!-- Sidebar -->
      <aside
        class="group flex flex-col items-center md:items-stretch transition-all duration-200 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-2 md:p-4 h-fit"
      >
        <nav class="flex flex-col gap-2 w-full">
          <button
            class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
            :class="activeSection === 'update-profile' ? 'bg-gray-200 dark:bg-gray-700' : ''"
            @click="activeSection = 'update-profile'"
            title="Profile Information"
          >
            <!-- Icon -->
            <Icon name="mdi:account-circle-outline" class="h-6 w-6 flex-shrink-0" />
            <!-- Text, hidden by default, shown on hover or md+ -->
            <span class="hidden md:inline transition-all">Profile Information</span>
          </button>
          <button
            class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
            :class="activeSection === 'my-orders' ? 'bg-gray-200 dark:bg-gray-700' : ''"
            @click="activeSection = 'my-orders'"
            title="My Orders"
          >
            <!-- Icon -->
            <Icon name="mdi:cart-outline" class="h-6 w-6 flex-shrink-0" />
            <!-- Text, hidden by default, shown on hover or md+ -->
            <span class="hidden md:inline transition-all">My Orders</span>
          </button>
          <button
            class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
            :class="activeSection === 'change-password' ? 'bg-gray-200 dark:bg-gray-700' : ''"
            @click="activeSection = 'change-password'"
            title="Change Password"
          >
            <!-- Icon -->
            <Icon name="mdi:lock-outline" class="h-6 w-6 flex-shrink-0" />
            <span class="hidden md:inline transition-all">Change Password</span>
          </button>
        </nav>
      </aside>
      <!-- Main Content -->
      <main class="flex-1">
        <!-- Update Profile Section -->
        <div
          v-if="activeSection === 'update-profile'"
          class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-6"
        >
          <UserUpdateProfile
            :profile="profile"
            :errors="errors"
            :isUpdating="authStore.isUpdating"
            @submit="handleUpdateInfo"
          />
        </div>

        <!-- My Orders Section -->
        <div
          v-if="activeSection === 'my-orders'"
          class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8"
        >
          <UserMyOrders
            v-if="activeSection === 'my-orders'"
            :profile="profile"
            :error="error"
            :isLoading="authStore.isLoading"
            @fetchOrders="authStore.getUserOrders"
          />
        </div>

        <!-- Change Password Section -->
        <div
          v-if="activeSection === 'change-password'"
          class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8"
        >
          <UserChangePassword
            v-if="activeSection === 'change-password'"
            :profile="profile"
            :changePasswordData="changePasswordData"
            :errors="errors"
            :isChanging="authStore.isChanging"
            @submit="handleChangePassword"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import { useAuthStore } from '~/store/authStore';
  import type { User } from '~/types/users';

  const authStore = useAuthStore();
  const activeSection = ref<'my-orders' | 'update-profile' | 'change-password'>('update-profile');

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
    fullname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateFullname = async (newValue: string) => {
    if (!newValue) {
      errors.fullname = 'Full Name is required';
    } else {
      errors.fullname = '';
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
            '/users/is-exist-email-auth',
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

  watch(() => profile.value?.fullname ?? '', validateFullname);
  watch(() => profile.value?.email ?? '', validateEmail);

  const handleUpdateInfo = async () => {
    if (!profile.value) return;

    try {
      const updateResult = await authStore.updateUser(
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