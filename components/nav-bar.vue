<template>
  <div>
    <nav class="w-full flex justify-center bg-gray-100 dark:bg-gray-800 shadow-lg fixed h-20 z-[99999]">
      <div class="max-w-[81rem] w-[80%] flex items-center justify-between">
        <div id="left" class="flex items-center">
          <div id="logo" class="px-2 flex items-center">
            <img @click="$router.push('/')" src="/assets/kmeowkeyshop_logo.png" alt="logo" class="hidden max-sm:block max-h-[2rem]" />
            <NuxtLink to="/" class="block max-sm:hidden dark:text-white font-bold text-2xl text-nowrap">K'meow Key shop</NuxtLink>
          </div>
          <!-- <div id="categories" class="px-2 flex max-sm:flex-col items-center gap-4 text-gray-800 dark:text-white font-medium">
            <NuxtLink v-for="category in categories" :to="`/categories/${category.name}`" class="hover:cursor-pointer hover:text-blue-500 font-bold">
              {{ category.name }}
            </NuxtLink>
          </div> -->

          <!-- Navigation Links -->
          <div
            id="categories"
            :class="[
              'lg:block flex flex-col items-center gap-4 p-2 text-gray-800 dark:text-white font-medium max-lg:pb-4 rounded-b-lg',
              menuOpen ? 'block' : 'hidden'
            ]"
            class="absolute lg:static top-20 left-0 w-full lg:w-auto bg-gray-100 dark:bg-gray-800 lg:bg-transparent"
          >
            <NuxtLink
              v-for="category in categories"
              :key="category.slug"
              :name="category.name"
              :to="`/products/${category.slug}`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/products/${category.slug}`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <div id="right" class="flex items-center gap-x-4">
          <div id="search">
            <div class="flex items-center gap-4 justify-end">
              <div @click="toggleSearchPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="tabler:search" class="text-2xl sm:text-3xl lg:text-4xl" />
                <p class="hidden sm:block lg:text-base">{{ 'Search' }}</p>
              </div>
              <!-- Search Popover -->
              <div
                id="search-popover"
                v-if="searchPopoverOpen"
                class="absolute top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-50 min-w-[20rem]"
              >
                <p class="text-gray-800 dark:text-white font-bold text-lg sm:text-xl text-center">{{ 'Search Products' }}</p>
                <hr class="my-2 border-gray-300 dark:border-gray-600" />
                <div class="my-3 sm:my-4">
                  <InputTextbox
                    label="Search"
                    v-model="query"
                    type="text"
                    placeholder="Search for products..."
                    @keyup.passive="searchFunction(query)"
                    class="w-full text-sm sm:text-base"
                  />
                </div>
                <!-- Search Results -->
                <div v-if="searchResults?.length" class="max-h-64 sm:max-h-80 overflow-auto scrollbar-hide">
                  <div class="text-gray-800 dark:text-white font-medium text-sm sm:text-base mb-2">
                    Search Results ({{ searchResults.length }})
                  </div>
                  <div v-for="product in searchResults" :key="product.id" class="p-2 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" @click="navigateToProduct(product)">
                    <div class="flex items-center gap-2">
                      <div 
                        v-if="!product.image || imageErrors[product.slug]"
                        class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md"
                      >
                        <Icon name="mdi:image-off-outline" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      
                      <!-- Product Image -->
                      <img 
                        v-else
                        :src="useGetImageUrl(product.image)" 
                        :alt="product.name"
                        class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md" 
                        @error="handleImageError(product.slug)"
                        @load="handleImageLoad(product.slug)"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-gray-800 dark:text-white font-medium text-sm sm:text-base truncate">{{ product.name }}</p>
                        <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">$ {{ product.price }}</p>
                      </div>
                    </div>
                  </div>
                  <span class="flex justify-center text-gray-500 dark:text-gray-300 text-center pt-4 text-sm sm:text-base">You've seen all search results!</span>
                </div>
                <div v-else-if="searchResults?.length === 0 && query.trim()" class="text-gray-500 dark:text-gray-300 text-center py-4 text-sm sm:text-base">
                  <span>No products found</span>
                </div>
              </div>
            </div>
          </div>

          <div id="cart">
            <div class="flex items-center gap-4 justify-end">
              <div @click="toggleCartPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="solar:cart-large-minimalistic-bold" class="text-2xl sm:text-3xl lg:text-4xl" />
                <p class="max-sm:hidden">{{ 'Cart' }}</p>
              </div>
              <!-- Cart Popover -->
              <div
                id="cart-popover"
                v-if="cartPopoverOpen"
                class="absolute top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-50 min-w-[20rem]"
              >
                <p class="text-gray-800 dark:text-white font-bold text-xl text-center">{{ 'Cart' }}</p>
                <hr class="my-2 border-gray-300 dark:border-gray-600" />
                <div class="max-h-64 sm:max-h-80 overflow-auto scrollbar-hide">
                  <div v-if="carts?.length === 0" class="h-[5rem] text-gray-500 dark:text-gray-300 flex justify-center items-center">
                    <p>{{ 'Your cart is empty' }}</p>
                  </div>
                  <!-- <pre>{{ carts }}</pre> -->
                  <div v-for="item in carts" class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-600">
                    <div class="w-full flex items-center gap-2 h-16">
                      <div 
                        v-if="!item.product.image || imageErrors[item.product.slug]"
                        class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md"
                      >
                        <Icon name="mdi:image-off-outline" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      
                      <!-- Product Image -->
                      <img 
                        v-else
                        :src="useGetImageUrl(item.product.image)" 
                        :alt="item.product.name"
                        class="w-16 h-16 object-cover rounded-md" 
                        @error="handleImageError(item.product.slug)"
                        @load="handleImageLoad(item.product.slug)"
                      />
                      <div class="w-32 flex-1">
                        <p class="overflow-hidden text-gray-800 dark:text-white font-medium">{{ item.product.name }}</p>
                        <p class="text-gray-600 dark:text-gray-400 text-sm text-nowrap">$ {{ item.product.price }}</p>
                      </div>
                      <InputTextbox
                        :model-value="String(item.quantity)"
                        type="number"
                        min="0"
                        step="1"
                        @update:model-value="(val: string | number) => changeItemQuantity(item, val)"
                        class="max-w-[5rem] text-center items-center"
                      />
                      <button
                        @click="cartStore.removeFromCart(item.id)"
                        class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 items-center"
                      >
                        <Icon name="mdi:delete" class="text-2xl" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="my-4 flex justify-between">
                  <p class="text-gray-800 dark:text-white font-bold text-lg">{{ 'Total' }}</p>
                  <p class="text-gray-600 dark:text-gray-400 font-bold text-lg">
                    $ {{ carts?.reduce((total, item) => total + (item.quantity * item.product.price), 0).toFixed(2) }}
                  </p>
                </div>
                <hr>
                <UButton
                  :to="carts?.length ? '/checkout' : '#'"
                  class="w-full mt-2 text-center justify-center p-2 text-gray-900 text-md font-bold"
                  color="primary"
                  variant="solid"
                  :disabled="!carts?.length"
                  @click="if (!carts?.length) { $event.preventDefault(); } else { cartPopoverOpen = false; }"
                >
                  {{ 'Checkout' }}
                </UButton>
              </div>
            </div>
          </div>
          <div id="user">
            <div v-if="authStore.user" class="flex items-center gap-4 justify-end">
              <div @click="toggleUserPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="mdi:account" class="text-2xl sm:text-3xl lg:text-4xl" />
                <p class="max-sm:hidden text-nowrap">{{ user?.fullname }}</p>
              </div>
              <!-- User Popover -->
              <div
                id="user-popover"
                v-if="userPopoverOpen"
                class="absolute top-20 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-50"
              >
                <p class="text-gray-800 dark:text-white font-medium">{{ user?.fullname }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300">{{ user?.email }}</p>
                <hr class="my-2 border-gray-300 dark:border-gray-600" />
                <NuxtLink 
                  to="/user/update-profile"
                  class="block text-gray-800 dark:text-gray-200 font-medium p-2 my-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  active-class="bg-gray-100 dark:bg-gray-500 text-blue-600 dark:text-blue-400"
                  exact
                  @click="closeUserPopover"
                >
                  Profile
                </NuxtLink>
                <NuxtLink 
                  to="/balance"
                  class="block text-gray-800 dark:text-gray-200 font-medium p-2 my-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  active-class="bg-gray-100 dark:bg-gray-500 text-blue-600 dark:text-blue-400"
                  exact
                  @click="closeUserPopover"
                >
                  $ {{ user?.balance?.amount }}
                </NuxtLink>
                <NuxtLink 
                  v-if="hasAccessToDashboard"
                  to="/dashboard"
                  class="block text-gray-800 dark:text-gray-200 font-medium p-2 my-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  active-class="bg-gray-100 dark:bg-gray-500 text-blue-600 dark:text-blue-400"
                  exact
                  @click="closeUserPopover"
                >
                  Dashboard
                </NuxtLink>
                <NuxtLink 
                  v-if="hasAccessToUsersSetting"
                  to="/users-setting"
                  class="block text-gray-800 dark:text-gray-200 font-medium p-2 my-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  active-class="bg-gray-100 dark:bg-gray-500 text-blue-600 dark:text-blue-400"
                  exact
                  @click="closeUserPopover"
                >
                  Users Setting
                </NuxtLink>
                <hr class="my-2 border-gray-300 dark:border-gray-600" />
                <button
                  @click="signOut"
                  class="block w-full text-left text-red-500 font-medium mt-2 p-2 hover:bg-gray-200 rounded dark:hover:bg-gray-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div v-else class="flex items-center gap-4">
              <NuxtLink to="/auth/sign-in" class="flex items-center gap-2 hover:cursor-pointer hover:text-blue-500 text-gray-800 dark:text-white font-bold">
                <Icon name="mdi:login" class="text-2xl sm:text-3xl lg:text-4xl text-gray-400 hover:text-gray-500" />
                <p class="max-sm:hidden text-nowrap">{{ "Sign In" }}</p>
              </NuxtLink>
              <NuxtLink name="Sign Up" to="/auth/sign-up" class="max-md:hidden flex items-center gap-2 hover:cursor-pointer hover:text-blue-500 text-gray-800 dark:text-white font-bold">
                <Icon name="mdi:register" class="text-2xl sm:text-3xl lg:text-4xl text-gray-400 hover:text-gray-500" />
                <p class="max-sm:hidden text-nowrap">{{ "Sign Up" }}</p>
              </NuxtLink>
            </div>
          </div>

          <!-- Theme Toggle Button -->
          <div class="flex justify-end">
            <button 
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
          </div>

          <!-- Berger Menu -->
          <button id="toggle-menu" @click="toggleMenu" class="lg:hidden flex items-center text-gray-800 dark:text-white">
            <Icon name="material-symbols:menu-rounded" class="text-black dark:text-white text-4xl" />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';
import { useCartStore } from '~/store/cartStore';
import { useApi } from '~/composables/useApi';
import { useGetImageUrl } from '~/composables/getImageUrl';
import { getSwalTheme } from '~/utils/swalTheme';
import type { Category } from '~/types/categories';
import type { CartItem } from '~/types/cart-items';
import Swal from 'sweetalert2';

const isDark = ref(false);
const authStore = useAuthStore();
const cartStore = useCartStore();
const menuOpen = ref(false);
const userPopoverOpen = ref(false);
const cartPopoverOpen = ref(false);
const searchPopoverOpen = ref(false);
const categories = ref<Category[] | undefined>(undefined);
const carts = ref<CartItem[] | undefined>(undefined);
const query = ref('');
const searchResults = ref<any[]>([]);

const imageErrors = ref<Record<string, boolean>>({});

const handleImageError = (productSlug: string) => {
  imageErrors.value[productSlug] = true;
};

const handleImageLoad = (productSlug: string) => {
  imageErrors.value[productSlug] = false;
};

const searchFunction = async (query: string) => {
  if (!query.trim() || query.trim().length < 2) {
    searchResults.value = [];
    return;
  }
  try {
    searchResults.value = await useApi(`/products?search=${query}`, { method: 'GET' });
  } catch (error) {
    handleError(error);
  }
};

const navigateToProduct = (product: any) => {
  searchPopoverOpen.value = false;
  query.value = '';
  searchResults.value = [];
  navigateTo(`/${product.category.slug}/${product.slug}`);
};

const user = computed(() => {
  if (!authStore.user) return null;
  return authStore.user;
});

const hasAccessToDashboard = computed(() => {
  const hasPermission = authStore.checkPermission('access-dashboard');
  return hasPermission;
});

const hasAccessToUsersSetting = computed(() => {
  const hasPermission = authStore.checkPermission('access-users-setting');
  return hasPermission;
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const toggleUserPopover = (event: MouseEvent) => {
  event.stopPropagation();
  menuOpen.value = false;
  cartPopoverOpen.value = false;
  searchPopoverOpen.value = false;
  userPopoverOpen.value = !userPopoverOpen.value;
};

const toggleCartPopover = (event: MouseEvent) => {
  event.stopPropagation();
  menuOpen.value = false;
  userPopoverOpen.value = false;
  searchPopoverOpen.value = false;
  cartPopoverOpen.value = !cartPopoverOpen.value;
};

const toggleSearchPopover = (event: MouseEvent) => {
  event.stopPropagation();
  menuOpen.value = false;
  userPopoverOpen.value = false;
  cartPopoverOpen.value = false;
  searchPopoverOpen.value = !searchPopoverOpen.value;
  
  // Focus on search input when popover opens
  if (searchPopoverOpen.value) {
    nextTick(() => {
      const searchInput = document.querySelector('#search-popover input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    });
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const userPopover = document.getElementById('user-popover');
  if (userPopover && !userPopover.contains(event.target as Node)) {
    userPopoverOpen.value = false;
  }

  const searchPopover = document.getElementById('search-popover');
  if (searchPopover && !searchPopover.contains(event.target as Node)) {
    searchPopoverOpen.value = false;
  }
  
  const cartPopover = document.getElementById('cart-popover');
  if (cartPopover && !cartPopover.contains(event.target as Node)) {
    cartPopoverOpen.value = false;
  }

  const menu = document.getElementById('categories');
  const toggleMenu = document.getElementById('toggle-menu');
  if (toggleMenu && !toggleMenu.contains(event.target as Node) && menu && !menu.contains(event.target as Node)) {
    menuOpen.value = false;
  }
};

const changeItemQuantity = async (item: CartItem, val: string | number) => {
  let quantity = parseInt(val as string, 10);
  if (isNaN(quantity)) quantity = 1;
  quantity = Math.floor(quantity);

  // Ensure quantity does not exceed stock
  if (quantity > item.product.stock) {
    await Swal.fire({
      icon: 'warning',
      title: 'Quantity exceeds stock',
      text: `Maximum available: ${item.product.stock}`,
      confirmButtonText: 'OK',
      ...getSwalTheme(),
    });
    quantity = item.product.stock;
  }
  if (quantity < 0) {
    quantity = 0;
  }

  await cartStore.updateCartItem(item.id, quantity);
  carts.value = await cartStore.getAllItems();
};

watch(
  () => carts.value?.map(item => item.quantity),
  async (newQuantities, oldQuantities) => {
    if (!oldQuantities) return;
    newQuantities?.forEach(async (qty, idx) => {
      if (qty !== oldQuantities[idx]) {
        const item = carts.value?.[idx];
        if (item) {
          await changeItemQuantity(item, qty);
        }
      }
    });
  }
);

watch(
  () => cartStore.cartItems,
  async () => {
    carts.value = await cartStore.getAllItems();
  },
  { deep: true }
);

// Watch for when items are added to cart and open cart popover
watch(
  () => cartStore.justAddedToCart,
  (newValue) => {
    if (newValue) {
      // Close other popovers
      menuOpen.value = false;
      userPopoverOpen.value = false;
      searchPopoverOpen.value = false;
      // Open cart popover
      cartPopoverOpen.value = true;
    }
  }
);

onMounted(async () => {
  await authStore.checkAuth();

  // Initialize dark mode from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Apply theme
  updateTheme()
  
  isDark.value = document.documentElement.classList.contains('dark');
  await getCategories();
  carts.value = await cartStore.getAllItems() as CartItem[];

  document.addEventListener('click', handleClickOutside);
});


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const getCategories = async () => {
  try {
    categories.value = await useApi('/categories', { method: 'GET' });
  } catch (error) {
    handleError(error);
  }
};

const closeUserPopover = () => {
  userPopoverOpen.value = false;
};

const signOut = async () => {
  try {
    await authStore.signOut();
    await authStore.getUser();
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message);
  }
  console.error('Logout error:', error);
};
</script>

<style scoped>

/* Hide scrollbar for mobile category filter */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}

/* Smooth scrolling for mobile categories */
.scrollbar-hide {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Enhanced mobile responsive styles */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>