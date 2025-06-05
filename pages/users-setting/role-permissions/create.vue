<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Create Role Permissions' }}</h1>
      <ButtonSubmit class="ml-auto" :disabled="isCreating">
        {{ isCreating ? 'Creating...' : 'Create' }}
      </ButtonSubmit>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3.5">
      <InputSelectBox
        label="Role"
        id="role"
        v-model="role"
        :options="roles?.map(role => ({ value: String(role.slug), label: role.name }))"
        :error="errors.role"
        :placeholder="'Select a role...'"
      />
      <InputSelectBox
        label="Permission"
        id="permission"
        v-model="permission"
        :options="permissions?.map(permission => ({ value: String(permission.slug), label: permission.name }))"
        :error="errors.permission"
        :placeholder="'Select a permission...'"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
  import Swal from 'sweetalert2';
  import type { Role } from '~/types/roles';
  import type { Permission } from '~/types/permissions';
  import type { RolePermission } from '~/types/role-permissions';

  definePageMeta({
    layout: 'users-setting',
    middleware: ['auth', 'dashboard', 'permission'],
    requiredPermission: 'create-role-permission',
  });
  
  const isDark = ref(false);
  const role = ref<string | undefined>(undefined);
  const roles = ref<Role[] | undefined>(undefined);
  const permission = ref<string | undefined>(undefined);
  const permissions = ref<Permission[] | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let isCreating = ref(false);
  
  const errors = reactive({
    role: '',
    permission: '',
  });

  onMounted(async () => {
    isDark.value = document.documentElement.classList.contains('dark');
    await [getRoles(), getPermissions()];
  });
  
  async function getRoles() {
    try {
      isLoading.value = true;
      const response = await useApi<Role[]>(`/roles`, {
        method: 'GET',
      });
      roles.value = response;
      role.value = '';
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch roles:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  async function getPermissions() {
    try {
      isLoading.value = true;
      const response = await useApi<Permission[]>(`/permissions`, {
        method: 'GET',
      });
      permissions.value = response;
      permission.value = '';
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  const validateRole = async (newValue: string | undefined) => {
    errors.role = newValue ? '' : 'Role is required';
  };

  const validatePermission = async (newValue: string | undefined) => {
    errors.permission = newValue ? '' : 'Permission is required';
  };

  watch(role, validateRole);
  watch(permission, validatePermission);

  const handleSubmit = async () => {
    validateRole(role.value);
    validatePermission(permission.value);

    if (!errors.role && !errors.permission) {
      try {
        isCreating.value = true;
        const response = await useApi<RolePermission[]>(`/role-permissions`, {
          method: 'POST',
          data: {
            roleSlug: role.value,
            permissionSlug: permission.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Role permission created successfully!',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
          navigateTo('/users-setting/role-permissions');
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create Role',
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? '#1a202c' : '#fff',
          color: isDark ? '#fff' : '#1a202c',
        });
      } finally {
        isCreating.value = false;
      }
    }
  };
</script>

<style>

</style>