<template>
  <div>
    <NavBar />
    <div id="blank" class="h-20 mb-4"></div>
    <div class="w-full flex justify-center">
      <div class="max-w-[81rem] w-[80%]">
        <div class="px-2 sm:px-4 md:px-8 mx-auto">
          <h1 class="text-xl md:text-2xl font-bold py-4">My Profile</h1>
          <div class="flex flex-col md:flex-row gap-4 md:gap-6">
            <UserSidebarLeft />
            <main class="flex-1 w-full md:w-[70%]">
              <div class="w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-2 sm:p-4 md:p-8 mb-2 sm:mb-4 md:mb-6 overflow-x-auto">
                <slot />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">

</script>