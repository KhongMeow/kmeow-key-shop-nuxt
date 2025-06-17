<template>
  <form @submit.prevent="onSubmit" class="w-full">
    <header class="mb-6 md:mb-8">
      <h2 class="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Update your account's profile information and email address.
      </p>
    </header>
    <div v-if="profile" class="space-y-4">
      <InputTextbox
        label="Full Name"
        type="text"
        id="full-name"
        ariaDescribedby="full-name-helper"
        placeholder="Enter your full name"
        v-model="profileData.fullname"
        :error="errors.fullname"
      />
      <InputTextbox
        label="Email"
        type="email"
        id="email"
        ariaDescribedby="email-helper"
        placeholder="Enter your email"
        class="w-full"
        v-model="profileData.email"
        :error="errors.email"
      />
    </div>
    <div class="mt-6 flex justify-end">
      <ButtonSubmit :disabled="authStore.isUpdating" type="submit" class="w-full sm:w-auto">
        <span v-if="authStore.isUpdating">Saving...</span>
        <span v-else>Save</span>
      </ButtonSubmit>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/authStore';
  import type { User } from '~/types/users';
  
  definePageMeta({
    layout: 'user-sidebar-left',
    middleware: ['auth'],
  })

  const authStore = useAuthStore();

  const profile = ref<User | null>(null);
  const error = ref<string | null>(null);

  const errors = reactive({
    fullname: '',
    email: '',
  });

  const profileData = computed({
    get: () => profile.value ?? { fullname: '', email: '' },
    set: (val: User) => {
      if (profile.value) {
        profile.value.fullname = val.fullname;
        profile.value.email = val.email;
      }
    }
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

  watch(() => profile.value?.fullname ?? '', validateFullname);
  watch(() => profile.value?.email ?? '', validateEmail);
  const handleUpdateInfo = async () => {
    if (!profile.value) return;

    authStore.isUpdating = true;
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
    } finally {
      authStore.isUpdating = false;
    }
  };
  
  const onSubmit = async () => {
    await handleUpdateInfo();
  };
</script>

<style>

</style>