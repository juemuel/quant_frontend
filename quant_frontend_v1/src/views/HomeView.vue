<template>
  <div class="page">
    <div class="dashboard-editor-container">
      <PanelGroup @handleSetLineChartData="handleSetLineChartData" />
      <el-row style="chart-box">
        <LineChart :chart-data="lineChartData" />
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PanelGroup from '@/components/pc/PanelGroup.vue';
import LineChart from '@/components/pc/LineChart.vue'
const lineChartList = ref({
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
});
const lineChartData = ref(null)
lineChartData.value = lineChartList.value.newVisitis;
const handleSetLineChartData = (type) => {
  lineChartData.value = lineChartList.value[type];
};
</script>

<style scoped>
.page {
  height: calc(100vh - 45px);
  width: 100%;
  overflow: hidden;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.dashboard-editor-container .github-corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}

.dashboard-editor-container .chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
.chart-box {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>
