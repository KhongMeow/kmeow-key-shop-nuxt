<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Roles' }}</h1>
    </header>
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]"
        placeholder="Filter names..."
        @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
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
          :to="canCreate ? '/users-setting/roles/create' : undefined"
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
      :data="flattenedData"
      :columns="columns"
      :grouping="['roleId']"
      :grouping-options="grouping_options"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="min-h-96"
      :ui="{
        root: 'min-w-full',
        td: 'empty:p-0',
        th: 'w-auto'
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
  </div>
</template>

<script setup lang="ts">
  import { h, resolveComponent } from 'vue'
  import { upperFirst } from 'scule'
  import type { TableColumn } from '@nuxt/ui'
  import { getGroupedRowModel, getPaginationRowModel, type GroupingOptions } from '@tanstack/vue-table'
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
          await useApi(`/role-permissions/${slug}`, {
            method: 'DELETE',
          });
          data.value = data.value?.filter(item => item.slug !== slug) || [];
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your role permission has been deleted.',
            timer: 2000,
            showConfirmButton: false,
            background: isDark.value ? '#1a202c' : '#fff',
            color: isDark.value ? '#fff' : '#1a202c',
          });
        } catch (err: any) {
          console.error('Failed to delete roles:', err);
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

  const flattenedData = computed(() => {
    if (!data.value) return []
    
    const flattened: any[] = []
    
    data.value.forEach(role => {
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

  const columns: TableColumn<any>[] = [{
    id: 'title',
    header: 'Role / Permission'
  }, {
    id: 'roleId',
    accessorKey: 'roleId'
  }, {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.isEmpty) {
          return h('span', { class: 'text-muted' }, '(No permissions)')
        }
        return `${row.subRows?.length} permissions`
      }
      return row.getValue('name')
    }
  }, {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      if (row.getIsGrouped()) return ''
      const type = row.getValue('type')
      return h(UBadge, {
        color: type === 'role' ? 'primary' : 'neutral',
        variant: 'subtle',
        class: 'capitalize'
      }, () => type)
    }
  }, {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      if (row.getIsGrouped()) return ''
      
      const isPermission = row.getValue('type') === 'permission'
      
      if (isPermission) {
        // Actions for permissions
        return h('div', { class: 'flex gap-1' }, [
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
            default: () => h('span', { class: 'hidden sm:inline' }, 'Edit')
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
            default: () => h('span', { class: 'hidden sm:inline' }, 'Delete')
          })
        ])
      }
      
      return ''
    }
  }]

  const table = useTemplateRef('table')
</script>