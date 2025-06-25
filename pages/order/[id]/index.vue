<template>
  <div class="min-h-screen px-4 sm:px-6 lg:px-8">
    <div class="py-6 sm:py-8 lg:py-12">
      <!-- Header with back button -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button @click="$router.back()" class="flex group p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 self-start">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </button>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Order Details
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track your order status and details</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
          <div class="space-y-3">
            <div class="h-16 sm:h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-16 sm:h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Order Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Order Info Card -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:hashtag" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                  <p class="font-mono font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{{ order?.id }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:envelope" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p class="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{{ order?.email }}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:clock" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Placed At</p>
                  <p class="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {{ order?.createdAt ? formatDate(order?.createdAt) : '-' }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:tag" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span :class="statusColor(order?.status ?? '')" class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    <Icon :name="getStatusIcon(order?.status ?? '')" class="w-3 h-3 mr-1 sm:mr-2 flex-shrink-0" />
                    <span class="truncate">{{ order?.status }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
              
          <!-- Payment Timeout Warning -->
          <div
            v-if="order?.status === 'Waiting Payment'"
            class="mt-4 flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:via-yellow-900/10 dark:to-yellow-900/30 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 shadow-lg animate-fadeInUp"
          >
            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-200 dark:bg-yellow-800 border-4 border-yellow-300 dark:border-yellow-700 shadow">
              <Icon name="heroicons:exclamation-triangle" class="w-7 h-7 text-yellow-700 dark:text-yellow-200" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm sm:text-base font-semibold text-yellow-900 dark:text-yellow-100">
                  Payment expires in
                </p>
                <span
                  class="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 font-mono font-bold text-base tracking-widest border border-yellow-300 dark:border-yellow-700"
                >
                  {{ getTimeRemaining() }}
                </span>
              </div>
              <div class="mt-2 w-full h-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-400 transition-all duration-1000"
                  :style="{ width: getTimePercentLeft + '%' }"
                ></div>
              </div>
              <p class="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                Please complete your payment before the timer runs out to avoid automatic cancellation.
              </p>
            </div>
          </div>
        </div>

        <!-- Payment Confirmation Section (only show for Waiting Payment status) -->
        <div v-if="order?.status === 'Waiting Payment'" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
              <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Confirmation Required</h2>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Please confirm when you have completed your payment</p>
          </div>

          <!-- Payment Details -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Payment Information</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Order Total:</span>
                <span class="font-bold text-gray-900 dark:text-white">${{ calculateTotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Order ID:</span>
                <span class="font-mono text-gray-900 dark:text-white">#{{ order?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Payment Deadline:</span>
                <span class="text-gray-900 dark:text-white">{{ order?.paymentDeadline ? formatDate(order?.paymentDeadline) : '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Confirmation Checkbox -->
          <div class="mb-6">
            <label class="flex items-start gap-3">
              <input
                v-model="confirmationChecked"
                type="checkbox"
                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <div class="text-sm">
                <span class="text-gray-700 dark:text-gray-300">
                  I confirm that I have completed the payment of 
                  <strong class="text-gray-900 dark:text-white">${{ calculateTotal().toFixed(2) }}</strong> 
                  for this order and understand that false confirmation may result in order cancellation.
                </span>
              </div>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="confirmPayment"
              :disabled="!canConfirmPayment || isConfirming"
              class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Icon v-if="isConfirming" name="heroicons:arrow-path" class="animate-spin w-5 h-5 mr-2" />
              <Icon v-else name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              {{ isConfirming ? 'Confirming...' : 'Confirm Payment' }}
            </button>
          </div>
        </div>

        <!-- Progress Tracker -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="heroicons:truck" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
            <span>Order Progress</span>
          </h3>
          
          <div class="relative">
            <!-- Mobile Progress (Vertical) -->
            <div class="block sm:hidden space-y-4">
              <div v-for="(step, index) in getOrderSteps()" :key="step.name" class="flex items-start gap-4">
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      'w-10 h-10 flex items-center justify-center rounded-full border-3 font-bold text-sm transition-all duration-500',
                      getStepStatusClass(step, index)
                    ]"
                  >
                    <Icon v-if="step.completed" name="heroicons:check" class="w-5 h-5" />
                    <Icon v-else-if="step.failed" name="heroicons:x-mark" class="w-5 h-5" />
                    <Icon v-else-if="step.current" :name="step.icon" class="w-4 h-4" />
                    <span v-else class="text-xs">{{ index + 1 }}</span>
                  </div>
                  <div v-if="index < getOrderSteps().length - 1" class="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2"></div>
                </div>
                <div class="flex-1 pb-4">
                  <span class="font-medium text-sm text-gray-900 dark:text-white">{{ step.name }}</span>
                  <span v-if="step.timestamp" class="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {{ step.timestamp }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Desktop Progress (Horizontal) -->
            <div class="hidden sm:block">
              <div class="flex items-center justify-between">
                <div v-for="(step, index) in getOrderSteps()" :key="step.name" class="flex flex-col items-center relative z-10 flex-1">
                  <div
                    :class="[
                      'w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border-3 font-bold text-sm transition-all duration-500 transform',
                      getStepStatusClass(step, index),
                      index <= getCurrentStepIndex() ? 'scale-110' : 'scale-100'
                    ]"
                  >
                    <Icon v-if="step.completed" name="heroicons:check" class="w-5 h-5 lg:w-6 lg:h-6" />
                    <Icon v-else-if="step.failed" name="heroicons:x-mark" class="w-5 h-5 lg:w-6 lg:h-6" />
                    <Icon v-else-if="step.current" :name="step.icon" class="w-4 h-4 lg:w-5 lg:h-5" />
                    <span v-else class="text-xs lg:text-sm">{{ index + 1 }}</span>
                  </div>
                  <span class="mt-4 text-xs lg:text-sm text-center text-gray-600 dark:text-gray-400 max-w-24 lg:max-w-32 leading-tight text-nowrap">{{ step.name }}</span>
                  <span v-if="step.timestamp" class="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
                    {{ step.timestamp }}
                  </span>
                </div>
              </div>

              <!-- Progress Line -->
              <div class="absolute top-5 lg:top-6 left-5 lg:left-6 right-5 lg:right-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-0">
                <div 
                  :class="[
                    'h-full rounded-full transition-all duration-1000 ease-out',
                    getProgressBarClass()
                  ]"
                  :style="{ width: `${getProgressPercentage()}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <h2 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="heroicons:shopping-bag" class="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
            <span>Order Items</span>
          </h2>
          
          <div class="space-y-3 sm:space-y-4">
            <div 
              v-for="(orderItem, index) in order?.orderItems" 
              :key="orderItem.id" 
              class="group flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="relative flex-shrink-0">
                <img
                  v-if="orderItem.product"
                  :src="useGetImageUrl(orderItem.product.image)"
                  alt="Product"
                  class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors duration-300"
                />
                <div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {{ orderItem.quantity }}
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {{ orderItem.product?.name ?? 'Unknown Product' }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 flex items-center gap-1 sm:gap-2 mt-1 text-sm sm:text-base">
                  <Icon name="heroicons:currency-dollar" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>${{ orderItem.product?.price }}</span>
                </p>
              </div>
              
              <div class="text-right flex-shrink-0">
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Qty</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ orderItem.quantity }}</p>
              </div>
            </div>
          </div>
          
          <!-- Order Total -->
          <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <span class="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Total Amount:</span>
              <span class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${{ calculateTotal().toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetImageUrl } from '~/composables/getImageUrl'
import type { Order } from '~/types/orders'

interface OrderStep {
  name: string
  completed: boolean
  current: boolean
  failed: boolean
  icon: string
  timestamp?: string
}

const route = useRoute()
const orderId = route.params.id as string
const order = ref<Order | undefined>(undefined)
const isLoading = ref(false)
const isConfirming = ref(false)
const confirmationChecked = ref(false)
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const canConfirmPayment = computed(() => {
  return confirmationChecked.value && !isConfirming.value
})

async function getOrder() {
  try {
    isLoading.value = true
    const response = await useApi<Order>(`/orders/my-order/${orderId}`, {
      method: 'GET',
    })
    order.value = response
  } catch (error) {
    order.value = undefined
    navigateTo('/errors/not-found');
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await getOrder()
  
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function confirmPayment() {
  if (!canConfirmPayment.value) return
  
  try {
    isConfirming.value = true
    
    const response = await useApi<{ status: number; message: string }>(`/orders/confirm-payment`, {
      method: 'POST',
      data: { orderId },
    })
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Payment Confirmed',
      text: `${response?.message || 'Your payment has been confirmed successfully.'}`,
      showConfirmButton: false,
      timer: 2000,
      ...getSwalTheme(),
    })
    
    await getOrder()
    if (timer) clearInterval(timer)
    confirmationChecked.value = false
    
  } catch (error: any) {
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'An error occurred while confirming payment.',
      ...getSwalTheme(),
      showConfirmButton: false,
      timer: 2000,
    })
  } finally {
    isConfirming.value = false
  }
}

function getOrderSteps(): OrderStep[] {
  const status = order.value?.status ?? ''
  
  return [
    {
      name: 'Order Created',
      completed: ['Waiting Payment', 'Paid', 'Delivered', 'Cancelled', 'Failed to Deliver'].includes(status),
      current: status === 'Order Created',
      failed: false,
      icon: 'heroicons:document-plus',
      timestamp: order.value?.createdAt ? formatDate(order.value.createdAt) : undefined
    },
    {
      name: (() => {
        switch (status) {
          case 'Waiting Payment': return 'Waiting Payment'
          case 'Paid': return 'Paid'
          case 'Cancelled': return 'Cancelled'
          case 'Delivered': return 'Paid'
          case 'Failed to Deliver': return 'Paid'
          default: return 'Payment'
        }
      })(),
      completed: ['Delivered'].includes(status),
      current: ['Waiting Payment', 'Paid'].includes(status),
      failed: status === 'Cancelled',
      icon: status === 'Paid' ? 'heroicons:check-circle' : 'heroicons:credit-card',
      timestamp: (() => {
        // Show paidAt for Paid, Delivered, or Failed to Deliver
        if (
          ['Paid', 'Delivered', 'Failed to Deliver'].includes(status) &&
          order.value?.paidAt
        ) {
          return formatDate(order.value.paidAt)
        }
        if (status === 'Waiting Payment' && order.value?.createdAt) {
          return formatDate(order.value.createdAt)
        }
        return undefined
      })()
    },
    {
      name: (() => {
        switch (status) {
          case 'Delivered': return 'Delivered'
          case 'Failed to Deliver': return 'Failed to Deliver'
          default: return 'Delivery'
        }
      })(),
      completed: status === 'Delivered',
      current: false,
      failed: status === 'Failed to Deliver',
      icon: 'heroicons:truck',
      timestamp: status === 'Delivered' && order.value?.updatedAt ? formatDate(order.value.updatedAt) : undefined
    }
  ]
}

function getCurrentStepIndex(): number {
  const steps = getOrderSteps()
  const currentStepIndex = steps.findIndex(step => step.current)
  const completedSteps = steps.filter(step => step.completed).length
  return Math.max(currentStepIndex, completedSteps - 1)
}

function getStepStatusClass(step: OrderStep, index: number): string {
  if (step.failed) {
    return 'bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white shadow-lg'
  }
  if (step.completed) {
    return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-lg'
  }
  if (step.current) {
    const status = order.value?.status ?? ''
    if (step.name === 'Paid' && status === 'Paid') {
      return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-lg'
    }
    return 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-500 text-white shadow-lg animate-pulse'
  }
  return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
}

function getProgressPercentage(): number {
  const status = order.value?.status ?? ''
  
  if (status === 'Order Created') return 0
  if (['Waiting Payment', 'Paid'].includes(status)) {
    return status === 'Paid' ? 66 : 33
  }
  if (status === 'Delivered') return 100
  if (['Cancelled', 'Failed to Deliver'].includes(status)) {
    return status === 'Cancelled' ? 33 : 66
  }
  
  return 0
}

function getProgressBarClass(): string {
  const status = order.value?.status ?? ''
  
  if (['Cancelled', 'Failed to Deliver'].includes(status)) {
    return 'bg-gradient-to-r from-red-500 to-red-600'
  }
  if (status === 'Delivered') {
    return 'bg-gradient-to-r from-green-500 to-emerald-600'
  }
  return 'bg-gradient-to-r from-blue-500 to-purple-600'
}

function statusColor(status: string): string {
  switch (status) {
    case 'Order Created': 
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
    case 'Waiting Payment': 
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600'
    case 'Paid': 
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
    case 'Delivered': 
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600'
    case 'Cancelled': 
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'
    case 'Failed to Deliver': 
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600'
    default: 
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'Order Created': return 'heroicons:document-plus'
    case 'Waiting Payment': return 'heroicons:clock'
    case 'Paid': return 'heroicons:check-circle'
    case 'Delivered': return 'heroicons:check-badge'
    case 'Cancelled': return 'heroicons:x-circle'
    case 'Failed to Deliver': return 'heroicons:exclamation-triangle'
    default: return 'heroicons:question-mark-circle'
  }
}

watch(getTimeRemaining, async (val) => {
  if (val === 'Expired') {
    await getOrder()
  }
})

const getTimePercentLeft = computed(() => {
  if (!order.value?.paymentDeadline || !order.value?.createdAt) return 0
  const total = new Date(order.value.paymentDeadline).getTime() - new Date(order.value.createdAt).getTime()
  const left = new Date(order.value.paymentDeadline).getTime() - now.value.getTime()
  if (total <= 0) return 0
  const percent = (left / total) * 100
  return Math.max(0, Math.min(100, percent))
})

function getTimeRemaining(): string {
  if (!order.value?.createdAt) return ''
  
  const expiryTime = new Date(order.value.paymentDeadline)
  const timeRemaining = expiryTime.getTime() - now.value.getTime()
  
  if (timeRemaining <= 0) return 'Expired'
  
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60)
  const seconds = Math.floor((timeRemaining / 1000) % 60)
  
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(minutes)}m : ${pad(seconds)}s`
}

function calculateTotal(): number {
  if (!order.value?.orderItems) return 0
  return order.value.orderItems.reduce((total, item) => {
    return total + (item.product?.price ?? 0) * item.quantity
  }, 0)
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>