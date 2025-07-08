<template>
  <div>
    <HeaderPageHead title="Checkout" />

    <div class="h-full mx-auto flex flex-col md:flex-row gap-8 items-start">
      <!-- Left: Email Input -->
      <div id="left" class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Contact Information</h2>
        <InputTextbox
          label="Email"
          type="text"
          id="email"
          placeholder="Enter your email"
          class="mb-4"
          v-model="email"
          :error="errors.email"
          aria-describedby="email-helper"
        />

        <button
          class="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Continue to Shipping
        </button>
      </div>
      <!-- Right: Cart Summary -->
      <div id="right" class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Order Summary</h2>
        <div class="my-4 max-h-[30rem] overflow-auto">
          <div v-if="carts?.length === 0" class="h-[5rem] text-gray-500 dark:text-gray-300 flex justify-center items-center">
            <p>Your cart is empty</p>
          </div>
          <div v-for="item in carts" :key="item.product.id" class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div class="flex items-center gap-4 w-full">
              <!-- Product Image with fallback -->
              <div class="relative w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Default placeholder when no image or image fails -->
                <div 
                  v-if="!item.product.image || imageErrors[item.product.slug]"
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
                >
                  <Icon name="mdi:image-off-outline" class="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                
                <!-- Product Image -->
                <img 
                  v-else
                  :src="useGetImageUrl(item.product.image)" 
                  alt="Product Image" 
                  class="w-full h-full object-cover"
                  @error="handleImageError(item.product.slug)"
                  @load="handleImageLoad(item.product.slug)"
                />
              </div>
              <div class="flex-1">
                <p class="truncate text-gray-800 dark:text-white font-medium">{{ item.product.name }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">$ {{ item.product.price }}</p>
              </div>
              <p class="text-gray-700 dark:text-gray-300 font-semibold">x{{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
          <p class="text-gray-800 dark:text-white font-bold text-lg">Total</p>
          <p class="text-gray-600 dark:text-gray-400 font-bold text-lg">
            $ {{ carts?.reduce((total, item) => total + (item.quantity * item.product.price), 0).toFixed(2) }}
          </p>
        </div>
        <form @submit.prevent="placeOrder">
          <button
            type="submit"
            class="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCartStore } from '~/store/cartStore';
  import type { CartItem } from '~/types/cart-items';
  import { useGetImageUrl } from '~/composables/getImageUrl';
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

<style>

</style>