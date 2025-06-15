<template>
  <div class="min-h-screen px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto py-6 sm:py-8 lg:py-12">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="$router.back()"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
          Back to Orders
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!order" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
        <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
        <p class="text-gray-600 dark:text-gray-400">The order you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>

      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Order Info Card -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{{ order.id }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Placed on {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="flex flex-col sm:items-end gap-2">
              <div class="flex items-center gap-2">
                <Icon :name="getStatusIcon(order.status)" class="w-5 h-5" />
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="statusColor(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>
              <div v-if="order.status === 'Waiting Payment' && isPaymentExpiringSoon()" class="text-sm text-orange-600 dark:text-orange-400 font-medium">
                <Icon name="heroicons:clock" class="w-4 h-4 inline mr-1" />
                Expires in {{ getTimeRemaining() }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400 block">Email</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ order.email }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400 block">Total Amount</span>
              <span class="font-bold text-blue-600 dark:text-blue-400 text-lg">${{ calculateTotal().toFixed(2) }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400 block">Last Updated</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(order.updatedAt) }}</span>
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
                <span class="text-gray-900 dark:text-white">{{ getPaymentDeadline() }}</span>
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
          <h2 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="heroicons:chart-bar" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
            <span>Order Progress</span>
          </h2>
          
          <div class="relative">
            <div class="hidden sm:block">
              <!-- Progress Line -->
              <div class="absolute top-5 lg:top-6 left-5 lg:left-6 right-5 lg:right-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-0">
                <div 
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="getProgressBarClass()"
                  :style="{ width: `${getProgressPercentage()}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Steps -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
              <div 
                v-for="(step, index) in getOrderSteps()" 
                :key="index"
                class="flex flex-col items-center text-center"
                :style="{ animationDelay: `${index * 200}ms` }"
              >
                <div 
                  class="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center mb-2 lg:mb-3 transition-all duration-500"
                  :class="getStepStatusClass(step, index)"
                >
                  <Icon 
                    :name="step.icon" 
                    class="w-4 h-4 lg:w-5 lg:h-5" 
                  />
                </div>
                <h3 class="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 dark:text-white mb-1">
                  {{ step.name }}
                </h3>
                <p v-if="step.timestamp" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ step.timestamp }}
                </p>
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
              class="flex items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 rounded-xl bg-white dark:bg-gray-600 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 animate-fadeInUp"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="relative flex-shrink-0">
                <img
                  v-if="orderItem.product"
                  :src="useGetImageUrl(orderItem.product.image)"
                  alt="Product"
                  class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                />
                <div v-else class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <Icon name="heroicons:photo" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <!-- Quantity Badge -->
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {{ orderItem.quantity }}
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg leading-tight line-clamp-2">
                  {{ orderItem.product?.name || orderItem.productSlug }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1 text-xs sm:text-sm">
                  <Icon name="heroicons:currency-dollar" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>${{ orderItem.product?.price || 0 }} each</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Quantity: {{ orderItem.quantity }}
                </p>
              </div>
              
              <div class="text-right flex-shrink-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p class="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                  ${{ ((orderItem.product?.price || 0) * orderItem.quantity).toFixed(2) }}
                </p>
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

// Payment confirmation variables (removed selectedPaymentMethod)
const paymentReference = ref('')
const paymentNotes = ref('')
const confirmationChecked = ref(false)
const isConfirming = ref(false)

// Fixed: Computed property to check if payment can be confirmed (removed selectedPaymentMethod requirement)
const canConfirmPayment = computed(() => {
  return confirmationChecked.value && !isConfirming.value
})

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await useApi<Order>(`/orders/${orderId}`, {
      method: 'GET',
    })
    order.value = response
    console.log('Order fetched successfully:', order.value)
  } catch (error) {
    console.error(error)
    order.value = undefined
  } finally {
    isLoading.value = false
  }
})

// Fixed: Payment confirmation function (removed paymentMethod from data)
async function confirmPayment() {
  if (!canConfirmPayment.value) return
  
  try {
    isConfirming.value = true
    
    await useApi(`/orders/confirm-payment`, {
      method: 'POST',
      data: { orderId },
    })
    
    // Show success message
    useToast().add({
      title: 'Payment Confirmed!',
      description: 'Your payment confirmation has been submitted. We will review and update your order status soon.',
      color: 'success'
    })
    
    // Refresh order data to get updated status
    await fetchOrderData()
    
    // Reset form (removed selectedPaymentMethod)
    paymentReference.value = ''
    paymentNotes.value = ''
    confirmationChecked.value = false
    
  } catch (error: any) {
    console.error('Error confirming payment:', error)
    
    let errorMessage = 'Failed to confirm payment. Please try again.'
    if (error?.data?.message) {
      errorMessage = error.data.message
    }
    
    useToast().add({
      title: 'Error',
      description: errorMessage,
      color: 'error',
    })
  } finally {
    isConfirming.value = false
  }
}

// Function to refetch order data
async function fetchOrderData() {
  try {
    const response = await useApi<Order>(`/orders/${orderId}`, {
      method: 'GET',
    })
    order.value = response
  } catch (error) {
    console.error('Error fetching updated order:', error)
  }
}

// Function to get payment deadline
function getPaymentDeadline(): string {
  if (!order.value?.createdAt) return '-'
  
  const createdAt = new Date(order.value.createdAt)
  const deadline = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000)) // 24 hours
  
  return deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
          case 'Paid': return 'Payment Complete'
          case 'Cancelled': return 'Payment Cancelled'
          case 'Delivered': return 'Payment Complete'
          case 'Failed to Deliver': return 'Payment Complete'
          default: return 'Payment'
        }
      })(),
      completed: ['Paid', 'Delivered'].includes(status),
      current: ['Waiting Payment', 'Paid'].includes(status),
      failed: status === 'Cancelled',
      icon: status === 'Paid' ? 'heroicons:check-circle' : 'heroicons:credit-card',
      timestamp: (() => {
        if (status === 'Paid' && order.value?.updatedAt) {
          return formatDate(order.value.updatedAt)
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
          case 'Delivered': return 'Successfully Delivered'
          case 'Failed to Deliver': return 'Delivery Failed'
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

function getStepStatusClass(step: OrderStep, index: number): string {
  if (step.failed) {
    return 'bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white shadow-lg'
  }
  if (step.completed) {
    return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-lg'
  }
  if (step.current) {
    const status = order.value?.status ?? ''
    if (step.name === 'Payment Complete' && status === 'Paid') {
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

function isPaymentExpiringSoon(): boolean {
  if (!order.value?.createdAt) return false
  
  const createdAt = new Date(order.value.createdAt)
  const expiryTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000))
  const now = new Date()
  const timeRemaining = expiryTime.getTime() - now.getTime()
  
  return timeRemaining > 0 && timeRemaining < (2 * 60 * 60 * 1000)
}

function getTimeRemaining(): string {
  if (!order.value?.createdAt) return ''
  
  const createdAt = new Date(order.value.createdAt)
  const expiryTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000))
  const now = new Date()
  const timeRemaining = expiryTime.getTime() - now.getTime()
  
  if (timeRemaining <= 0) return 'Expired'
  
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

function calculateTotal(): number {
  if (!order.value?.orderItems) return 0
  return order.value.orderItems.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + (price * item.quantity)
  }, 0)
}

function formatDate(date?: string | Date): string {
  if (!date) return '-'
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>