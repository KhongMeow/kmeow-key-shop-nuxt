<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Slides Show' }}</h1>
      <USelectMenu
        v-model="groupBy"
        placeholder="Group by"
        :items="groupByOptions"
        class="w-48 max-md:w-full"
      />
    </header>

    <div class="w-full p-4">
      <AreaChart
        :key="colorMode + groupBy"
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
import { computed, ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { CurveType, LegendPosition } from 'vue-chrts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'dashboard']
})

const colorMode = useColorMode()

const groupByOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' }
]
const groupBy = ref(groupByOptions[0])

// Fetch daily stats from your Nest API
const { data: stats, pending } = await useAsyncData('dailyStats', () =>
  useApi('/license-keys/daily-stats', {
    method: 'GET'
  })
)

// Helper to get week number
function getWeek(dateStr: string) {
  const date = new Date(dateStr)
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.valueOf() - firstDay.valueOf()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7)
}

// Prepare chart data
const areaChartData = computed(() => {
  let raw: any[] = []
  if (Array.isArray(stats.value)) {
    raw = stats.value
  } else if (stats.value && Array.isArray((stats.value as any).data)) {
    raw = (stats.value as any).data
  }
  const byGroup: Record<string, { date: string; total: number; totalPrice: number }> = {}
  for (const row of raw) {
    let key = row.date
    const groupValue = groupBy.value?.value || 'day'
    if (groupValue === 'week') {
      const week = getWeek(row.date)
      const year = new Date(row.date).getFullYear()
      key = `${year}-W${week}`
    } else if (groupValue === 'month') {
      const d = new Date(row.date)
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    } else if (groupValue === 'year') {
      key = String(new Date(row.date).getFullYear())
    }
    if (!byGroup[key]) {
      byGroup[key] = { date: key, total: 0, totalPrice: 0 }
    }
    byGroup[key].total += Number(row.total) || 0
    byGroup[key].totalPrice += Number(row.totalPrice) || 0
  }
  // Sort by group key ascending
  return Object.values(byGroup).sort((a, b) => a.date.localeCompare(b.date))
})

const categories = computed(() => ({
  total: { name: 'Total Keys', color: '#3b82f6' },
  totalPrice: { name: 'Total Price', color: '#22c55e' },
}))

const curveType = CurveType.MonotoneX
const legendPosition = LegendPosition.Top

const xFormatter = (tick: number, i: number, ticks: number[]): string => {
  return areaChartData.value[i]?.date ?? ''
}
</script>