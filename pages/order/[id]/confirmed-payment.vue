<template>
  <div class="min-h-screen flex items-center justify-center p-2 sm:p-4 lg:p-6 transition-colors duration-300">
    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-lg lg:max-w-2xl w-full transition-colors duration-300">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-3 sm:mb-4 animate-pulse">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Order Details...</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Please wait while we fetch your order information</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-lg lg:max-w-2xl w-full transition-colors duration-300">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900 rounded-full mb-3 sm:mb-4">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">{{ error }}</p>
        <button @click="goToOrders" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base">
          View All Orders
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-lg lg:max-w-4xl xl:max-w-5xl w-full transition-colors duration-300">
      <!-- Header -->
      <div class="text-center mb-4 sm:mb-6 lg:mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full mb-3 sm:mb-4 transition-colors duration-300">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Payment Confirmed!</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">Your transaction has been processed successfully</p>
      </div>

      <!-- Payment Details -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 transition-colors duration-300">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center transition-colors duration-300">Order Summary</h2>
        
        <div class="space-y-3 sm:space-y-4">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Order ID</span>
            <span class="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-all sm:break-normal">#{{ order?.id }}</span>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Email</span>
            <span class="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-all sm:break-normal">{{ order?.email }}</span>
          </div>
          
          <div class="flex sm:flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Total Amount</span>
            <span class="font-bold text-green-600 dark:text-green-400 text-lg sm:text-xl">${{ calculateTotal().toFixed(2) }}</span>
          </div>
          
          <div class="flex sm:flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Status</span>
            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit" 
                  :class="getStatusColor(order?.status || '')">
              {{ order?.status }}
            </span>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Order Date</span>
            <span class="text-gray-900 dark:text-white text-sm sm:text-base">{{ formatDate(order?.createdAt) }}</span>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-600 gap-1 sm:gap-0">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Paid Date</span>
            <span class="text-gray-900 dark:text-white text-sm sm:text-base">{{ formatDate(order?.paidAt) }}</span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-gray-200 dark:border-gray-600">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Order Items</h3>
          <div class="space-y-2 sm:space-y-3">
            <div 
              v-for="(orderItem, index) in order?.orderItems" 
              :key="orderItem.id"
              class="flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-gray-600 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              <!-- Product Image -->
              <div class="relative flex-shrink-0">
                <img
                  v-if="orderItem.product"
                  :src="useGetImageUrl(orderItem.product.image)"
                  alt="Product"
                  class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-600"
                />
                <div v-else class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <Icon name="heroicons:photo" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <!-- Quantity Badge -->
                <div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {{ orderItem.quantity }}
                </div>
              </div>
              
              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm lg:text-base leading-tight line-clamp-2">
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
              
              <!-- Price -->
              <div class="text-right flex-shrink-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p class="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                  ${{ ((orderItem.product?.price || 0) * orderItem.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Message -->
      <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 lg:mb-8 transition-colors duration-300">
        <div class="flex items-start gap-2 sm:gap-3">
          <div class="flex-shrink-0">
            <svg class="h-4 w-4 sm:h-5 sm:w-5 text-green-400 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Payment Successful</h3>
            <div class="mt-1 sm:mt-2 text-xs sm:text-sm text-green-700 dark:text-green-300">
              <p>Your payment has been processed and a confirmation email has been sent to {{ order?.email }}.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
        <button 
          @click="downloadReceipt"
          class="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-300"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="hidden sm:inline">Download Receipt</span>
          <span class="sm:hidden">Receipt</span>
        </button>
        
        <button 
          @click="goToOrder"
          class="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-300"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span class="hidden sm:inline">View My Order</span>
          <span class="sm:hidden">My Order</span>
        </button>
        
        <button 
          @click="goHome"
          class="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors duration-300"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 18m0 0a2 2 0 11-4 0 2 2 0 014 0zM9 9h10a2 2 0 012 2v8a2 2 0 01-2-2v-8a2 2 0 012-2z"></path>
          </svg>
          <span class="hidden sm:inline">Continue Shopping</span>
          <span class="sm:hidden">Shop</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// ...existing code...
import type { Order } from '~/types/orders'
import { useGetImageUrl } from '~/composables/getImageUrl'

const route = useRoute()
const router = useRouter()

// State management
const isLoading = ref(false)
const id = route.params.id as string
const order = ref<Order | undefined>(undefined)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await useApi<Order>(`/orders/${id}`, {
      method: 'GET',
    })
    order.value = response
    console.log('Order fetched successfully:', order.value)
  } catch (err: any) {
    let errorMessage = 'Failed to fetch order data'
    
    if (err?.response?.data?.message) {
      // Axios response with data.message
      errorMessage = err.response.data.message
    } else if (err?.response?.data?.error) {
      // Axios response with data.error
      errorMessage = err.response.data.error
    } else if (err?.response?.data) {
      // If data is a string
      errorMessage = typeof err.response.data === 'string' ? err.response.data : errorMessage
    } else if (err?.data?.message) {
      // Direct data.message
      errorMessage = err.data.message
    } else if (err?.data?.error) {
      // Direct data.error
      errorMessage = err.data.error
    } else if (err?.message) {
      // Standard error message
      errorMessage = err.message
    } else if (err?.response?.status) {
      // HTTP status code based messages
      switch (err.response.status) {
        case 400:
          errorMessage = 'Invalid order ID'
          break
        case 401:
          errorMessage = 'You are not authorized to view this order'
          break
        case 403:
          errorMessage = 'Access denied to this order'
          break
        case 404:
          errorMessage = 'Order not found'
          break
        case 500:
          errorMessage = 'Server error occurred. Please try again later'
          break
        default:
          errorMessage = `Error ${err.response.status}: Unable to fetch order`
      }
    }
    
    error.value = errorMessage
    order.value = undefined
  } finally {
    isLoading.value = false
  }
})

const calculateTotal = () => {
  if (!order.value?.orderItems) return 0
  return order.value.orderItems.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + (price * item.quantity)
  }, 0)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
    case 'Delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
    case 'Waiting Payment':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
    case 'Cancelled':
    case 'Failed to Deliver':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
  }
}

const formatDate = (date?: Date | string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const downloadReceipt = async () => {
  try {
    // Call API to generate and download receipt
    const response = await $fetch(`/api/orders/${route.params.id}/receipt`, {
      method: 'GET'
    })
    
    // You can implement PDF generation or redirect to receipt page
    console.log('Receipt data:', response)
  } catch (error) {
    console.error('Error downloading receipt:', error)
  }
}

const goToOrders = () => {
  router.push(`/order`)
}

const goToOrder = () => {
  router.push(`/order/${id}`)
}

const goHome = () => {
  router.push('/')
}
</script>

<style>

</style>