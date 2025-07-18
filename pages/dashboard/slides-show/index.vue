<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <HeaderPageHead title="Slides Show" />

    <div class="flex max-sm:flex-col items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="(table?.tableApi?.getColumn('title')?.getFilterValue() as string)"
        class="w-48 max-sm:w-full"
        placeholder="Filter titles..."
        @update:model-value="table?.tableApi?.getColumn('title')?.setFilterValue($event)"
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
          :to="canCreate ? '/dashboard/slides-show/create' : undefined"
          :disabled="!canCreate"
        />
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
      class="min-h-96 [&_th]:w-[30%]"
    />

    <div class="border-t border-default pt-2">
      <div class="px-4 text-sm text-muted">
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
  import { getPaginationRowModel } from '@tanstack/vue-table'
  import type { SlideShow } from '~/types/slides-show'
  import Swal from 'sweetalert2'
  import { useAuthStore } from '~/store/authStore'

  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'dashboard'],
  });

  const authStore = useAuthStore();
  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const data = ref<SlideShow[] | null>(null);
  let isLoading = ref(true);
  const error = ref<string | null>(null);
  // Add imageErrors ref to track failed images
  const imageErrors = ref<Record<string, boolean>>({});

  const canCreate = authStore.checkPermission('create-slide-show')
  const canEdit = authStore.checkPermission('update-slide-show')
  const canDelete = authStore.checkPermission('delete-slide-show')

  // Add image error and load handlers
  const handleImageError = (slideSlug: string) => {
    imageErrors.value[slideSlug] = true;
  };

  const handleImageLoad = (slideSlug: string) => {
    imageErrors.value[slideSlug] = false;
  };

  onMounted(async () => {
    await getSlidesShow();
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
      ...getSwalTheme(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          isLoading.value = true;
          const response = await useApi<{ status?: number, message?: string }>(`/slides-show/${slug}`, {
            method: 'DELETE',
          });
          data.value = data.value?.filter(item => item.slug !== slug) || [];
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: response.message || 'This slide show has been deleted.',
            timer: 2000,
            showConfirmButton: false,
            ...getSwalTheme(),
          });
        } catch (err: any) {
          console.error('Failed to delete slide show:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err?.data?.message || err?.response?.data?.message || err?.message || 'Unknown error',
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

  async function getSlidesShow() {
    try {
      isLoading.value = true;
      const response = await useApi<SlideShow[]>(`/slides-show?order=id&direction=asc`, {
        method: 'GET',
      });
      data.value = response;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch slides show:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  const columns: TableColumn<SlideShow>[] = [{
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
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Tittle',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.getValue('title'),
  }, {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return h('div', { class: 'relative w-16 h-16' }, [
        // Show placeholder if no image or image error
        (!row.getValue('image') || imageErrors.value[row.original.slug]) ? 
          h('div', { 
            class: 'w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg'
          }, [
            h('div', { class: 'text-center' }, [
              h('svg', {
                class: 'w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              }, [
                h('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                })
              ]),
              h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, 'No Image')
            ])
          ]) :
          h('img', { 
            src: useGetImageUrl(row.getValue('image')), 
            alt: row.getValue('title'), 
            class: 'w-16 h-16 object-cover rounded-lg',
            onError: () => handleImageError(row.original.slug),
            onLoad: () => handleImageLoad(row.original.slug)
          })
      ])
    }
  }, {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'sm:flex' }, [
        h(UButton, {
          class: [
            'px-2 py-1 m-1 rounded flex items-center transition-colors bg-blue-600 text-white',
            canEdit
              ? 'hover:bg-blue-700'
              : 'cursor-not-allowed'
          ].join(' '),
          title: canEdit ? 'Edit' : 'Unauthorized',
          color: canEdit ? undefined : 'none',
          variant: canEdit ? undefined : 'none',
          icon: canEdit ? 'tabler:edit' : 'tabler:lock',
          disabled: !canEdit,
          onClick: canEdit ? () => navigateTo(`/dashboard/slides-show/${row.original.slug}/edit`) : undefined,
        }, {
          default: () => h('span', { class: 'hidden sm:inline' }, 'Edit')
        }),
        h(UButton, {
          class: [
            'px-2 py-1 m-1 rounded flex items-center transition-colors bg-red-600 text-white',
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
  }]

  const table = useTemplateRef('table')
</script>