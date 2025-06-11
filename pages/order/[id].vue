<template>
  <div class="max-w-2xl mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Order Details</h1>
    <div v-if="order" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div class="mb-4">
        <p class="text-gray-700 dark:text-gray-200"><span class="font-semibold">Order ID:</span> {{ order?.id }}</p>
        <p class="text-gray-700 dark:text-gray-200"><span class="font-semibold">Email:</span> {{ order?.email }}</p>
        <p class="text-gray-700 dark:text-gray-200">
          <span class="font-semibold">Placed At:</span>
          {{ order?.createAt ? formatDate(order.createAt) : '-' }}
        </p>
        <p class="text-gray-700 dark:text-gray-200"><span class="font-semibold">Status:</span>
          <span :class="statusColor(order?.status ?? '')" class="font-semibold px-2 py-1 rounded">
            {{ order?.status }}
          </span>
        </p>
      </div>
      <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Items</h2>
      <div v-for="item in order?.orders" :key="item.id" class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 py-3 last:border-b-0">
        <img
          v-if="item.product"
          :src="useGetImageUrl(item.product.image)"
          alt="Product"
          class="w-14 h-14 object-cover rounded border border-gray-200 dark:border-gray-700"
        />
        <div class="flex-1">
          <p class="font-medium text-gray-800 dark:text-white">{{ item.product?.name ?? 'Unknown Product' }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            $ {{ item.product?.price !== undefined ? item.product.price : '-' }}
          </p>
        </div>
        <div class="text-gray-700 dark:text-gray-300 font-semibold">x{{ item.quntity }}</div>
      </div>
      <div class="mt-6 flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
        <p class="text-gray-800 dark:text-white font-bold text-lg">Total</p>
        <p class="text-gray-600 dark:text-gray-400 font-bold text-lg">
          $ {{
            order?.orders.reduce((total, item) =>
              total + (item.product?.price ?? 0) * item.quntity, 0
            ).toFixed(2)
          }}
        </p>
      </div>
      <div class="mt-8">
        <h3 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">Order Progress</h3>
        <div class="flex items-center gap-4">
          <div v-for="step in steps" :key="step" class="flex items-center">
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold',
                stepStatusClass(step)
              ]"
            >
              <span>{{ steps.indexOf(step) + 1 }}</span>
            </div>
            <span v-if="step !== steps[steps.length - 1]" class="w-8 h-1 bg-gray-300 dark:bg-gray-600"></span>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span v-for="step in steps" :key="step">{{ step }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGetImageUrl } from '~/composables/getImageUrl'
import type { Order } from '~/types/orders'

const route = useRoute()
const id = route.params.id as string
const order = ref<Order | undefined>(undefined);

const steps = ['Order Created', 'Waiting Payment', 'Paid', 'Delivered', 'Cancelled']

onMounted(async () => {
  try {
    const response = await useApi<Order>(`/orders/${id}`, {
      method: 'GET',
    })
    order.value = response
    console.log('Order fetched successfully:', order.value);
    
  } catch (error) {
    console.error(error)
    order.value = undefined
  }
})

function statusColor(status: string) {
  switch (status) {
    case 'Order Created': return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    case 'Waiting Payment': return 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200'
    case 'Paid': return 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200'
    case 'Delivered': return 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200'
    case 'Cancelled': return 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200'
    default: return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

function stepStatusClass(step: string) {
  const currentIndex = steps.indexOf(order.value?.status ?? '')
  const stepIndex = steps.indexOf(step)
  if (stepIndex < currentIndex) return 'bg-green-500 border-green-500 text-white'
  if (stepIndex === currentIndex) return 'bg-blue-500 border-blue-500 text-white'
  return 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600 text-gray-400'
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>