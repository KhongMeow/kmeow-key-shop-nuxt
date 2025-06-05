<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Users' }}</h1>
    </header>
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="(table?.tableApi?.getColumn('username')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]"
        placeholder="Filter usernames..."
        @update:model-value="table?.tableApi?.getColumn('username')?.setFilterValue($event)"
      />

      <UDropdownMenu
        :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
          label: upperFirst(column.id),
          type: 'checkbox' as const,
          checked: column.getIsVisible(),
          onUpdateChecked(checked: boolean) {
            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
          },
          onSelect(e?: Event) {
            e?.preventDefault()
          }
        }))"
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class="ml-auto"
          aria-label="Columns select dropdown"
        />
        <UButton
          label="Create"
          :title="canCreate ? 'Create' : 'Unauthorized'"
          :icon="canCreate ? 'tabler:plus' : 'tabler:lock'"
          color="primary"
          class="mr-2"
          :to="canCreate ? '/users-setting/users/create' : undefined"
          :disabled="!canCreate"
        />
      </UDropdownMenu>
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      :loading="isLoading"
      loading-color="primary"
      loading-animation="carousel"
      :data="data ?? undefined"
      :columns="columns"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="min-h-96 [&_th:not(:first-child)]:w-[25%]"
    />

    <div class="border-t border-default pt-2">
      <div class="px-4 text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </div>
      
      <UPagination class="flex justify-center"
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>

    <!-- Change Role Modal -->
    <UModal v-model:open="isChangeRoleModalOpen" :title="`Change Role`" :description="`Here you can change role for user.`" :ui="{ footer: 'justify-end' }">
      <template #body class="min-w-full text-sm">
        <div class="overflow-x-auto max-h-96">
          <div class="p-4">
            <p class="mb-4">Selected User: <strong>{{ selectedUser?.fullname }}</strong></p>
            <!-- Add your role selection form here -->
            <div class="space-y-4">
              <!-- Example role selection - replace with your actual role options -->
              <InputSelectBox
                label="Select Role"
                id="role"
                v-model="selectedRole"
                :options="roles?.map(role => ({ value: role.slug, label: role.name }))"
                placeholder="Select a role..."
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancel" color="neutral" variant="outline" @click="isChangeRoleModalOpen = false" />
        <UButton label="Submit" color="primary" :loading="isChangingRole" @click="confirmChangeRole" />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
  import { h, resolveComponent } from 'vue'
  import { upperFirst } from 'scule'
  import type { TableColumn } from '@nuxt/ui'
  import { getPaginationRowModel } from '@tanstack/vue-table'
  import Swal from 'sweetalert2'
  import { useAuthStore } from '~/store/authStore'
  import type { User } from '~/types/users'
  import type { Role } from '~/types/roles'

  definePageMeta({
    layout: 'users-setting',
    middleware: ['auth', 'users-setting', 'permission'],
    requiredPermission: 'list-users',
  });

  const authStore = useAuthStore();
  const isDark = ref(false);
  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const data = ref<User[] | null>(null);
  let isLoading = ref(false);
  let isChangingRole = ref(false);
  const error = ref<string | null>(null);

  const isChangeRoleModalOpen = ref(false);
  const selectedUser = ref<User | null>(null);
  const selectedRole = ref<string>('');
  const roles = ref<Role[] | undefined>(undefined);

  const canCreate = authStore.checkPermission('create-user')
  const canChangeRole = authStore.checkPermission('change-role-user')
  const canResetPassword = authStore.checkPermission('reset-password-user')
  const canDelete = authStore.checkPermission('delete-user')

  onMounted(async () => {
    await [getUsers(), getRoles()];
    isDark.value = document.documentElement.classList.contains('dark');
  });

  function changeRoleUser(username: string) {
    getUser(username).then(user => {
      if (user) {
        selectedUser.value = user;
        selectedRole.value = user.role.slug;
        isChangeRoleModalOpen.value = true;
      }
    });
  }

  function confirmChangeRole() {
    try {
      if (!selectedUser.value || !selectedRole.value) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Please select a user and a role.',
          timer: 2000,
          showConfirmButton: false,
          background: isDark.value ? '#1a202c' : '#fff',
          color: isDark.value ? '#fff' : '#1a202c',
        });
        return;
      }

      isChangingRole.value = true;

      useApi(`/users/change-role/${selectedUser.value.username}`, {
        method: 'POST',
        data: {
          newRoleSlug: selectedRole.value,
        },
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Role Changed!',
          text: `The user's role has been changed to ${selectedRole.value}.`,
          timer: 2000,
          showConfirmButton: false,
          background: isDark.value ? '#1a202c' : '#fff',
          color: isDark.value ? '#fff' : '#1a202c',
        });
        getUsers(); // Refresh the user list
      }).catch(err => {
        console.error('Failed to change role:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err?.response?.data?.message || 'Unknown error',
          timer: 2000,
          showConfirmButton: false,
          background: isDark.value ? '#1a202c' : '#fff',
          color: isDark.value ? '#fff' : '#1a202c',
        });
      }).finally(() => {
        isChangingRole.value = false;
      });
    } catch (err: any) {
      console.error('Failed to change role:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err?.response?.data?.message || 'Unknown error',
        timer: 2000,
        showConfirmButton: false,
        background: isDark.value ? '#1a202c' : '#fff',
        color: isDark.value ? '#fff' : '#1a202c',
      });
    } finally {
      isChangeRoleModalOpen.value = false;
    }
  }

  const pagination = ref({
    pageIndex: 0,
    pageSize: 24,
  })

  function resetPasswordUser(username: string) {
    Swal.fire({
      title: 'Do you want to reset password?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!',
      background: isDark ? '#1a202c' : '#fff',
      color: isDark ? '#fff' : '#1a202c',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          isLoading.value = true;
          await useApi(`/users/reset-password/${username}`, {
            method: 'POST',
          });
          Swal.fire({
            icon: 'success',
            title: 'Reset Password!',
            text: "The user's password has been reset. New password was sent to the user's email.",
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
        } catch (err: any) {
          console.error('Failed to reset password:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err?.response?.data?.message || 'Unknown error',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
        } finally {
          isLoading.value = false;
        }
      }
    }).catch(err => {
      console.error('Error during reset confirmation:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to confirm reset password',
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1a202c' : '#fff',
        color: isDark ? '#fff' : '#1a202c',
      });
    });
  }

  function deleteRow(username: string) {
    Swal.fire({
      title: 'Do you want to delete?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#1a202c' : '#fff',
      color: isDark ? '#fff' : '#1a202c',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          isLoading.value = true;
          await useApi(`/users/${username}`, {
            method: 'DELETE',
          });
          data.value = data.value?.filter(item => item.username !== username) || [];
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your user has been deleted.',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
        } catch (err: any) {
          console.error('Failed to delete user:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err?.response?.data?.message || 'Unknown error',
            timer: 2000,
            showConfirmButton: false,
            background: isDark ? '#1a202c' : '#fff',
            color: isDark ? '#fff' : '#1a202c',
          });
        } finally {
          isLoading.value = false;
        }
      }
    }).catch(err => {
      console.error('Error during delete confirmation:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to confirm deletion',
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1a202c' : '#fff',
        color: isDark ? '#fff' : '#1a202c',
      });
    });
  }

  async function getUser(username: string) {
    try {
      isLoading.value = true;
      const response = await useApi<User>(`/users/${username}`, {
        method: 'GET',
      });
      return response;
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      error.value = err?.message || 'Unknown error';
      return null;
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
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch roles:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  async function getUsers() {
    try {
      isLoading.value = true;
      const response = await useApi<User[]>(`/users`, {
        method: 'GET',
      });
      data.value = response;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  const columns: TableColumn<User>[] = [{
    accessorKey: 'id',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => `${row.index + 1}`,
  }, {
    accessorKey: 'fullname',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Full Name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.getValue('fullname'),
  }, {
    accessorKey: 'username',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Username',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.getValue('username'),
  }, {
    accessorKey: 'role',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Role',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.original.role.name,
  }, {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex' }, [
        h(UButton, {
          class: [
            'px-2 py-1 mr-2 rounded flex items-center transition-colors bg-blue-600 text-white',
            canChangeRole
              ? 'hover:bg-blue-700'
              : 'cursor-not-allowed'
          ].join(' '),
          title: canChangeRole ? 'Change Role' : 'Unauthorized',
          color: canChangeRole ? undefined : 'none',
          variant: canChangeRole ? undefined : 'none',
          icon: canChangeRole ? 'tabler:edit' : 'tabler:lock',
          disabled: !canChangeRole,
          onClick: canChangeRole ? () => changeRoleUser(row.original.username) : undefined,
        }, {
          default: () => h('span', { class: 'hidden lg:inline' }, 'Change Role')
        }),
        h(UButton, {
          class: [
            'px-2 py-1 mr-2 rounded flex items-center transition-colors bg-yellow-600 text-white',
            canResetPassword
              ? 'hover:bg-yellow-700'
              : 'cursor-not-allowed'
          ].join(' '),
          title: canResetPassword ? 'Reset Password' : 'Unauthorized',
          color: canResetPassword ? undefined : 'none',
          variant: canResetPassword ? undefined : 'none',
          icon: canResetPassword ? 'tabler:reload' : 'tabler:lock',
          disabled: !canResetPassword,
          onClick: canResetPassword ? () => resetPasswordUser(row.original.username) : undefined,
        }, {
          default: () => h('span', { class: 'hidden lg:inline' }, 'Reset Password')
        }),
        h(UButton, {
          class: [
            'px-2 py-1 rounded flex items-center transition-colors bg-red-600 text-white',
            canDelete
              ? 'hover:bg-red-700'
              : 'cursor-not-allowed'
          ].join(' '),
          title: canDelete ? 'Delete' : 'Unauthorized',
          color: canDelete ? undefined : 'none',
          variant: canDelete ? undefined : 'none',
          icon: canDelete ? 'tabler:trash-filled' : 'tabler:lock',
          disabled: !canDelete,
          onClick: canDelete ? () => deleteRow(row.original.username) : undefined,
        }, {
          default: () => h('span', { class: 'hidden lg:inline' }, 'Delete')
        })
      ])
    }
  }]

  const table = useTemplateRef('table')
</script>