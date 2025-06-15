<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-4">
      <select v-model="filters.status" class="input" @change="fetchOrders">
        <option value="">All Status</option>
        <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="filters.period" class="input" @change="fetchOrders">
        <option value="">All Periods</option>
        <option v-for="p in periodOptions" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="filters.order" class="input" @change="fetchOrders">
        <option value="">Sort By</option>
        <option value="createdAt">Created At</option>
        <option value="total">Total</option>
      </select>
      <select v-model="filters.direction" class="input" @change="fetchOrders">
        <option value="">Direction</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div v-if="isLoading" class="py-8 text-center">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="py-8 text-center">No orders found.</div>
    <div v-else>
      <table class="min-w-full table-auto mb-4">
        <thead>
          <tr>
            <th class="px-2 py-1">Order #</th>
            <th class="px-2 py-1">Status</th>
            <th class="px-2 py-1">Total</th>
            <th class="px-2 py-1">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="px-2 py-1">{{ order.id }}</td>
            <td class="px-2 py-1">{{ order.status }}</td>
            <td class="px-2 py-1">{{ formatDate(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center">
        <button :disabled="filters.page === 1" @click="prevPage" class="btn">Prev</button>
        <span>Page {{ filters.page }}</span>
        <button :disabled="orders.length < filters.limit" @click="nextPage" class="btn">Next</button>
      </div>
    </div>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Order } from '~/types/orders'

const props = defineProps<{
  profile: any
  error?: string | null
  isLoading?: boolean
}>()
const emit = defineEmits(['fetchOrders'])

const orders = ref<Order[]>([])
const error = ref<string | null>(null)
const isLoading = ref(false)

const statusOptions = [
  'Order Created', 'Waiting Payment', 'Paid', 'Delivered',
  'Failed to Deliver', 'Order Completed', 'Cancelled'
]
const periodOptions = [
  'thisWeek', 'thisMonth', 'thisYear', 'oneWeekBefore',
  'oneMonthBefore', '3monthsBefore', '6monthsBefore', '1yearBefore'
]
function formatDate(date: string | Date) {
  return new Date(date).toLocaleString()
}

const filters = ref({
  page: 1,
  limit: 10,
  order: '',
  direction: '',
  status: '',
  period: ''
})

async function fetchOrders() {
  isLoading.value = true
  error.value = null
  try {
    const params = Object.fromEntries(
      Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null)
    )
    const query = new URLSearchParams(params as any).toString()
    const response = await useApi<Order[]>(`/order/my-orders?${query}`, {
      method: 'GET',
    });
    orders.value = response || []
    emit('fetchOrders')
  } catch (e: any) {
    error.value = e?.message || 'Failed to fetch orders'
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

function prevPage() {
  if (filters.value.page > 1) {
    filters.value.page--
    fetchOrders()
  }
}
function nextPage() {
  filters.value.page++
  fetchOrders()
}

watch(filters, fetchOrders, { deep: true })
onMounted(fetchOrders)
</script>

<style scoped>
.input { padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid #ccc; }
.btn { padding: 0.25rem 0.75rem; border-radius: 0.25rem; background: #eee; }
</style>