<template>
  <div :class="className" :style="{ height: height, width: width }" ref="chartRef" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watchDeep, nextTick, defineProps, defineEmits, onDeactivated, onActivated } from 'vue';
import * as echarts from 'echarts';
require('echarts/theme/macarons');

// 定义 props
const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    required: true
  }
});

// 定义 refs
const chartRef = ref(null);
const chartInstance = ref(null);

// 定义 emits
const emit = defineEmits(['handleSetLineChartData']);

// 监听 chartData 变化
watchDeep(() => props.chartData, val => {
  updateChartOptions(val);
});

// 初始化图表
const initChart = () => {
  chartInstance.value = echarts.init(chartRef.value, 'macarons');
  updateChartOptions(props.chartData);
};

// 设置图表选项
const updateChartOptions = ({ expectedData, actualData } = {}) => {
  chartInstance.value.setOption({
    xAxis: {
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['期望', '实际']
    },
    series: [
      {
        name: '期望',
        itemStyle: {
          normal: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          }
        },
        smooth: true,
        type: 'line',
        data: expectedData,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: '实际',
        smooth: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: '#3888fa',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            }
          }
        },
        data: actualData,
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ]
  });
};

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

// 初始化 resize 事件监听
const initResizeEvent = () => {
  window.addEventListener('resize', handleResize);
};

// 销毁 resize 事件监听
const destroyResizeEvent = () => {
  window.removeEventListener('resize', handleResize);
};

// 初始化和销毁事件监听
const initializeResizeListeners = () => {
  initResizeEvent();
};

const destroyResizeListeners = () => {
  destroyResizeEvent();
};

// 触发自定义事件
const handleSetLineChartData = (type) => {
  emit('handleSetLineChartData', type); // 冒泡 handleSetLineChartData 事件
};

// 激活和去激活
onActivated(() => {
  initializeResizeListeners();
});

onDeactivated(() => {
  destroyResizeListeners();
});
</script>

<style scoped>
.chart {
  background: #fff;
}
</style>
