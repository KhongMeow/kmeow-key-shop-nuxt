<template>
  <div>
    <nav class="w-full flex justify-center bg-gray-100 dark:bg-gray-800 shadow-lg fixed h-20 z-[99999]">
      <div class="max-w-[81rem] w-[80%] flex items-center justify-between">
        <div id="left" class="flex items-center">
          <div id="logo" class="px-2 flex items-center">
            <img @click="$router.push('/users-setting')" src="/assets/kmeowkeyshop_logo.png" alt="logo" class="hidden max-sm:block max-h-[2rem]" />
            <NuxtLink to="/users-setting" class="block max-sm:hidden dark:text-white font-bold text-2xl text-nowrap">K'meow Key shop</NuxtLink>
          </div>

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
              :to="`/users-setting/roles`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/users-setting/roles`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              Roles
            </NuxtLink>

            <NuxtLink
              :to="`/users-setting/role-permissions`"
              @click="closeMenu"
              :class="[
                'hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 max-lg:hover:bg-gray-300 max-lg:dark:hover:bg-gray-500 font-bold p-2 w-full text-center rounded',
                $route.path.startsWith(`/users-setting/role-permissions`) ? 'text-gray-700 dark:text-gray-300 max-lg:bg-gray-400 max-lg:dark:bg-gray-600' : 'text-gray-600 dark:text-gray-400 max-lg:bg-gray-200 max-lg:dark:bg-gray-700'
              ]"
            >
              Role Permissions
            </NuxtLink>
          </div>
        </div>

        <div id="right" class="flex items-center">

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
                  to="/user/my-profile"
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
import { useApi } from '~/composables/useApi';

const categories = ref<{ 
  id: number,
  name: string,
  slug: string,
}[]>([]);
const authStore = useAuthStore();
const menuOpen = ref(false);
const userPopoverOpen = ref(false);
type RolePermission = {
  permission: {
    slug: string;
  };
};

type Role = {
  rolePermissions: RolePermission[];
};

type User = {
  fullname: string;
  username: string;
  email: string;
  role: Role | Role[];
};

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
  await getCategories();
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