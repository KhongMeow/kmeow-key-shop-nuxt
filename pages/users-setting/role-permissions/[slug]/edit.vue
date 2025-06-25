<template>
  <form @submit.prevent="handleSubmit" class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <HeaderPageHead title="Edit Role Permission" />

    <ButtonSubmit class="ml-auto" :disabled="isEditing">
      {{ isEditing ? 'Editing...' : 'Edit' }}
    </ButtonSubmit>

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
    requiredPermission: 'update-role-permission',
  });
  
  const route = useRoute();
  const isDark = ref(false);
  const role = ref<string | undefined>(undefined);
  const roles = ref<Role[] | undefined>(undefined);
  const permission = ref<string | undefined>(undefined);
  const permissions = ref<Permission[] | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let isEditing = ref(false);
  
  const errors = reactive({
    role: '',
    permission: '',
  });

  onMounted(async () => {
    isDark.value = document.documentElement.classList.contains('dark');
    await [getRoles(), getPermissions(), getRolePermission()];
  });

  async function getRolePermission() {
    try {
      while (!roles.value || !permissions.value || roles.value.length === 0 || permissions.value.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
        
      isLoading.value = true;
      const response = await useApi<RolePermission>(`/role-permissions/${route.params.slug}`, {
        method: 'GET',
      });
      role.value = response.role.slug;
      permission.value = response.permission.slug;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch role permission:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }
  
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
        isEditing.value = true;
        const response = await useApi<RolePermission[]>(`/role-permissions/${route.params.slug}`, {
          method: 'PATCH',
          data: {
            roleSlug: role.value,
            permissionSlug: permission.value,
          },
        });

        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Role permission updated successfully!',
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
        isEditing.value = false;
      }
    }
  };
</script>

<style>

</style>