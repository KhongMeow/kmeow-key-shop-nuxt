<template>
  <div class="max-w-8xl">
    <h1 class="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-4">
      Secure Checkout
    </h1>

    <!-- Main Container -->
    <div class="container mx-auto py-8">
      <!-- Checkout Header -->
      <div class="mb-12">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete your purchase safely and securely. Your payment information is protected with industry-standard encryption.
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Left: Contact Information -->
        <div class="order-1">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8 lg:p-10 h-fit">
            <div class="flex items-center mb-8">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Icon name="mdi:email-outline" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Contact Information</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm">We'll use this to send you order updates</p>
              </div>
            </div>

            <div class="space-y-6">
              <InputTextbox
                label="Email Address"
                type="email"
                id="email"
                placeholder="Enter your email address"
                v-model="email"
                :error="errors.email"
                aria-describedby="email-helper"
                class="transform transition-all duration-200 focus-within:scale-[1.02]"
              />

              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div class="flex items-start">
                  <Icon name="mdi:information-outline" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Secure Checkout</p>
                    <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">Your information is encrypted and secure. We'll never share your email with third parties.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              class="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
            >
              <span class="flex items-center justify-center">
                Continue to Shipping
                <Icon name="mdi:arrow-right" class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="order-2">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8 lg:p-10 sticky top-8">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Icon name="mdi:cart-outline" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Order Summary</h2>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ carts?.length || 0 }} item{{ (carts?.length || 0) !== 1 ? 's' : '' }} in your cart</p>
                </div>
              </div>
            </div>            <!-- Cart Items -->
            <div class="space-y-4 max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div v-if="carts?.length === 0" class="h-32 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Icon name="mdi:cart-off" class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                <p class="font-medium">Your cart is empty</p>
                <p class="text-sm text-gray-400 dark:text-gray-500">Add some items to continue</p>
              </div>
              
              <div v-for="item in carts" :key="item.product.id" class="group bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div class="flex items-center gap-4">
                  <!-- Product Image with enhanced styling -->
                  <div class="relative w-20 h-20 rounded-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <!-- Default placeholder when no image or image fails -->
                    <div 
                      v-if="!item.product.image || imageErrors[item.product.slug]"
                      class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600"
                    >
                      <Icon name="mdi:image-off-outline" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    
                    <!-- Product Image -->
                    <img 
                      v-else
                      :src="useGetImageUrl(item.product.image)" 
                      alt="Product Image" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      @error="handleImageError(item.product.slug)"
                      @load="handleImageLoad(item.product.slug)"
                    />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ item.product.name }}
                    </h3>
                    <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      ${{ item.product.price }}
                    </p>
                  </div>
                  
                  <div class="text-right">
                    <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                      ×{{ item.quantity }}
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ${{ (item.quantity * item.product.price).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Total -->
            <div class="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
              <div class="space-y-3">
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${{ carts?.reduce((total, item) => total + (item.quantity * item.product.price), 0).toFixed(2) || '0.00' }}</span>
                </div>
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div class="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gray-800 dark:text-white">Total</span>
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${{ carts?.reduce((total, item) => total + (item.quantity * item.product.price), 0).toFixed(2) || '0.00' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Place Order Button -->
            <form @submit.prevent="placeOrder" class="mt-8">
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
              >
                <span class="relative z-10 flex items-center justify-center">
                  <Icon name="mdi:credit-card-outline" class="mr-3 w-5 h-5" />
                  Place Order
                  <Icon name="mdi:arrow-right" class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCartStore } from '~/store/cartStore';
  import type { CartItem } from '~/types/cart-items';
  import { useGetImageUrl } from '~/composables/getImageUrl';
  import { getSwalTheme } from '~/utils/swalTheme';
  import Swal from 'sweetalert2';

  const cartStore = useCartStore()
  const carts = ref<CartItem[] | undefined>(undefined);
  const email = ref<string>('');
  const imageErrors = ref<Record<string, boolean>>({});
  const errors = reactive({
    email: '',
  });

  definePageMeta({
    middleware: ['auth'],
  })

  const handleImageError = (productSlug: string) => {
    imageErrors.value[productSlug] = true;
  };

  const handleImageLoad = (productSlug: string) => {
    imageErrors.value[productSlug] = false;
  };

  onMounted(async () => {
    carts.value = await cartStore.getAllItems();
  });

  const validateEmail = async (newValue: string) => {
    errors.email = newValue ? '' : 'Email is required';
  };

  watch(email, validateEmail);

  const placeOrder = async () => {
    await validateEmail(email.value);

    if (email.value && !errors.email) {
      if (!carts.value || carts.value.length === 0) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Your cart is empty!',
          timer: 3000,
          showConfirmButton: false,
          ...getSwalTheme(),
        });
      }

      try {
        const response = await cartStore.placeOrder(email.value);
        await cartStore.clearCart();
        carts.value = [];
        navigateTo('/order/' + response.id);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your order has been placed successfully!',
          showConfirmButton: false,
          timer: 3000,
          ...getSwalTheme(),
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.message || 'Unknown error',
          showConfirmButton: false,
          timer: 3000,
          ...getSwalTheme(),
        });
      }
    }
  };
</script>

<style scoped>
/* Custom scrollbar styling */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

/* Backdrop blur fallback for older browsers */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.95);
  }
  
  .dark .backdrop-blur-sm {
    background-color: rgba(31, 41, 55, 0.95);
  }
}

/* Enhanced hover animations */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Loading animation for buttons */
.loading-button {
  position: relative;
  overflow: hidden;
}

.loading-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.loading-button:hover::after {
  left: 100%;
}

/* Floating effect for cards */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
}

.float-animation:hover {
  animation: float 2s ease-in-out infinite;
}

/* Gradient border animation */
@keyframes gradient-border {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animated-border {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-border 3s ease infinite;
}

/* Glass morphism effect */
.glass-effect {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>