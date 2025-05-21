<template>
  <div>
    <nav class="w-full flex justify-center bg-gray-100 dark:bg-gray-800 shadow-lg fixed h-20">
      <div class="max-w-[81rem] w-[80%] flex items-center justify-between">
        <div id="left" class="flex items-center">
          <div id="logo" class="px-2 flex items-center">
            <img src="/assets/kmeowkeyshop_logo.png" alt="logo" class="hidden max-sm:block max-h-[2rem]" />
            <NuxtLink to="/" class="block max-sm:hidden dark:text-white font-bold text-2xl">K'meow Key shop</NuxtLink>
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
              'sm:block flex flex-col items-center gap-4 p-2 text-gray-800 dark:text-white font-medium max-md:pb-4 rounded-b-lg',
              menuOpen ? 'block' : 'hidden'
            ]"
            class="absolute sm:static top-20 left-0 w-full sm:w-auto bg-gray-100 dark:bg-gray-800 sm:bg-transparent"
          >
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/products/categories/${category.id}`"
              class="hover:cursor-pointer hover:text-gray-800 text-gray-600 dark:hover:text-gray-200 dark:text-gray-400 max-sm:bg-gray-700 max-md:hover:bg-gray-600 font-bold p-2 w-full text-center rounded"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <div id="right" class="flex items-center">

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
                <NuxtLink to="/user/my-profile" class="block text-gray-800 dark:text-gray-200 font-medium p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                  Profile
                </NuxtLink>
                <NuxtLink v-if="hasAccessToDashboard" to="/admin/dashboard" class="block text-gray-800 dark:text-gray-200 font-medium p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
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
          <button @click="toggleMenu" class="sm:hidden flex items-center text-gray-800 dark:text-white">
            <Icon name="material-symbols:menu-rounded" class="text-black dark:text-white text-4xl" />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';
import { useApi } from '~/composables/userApi';

const categories = ref<{ 
  id: number,
  name: string
}[]>([]);
const authStore = useAuthStore();
const menuOpen = ref(false);
const userPopoverOpen = ref(false);
const user = ref<{ 
  fullname: string,
  username: string,
  email: string,
  role: [{
    id: number,
    name: string,
    slug: string,
    rolePermissions: [{
      id: number,
      permission: {
        id: number,
        name: string,
        slug: string,
      }
    }]
  }],
  balance: [{
    id: number,
    amount: number,
  }],
} | null>(null);

const hasAccessToDashboard = computed(() => {
  if (!user.value || !user.value.role) {
    return false;
  }

  // Handle if `role` is an object instead of an array
  const roles = Array.isArray(user.value.role) ? user.value.role : [user.value.role];

  const hasPermission = roles.some(role =>
    Array.isArray(role.rolePermissions) &&
    role.rolePermissions.some(rolePermission => rolePermission.permission.slug === 'access-dashboard')
  );

  return hasPermission;
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const toggleUserPopover = (event: MouseEvent) => {
  event.stopPropagation();
  userPopoverOpen.value = !userPopoverOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const userPopover = document.getElementById('user-popover');
  if (userPopover && !userPopover.contains(event.target as Node)) {
    userPopoverOpen.value = false;
  }
};

onMounted(async () => {
  await getCategories();
  await authStore.getUser();
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