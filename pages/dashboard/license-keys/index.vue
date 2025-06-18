<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'License Keys' }}</h1>
    </header>
    <div class="flex max-md:flex-col items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <USelectMenu
        placeholder="Filter by products"
        :items="[{ label: 'All', value: 'All' }, ...(products?.map(product => ({
          label: product.name,
          value: product.slug,
        })) || [])]"
        class="w-48 max-md:w-full"
        @update:model-value="table?.tableApi?.getColumn('product')?.setFilterValue($event)"
      />
      <USelectMenu
        placeholder="Filter by status"
        :items="items"
        class="w-48 max-md:w-full"
        @update:model-value="table?.tableApi?.getColumn('status')?.setFilterValue($event)"
      />

      <div class="flex max-md:flex-col-reverse ml-auto gap-2">
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
        </UDropdownMenu>
        
        <div class="flex ml-auto gap-2">
          <UButton
            label="Create"
            :title="canCreate ? 'Create' : 'Unauthorized'"
            :icon="canCreate ? 'tabler:plus' : 'tabler:lock'"
            color="primary"
            :to="canCreate ? '/dashboard/license-keys/create' : undefined"
            :disabled="!canCreate"
          />
          <UButton
            label="Import"
            :title="canCreate ? 'Import' : 'Unauthorized'"
            :icon="canCreate ? 'tabler:plus' : 'tabler:lock'"
            color="primary"
            leading-icon="tabler:file-import"
            @click="triggerFileInput"
            :disabled="!canCreate"
          />
          <input
            ref="fileInput"
            type="file"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            class="hidden"
            @change="handleFileUpload"
            :disabled="!canCreate"
          />
        </div>
      </div>
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
      class="min-h-96 [&_th:not(:first-child)]:w-[25%] max-md:[&_th]:hidden max-md:[&_td]:flex max-md:[&_tr]:border-b max-md:[&_tr]:border-gray-500"
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

  <!-- Preview Modal -->
  <UModal v-model:open="showPreviewModal" title="Preview" description="This is the preview of the imported data." :ui="{ footer: 'justify-end' }">
    <template #body class="min-w-full text-sm">
      <div class="overflow-x-auto max-h-96">
        <table class="min-w-full text-sm text-center rounded-lg overflow-hidden">
          <thead class="bg-gray-300 dark:bg-gray-700">
            <tr>
              <th class="px-2 py-1">Key</th>
              <th class="px-2 py-1">Product Slug</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in previewRows" :key="idx" class="odd:bg-gray-100 even:bg-gray-200 dark:odd:bg-gray-900 dark:even:bg-gray-800">
              <td class="px-2 py-1">{{ row.key }}</td>
              <td class="px-2 py-1">{{ row.productSlug }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="showPreviewModal = false" />
      <UButton label="Submit" color="primary" :loading="isLoading" @click="confirmImport" />
    </template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import { ref, onMounted, h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table'
import Swal from 'sweetalert2'
import type { LicenseKey } from '~/types/license-keys'
import type { Product } from '~/types/products'
import { useAuthStore } from '~/store/authStore'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard', 'permission'],
  requiredPermission: 'list-license-keys'
});

const authStore = useAuthStore();
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const data = ref<LicenseKey[] | null>(null);
let isLoading = ref(true);
const error = ref<string | null>(null);

const canCreate = authStore.checkPermission('create-license-key')
const canEdit = authStore.checkPermission('update-license-key')
const canDelete = authStore.checkPermission('delete-license-key')

const items = ref(['All', 'Active', 'Waiting Payment', 'Cancelled', 'Paid', 'Delivered'])
const products = ref<Product[] | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const showPreviewModal = ref(false)
const previewRows = ref<any[]>([])

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Expect columns: key, productSlug
    const keys: string[] = [];
    const productSlugs: string[] = [];
    json.forEach(row => {
      if (row.key && row.productSlug) {
        keys.push(String(row.key));
        productSlugs.push(String(row.productSlug));
      }
    });

    if (!keys.length || !productSlugs.length || keys.length !== productSlugs.length) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Excel must have columns: key, productSlug',
        timer: 2000,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
      return;
    }

    // Show preview modal
    previewRows.value = json;
    showPreviewModal.value = true;

    // Don't upload yet, wait for user confirmation in modal
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.message ?? 'Failed to import',
      timer: 2000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
  } finally {
    // Reset file input so user can re-upload the same file if needed
    if (fileInput.value) fileInput.value.value = '';
  }
}

async function confirmImport() {
  if (!previewRows.value.length) return;
  const keys = previewRows.value.map(row => String(row.key));
  const productSlugs = previewRows.value.map(row => String(row.productSlug));
  try {
    isLoading.value = true;
    await useApi('/license-keys/import', {
      method: 'POST',
      data: { key: keys, productSlug: productSlugs }
    });
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'License Key imported successfully!',
      timer: 2000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
    await getLicenseKeys();
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.response?.data?.message ?? 'Failed to import',
      timer: 2000,
      showConfirmButton: false,
      ...getSwalTheme(),
    });
  } finally {
    isLoading.value = false;
    showPreviewModal.value = false;
    previewRows.value = [];
  }
}

async function getProducts() {
  try {
    isLoading.value = true;
    const response = await useApi<Product[]>(`/products`, {
      method: 'GET',
    });
    products.value = response;
    error.value = null;
  } catch (err: any) {
    console.error('Failed to fetch products:', err);
    error.value = err?.message || 'Unknown error';
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await [getLicenseKeys(), getProducts()];
});

const pagination = ref({
  pageIndex: 0,
  pageSize: 24,
})

function deleteRow(id: string) {
  Swal.fire({
    title: 'Do you want to delete?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    ...getSwalTheme(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        isLoading.value = true;
        await useApi(`/license-keys/${id}`, {
          method: 'DELETE',
        });
        data.value = data.value?.filter(item => item.id !== id) || [];
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your license key has been deleted.',
          timer: 2000,
          showConfirmButton: false,
          ...getSwalTheme(),
        });
      } catch (err: any) {
        console.error('Failed to delete license key:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err?.message || 'Unknown error',
          timer: 2000,
          showConfirmButton: false,
          ...getSwalTheme(),
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
      ...getSwalTheme(),
    });
  });
}

async function getLicenseKeys() {
  try {
    isLoading.value = true;
    const response = await useApi<LicenseKey[]>(`/license-keys`, {
      method: 'GET',
    });
    data.value = response;
    error.value = null;
  } catch (err: any) {
    console.error('Failed to fetch license keys:', err);
    error.value = err?.message || 'Unknown error';
  } finally {
    isLoading.value = false;
  }
}

const columns: TableColumn<LicenseKey>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'No.',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h('div', { class: 'w-full flex items-center justify-between' }, [
      h('p', { class: 'text-sm font-medium hidden max-md:block' }, "No.:"),
      h('span', {}, `${row.index + 1}`)
    ]),
  },
  {
    accessorKey: 'product',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Product',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      const product = row.getValue('product') as Product | null | undefined;
      return h('div', { class: 'w-full flex items-center justify-between' }, [
        h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Product:"),
        h('span', {}, product?.name || 'N/A')
      ])
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue.value || filterValue.value === 'All') return true
      const product = row.getValue(columnId) as Product | null | undefined
      return product?.slug === filterValue.value
    },
  },
  {
    accessorKey: 'key',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Key',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h('div', { class: 'w-full flex items-center justify-between' }, [
      h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Key:"),
      h('span', {}, row.getValue('key'))
    ]),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Status',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      const status = row.getValue('status')
      // Add index signature to satisfy TypeScript
      const statusMap: Record<string, string> = {
        'Active': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600',
        'Waiting Payment': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600',
        'Cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600',
        'Paid': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600',
        'Delivered': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600'
      }
      const statusClass = statusMap[String(status)] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
      return h('div', { class: 'w-full flex items-center justify-between' }, [
        h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Status:"),
        h('span', {
          class: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusClass}`
        }, String(status))
      ])
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === 'All') return true
      return row.getValue(columnId) === filterValue
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex w-full items-center justify-between' }, [
        h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Status:"),
        h('div', { class: 'flex items-center gap-2' }, [
          h(UButton, {
            class: [
              'px-2 py-1 mr-2 rounded flex items-center transition-colors bg-blue-600 text-white cursor-pointer',
              canEdit
                ? 'hover:bg-blue-700'
                : 'cursor-not-allowed'
            ].join(' '),
            title: canEdit ? 'Edit' : 'Unauthorized',
            color: canEdit ? undefined : 'none',
            variant: canEdit ? undefined : 'none',
            icon: canEdit ? 'tabler:edit' : 'tabler:lock',
            disabled: !canEdit,
            onClick: canEdit ? () => navigateTo(`/dashboard/license-keys/${row.original.id}/edit`) : undefined,
          }, {
            default: () => h('span', { class: 'max-lg:hidden' }, 'Edit')
          }),
          h(UButton, {
            class: [
              'px-2 py-1 rounded flex items-center transition-colors bg-red-600 text-white cursor-pointer',
              canDelete
                ? 'hover:bg-red-700'
                : 'cursor-not-allowed'
            ].join(' '),
            title: canDelete ? 'Delete' : 'Unauthorized',
            color: canDelete ? undefined : 'none',
            variant: canDelete ? undefined : 'none',
            icon: canDelete ? 'tabler:trash-filled' : 'tabler:lock',
            disabled: !canDelete,
            onClick: canDelete ? () => deleteRow(row.original.id) : undefined,
          }, {
            default: () => h('span', { class: 'max-lg:hidden' }, 'Delete')
          })
        ]),
      ])
    }
  }
]

const table = useTemplateRef('table')
</script>