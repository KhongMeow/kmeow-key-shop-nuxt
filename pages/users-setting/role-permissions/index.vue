<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <HeaderPageHeader title="Roles" />

    <div class="flex max-sm:flex-col items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string)"
        class="w-48 max-sm:w-full"
        placeholder="Filter names..."
        @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
      />

      <div class="flex max-sm:flex-col-reverse ml-auto gap-2">
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
            aria-label="Columns select dropdown"
          />
        </UDropdownMenu>

        <UButton
          label="Create"
          :title="canCreate ? 'Create' : 'Unauthorized'"
          :icon="canCreate ? 'tabler:plus' : 'tabler:lock'"
          color="primary"
          :to="canCreate ? '/users-setting/role-permissions/create' : undefined"
          :disabled="!canCreate"
        />
      </div>
    </div>

    <UTable
      ref="table"
      :loading="isLoading"
      loading-color="primary"
      loading-animation="carousel"
      :data="flattenedData"
      :columns="columns"
      :grouping="['roleId']"
      :grouping-options="grouping_options"
      class="min-h-96 max-md:[&_th]:hidden  [&_th]:w-[45%]  max-md:[&_td]:flex max-md:[&_tr]:border-b max-md:[&_tr]:border-gray-500"
      :ui="{
        root: 'min-w-full',
        td: 'empty:p-0',
        th: 'w-[25%]'
      }"
    >
      <template #title-cell="{ row }">
        <div v-if="row.getIsGrouped()" class="flex items-center">
          <UButton
            variant="outline"
            color="neutral"
            class="mr-2"
            size="xs"
            :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
            @click="row.toggleExpanded()"
          />
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">Role</UBadge>
            <strong>{{ row.original.roleName }}</strong>
          </div>
        </div>
        <div v-else class="flex items-center">
          <span class="inline-block w-6"></span>
          <UBadge 
            color="neutral" 
            variant="subtle" 
            size="xs"
            class="mr-2"
          >
            {{ row.original.isEmpty ? '(No permissions)' : 'Permission' }}
          </UBadge>
          <span>{{ row.getValue('permissionName') }}</span>
        </div>
      </template>
    </UTable>

    <div class="border-t border-default pt-2">
      <div class="px-4 text-sm text-muted">
        {{ filteredRoles.length }} row(s) selected.
      </div>
      
      <UPagination class="flex justify-center"
        :default-page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="filteredRoles.length"
        @update:page="(p) => pagination.pageIndex = p - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, resolveComponent, computed, ref, onMounted } from 'vue'
  import { upperFirst } from 'scule'
  import type { TableColumn } from '@nuxt/ui'
  import { getGroupedRowModel, type GroupingOptions } from '@tanstack/vue-table'
  import Swal from 'sweetalert2'
  import { useAuthStore } from '~/store/authStore'
  import type { Role } from '~/types/roles'

  definePageMeta({
    layout: 'users-setting',
    middleware: ['auth', 'users-setting', 'permission'],
    requiredPermission: 'list-role-permissions',
  });

  const authStore = useAuthStore();
  const isDark = ref(false);
  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const data = ref<Role[] | null>(null);
  let isLoading = ref(true);
  const error = ref<string | null>(null);

  // Role permissions
  const canCreate = authStore.checkPermission('create-role-permission')
  const canEdit = authStore.checkPermission('update-role-permission')
  const canDelete = authStore.checkPermission('delete-role-permission')

  onMounted(async () => {
    await getRoles();
    isDark.value = document.documentElement.classList.contains('dark');
  });

  const pagination = ref({
    pageIndex: 0,
    pageSize: 24,
  })

  function deleteRow(slug: string) {
    Swal.fire({
      title: 'Do you want to delete?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: isDark.value ? '#1a202c' : '#fff',
      color: isDark.value ? '#fff' : '#1a202c',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          isLoading.value = true;
          const response = await useApi<{ status?: number, message?: string }>(`/role-permissions/${slug}`, {
            method: 'DELETE',
          });
          data.value = data.value?.filter(item => item.slug !== slug) || [];
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: response.message || 'This role permission has been deleted.',
            timer: 2000,
            showConfirmButton: false,
            background: isDark.value ? '#1a202c' : '#fff',
            color: isDark.value ? '#fff' : '#1a202c',
          });
        } catch (err: any) {
          console.error('Failed to delete role permissions:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err?.data?.message || err?.response?.data?.message || err?.message || 'Unknown error',
            timer: 2000,
            showConfirmButton: false,
            background: isDark.value ? '#1a202c' : '#fff',
            color: isDark.value ? '#fff' : '#1a202c',
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
        background: isDark.value ? '#1a202c' : '#fff',
        color: isDark.value ? '#fff' : '#1a202c',
      });
    });
  }

  async function getRoles() {
    try {
      isLoading.value = true;
      const response = await useApi<Role[]>(`/roles`, {
        method: 'GET',
      });
      data.value = response;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch roles:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  // Filtered roles (if you want to add search/filter logic, do it here)
  const filteredRoles = computed(() => {
    if (!data.value) return []
    // Add filter logic here if needed, currently returns all roles
    return data.value
  })

  // Paginate only parent roles
  const paginatedRoles = computed(() => {
    const roles = filteredRoles.value
    const start = pagination.value.pageIndex * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return roles.slice(start, end)
  })

  // Flatten only paginated roles
  const flattenedData = computed(() => {
    const roles = paginatedRoles.value
    if (!roles) return []
    const flattened: any[] = []
    roles.forEach(role => {
      const hasPermissions = role.rolePermissions && Array.isArray(role.rolePermissions) && role.rolePermissions.length > 0
      if (hasPermissions) {
        role.rolePermissions.forEach(rolePermission => {
          if (rolePermission.permission) {
            flattened.push({
              id: `${role.id}-${rolePermission.permission.id}`,
              type: 'permission',
              roleId: role.id,
              roleName: role.name,
              roleSlug: role.slug,
              name: rolePermission.permission.name,
              permissionName: rolePermission.permission.name,
              permissionId: rolePermission.permission.id,
              permissionSlug: rolePermission.permission.slug,
              rolePermissionId: rolePermission.id,
              rolePermissionSlug: rolePermission.slug,
              isEmpty: false,
              slug: rolePermission.slug,
            })
          }
        })
      } else {
        // Add a dummy permission row for roles with no permissions
        flattened.push({
          id: `${role.id}-empty`,
          type: 'Empty',
          roleId: role.id,
          roleName: role.name,
          roleSlug: role.slug,
          name: '(No permissions)',
          permissionName: '(No permissions)',
          permissionId: null,
          permissionSlug: '',
          rolePermissionId: null,
          rolePermissionSlug: '',
          isEmpty: true,
        })
      }
    })
    return flattened
  })

  const grouping_options = ref<GroupingOptions>({
    groupedColumnMode: 'remove',
    getGroupedRowModel: getGroupedRowModel()
  })

  const columns: TableColumn<any>[] = [
    {
      id: 'title',
      header: 'Role / Permission'
    },
    {
      id: 'roleId',
      accessorKey: 'roleId'
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        if (row.getIsGrouped()) {
          if (row.original.isEmpty) {
            return h('span', { class: 'text-muted' }, '(No permissions)')
          }
          return `${row.subRows?.length} permissions`
        }
        return h('div', { class: 'w-full flex items-center justify-between' }, [
          h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Name:"),
          h('span', {}, row.getValue('name'))
        ])
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        if (row.getIsGrouped()) return ''
        const type = row.getValue('type')
        return h('div', { class: 'w-full flex items-center justify-between' }, [
          h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Type:"),
          h(UBadge, {
            color: type === 'role' ? 'primary' : 'neutral',
            variant: 'subtle',
            class: 'capitalize'
          }, () => type)
        ])
      }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        if (row.getIsGrouped()) return ''
        const isPermission = row.getValue('type') === 'permission'
        if (isPermission) {
          return h('div', { class: 'flex w-full items-center justify-between' }, [
            h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Actions:"),
            h('div', { class: 'flex items-center gap-2' }, [
              h(UButton, {
                class: [
                  'px-2 py-1 mr-2 rounded flex items-center transition-colors bg-blue-600 text-white',
                  canEdit
                    ? 'hover:bg-blue-700'
                    : 'cursor-not-allowed'
                ].join(' '),
                title: canEdit ? 'Edit' : 'Unauthorized',
                color: canEdit ? undefined : 'none',
                variant: canEdit ? undefined : 'none',
                icon: canEdit ? 'tabler:edit' : 'tabler:lock',
                disabled: !canEdit,
                onClick: canEdit ? () => navigateTo(`/users-setting/role-permissions/${row.original.slug}/edit`) : undefined,
              }, {
                default: () => h('span', { class: 'hidden lg:inline' }, 'Edit')
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
                onClick: canDelete ? () => deleteRow(row.original.slug) : undefined,
              }, {
                default: () => h('span', { class: 'hidden lg:inline' }, 'Delete')
              })
            ])
          ])
        }
        return ''
      }
    }
  ]

  const table = useTemplateRef('table')
</script>