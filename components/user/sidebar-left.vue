<template>
  <!-- Sidebar -->
  <aside
    class="group flex flex-col items-center md:items-stretch transition-all duration-200 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-2 md:p-4 h-fit"
  >
    <nav class="flex flex-col gap-2 w-full">
      <button
        
        class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
        :class="$route.path.startsWith(`/user/update-profile`) ? 'bg-gray-200 dark:bg-gray-700' : ''"
        @click="$router.push('/user/update-profile')"
        title="Profile Information"
      >
        <!-- Icon -->
        <Icon name="mdi:account-circle-outline" class="h-6 w-6 flex-shrink-0" />
        <!-- Text, hidden by default, shown on hover or md+ -->
        <span class="md:inline transition-all text-nowrap">Profile Information</span>
      </button>
      <button
        class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
        :class="$route.path.startsWith(`/user/my-orders`) ? 'bg-gray-200 dark:bg-gray-700' : ''"
        @click="$router.push('/user/my-orders')"
        title="My Orders"
      >
        <!-- Icon -->
        <Icon name="mdi:cart-outline" class="h-6 w-6 flex-shrink-0" />
        <!-- Text, hidden by default, shown on hover or md+ -->
        <span class="md:inline transition-all text-nowrap">My Orders</span>
      </button>
      <button
        class="flex items-center gap-3 py-2 px-2 md:px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition text-left w-full"
        :class="$route.path.startsWith(`/user/change-password`) ? 'bg-gray-200 dark:bg-gray-700' : ''"
        @click="$router.push('/user/change-password')"
        title="Change Password"
      >
        <!-- Icon -->
        <Icon name="mdi:lock-outline" class="h-6 w-6 flex-shrink-0" />
        <span class="md:inline transition-all text-nowrap">Change Password</span>
      </button>
    </nav>
  </aside>
</template>