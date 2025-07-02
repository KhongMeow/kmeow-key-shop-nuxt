<template>
  <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
    
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Analytics Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Track your license key sales and revenue over time
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Keys Sold</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalKeysSold.toLocaleString() }}
            </p>
          </div>
          <div class="flex justify-center items-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Icon name="heroicons:key" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              ${{ totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </p>
          </div>
          <div class="flex justify-center items-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              ${{ averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </p>
          </div>
          <div class="flex justify-center items-center p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Icon name="heroicons:chart-bar" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ growthRate >= 0 ? '+' : '' }}{{ growthRate.toFixed(1) }}%
            </p>
          </div>
          <div class="flex justify-center items-center p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Icon 
              :name="growthRate >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
              :class="growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              class="w-6 h-6"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Chart Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Sales Analytics
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visualize your sales data over time
            </p>
          </div>
          
          <!-- Controls -->
          <div class="flex items-center gap-3">
            <USelectMenu
              v-model="selectedGroup"
              placeholder="Group by"
              :items="groupByOptions"
              option-attribute="label"
              value-attribute="value"
              class="w-40"
            >
              <template #leading>
                <Icon name="heroicons:calendar" class="w-4 h-4" />
              </template>
            </USelectMenu>
            
            <UButton
              @click="fetchStats"
              :loading="pending"
              variant="outline"
              size="sm"
              icon="heroicons:arrow-path"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </div>

      <!-- Chart Content -->
      <div class="p-6">
        <div v-if="pending" class="flex flex-col justify-center items-center h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Loading analytics data...</p>
        </div>
        
        <div v-else-if="!areaChartData.length" class="flex flex-col justify-center items-center h-[400px] text-center">
          <Icon name="heroicons:chart-bar-square" class="w-16 h-16 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            No sales data found for the selected time period.
          </p>
        </div>
        
        <AreaChart
          v-else
          :key="`${colorMode}-${selectedGroup.value}`"
          :data="areaChartData"
          :height="400"
          :categories="categories"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :curve-type="curveType"
          :legend-position="legendPosition"
          :hide-legend="false"
          class="w-full"
        />
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Stats
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600 dark:text-gray-400">Time Period</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ selectedGroup.label }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600 dark:text-gray-400">Data Points</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ areaChartData.length }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600 dark:text-gray-400">Last Updated</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ lastUpdated }}</span>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Data
        </h3>
        <div class="space-y-3">
          <UButton
            block
            variant="outline"
            icon="heroicons:document-arrow-down"
            @click="exportData('csv')"
          >
            Export as CSV
          </UButton>
          <UButton
            block
            variant="outline"
            icon="heroicons:document-chart-bar"
            @click="exportData('json')"
          >
            Export as JSON
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { CurveType, LegendPosition } from 'vue-chrts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard']
})

const groupByOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const selectedGroup = ref(groupByOptions[0])
const colorMode = useColorMode()
const stats = ref<any>([])
const pending = ref(false)

async function fetchStats() {
  pending.value = true
  try {
    const res = await useApi('/license-keys/stats/' + selectedGroup.value.value, {
      method: 'GET'
    })
    stats.value = res
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    pending.value = false
  }
}

// Fetch on mount and when selectedGroup changes
watch(
  () => selectedGroup.value,
  fetchStats,
  { immediate: true }
)

// Prepare chart data
const areaChartData = computed(() => {
  let raw: any[] = []
  if (Array.isArray(stats.value)) {
    raw = stats.value
  } else if (stats.value && Array.isArray((stats.value as any).data)) {
    raw = (stats.value as any).data
  }
  
  // Aggregate by date
  const byDate: Record<string, { date: string; total: number; totalPrice: number }> = {}
  for (const row of raw) {
    if (!byDate[row.date]) {
      byDate[row.date] = { date: row.date, total: 0, totalPrice: 0 }
    }
    byDate[row.date].total += Number(row.total) || 0
    byDate[row.date].totalPrice += Number(row.totalPrice) || 0
  }
  
  // Sort by date ascending
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
})

// Computed stats
const totalKeysSold = computed(() => 
  areaChartData.value.reduce((sum, item) => sum + item.total, 0)
)

const totalRevenue = computed(() => 
  areaChartData.value.reduce((sum, item) => sum + item.totalPrice, 0)
)

const averagePrice = computed(() => 
  totalKeysSold.value > 0 ? totalRevenue.value / totalKeysSold.value : 0
)

const growthRate = computed(() => {
  if (areaChartData.value.length < 2) return 0
  const recent = areaChartData.value.slice(-2)
  const [prev, current] = recent
  if (!prev || !current || prev.totalPrice === 0) return 0
  return ((current.totalPrice - prev.totalPrice) / prev.totalPrice) * 100
})

const lastUpdated = computed(() => {
  return new Date().toLocaleString()
})

// Chart configuration
const categories = computed(() => ({
  total: { name: 'Total Keys', color: '#3b82f6' },
  totalPrice: { name: 'Total Price ($)', color: '#22c55e' },
}))

const curveType = CurveType.MonotoneX
const legendPosition = LegendPosition.Top

const xFormatter = (tick: number, i: number, ticks: number[]): string => {
  return areaChartData.value[i]?.date ?? ''
}

// Export functionality
function exportData(format: 'csv' | 'json') {
  const data = areaChartData.value
  let content = ''
  let filename = `sales-data-${selectedGroup.value.value}-${new Date().toISOString().split('T')[0]}`
  
  if (format === 'csv') {
    const headers = 'Date,Total Keys,Total Price\n'
    const rows = data.map(item => `${item.date},${item.total},${item.totalPrice}`).join('\n')
    content = headers + rows
    filename += '.csv'
  } else {
    content = JSON.stringify(data, null, 2)
    filename += '.json'
  }
  
  const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>