<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'My Orders' }}</h1>
    </header>
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <!-- Filter by Status -->
      <USelectMenu
        placeholder="Filter by status"
        :items="statusOptions"
        class="w-48"
        @update:model-value="val => table?.tableApi?.getColumn('status')?.setFilterValue(val === 'All' ? undefined : val)"
      />

      <!-- Filter by Period -->
      <USelectMenu
        placeholder="Filter by period"
        :items="periodOptions"
        class="w-48"
        @update:model-value="val => {
          if (val?.value === 'all') {
            table?.tableApi?.getColumn('createdAt')?.setFilterValue(undefined)
          } else {
            const range = getPeriodRange(val.value)
            table?.tableApi?.getColumn('createdAt')?.setFilterValue(range)
          }
        }"
      />

      <UDropdownMenu
        :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
          type: 'checkbox' as const,
          label: upperFirst(column.id),
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
      class="mt-2
        min-h-96 
        max-md:[&_th]:hidden 
        [&_th]:w-[45%] 
        max-md:[&_td]:flex
        max-md:[&_tr]:border-b
        max-md:[&_tr]:border-gray-500"
    />

    <div class="border-t border-default pt-2">
      <div class="px-4 text-sm text-muted">
      {{(
          table?.tableApi?.getPaginationRowModel().rows.filter(
            row => table?.tableApi?.getState().rowSelection?.[row.id]
          ).length || 0
      )}} of
      {{
        table?.tableApi?.getPaginationRowModel().rows.length || 0
      }} row(s) selected on this page.
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
import { upperFirst } from 'scule'
import moment from 'moment';
import type { Order } from '~/types/orders';
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { Icon } from '#components';

  definePageMeta({
    layout: 'user-sidebar-left',
    middleware: ['auth'],
  })

  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const data = ref<Order[] | null>(null);
  let isLoading = ref(true);
  const error = ref<string | null>(null);

  onMounted(async () => {
    await getOrders();
  });

  const pagination = ref({
    pageIndex: 0,
    pageSize: 24,
  });

  const statusOptions = [
    'All',
    'Order Created',
    'Waiting Payment',
    'Paid',
    'Delivered',
    'Failed to Deliver',
    'Cancelled'
  ];

  const periodOptions = [
    { label: 'All', value: 'all' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
    { label: '1 Week Before', value: 'oneWeekBefore' },
    { label: '1 Month Before', value: 'oneMonthBefore' },
    { label: '3 Months Before', value: '3monthsBefore' },
    { label: '6 Months Before', value: '6monthsBefore' },
    { label: '1 Year Before', value: '1yearBefore' }
  ];

  function getPeriodRange(periodValue: string) {
    let from: Date | null = null;
    let to: Date | null = null;

    switch (periodValue) {
      case 'thisWeek':
        from = moment().startOf('week').toDate();
        to = moment().endOf('week').toDate();
        break;
      case 'thisMonth':
        from = moment().startOf('month').toDate();
        to = moment().endOf('month').toDate();
        break;
      case 'thisYear':
        from = moment().startOf('year').toDate();
        to = moment().endOf('year').toDate();
        break;
      case 'oneWeekBefore':
        from = moment().subtract(1, 'weeks').startOf('week').toDate();
        to = moment().subtract(1, 'weeks').endOf('week').toDate();
        break;
      case 'oneMonthBefore':
        from = moment().subtract(1, 'months').startOf('month').toDate();
        to = moment().subtract(1, 'months').endOf('month').toDate();
        break;
      case '3monthsBefore':
        from = moment().subtract(3, 'months').startOf('month').toDate();
        to = moment().subtract(3, 'months').endOf('month').toDate();
        break;
      case '6monthsBefore':
        from = moment().subtract(6, 'months').startOf('month').toDate();
        to = moment().subtract(6, 'months').endOf('month').toDate();
        break;
      case '1yearBefore':
        from = moment().subtract(1, 'years').startOf('year').toDate();
        to = moment().subtract(1, 'years').endOf('year').toDate();
        break;
      default:
        from = null;
        to = null;
    }
    return { from, to };
  }

  async function getOrders() {
    try {
      isLoading.value = true;
      const response = await useApi<Order[]>(`/orders/my-orders`, {
        method: 'GET',
      });
      data.value = response;
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  const columns: TableColumn<Order>[] = [{
    accessorKey: 'id',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Order ID',
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
      h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Order ID:"),

      h(
        resolveComponent('NuxtLink'),
        {
          to: `/order/${row.getValue('id')}`,
          class: 'text-blue-500 hover:text-blue-700 transition'
        },
        { default: () => `${row.getValue('id')}` }
      )
    ]),
  },{
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
      const statusMap: Record<string, { class: string, icon: string }> = {
        'Order Created': {
          class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
          icon: 'mdi:progress-clock'
        },
        'Waiting Payment': {
          class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600',
          icon: 'mdi:clock-outline'
        },
        'Paid': {
          class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600',
          icon: 'mdi:cash-check'
        },
        'Delivered': {
          class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600',
          icon: 'mdi:check-circle-outline'
        },
        'Cancelled': {
          class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600',
          icon: 'mdi:close-circle-outline'
        },
        'Failed to Deliver': {
          class: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600',
          icon: 'mdi:alert-outline'
        }
      }
      const { class: statusClass, icon } = statusMap[String(status)] || statusMap['Order Created']
      return h('div', { class: 'w-full flex items-center justify-between' }, [
        h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Status:"),

        h('span', {
          class: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusClass}`
        }, [
          h(Icon, { name: icon, class: 'text-base align-middle', style: 'margin-right: 0.25em;' }),
          String(status)
        ])
      ])
    },
  }, {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Created At',
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
      h('p', { class: 'text-sm font-medium hidden max-md:block' }, "Created At:"),
      h('span', { class: 'text-sm text-gray-600 dark:text-gray-400' }, new Date(row.getValue('createdAt')).toLocaleString()),
    ]),
    // Add this filterFn:
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || !filterValue.from || !filterValue.to) return true;
      const createdAt = new Date(row.getValue(columnId));
      const from = new Date(filterValue.from);
      const to = new Date(filterValue.to);
      return createdAt >= from && createdAt <= to;
    }
  }];

  const table = useTemplateRef('table')
</script>

<style scoped>

</style>