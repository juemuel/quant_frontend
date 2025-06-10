<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'
const props = defineProps<{
  annuals: string[]
  indexIncomes: number[]
  trendIncomes: number[]
}>()
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
watch(
  () => [props.annuals, props.indexIncomes, props.trendIncomes],
  () => {
    initChart()
  },
  { deep: true }
)

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option = {
    title: { text: '指数/趋势收益分布对比图' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['指数数据', '趋势投资'] },
    xAxis: { type: 'category', data: props.annuals },
    yAxis: { type: 'value' },
    series: [
      {
        name: '指数数据',
        type: 'bar',
        data: props.indexIncomes,
        itemStyle: { color: '#FF4040' }
      },
      {
        name: '趋势投资',
        type: 'bar',
        data: props.trendIncomes,
        itemStyle: { color: '#5D98C8' }
      }
    ]
  }

  chartInstance.setOption(option)
}

const resizeHandler = () => {
  if (chartInstance) chartInstance.resize()
}

</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
