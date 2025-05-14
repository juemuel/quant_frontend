<template>
    <el-card class="stock-detail-card">
        <div class="stock-detail-header">
            <div class="detail-title">
                <span class="stock-name">{{ props.stock.name }}</span>
                <span class="stock-code">{{ props.stock.code }}</span>
            </div>
            <div :class="['stock-current-price', props.stock.change < 0 ? 'price-down' : 'price-up']">
                {{ props.stock.price }}
                <span class="change-percentage">
                    {{ props.stock.change < 0 ? '' : '+' }}{{ props.stock.change }}% </span>
            </div>
        </div>
        <!-- Chart Tabs -->
        <div class="chart-tabs">
            <el-tabs v-model="state.activeChartTab" class="chart-tab-container">
                <el-tab-pane label="日K" name="daily"></el-tab-pane>
                <el-tab-pane label="月K" name="monthly"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- Candlestick Chart -->
        <div class="candlestick-chart" ref="chartContainer"></div>
        <!-- Trading Info -->
        <div class="trading-info">
            <div class="info-item">
                <div class="info-label">成交量</div>
                <div class="info-value">234.5万手</div>
            </div>
            <div class="info-item">
                <div class="info-label">成交额</div>
                <div class="info-value">465.8亿</div>
            </div>
            <div class="info-item">
                <div class="info-label">换手率</div>
                <div class="info-value">1.25%</div>
            </div>
            <div class="info-item">
                <div class="info-label">市值</div>
                <div class="info-value">4628亿</div>
            </div>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps, reactive } from 'vue'
import * as echarts from 'echarts'
const props = defineProps({
    stock: {
        type: Object,
        required: true
    }
})
const state = reactive({
    activeChartTab: 'daily'
})
const chartContainer = ref(null)
let chart: echarts.ECharts | null = null
onMounted(() => {
    console.log('stockDetailCard', props.stock)
    initChart()
})
function initChart() {
  const chartDom = document.querySelector('.candlestick-chart');
  chart = echarts.init(chartDom);
  const option = {
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'],
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: '#ccc' } },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        type: 'candlestick',
        data: [
          [20, 34, 10, 38],
          [30, 40, 30, 40],
          [33, 44, 30, 44],
          [40, 40, 32, 35],
          [30, 50, 15, 37],
          [40, 30, 20, 40],
          [30, 40, 25, 40]
        ],
        itemStyle: {
          color: '#4CAF50',
          color0: '#F44336',
          borderColor: '#4CAF50',
          borderColor0: '#F44336'
        }
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', () => {
    chart.resize();
  });
}
</script>
<style lang="scss" scoped>
  .stock-detail-card {
    flex: 1;
    display: flex;
    flex-direction: column;

    .stock-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .detail-title {
        display: flex;
        align-items: baseline;

        .stock-name {
          font-size: 18px;
          font-weight: bold;
          margin-right: 8px;
        }
      }

      .stock-current-price {
        font-size: 22px;
        font-weight: bold;

        .change-percentage {
          font-size: 14px;
          margin-left: 8px;
        }
      }
    }

    .chart-tab-container {
      margin-bottom: 8px;
    }

    .candlestick-chart {
      height: 350px;
      width: 100%;
    }

    .trading-info {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;

      .info-item {
        text-align: center;

        .info-label {
          color: #999;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .info-value {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
</style>
