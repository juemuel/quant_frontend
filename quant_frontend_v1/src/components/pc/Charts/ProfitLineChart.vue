<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  dates: string[]
  closePoints: number[]
  profitValues: number[]
  maDatas: { ma10?: number; ma20?: number; ma30?: number; ma50?: number; ma100?: number }[]
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
  () => [props.dates, props.closePoints, props.profitValues, props.maDatas],
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
    title: { text: '收益折线图' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: ['指数数据', '趋势投资', 'MA10', 'MA20', 'MA30', 'MA50', 'MA100']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.dates
    },
    dataZoom: { type: 'inside' },
    yAxis: { type: 'value' },
    series: [
      {
        name: '指数数据',
        type: 'line',
        data: props.closePoints,
        lineStyle: { color: '#FF4040' }
      },
      {
        name: '趋势投资',
        type: 'line',
        data: props.profitValues,
        lineStyle: { color: '#5D98C8' }
      },
      {
        name: 'MA10',
        type: 'line',
        data: props.maDatas.map(d => d.ma10),
        symbol: 'none',
        lineStyle: { color: '#00FF00' }
      },
      {
        name: 'MA20',
        type: 'line',
        data: props.maDatas.map(d => d.ma20),
        symbol: 'none',
        lineStyle: { color: '#FF00FF' }
      },
      {
        name: 'MA30',
        type: 'line',
        data: props.maDatas.map(d => d.ma30),
        symbol: 'none',
        lineStyle: { color: '#00FFFF' }
      },
      {
        name: 'MA50',
        type: 'line',
        data: props.maDatas.map(d => d.ma50),
        symbol: 'none',
        lineStyle: { color: '#FFA500' }
      },
      {
        name: 'MA100',
        type: 'line',
        data: props.maDatas.map(d => d.ma100),
        symbol: 'none',
        lineStyle: { color: '#800080' }
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
