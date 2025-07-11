<template>
  <div class="py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
          Top Up Your Wallet
        </h1>
        <p class="text-gray-400 text-lg max-w-md mx-auto">
          Add funds to your account balance securely and instantly
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-start">
        <!-- Top-up Form Card -->
        <div class="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <form @submit.prevent="proceedToPayment" class="p-6 md:p-8 space-y-8">
            <!-- Amount Input -->
            <div class="space-y-4">
              <label class="block text-sm font-semibold text-gray-300 mb-3">
                Amount to Top Up
              </label>
              <div class="relative group">
                <span class="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-semibold z-10">$</span>
                <input
                  v-model="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  class="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl py-2 pl-10 md:pl-12 pr-4 md:pr-6 text-white text-xl md:text-2xl font-semibold placeholder-gray-500 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-500"
                />
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="space-y-4">
              <label class="block text-sm font-semibold text-gray-300 mb-4">
                Quick Select
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                <button 
                  v-for="quickAmount in quickAmounts" 
                  :key="quickAmount"
                  type="button"
                  :class="[
                    'group relative py-3 md:py-4 px-3 md:px-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95',
                    amount == quickAmount 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500 hover:text-white'
                  ]"
                  @click="selectAmount(quickAmount)"
                >
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative">${{ quickAmount }}</span>
                </button>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="bg-gradient-to-r from-gray-700/30 to-gray-600/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-600/50">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Payment Summary
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-400">Amount:</span>
                  <span class="text-white font-semibold text-lg">${{ formatAmount(amount) }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-400 flex items-center">
                    Processing Fee:
                    <svg class="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>
                  <span class="text-white font-semibold">${{ processingFee }}</span>
                </div>
                <div class="border-t border-gray-600 pt-3 mt-3">
                  <div class="flex justify-between items-center">
                    <span class="text-white font-bold text-lg">Total:</span>
                    <span class="text-blue-400 font-bold text-xl md:text-2xl">${{ total }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top-up Button -->
            <button 
              :disabled="!isValidAmount || isProcessing"
              :class="[
                'w-full font-bold py-4 md:py-5 px-6 md:px-8 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 transform hover:scale-[1.02] disabled:hover:scale-100 active:scale-95',
                isValidAmount && !isProcessing
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500/50'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none'
              ]"
            >
              <span v-if="!isProcessing" class="flex items-center justify-center text-base md:text-lg">
                <svg class="w-5 h-5 md:w-6 md:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                Proceed to Payment
              </span>
              <span v-else class="flex items-center justify-center text-base md:text-lg">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 md:h-6 md:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            </button>
          </form>
        </div>

        <!-- QR Code & Payment Methods Section -->
        <div class="space-y-6">
          <!-- QR Code Card -->
          <div class="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div class="p-6 md:p-8">
              <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-white mb-4">Quick Pay</h3>
                <p class="text-gray-400">Scan to pay instantly</p>
              </div>
              <div class="flex justify-center">
                <div class="bg-white p-4 rounded-2xl shadow-lg relative aspect-square flex items-center justify-center ">
                  <p class="text-black font-bold text-lg">QR Code Placeholder</p>
                </div>
              </div>
              <div class="mt-6 text-center">
                <p class="text-md text-gray-400">Scan with your mobile payment with KHQR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security & Info Cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <!-- Security Notice -->
        <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-600/40 rounded-2xl p-6 backdrop-blur-sm">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-green-300 font-bold text-lg">Secure Payment</div>
              <div class="text-green-400 text-sm mt-1">Protected with 256-bit SSL encryption and PCI compliance</div>
            </div>
          </div>
        </div>

        <!-- Instant Processing -->
        <div class="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-600/40 rounded-2xl p-6 backdrop-blur-sm">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-blue-300 font-bold text-lg">Instant Processing</div>
              <div class="text-blue-400 text-sm mt-1">Funds are added to your account immediately after payment</div>
            </div>
          </div>
        </div>

        <!-- 24/7 Support -->
        <div class="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-600/40 rounded-2xl p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-purple-300 font-bold text-lg">24/7 Support</div>
              <div class="text-purple-400 text-sm mt-1">Get help anytime with our dedicated support team</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

const amount = ref<number | null>(null);
const isProcessing = ref(false);

const quickAmounts = ref([10, 25, 50, 100, 200, 500]);

const processingFee = computed(() => {
  if (!amount.value) return '0.00';
  return (amount.value * 0.029 + 0.30).toFixed(2); // More realistic fee structure
});

const total = computed(() => {
  if (!amount.value) return '0.00';
  return (amount.value + parseFloat(processingFee.value)).toFixed(2);
});

const isValidAmount = computed(() => {
  return amount.value && amount.value >= 1 && amount.value <= 10000;
});

const formatAmount = (value: number | null) => {
  if (!value) return '0.00';
  return value.toFixed(2);
};

const selectAmount = (selectedAmount: number) => {
  amount.value = selectedAmount;
};

const proceedToPayment = async () => {
  if (!isValidAmount.value) return;
  
  isProcessing.value = true;
  
  try {
    // console.log(`Processing payment for amount: $${amount.value!}`);
    
    await useAuthStore().increaseBalance(amount.value!);
  } catch (error) {
    console.error('Payment processing failed:', error);
    // Handle error (show toast, etc.)
  } finally {
    isProcessing.value = false;
  }
};

// Auto-focus amount input on mount
onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  });
});
</script>

<style scoped>
/* Enhanced scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #4f46e5, #7c3aed);
}

/* Custom number input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Subtle animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > * {
  animation: fadeInUp 0.6s ease-out forwards;
}

.grid > *:nth-child(1) {
  animation-delay: 0.1s;
}

.grid > *:nth-child(2) {
  animation-delay: 0.2s;
}

.grid > *:nth-child(3) {
  animation-delay: 0.3s;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-2 {
    gap: 0.75rem;
  }
  
  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}

/* Hover effects for touch devices */
@media (hover: none) {
  .hover\:scale-105:hover {
    transform: none;
  }
  
  .hover\:scale-\[1\.02\]:hover {
    transform: none;
  }
}
</style>