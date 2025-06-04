<template>
  <div>
    meow
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'users-setting',
    middleware: ['auth', 'users-setting'],
  });
</script>

<style>

</style>