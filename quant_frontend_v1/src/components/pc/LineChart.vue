<template>
  <div :class="className" :style="{ height: height, width: width }" ref="chartRef" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watchDeep, onActivated, onDeactivated, defineProps, nextTick } from 'vue';
import * as echarts from 'echarts'; // 引入 echarts
require('echarts/theme/macarons'); // 使用 echarts 的 macarons 主题

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
const chart = ref(null);

// 监听 chartData 变化
watchDeep(() => props.chartData, val => {
  setOptions(val);
});

// 初始化图表
const initChart = () => {
  chart.value = echarts.init(chartRef.value, 'macarons');
  setOptions(props.chartData);
};

// 设置图表选项
const setOptions = ({ expectedData, actualData } = {}) => {
  chart.value.setOption({
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
  if (chart.value) {
    chart.value.dispose();
    chart.value = null;
  }
});

// // 处理窗口大小变化
// const handleResize = () => {
//   if (chart.value) {
//     chart.value.resize();
//   }
// };

// // 初始化 resize 事件监听
// const initResizeEvent = () => {
//   window.addEventListener('resize', handleResize);
// };

// // 销毁 resize 事件监听
// const destroyResizeEvent = () => {
//   window.removeEventListener('resize', handleResize);
// };

// // 初始化 sidebar resize 事件监听
// const initSidebarResizeEvent = () => {
//   const sidebarElm = document.querySelector('.sidebar-container');
//   if (sidebarElm) {
//     sidebarElm.addEventListener('transitionend', handleSidebarResize);
//   }
// };

// // 销毁 sidebar resize 事件监听
// const destroySidebarResizeEvent = () => {
//   const sidebarElm = document.querySelector('.sidebar-container');
//   if (sidebarElm) {
//     sidebarElm.removeEventListener('transitionend', handleSidebarResize);
//   }
// };

// // 处理 sidebar resize 事件
// const handleSidebarResize = (e) => {
//   if (e.propertyName === 'width') {
//     handleResize();
//   }
// };

// // 初始化和销毁事件监听
// const initializeResizeListeners = () => {
//   initResizeEvent();
//   initSidebarResizeEvent();
// };

// const destroyResizeListeners = () => {
//   destroyResizeEvent();
//   destroySidebarResizeEvent();
// };

// // 激活和去激活
// onActivated(() => {
//   initializeResizeListeners();
// });

// onDeactivated(() => {
//   destroyResizeListeners();
// });
</script>

<style scoped>
.chart {
  background: #fff;
}
</style>
