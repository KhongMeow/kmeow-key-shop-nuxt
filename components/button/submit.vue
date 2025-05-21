<template>
  <button
    :disabled="disabled"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    <slot>Submit</slot>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
/* Add styles for the disabled state */
</style>