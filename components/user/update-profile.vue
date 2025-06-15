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
        v-model="profile.fullname"
        :error="errors.fullname"
      />
      <InputTextbox
        label="Email"
        type="email"
        id="email"
        ariaDescribedby="email-helper"
        placeholder="Enter your email"
        class="w-full"
        v-model="profile.email"
        :error="errors.email"
      />
    </div>
    <div class="mt-6 flex justify-end">
      <ButtonSubmit :disabled="isUpdating" type="submit" class="w-full sm:w-auto">
        <span v-if="isUpdating">Saving...</span>
        <span v-else>Save</span>
      </ButtonSubmit>
    </div>
  </form>
</template>

<script setup lang="ts">
defineProps<{
  profile: any,
  errors: any,
  isUpdating: boolean
}>();
const emit = defineEmits(['submit']);
const onSubmit = () => emit('submit');
</script>