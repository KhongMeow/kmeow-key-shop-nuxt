<template>
  <div>
    <nav class="w-full flex justify-center bg-gray-100 dark:bg-gray-800 shadow-lg fixed h-20 z-[99999]">
      <div class="max-w-[81rem] w-[80%] flex items-center justify-between">
        <div id="left" class="flex items-center">
          <div id="logo" class="px-2 flex items-center">
            <img @click="$router.push('/dashboard')" src="/assets/kmeowkeyshop_logo.png" alt="logo" class="hidden max-sm:block max-h-[2rem]" />
            <NuxtLink to="/dashboard" class="block max-sm:hidden dark:text-white font-bold text-2xl text-nowrap">K'meow Key shop</NuxtLink>
          </div>
          <!-- <div id="categories" class="px-2 flex max-sm:flex-col items-center gap-4 text-gray-800 dark:text-white font-medium">
            <NuxtLink v-for="category in categories" :to="`/categories/${category.name}`" class="hover:cursor-pointer hover:text-blue-500 font-bold">
              {{ category.name }}
            </NuxtLink>
          </div> -->

          <!-- Navigation Links -->
          <div
            id="nav-links"
            :class="[
              'lg:block flex flex-col items-center gap-4 p-2 text-gray-800 dark:text-white font-medium max-lg:pb-4 rounded-b-lg',
              menuOpen ? 'block' : 'hidden'
            ]"
            class="absolute lg:static top-20 left-0 w-full lg:w-auto bg-gray-100 dark:bg-gray-800 lg:bg-transparent"
          >
            <NuxtLink
              :to="`/dashboard/slides-show`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/dashboard/slides-show`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              Slides Show
            </NuxtLink>

            <NuxtLink
              :to="`/dashboard/categories`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/dashboard/categories`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              Categories
            </NuxtLink>

            <NuxtLink
              :to="`/dashboard/products`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/dashboard/products`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              Products
            </NuxtLink>

            <NuxtLink
              :to="`/dashboard/license-keys`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/dashboard/license-keys`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              License Keys
            </NuxtLink>
          </div>
        </div>

        <div id="right" class="flex items-center gap-x-4">

          <div id="user">
            <div class="flex items-center gap-4 justify-end">
              <div @click="toggleUserPopover" class="hover:cursor-pointer hover:text-gray-800 text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold flex items-center gap-1">
                <Icon name="mdi:account" class="text-4xl" />
                <p class="max-lg:hidden">{{ user?.fullname }}</p>
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

const isDark = ref(false);
const authStore = useAuthStore();
const menuOpen = ref(false);
const userPopoverOpen = ref(false);

// const user = ref<User | null>(null);
const user = computed(() => {
  if (!authStore.user) return null;
  return {
    fullname: authStore.user.fullname,
    username: authStore.user.username,
    email: authStore.user.email,
    role: Array.isArray(authStore.user.role)
      ? authStore.user.role.map(r => ({
          ...r,
          rolePermissions: r.rolePermissions ?? []
        }))
      : {
          ...authStore.user.role,
          rolePermissions: (authStore.user.role as any)?.rolePermissions ?? []
        }
  };
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
  userPopoverOpen.value = !userPopoverOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const userPopover = document.getElementById('user-popover');
  if (userPopover && !userPopover.contains(event.target as Node)) {
    userPopoverOpen.value = false;
  }

  const menu = document.getElementById('nav-links');
  const toggleMenu = document.getElementById('toggle-menu');
  if (toggleMenu && !toggleMenu.contains(event.target as Node) && menu && !menu.contains(event.target as Node)) {
    menuOpen.value = false;
  }
};

onMounted(async () => {
  // Initialize dark mode from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Apply theme
  updateTheme()

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