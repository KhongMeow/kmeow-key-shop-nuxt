<template>
  <form @submit.prevent="onSubmit" class="w-full">
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

<script setup lang="ts">
defineProps<{
  profile: any,
  changePasswordData: any,
  errors: any,
  isChanging: boolean
}>();
const emit = defineEmits(['submit']);
function onSubmit() {
  emit('submit');
}
</script>