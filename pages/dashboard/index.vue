<template>
  <div>
    <h1 class="text-xl font-bold py-4">Dashboard</h1>

    <div v-if="authStore.isLoading">Loading...</div>
    <div v-else>
      <AreaChart
        :key="colorMode"
        :data="areaChartData"
        :height="300"
        :categories="categories"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :curve-type="curveType"
        :legend-position="legendPosition"
        :hide-legend="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore'
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'
// Import the enums from vue-chrts
import { CurveType, LegendPosition } from 'vue-chrts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard']
})

const authStore = useAuthStore()
const colorMode = useColorMode()

// Fetch daily stats from your Nest API
const { data: stats, pending } = await useAsyncData('dailyStats', () =>
  useApi('/license-keys/daily-stats', {
    method: 'GET'
  })
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

// Chart categories
const categories = computed(() => ({
  total: { name: 'Total Keys', color: '#3b82f6' },
  totalPrice: { name: 'Total Price', color: '#22c55e' },
}))

// Use the actual enums
const curveType = CurveType.MonotoneX
const legendPosition = LegendPosition.Top

const xFormatter = (tick: number, i: number, ticks: number[]): string => {
  return areaChartData.value[i]?.date ?? ''
}
</script>

<style scoped>
/* Add your styles here */
</style>