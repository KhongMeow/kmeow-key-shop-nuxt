<template>
  <div class="flex-1 divide-y divide-accented w-full shadow-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-800 p-4 rounded-xl">
    <header class="flex items-center justify-between border-b border-default p-4">
      <h1 class="text-xl font-bold">{{ 'Dashboard' }}</h1>
    </header>
    <div class="flex-1 max-md:flex-col items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <USelectMenu
        v-model="selectedGroup"
        placeholder="Group by"
        :items="groupByOptions"
        option-attribute="label"
        value-attribute="value"
        class="w-48 max-md:w-full"
      />

      <div class="w-full p-4">
        <div v-if="pending" class="flex justify-center items-center h-[300px]">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <AreaChart
          v-else
          :key="`${colorMode}-${selectedGroup.value}`"
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
  const res = await useApi('/license-keys/stats/' + selectedGroup.value.value, {
    method: 'GET'
  })
  stats.value = res
  pending.value = false
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

// Chart categories
const categories = computed(() => ({
  total: { name: 'Total Keys', color: '#3b82f6' },
  totalPrice: { name: 'Total Price ($)', color: '#22c55e' },
}))

// Use the actual enums
const curveType = CurveType.MonotoneX
const legendPosition = LegendPosition.Top

const xFormatter = (tick: number, i: number, ticks: number[]): string => {
  return areaChartData.value[i]?.date ?? ''
}
</script>

<style scoped>

</style>