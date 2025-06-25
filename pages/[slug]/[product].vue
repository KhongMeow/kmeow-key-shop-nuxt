<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
      <!-- Enhanced Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[80vh]">
        <div class="text-center px-4">
          <div class="relative mb-6 sm:mb-8">
            <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div class="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 border-4 sm:border-8 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin"></div>
              <div class="absolute inset-1 sm:inset-2 w-22 h-22 sm:w-28 sm:h-28 border-3 sm:border-6 border-transparent border-t-pink-400 border-l-cyan-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s"></div>
              <div class="absolute inset-3 sm:inset-6 w-18 h-18 sm:w-20 sm:h-20 border-2 sm:border-4 border-transparent border-t-yellow-400 border-b-green-400 rounded-full animate-spin" style="animation-duration: 2s"></div>
            </div>
          </div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-transparent mb-3">
            Loading Amazing Product
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">Preparing something special for you...</p>
          <div class="mt-4 sm:mt-6 flex justify-center gap-2">
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>

      <div v-else-if="product" class="max-w-8xl mx-auto">
        <!-- Floating Breadcrumb with Glassmorphism - Responsive -->
        <nav class="mb-8 sm:mb-10 lg:mb-12 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-white/40 dark:from-gray-800/40 dark:via-gray-800/60 dark:to-gray-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/60 dark:border-gray-700/60 shadow-2xl"></div>
          <ol class="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative z-10 overflow-x-auto">
            <li class="flex-shrink-0">
              <NuxtLink 
                to="/" 
                class="group flex items-center text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-all duration-300"
              >
                <Icon name="mdi:home-variant" class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                <span class="font-medium group-hover:font-semibold hidden sm:inline">Home</span>
              </NuxtLink>
            </li>
            <li class="flex-shrink-0"><Icon name="mdi:chevron-right" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /></li>
            <li class="flex-shrink-0">
              <NuxtLink 
                :to="`/${route.params.slug}`" 
                class="group text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-all duration-300 font-medium hover:font-semibold truncate max-w-[100px] sm:max-w-none"
              >
                {{ product.category?.name }}
              </NuxtLink>
            </li>
            <li class="flex-shrink-0"><Icon name="mdi:chevron-right" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /></li>
            <li class="text-gray-900 dark:text-white font-bold truncate min-w-0">
              {{ product.name }}
            </li>
          </ol>
        </nav>

        <!-- Main Product Section - Fully Responsive -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <!-- Product Image Section -->
          <div class="lg:col-span-1 xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            <!-- Main Image with 3D Effect -->
            <div class="group relative perspective-1000">
              <div class="relative transform-gpu transition-all duration-700 group-hover:rotate-y-6 lg:group-hover:rotate-y-12 preserve-3d">
                <div class="aspect-square bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-4xl transition-all duration-700 border border-gray-200/50 dark:border-gray-600/50 relative">
                  <!-- Shimmer Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <img 
                    :src="getImageUrl(product.image)" 
                    :alt="product.name"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  
                  <!-- Enhanced Out of Stock Overlay -->
                  <div v-if="product.stock === 0" class="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-800/50 to-transparent backdrop-blur-sm flex items-center justify-center">
                    <div class="text-center transform animate-pulse px-4">
                      <div class="bg-gradient-to-br from-red-500 to-red-600 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center shadow-2xl border-2 sm:border-4 border-red-400">
                        <Icon name="mdi:package-variant-closed" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                      </div>
                      <p class="text-white text-lg sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-red-400 backdrop-blur-sm">
                        Out of Stock
                      </p>
                    </div>
                  </div>

                  <!-- Floating Status Badges - Responsive -->
                  <div class="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 flex flex-col gap-2 sm:gap-3">
                    <!-- Stock Status -->
                    <div :class="[
                      'px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg sm:shadow-xl backdrop-blur-sm border border-opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2',
                      product.stock > 0 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-300' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300'
                    ]">
                      <Icon :name="product.stock > 0 ? 'mdi:check-circle' : 'mdi:close-circle'" class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      <span class="hidden sm:inline">{{ product.stock > 0 ? 'In Stock' : 'Sold Out' }}</span>
                      <span class="sm:hidden">{{ product.stock > 0 ? '✓' : '✗' }}</span>
                    </div>
                    
                    <!-- Featured Badge -->
                    <div class="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg sm:shadow-xl backdrop-blur-sm border border-purple-300 bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-1 sm:gap-2">
                      <Icon name="mdi:star" class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      <span class="hidden sm:inline">Featured</span>
                      <span class="sm:hidden">★</span>
                    </div>
                  </div>

                  <!-- Rating Badge - Responsive -->
                  <div class="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6">
                    <div class="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-lg sm:shadow-xl flex items-center gap-1 sm:gap-2">
                      <Icon name="mdi:star" class="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                      <span class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ product.scaleRating }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Information Section - Responsive -->
          <div class="lg:col-span-1 xl:col-span-2 space-y-6 sm:space-y-8">
            <!-- Product Header - Responsive -->
            <div class="space-y-4 sm:space-y-6">
              <div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black leading-tight mb-4 sm:mb-6">
                  <span class="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent animate-gradient">
                    {{ product.name }}
                  </span>
                </h1>
                
                <!-- Enhanced Rating Section - Responsive -->
                <div class="p-4 sm:p-6 bg-gradient-to-br from-white/80 via-indigo-50/80 to-purple-50/80 dark:from-gray-800/80 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg sm:shadow-xl">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div class="flex items-center gap-0.5 sm:gap-1">
                        <div 
                          v-for="star in 5" 
                          :key="star"
                          class="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 cursor-pointer transform hover:scale-125 transition-all duration-300"
                        >
                          <Icon 
                            name="mdi:star" 
                            class="absolute w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-300 dark:text-gray-600"
                          />
                          <div 
                            class="absolute overflow-hidden transition-all duration-500"
                            :style="{ width: getStarWidth(star, product.scaleRating) }"
                          >
                            <Icon 
                              name="mdi:star" 
                              class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-amber-400 drop-shadow-lg animate-pulse"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 sm:gap-3">
                        <span class="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">{{ product.scaleRating }}</span>
                        <span class="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">/5</span>
                      </div>
                    </div>
                    <div class="text-left sm:text-right">
                      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Based on</p>
                      <p class="text-sm sm:text-base lg:text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ ratings.length }} reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mega Price Section - Responsive -->
            <div class="relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl sm:rounded-4xl blur-xl"></div>
              <div class="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 rounded-3xl sm:rounded-4xl p-6 sm:p-8 border border-emerald-200/50 dark:border-emerald-700/50 shadow-xl sm:shadow-2xl">
                <div class="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full -translate-y-10 sm:-translate-y-16 lg:-translate-y-20 translate-x-10 sm:translate-x-16 lg:translate-x-20"></div>
                <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full translate-y-8 sm:translate-y-12 lg:translate-y-16 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16"></div>
                <div class="relative z-10">
                  <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                    <Icon name="mdi:currency-usd" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-emerald-600" />
                    <span class="text-sm sm:text-base lg:text-lg font-semibold text-emerald-700 dark:text-emerald-300">Best Price</span>
                  </div>
                  <div class="flex items-baseline gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3">
                    <span class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      ${{ product.price }}
                    </span>
                    <span class="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-bold">USD</span>
                  </div>
                  <div class="flex items-center gap-1 sm:gap-2">
                    <Icon name="mdi:shield-check" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    <p class="text-emerald-700 dark:text-emerald-300 font-bold text-sm sm:text-base lg:text-lg">Money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Stock Status - Responsive -->
            <div class="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-xl border border-gray-200/50 dark:border-gray-600/50">
              <div v-if="product.stock > 0" class="flex items-center gap-4 sm:gap-6">
                <div class="relative flex-shrink-0">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div class="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full animate-ping"></div>
                  <div class="absolute inset-0.5 sm:inset-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-300 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-emerald-600 dark:text-emerald-400 font-black text-lg sm:text-xl lg:text-2xl block">
                    {{ product.stock }} units available
                  </span>
                  <p class="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">⚡ Instant delivery after purchase</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="bg-emerald-100 dark:bg-emerald-900/30 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl">
                    <Icon name="mdi:truck-fast" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center gap-4 sm:gap-6">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:close" class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-red-600 dark:text-red-400 font-black text-lg sm:text-xl lg:text-2xl block">Out of stock</span>
                  <p class="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">🔔 Get notified when available</p>
                </div>
              </div>
            </div>

            <!-- Mega Purchase Section - Responsive -->
            <div class="bg-gradient-to-br from-white/90 via-indigo-50/50 to-purple-50/50 dark:from-gray-800/90 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-3xl sm:rounded-4xl p-6 sm:p-8 shadow-xl sm:shadow-2xl border border-gray-200/50 dark:border-gray-600/50 space-y-6 sm:space-y-8">
              <!-- Quantity Selector - Responsive -->
              <div class="space-y-3 sm:space-y-4">
                <label class="block text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                  Select Quantity
                </label>
                <div class="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-inner">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="group flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <Icon name="mdi:minus" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:scale-125 transition-transform" />
                  </button>
                  <div class="flex-1 text-center px-2 sm:px-4">
                    <span class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{{ quantity }}</span>
                  </div>
                  <button 
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                    class="group flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <Icon name="mdi:plus" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:scale-125 transition-transform" />
                  </button>
                </div>
              </div>

              <!-- Epic Add to Cart Button - Responsive -->
              <button 
                @click="addToCart"
                :disabled="product.stock === 0"
                class="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-black py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 rounded-2xl sm:rounded-3xl transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 shadow-xl sm:shadow-2xl hover:shadow-4xl transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-102 sm:hover:scale-105 disabled:transform-none border border-white/20"
              >
                <!-- Animated background -->
                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <!-- Button content -->
                <Icon name="solar:cart-plus-bold" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span class="text-sm sm:text-lg lg:text-2xl z-10">
                  {{ product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart` }}
                </span>
                
                <!-- Floating particles effect -->
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div class="absolute top-1 sm:top-2 left-2 sm:left-4 w-1 h-1 sm:w-2 sm:h-2 bg-yellow-300 rounded-full animate-bounce"></div>
                  <div class="absolute top-2 sm:top-4 right-3 sm:right-6 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="absolute bottom-1.5 sm:bottom-3 left-4 sm:left-8 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-cyan-300 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </button>

              <!-- Purchase Benefits - Responsive -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                  <Icon name="mdi:shield-check" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0" />
                  <span class="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Secure Payment</span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                  <Icon name="mdi:lightning-bolt" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 flex-shrink-0" />
                  <span class="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Product Information Tabs - Responsive -->
        <div class="bg-gradient-to-br from-white/90 via-gray-50/50 to-white/90 dark:from-gray-800/90 dark:via-gray-700/50 dark:to-gray-800/90 backdrop-blur-xl rounded-3xl sm:rounded-4xl shadow-xl sm:shadow-2xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
          <!-- Tab Navigation - Responsive -->
          <div class="border-b border-gray-200/50 dark:border-gray-600/50 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-gray-700/50">
            <nav class="flex overflow-x-auto scrollbar-hide">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex-shrink-0 px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 text-xs sm:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 relative overflow-hidden min-w-0',
                  activeTab === tab.id 
                    ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50 dark:hover:from-gray-700/50 dark:hover:to-indigo-900/20'
                ]"
              >
                <!-- Active tab indicator -->
                <div 
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"
                ></div>
                
                <Icon :name="tab.icon" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 hover:scale-110 flex-shrink-0" />
                <span class="text-sm sm:text-base lg:text-lg whitespace-nowrap">{{ tab.label }}</span>
              </button>
            </nav>
          </div>
          
          <!-- Tab Content - Responsive -->
          <div class="p-6 sm:p-8 lg:p-10">
            <Transition name="slide-fade" mode="out-in">
              <div :key="activeTab" class="space-y-6 sm:space-y-8">
                <template v-if="activeTab === 'details'">
                  <div class="space-y-4 sm:space-y-6">
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-800 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                      Product Details
                    </h3>
                    <div class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
                      <p class="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ product.detail }}
                      </p>
                    </div>
                  </div>
                </template>
                
                <template v-else-if="activeTab === 'description'">
                  <div class="space-y-4 sm:space-y-6">
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                      Description
                    </h3>
                    <div class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
                      <p class="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ product.description }}
                      </p>
                    </div>
                  </div>
                </template>
                
                <template v-else-if="activeTab === 'category'">
                  <div class="space-y-4 sm:space-y-6">
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-green-800 dark:from-white dark:to-green-200 bg-clip-text text-transparent">
                      Category
                    </h3>
                    <NuxtLink 
                      :to="`/${route.params.slug}`"
                      class="group inline-flex items-center gap-3 sm:gap-4 p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 text-indigo-700 dark:text-indigo-300 rounded-2xl sm:rounded-3xl hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 dark:hover:from-indigo-900/40 dark:hover:via-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-500 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:scale-102 sm:hover:scale-105"
                    >
                      <div class="p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon name="mdi:folder-star" class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <span class="font-black text-lg sm:text-xl lg:text-2xl block truncate">{{ product.category?.name }}</span>
                        <span class="text-xs sm:text-sm opacity-75">Explore more products</span>
                      </div>
                      <Icon name="mdi:arrow-right" class="w-5 h-5 sm:w-6 sm:h-6 ml-auto group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform flex-shrink-0" />
                    </NuxtLink>
                  </div>
                </template>

                <template v-else-if="activeTab === 'ratings'">
                  <div class="space-y-8 sm:space-y-10">
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-pink-800 dark:from-white dark:to-pink-200 bg-clip-text text-transparent">
                      Ratings & Reviews
                    </h3>
                    
                    <!-- Enhanced Rating Form - Responsive -->
                    <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg sm:shadow-xl">
                      <h4 class="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <Icon name="mdi:star-circle" class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500" />
                        <span class="truncate">Share Your Experience</span>
                      </h4>
                      
                      <form @submit.prevent="submitRating" class="space-y-6 sm:space-y-8">
                        <!-- Enhanced Rating Stars - Responsive -->
                        <div class="space-y-3 sm:space-y-4">
                          <label class="block text-sm sm:text-base lg:text-lg font-bold text-gray-700 dark:text-gray-300">
                            Your Rating
                          </label>
                          <div class="flex items-center gap-2 sm:gap-3 justify-center p-4 sm:p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl sm:rounded-2xl">
                            <button
                              v-for="star in 5"
                              :key="star"
                              type="button"
                              @click="setRating(star)"
                              @mouseover="hoverRating = star"
                              @mouseleave="hoverRating = 0"
                              class="transform hover:scale-110 sm:hover:scale-125 transition-all duration-300 hover:rotate-6 sm:hover:rotate-12"
                            >
                              <Icon
                                name="mdi:star"
                                :class="[
                                  'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-all duration-300 drop-shadow-lg',
                                  (hoverRating || userRating.rating) >= star
                                    ? 'text-amber-400 animate-pulse'
                                    : 'text-gray-300 dark:text-gray-600 hover:text-amber-200'
                                ]"
                              />
                            </button>
                            <span v-if="userRating.rating" class="ml-2 sm:ml-4 text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                              {{ userRating.rating }}/5
                            </span>
                          </div>
                        </div>

                        <!-- Enhanced Comment - Responsive -->
                        <div class="space-y-3 sm:space-y-4">
                          <label class="block text-sm sm:text-base lg:text-lg font-bold text-gray-700 dark:text-gray-300">
                            Your Review (Optional)
                          </label>
                          <textarea
                            v-model="userRating.comment"
                            rows="4"
                            placeholder="Tell us about your experience with this product..."
                            class="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 text-sm sm:text-base lg:text-lg backdrop-blur-sm resize-none"
                          ></textarea>
                        </div>

                        <!-- Epic Submit Button - Responsive -->
                        <button
                          type="submit"
                          :disabled="!userRating.rating || isSubmittingRating"
                          class="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-black py-4 sm:py-6 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:scale-102 disabled:transform-none"
                        >
                          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <Icon 
                            :name="isSubmittingRating ? 'mdi:loading' : 'mdi:send'" 
                            :class="[
                              'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 z-10',
                              isSubmittingRating ? 'animate-spin' : 'group-hover:rotate-6 sm:group-hover:rotate-12 transition-transform'
                            ]"
                          />
                          <span class="z-10 text-sm sm:text-base lg:text-xl">
                            {{ isSubmittingRating ? 'Submitting...' : 'Submit Review' }}
                          </span>
                        </button>
                      </form>
                    </div>

                    <!-- Enhanced Existing Ratings - Responsive -->
                    <div class="space-y-6 sm:space-y-8">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h4 class="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                          Customer Reviews
                        </h4>
                        <div class="text-left sm:text-right">
                          <span class="text-sm sm:text-base lg:text-lg font-bold text-indigo-600 dark:text-indigo-400 block">
                            {{ ratings.length }} review{{ ratings.length !== 1 ? 's' : '' }}
                          </span>
                          <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Verified purchases</span>
                        </div>
                      </div>

                      <div v-if="loadingRatings" class="flex justify-center py-8 sm:py-12">
                        <div class="relative">
                          <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-2 sm:border-4 border-indigo-200 border-t-indigo-600"></div>
                          <div class="absolute inset-1 sm:inset-2 animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 sm:border-4 border-purple-200 border-t-purple-600" style="animation-direction: reverse"></div>
                        </div>
                      </div>

                      <div v-else-if="ratings.length === 0" class="text-center py-12 sm:py-16">
                        <div class="mb-6 sm:mb-8">
                          <Icon name="mdi:comment-multiple-outline" class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 dark:text-gray-600 mx-auto animate-bounce" />
                        </div>
                        <h5 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">No reviews yet</h5>
                        <p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">Be the first to share your experience!</p>
                      </div>

                      <div v-else class="space-y-4 sm:space-y-6">
                        <div
                          v-for="rating in ratings"
                          :key="rating.id"
                          class="group bg-gradient-to-br from-white/80 via-gray-50/80 to-white/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102"
                        >
                          <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            <!-- Enhanced User Avatar - Responsive -->
                            <div class="flex-shrink-0 self-center sm:self-start">
                              <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                                {{ rating.user?.username?.charAt(0).toUpperCase() || 'U' }}
                              </div>
                            </div>

                            <div class="flex-1 min-w-0 w-full sm:w-auto">
                              <!-- Enhanced User Info and Rating - Responsive -->
                              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div class="min-w-0">
                                  <h5 class="font-black text-lg sm:text-xl text-gray-900 dark:text-white truncate">
                                    {{ rating.user?.username || 'Anonymous' }}
                                  </h5>
                                  <div class="flex items-center gap-1 sm:gap-2 mt-2">
                                    <Icon
                                      v-for="star in 5"
                                      :key="star"
                                      name="mdi:star"
                                      :class="[
                                        'w-4 h-4 sm:w-5 sm:h-5',
                                        star <= rating.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
                                      ]"
                                    />
                                    <span class="ml-1 sm:ml-2 text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                                      {{ rating.rating }}/5
                                    </span>
                                  </div>
                                </div>
                                <div class="text-left sm:text-right flex-shrink-0">
                                  <time class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full">
                                    {{ formatDate(rating.createdAt) }}
                                  </time>
                                </div>
                              </div>

                              <!-- Enhanced Comment - Responsive -->
                              <p v-if="rating.comment" class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg font-medium bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                                {{ rating.comment }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Enhanced 404 Section - Responsive -->
      <div v-else class="flex justify-center items-center min-h-[80vh]">
        <div class="text-center max-w-4xl mx-auto px-4 sm:px-6">
          <!-- Epic 404 Illustration - Responsive -->
          <div class="relative mb-12 sm:mb-16">
            <!-- Floating background elements -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-indigo-200/30 via-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <!-- Main container with floating elements -->
            <div class="relative inline-block">
              <!-- Large 404 text with gradient - Responsive -->
              <div class="text-[6rem] sm:text-[8rem] lg:text-[12rem] xl:text-[14rem] font-black text-transparent bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-200 dark:from-indigo-800 dark:via-purple-700 dark:to-pink-800 bg-clip-text opacity-20 select-none animate-pulse">
                404
              </div>
              
              <!-- Floating animated elements - Responsive -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative animate-float">
                  <!-- Main icon with enhanced styling -->
                  <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <Icon name="mdi:package-variant-closed-remove" class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" />
                  </div>
                  
                  <!-- Enhanced floating particles - Responsive -->
                  <div class="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg"></div>
                  <div class="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 0.5s"></div>
                  <div class="absolute top-1 sm:top-2 left-12 sm:left-16 lg:left-20 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 1s"></div>
                  <div class="absolute -top-2 sm:-top-4 left-6 sm:left-8 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full animate-bounce shadow-lg" style="animation-delay: 1.5s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced error message content - Responsive -->
          <div class="space-y-8 sm:space-y-12">
            <!-- Main heading -->
            <div class="space-y-4 sm:space-y-6">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                Oops! Product Lost in Space
              </h1>
              <p class="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
                The product you're searching for has taken an unexpected journey into the digital cosmos. Let's help you navigate back to amazing deals!
              </p>
            </div>

            <!-- Enhanced helpful suggestions - Responsive -->
            <div class="bg-gradient-to-br from-white/80 via-gray-50/80 to-white/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 backdrop-blur-xl rounded-3xl sm:rounded-4xl p-8 sm:p-10 lg:p-12 shadow-xl sm:shadow-2xl border border-gray-200/50 dark:border-gray-600/50">
              <h3 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-8 sm:mb-10">What would you like to do?</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <!-- Enhanced go back button - Responsive -->
                <button 
                  @click="$router.go(-1)"
                  class="group flex items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl sm:rounded-3xl transition-all duration-500 transform hover:scale-102 sm:hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl border border-white/20"
                >
                  <Icon name="mdi:arrow-left-circle" class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-transform group-hover:-translate-x-1 sm:group-hover:-translate-x-2 group-hover:scale-110" />
                  <div class="text-left">
                    <span class="font-black text-lg sm:text-xl lg:text-2xl block">Go Back</span>
                    <span class="text-xs sm:text-sm opacity-90">Return to previous page</span>
                  </div>
                </button>

                <!-- Enhanced browse all products - Responsive -->
                <NuxtLink 
                  to="/"
                  class="group flex items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl sm:rounded-3xl transition-all duration-500 transform hover:scale-102 sm:hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl border border-white/20"
                >
                  <Icon name="mdi:view-grid-plus" class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <div class="text-left">
                    <span class="font-black text-lg sm:text-xl lg:text-2xl block">Browse Products</span>
                    <span class="text-xs sm:text-sm opacity-90">Discover amazing deals</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/products';
import type { RatingProduct } from '~/types/rating-products';
import { useCartStore } from '~/store/cartStore';

const product = ref<Product | null>(null);
const quantity = ref(1);
const activeTab = ref('details');
const route = useRoute();
const config = useRuntimeConfig();
const isLoading = ref(false);

const cartStore = useCartStore();

// Rating-related reactive state
const ratings = ref<RatingProduct[]>([]);
const loadingRatings = ref(false);
const isSubmittingRating = ref(false);
const hoverRating = ref(0);
const userRating = ref({
  rating: 0,
  comment: ''
});

const tabs = [
  { id: 'details', label: 'Details', icon: 'mdi:information' },
  { id: 'description', label: 'Description', icon: 'mdi:text-box' },
  { id: 'category', label: 'Category', icon: 'mdi:folder' },
  { id: 'ratings', label: 'Ratings', icon: 'mdi:star' }
];

function getImageUrl(image: string | undefined) {
  if (!image) return '';
  return config.public.API_BASE_URL + image;
}

const getStarWidth = (starIndex: number, rating: number) => {
  if (rating >= starIndex) {
    return '100%';
  } else if (rating > starIndex - 1) {
    return `${(rating - (starIndex - 1)) * 100}%`;
  } else {
    return '0%';
  }
};

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addToCart(product.value.slug, quantity.value);
    // You could add a toast notification here
  }
};

const setRating = (rating: number) => {
  userRating.value.rating = rating;
};

const submitRating = async () => {
  if (!userRating.value.rating || !product.value) return;
  
  try {
    isSubmittingRating.value = true;
    
    const response = await useApi(`/rating-products/${product.value.slug}`, {
      method: 'POST',
      data: {
        rating: userRating.value.rating,
        comment: userRating.value.comment || null
      }
    });

    // Reset form
    userRating.value = { rating: 0, comment: '' };
    
    // Refresh ratings and product data
    await Promise.all([getRatings(), getProduct()]);
    
    // Show success message (you can implement toast notifications)
    console.log('Rating submitted successfully');
    
  } catch (error) {
    console.error('Failed to submit rating:', error);
    // Handle error (show toast notification)
  } finally {
    isSubmittingRating.value = false;
  }
};

const getRatings = async () => {
  if (!product.value) return;
  
  try {
    loadingRatings.value = true;
    const response = await useApi<RatingProduct[]>(`/rating-products/product/${product.value.slug}`, {
      method: 'GET'
    });
    ratings.value = response;
  } catch (error) {
    console.error('Failed to get ratings:', error);
  } finally {
    loadingRatings.value = false;
  }
};

const getProduct = async () => {
  const categorySlug = route.params.slug;
  const productSlug = route.params.product;
  
  const response = await useApi<Product>(`/products/${categorySlug}/${productSlug}`, {
    method: 'GET'
  });

  product.value = response;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await getProduct();
    await getRatings();
  } catch (err) {
    console.error('Failed to get product:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Enhanced animations and transitions */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

/* Custom utilities */
.rounded-4xl {
  border-radius: 2rem;
}

.shadow-4xl {
  box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.25);
}

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.rotate-y-12 {
  transform: rotateY(12deg);
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Glassmorphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

.backdrop-blur-3xl {
  backdrop-filter: blur(24px);
}

/* Enhanced blur */
.blur-3xl {
  filter: blur(64px);
}
</style>