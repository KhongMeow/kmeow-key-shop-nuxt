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
              :to="`/${category.slug}`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/${category.slug}`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <div id="right" class="flex items-center gap-x-4">
          <div id="cart">
            <div class="flex items-center gap-4 justify-end">
              <div @click="toggleCartPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="solar:cart-large-minimalistic-bold" class="text-4xl" />
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
                <div class="my-4 max-h-[50rem] overflow-auto">
                  <div v-if="carts?.length === 0" class="h-[5rem] text-gray-500 dark:text-gray-300 flex justify-center items-center">
                    <p>{{ 'Your cart is empty' }}</p>
                  </div>
                  <!-- <pre>{{ carts }}</pre> -->
                  <div v-for="item in carts" class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-600">
                    <div class="w-full flex items-center gap-2 h-16">
                      <img :src="useGetImageUrl(item.product.image)" alt="Product Image" class="w-16 h-16 object-cover rounded-md" />
                      <div class="w-32 flex-1">
                        <p class="overflow-hidden text-gray-800 dark:text-white font-medium">{{ item.product.name }}</p>
                        <p class="text-gray-600 dark:text-gray-400 text-sm text-nowrap">$ {{ item.product.price }}</p>
                      </div>
                      <InputTextbox
                        :model-value="String(item.quntity)"
                        type="number"
                        min="0"
                        step="1"
                        @update:model-value="val => changeItemQuantity(item, val)"
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
                    $ {{ carts?.reduce((total, item) => total + (item.quntity * item.product.price), 0).toFixed(2) }}
                  </p>
                </div>
                <hr>
                <UButton
                  :to="carts?.length ? '/checkout' : '#'"
                  class="w-full mt-2 text-center justify-center p-2 text-gray-900 text-md font-bold"
                  color="primary"
                  variant="solid"
                  :disabled="!carts?.length"
                  @click="carts?.length ? null : $event.preventDefault()"
                >
                  {{ 'Checkout' }}
                </UButton>
              </div>
            </div>
          </div>
          <div id="user">
            <div v-if="authStore.user" class="flex items-center gap-4 justify-end">
              <div @click="toggleUserPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="mdi:account" class="text-4xl" />
                <p class="max-sm:hidden">{{ user?.fullname }}</p>
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
                  to="/user/my-profile"
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
              <NuxtLink to="/auth/sign-in" class="hover:cursor-pointer hover:text-blue-500 text-gray-800 dark:text-white font-bold">
                Sign In
              </NuxtLink>
              <NuxtLink to="/auth/sign-up" class="hover:cursor-pointer hover:text-blue-500 text-gray-800 dark:text-white font-bold">
                Sign Up
              </NuxtLink>
            </div>
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
import type { Category } from '~/types/categories';
import type { RolePermission } from '~/types/role-permissions';
import type { CartItem } from '~/types/cart-items';

const authStore = useAuthStore();
const cartStore = useCartStore();
const menuOpen = ref(false);
const userPopoverOpen = ref(false);
const cartPopoverOpen = ref(false);
const categories = ref<Category[] | undefined>(undefined);
const carts = ref<CartItem[] | undefined>(undefined);

const user = computed(() => {
  if (!authStore.user) return null;
  return authStore.user;
});

const hasAccessToDashboard = computed(() => {
  if (!user.value || !user.value.role) {
    console.log('No user or role, returning false');
    return false;
  }

  const roles = Array.isArray(user.value.role) ? user.value.role : [user.value.role];
  
  const hasPermission = roles.some(role =>
    Array.isArray(role.rolePermissions) &&
    role.rolePermissions.some((rolePermission: RolePermission) => rolePermission.permission.slug === 'access-dashboard')
  );

  // console.log('hasAccessToDashboard:', hasPermission, roles);
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
  userPopoverOpen.value = !userPopoverOpen.value;
};

const toggleCartPopover = (event: MouseEvent) => {
  event.stopPropagation();
  menuOpen.value = false;
  userPopoverOpen.value = false;
  cartPopoverOpen.value = !cartPopoverOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const userPopover = document.getElementById('user-popover');
  if (userPopover && !userPopover.contains(event.target as Node)) {
    userPopoverOpen.value = false;
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
  quantity = Math.floor(quantity); // Ensure integer
  await cartStore.updateCartItem(item.id, quantity);
  carts.value = await cartStore.getAllItems();
};

watch(
  () => cartStore.cartItems,
  async () => {
    carts.value = await cartStore.getAllItems();
  },
  { deep: true }
);

onMounted(async () => {
  await getCategories();
  carts.value = await cartStore.getAllItems() as CartItem[];
  await authStore.checkAuth();
  
  // Wait for token to be available before trying to get the user
  const token = localStorage.getItem('access_token');
  if (token) {
    authStore.accessToken = token; // Ensure the store has it too
    try {
      await authStore.getUser();
    } catch (error) {
      console.error('Error fetching user in navbar:', error);
    }
  }

  document.addEventListener('click', handleClickOutside);
});


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

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

<style>

</style>