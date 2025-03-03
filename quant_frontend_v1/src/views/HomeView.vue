<template>
  <div class="stock-market-container">
    <!-- 市场概况 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="market-card">
          <div class="card-header">
            <span class="header-title">大盘行情</span>
            <span class="update-time">更新时间: 15:00:00</span>
          </div>
          <div class="stock-grid">
            <div v-for="(item, index) in marketOverview" :key="index" class="stock-item">
              <div class="stock-name">{{ item.name }}</div>
              <div class="stock-code">{{ item.code }}</div>
              <div :class="['stock-price', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.price }}
              </div>
              <div :class="['stock-change', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="market-card">
          <div class="card-header">
            <span class="header-title">重要指数</span>
            <span class="update-time">更新时间: 15:00:00</span>
          </div>
          <div class="stock-grid">
            <div v-for="(item, index) in importantIndices" :key="index" class="stock-item">
              <div class="stock-name">{{ item.name }}</div>
              <div class="stock-code">{{ item.code }}</div>
              <div :class="['stock-price', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.price }}
              </div>
              <div :class="['stock-change', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="market-card">
          <div class="card-header">
            <span class="header-title">期货行情</span>
            <span class="update-time">更新时间: 15:00:00</span>
          </div>
          <div class="stock-grid">
            <div v-for="(item, index) in futuresMarket" :key="index" class="stock-item">
              <div class="stock-name">{{ item.name }}</div>
              <div class="stock-code">{{ item.code }}</div>
              <div :class="['stock-price', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.price }}
              </div>
              <div :class="['stock-change', item.change > 0 ? 'price-up' : 'price-down']">
                {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 股票导入 -->
    <el-card class="search-card">
      <div class="stock-search">
        <div class="search-title">股票导入</div>
        <div class="search-input-wrapper">
          <el-input
            v-model="searchInput"
            placeholder="请在这里输入代码或名称"
            class="search-input"
          >
            <template #append>
              <div class="search-buttons">
                <el-button type="primary" class="import-button">
                  <el-icon><Document /></el-icon>
                  文件导入
                </el-button>
                <el-button type="success" class="import-button">
                  <el-icon><Picture /></el-icon>
                  图片识别
                </el-button>
              </div>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>
    <!-- 三栏布局 -->
    <el-row :gutter="20" class="main-content">
      <!-- 最近导入列表 -->
      <el-col :span="5">
        <el-card class="recent-searches-card">
          <div class="recent-title">
            最近导入 (20)
          </div>
          <div class="search-box">
            <el-input
              v-model="recentSearchInput"
              placeholder="搜索股票代码或名称"
              class="recent-search-input"
            >
              <template #suffix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="recent-list">
            <div
              v-for="(item, index) in recentSearches"
              :key="index"
              class="recent-item"
              :class="{ active: item.code === currentStock.code }"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-code">{{ item.code }}</span>
              <span
                :class="[
                  'item-change',
                  item.changePercentage > 0 ? 'price-up' : 'price-down',
                ]"
              >
                {{ item.changePercentage > 0 ? '+' : '' }}{{ item.changePercentage }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--图形区 -->
      <el-col :span="13">
        <el-card class="stock-detail-card">
          <div class="stock-detail-header">
            <div class="detail-title">
              <span class="stock-name">{{ currentStock.name }}</span>
              <span class="stock-code">{{ currentStock.code }}</span>
            </div>
            <div class="stock-current-price" :class="currentStock.change < 0 ? 'price-down' : 'price-up'">
              {{ currentStock.price }}
              <span class="change-percentage">{{ currentStock.change < 0 ? '' : '+' }}{{ currentStock.change }}%</span>
            </div>
          </div>

          <!-- Chart Tabs -->
          <div class="chart-tabs">
            <el-tabs v-model="activeChartTab" class="chart-tab-container">
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
      </el-col>
      <!--相关资讯与技术分析 -->
      <el-col :span="6">
        <el-card class="news-card">
          <div class="card-header">
            <span class="header-title">相关资讯</span>
          </div>
          <div class="news-list">
            <div v-for="(news, index) in relatedNews" :key="index" class="news-item">
              <div class="news-content">{{ news.content }}</div>
              <div class="news-time">{{ news.time }}</div>
            </div>
          </div>
        </el-card>
        <el-card class="technical-card">
          <div class="card-header">
            <span class="header-title">技术分析</span>
          </div>
          <div class="technical-list">
            <div v-for="(indicator, index) in technicalIndicators" :key="index" class="indicator-item">
              <span class="indicator-name">{{ indicator.name }}</span>
              <span :class="['indicator-signal', getSignalClass(indicator.signal)]">
                {{ indicator.signal }}
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Document, Picture, Search } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

// Data models
const searchInput = ref('');
const recentSearchInput = ref('');
const activeChartTab = ref('daily');
let chart = null;

// Mock data
const marketOverview = ref([
  { name: '张德帅5', code: '沪指帅5', price: '198.56', change: 5.67 },
  { name: '宁德时代', code: '300750', price: '198.56', change: 5.67 },
  { name: '恒瑞医药', code: '600276', price: '32.45', change: -4.56 },
  { name: '比亚迪', code: '002594', price: '245.89', change: 4.23 },
  { name: '隆基股份', code: '601012', price: '45.67', change: -3.89 },
  { name: '中国平安', code: '601318', price: '45.23', change: 5.86 },
  { name: '药明康德', code: '603259', price: '78.34', change: -3.43 },
  { name: '贵州茅台', code: '600519', price: '1689.00', change: 3.35 },
  { name: '五方控股', code: '300093', price: '18.76', change: -3.12 },
  { name: '招商银行', code: '600036', price: '35.68', change: 2.98 },
  { name: '迈瑞医疗', code: '300760', price: '289.45', change: -2.87 },
]);

const importantIndices = ref([
  { name: '张德帅5', code: '深证帅5', price: '2345.67', change: 3.45 },
  { name: '新能源指数', code: '399989', price: '2345.67', change: 3.45 },
  { name: '房地产指数', code: '399393', price: '1234.56', change: 3.21 },
  { name: '半导体指数', code: '399678', price: '3456.78', change: 2.89 },
  { name: '银行指数', code: '399986', price: '2345.67', change: -2.87 },
  { name: '医药指数', code: '399989', price: '4567.89', change: 2.34 },
  { name: '房地指数', code: '399989', price: '3456.78', change: 2.45 },
  { name: '消费指数', code: '399997', price: '5678.90', change: -2.12 },
  { name: '保安指数', code: '399998', price: '4567.89', change: 2.12 },
  { name: '科技指数', code: '399906', price: '6789.01', change: 1.98 },
  { name: '创业指数', code: '399987', price: '5678.90', change: -1.98 },
]);

const futuresMarket = ref([
  { name: '张德帅5', code: '黑帅帅5', price: '389.25', change: 4.56 },
  { name: '沪金主力', code: 'AU2312', price: '389.25', change: 4.56 },
  { name: '螺纹主力', code: '(RB2312', price: '3756.00', change: -3.43 },
  { name: '沪铜主力', code: 'CU2312', price: '678.90', change: 3.89 },
  { name: '热卷主力', code: 'HC2312', price: '4567.89', change: -3.12 },
  { name: '沪铝主力', code: 'AL2312', price: '567.89', change: 3.45 },
  { name: '焦炭主力', code: 'J2312', price: '2345.67', change: -2.87 },
  { name: '沪锡主力', code: 'NI2312', price: '156.78', change: 3.13 },
  { name: '焦煤主力', code: 'JM2312', price: '1678.90', change: -2.45 },
  { name: '沪镍主力', code: 'SN2312', price: '234.56', change: 2.87 },
  { name: '铁矿主力', code: 'I2312', price: '890.12', change: -2.12 },
]);

const recentSearches = ref([
  { name: '贵州茅台', code: '600519', changePercentage: 2.35 },
  { name: '宁德时代', code: '300750', changePercentage: -1.24 },
  { name: '中国平安', code: '601318', changePercentage: 0.86 },
  { name: '招商银行', code: '600036', changePercentage: -0.45 },
  { name: '比亚迪', code: '002594', changePercentage: 3.56 },
]);

const currentStock = ref({
  name: '宁德时代',
  code: '300750',
  price: '198.56',
  change: -1.24,
});

const relatedNews = ref([
  {
    content: '杰力在境外筹集资金改革，保持充动力维持竞争格，促进社会各融资渠道向中小增加',
    time: '10分钟前',
  },
  {
    content: '筹额受集团旨新能源板块，机构看好下半年投资机会',
    time: '25分钟前',
  },
  {
    content: '创新药板块估值偏高，医药行业整体震荡继续横向',
    time: '1小时前',
  },
  {
    content: '半导体产业链集中高改，国产替代进程加速',
    time: '2小时前',
  },
]);

const technicalIndicators = ref([
  { name: 'MACD', signal: '买入' },
  { name: 'KDJ', signal: '买入' },
  { name: 'RSI', signal: '中性' },
  { name: '右肩带', signal: '卖出' },
]);

// Methods
function getSignalClass(signal) {
  if (signal === '买入') return 'signal-buy';
  if (signal === '卖出') return 'signal-sell';
  return 'signal-neutral';
}

// Initialize chart
onMounted(() => {
  initChart();
});

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
<style>
.stock-market-container {
  padding: 20px 100px 20px 100px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}

/* Market Cards */
.market-card, .search-card, .stock-detail-card, .news-card, .technical-card, .recent-searches-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.update-time {
  color: #999;
  font-size: 13px;
}

/* Stock Grid - More compact */
.stock-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.stock-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  padding: 3px 5px;
  border-bottom: 1px dashed #eee;
  line-height: 1.2;
}

.stock-name {
  font-weight: bold;
  font-size: 13px;
}

.stock-code {
  color: #999;
  font-size: 11px;
  text-align: right;
}

.stock-price {
  font-size: 14px;
  font-weight: bold;
}

.stock-change {
  font-size: 11px;
  text-align: right;
}

.price-up {
  color: #f44336;
}

.price-down {
  color: #4caf50;
}

/* Search Section */
.search-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.search-input-wrapper {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
}

/* Adjusted import buttons to be inline */
.search-buttons {
  display: flex;
  white-space: nowrap;
}

.import-button {
  padding: 8px 10px;
  margin: 0;
  margin-left: -1px;
  border-radius: 0;
}

.import-button:first-child {
  border-right: 0;
}

.import-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* Three-column layout styling */
.main-content {
  display: flex;
  margin-top: 10px;
}

/* Recent Searches Card */
.recent-searches-card {
  height: 100%;
}

.recent-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.search-box {
  margin-bottom: 10px;
}

.recent-search-input {
  width: 100%;
}

.recent-list {
  border: 1px solid #eee;
  border-radius: 4px;
  max-height: 500px;
  overflow-y: auto;
}

.recent-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.recent-item:hover, .recent-item.active {
  background-color: #f5f7fa;
}

.item-name {
  font-weight: bold;
  font-size: 14px;
}

.item-code {
  color: #999;
  font-size: 12px;
  margin: 2px 0;
}

.item-change {
  font-size: 13px;
}

/* Stock Detail */
.stock-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.detail-title {
  display: flex;
  align-items: baseline;
}

.stock-name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 8px;
}

.stock-current-price {
  font-size: 22px;
  font-weight: bold;
}

.change-percentage {
  font-size: 14px;
  margin-left: 8px;
}

/* Chart */
.chart-tab-container {
  margin-bottom: 8px;
}

.candlestick-chart {
  height: 350px;
  width: 100%;
}

/* Trading Info */
.trading-info {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.info-item {
  text-align: center;
}

.info-label {
  color: #999;
  font-size: 12px;
  margin-bottom: 3px;
}

.info-value {
  font-size: 14px;
  font-weight: bold;
}

/* News */
.news-card {
  margin-bottom: 15px;
}

.news-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.news-content {
  margin-bottom: 4px;
  line-height: 1.4;
  font-size: 13px;
}

.news-time {
  color: #999;
  font-size: 11px;
}

/* Technical Analysis */
.technical-card {
  margin-top: 0;
}

.indicator-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.signal-buy {
  color: #f44336;
}

.signal-sell {
  color: #4caf50;
}

.signal-neutral {
  color: #ff9800;
}
</style>
