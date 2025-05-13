<template>
  <div class="stock-market-container">
    <!-- 市场概况 -->
    <el-row :gutter="20">
      <CarouselCard
        v-for="(marketGroup, index) in processedMarkets"
        :key="index"
        :market-list="marketGroup"
        :title="['股票', '指数', '期货'][index]"
      />
    </el-row>
    <!-- 股票导入 -->
    <el-card class="search-card">
      <div class="card-header">
        <span class="header-title">股票导入</span>
        <el-tooltip content="支持输入股票代码/名称/简拼进行搜索" placement="top">
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="search-input-wrapper">
        <el-row :gutter="10" class="input-group">
          <el-col :span="18">
            <el-input
              v-model="searchInput"
              placeholder="输入股票代码/名称/简拼"
              size="large"
              clearable
              @keyup.enter="handleCodeImport"
            >
              <template #append>
                <el-button
                  size="large"
                  type="primary"
                  class="import-button"
                  :disabled="!searchInput"
                  @click="handleCodeImport"
                >
                  导入
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <div class="search-else-buttons">
              <el-button
                type="primary"
                size="large"
                class="import-button"
                plain
                :icon="UploadFilled"
                @click="showFileDialog = true"
              >
                文件导入
              </el-button>
              <el-button
                type="success"
                size="large"
                class="import-button"
                plain
                :icon="Picture"
                @click="showImageDialog = true"
              >
              图片识别
              </el-button>
            </div>
          </el-col>
        </el-row>
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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Document, Picture, Search, UploadFilled, InfoFilled } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import CarouselCard from '@/components/pc/CarouselCard.vue';
import { todayMarkets, favoriteMarkets } from '@/mock/home'
import { ElMessage, ElTooltip } from 'element-plus';

// Data models

const activeChartTab = ref('daily');
let chart: echarts.ECharts | null = null;
// 一、今日股票、期货、指数行情数据
const processedMarkets = computed(() => {
  // 按市场类型分组
  const marketTypes = ['stock', 'index', 'futures'] as const
  return marketTypes.map(type => ([
    // 今日数据
    {
      ...todayMarkets[type],
      title: `今日${getTypeName(type)}`,
      topGainers: processTopList(todayMarkets[type].data, 'gainers'),
      topLosers: processTopList(todayMarkets[type].data, 'losers')
    },
    // 自选数据
    {
      ...favoriteMarkets[type],
      title: `自选${getTypeName(type)}`,
      topGainers: processTopList(favoriteMarkets[type].data, 'gainers'),
      topLosers: processTopList(favoriteMarkets[type].data, 'losers')
    }
  ]))
})
const getTypeName = (type: 'stock' | 'index' | 'futures') => {
  const map = { stock: '股票', index: '指数', futures: '期货' }
  return map[type]
}
const processTopList = (data: any[], type: 'gainers' | 'losers') => {
  const sorted = [...data].sort((a, b) => type === 'gainers'
    ? b.change - a.change
    : a.change - b.change)
  return sorted.slice(0, 5)
}

// 二、搜索栏数据
const searchInput = ref('')
const showResult = ref(false)
const showFileDialog = ref(false)
const showImageDialog = ref(false)
const importResult = ref<any[]>([])

// 处理代码导入
const handleCodeImport = async () => {
  try {
    // 调用识别接口
    const res = await mockRecognizeApi(searchInput.value)
    importResult.value = res
    showResult.value = true
  } catch (error) {
    ElMessage.error('识别失败，请检查输入格式')
  }
}

// 处理文件上传
const handleFileUpload = async (file: File) => {
  try {
    const res = await mockUploadApi(file, 'file')
    importResult.value = res
    showResult.value = true
  } catch (error) {
    ElMessage.error('文件解析失败')
  }
}

// 处理图片上传
const handleImageUpload = async (file: File) => {
  try {
    const res = await mockUploadApi(file, 'image')
    importResult.value = res
    showResult.value = true
  } catch (error) {
    ElMessage.error('图片识别失败')
  }
}
// 模拟接口
const mockRecognizeApi = (code: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        code: '600519',
        name: '贵州茅台',
        match: '代码完全匹配'
      }])
    }, 500)
  })
}

const mockUploadApi = (file: File, type: 'file' | 'image') => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        code: '000001',
        name: '上证指数',
        match: type === 'file' ? '文件解析' : '图片识别'
      }])
    }, 800)
  })
}

// 三
const recentSearchInput = ref('');
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
  {
    content: '半导体产业链集中高改，国产替代进程加速',
    time: '2小时前',
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
<style scoped lang="scss">
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

// 可选：添加响应式布局
@media (max-width: 768px) {
  .stock-grid {
    flex-direction: column;

    .stock-column {
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.el-icon{
  font-size: 16px;
}
::v-deep .el-tooltip__trigger{
    height: 16px !important;
    padding-left: 5px;
}
// 搜索区域
.search-card {
  margin: 0 auto;
  .card-header {
    text-align: left;
    margin-bottom: 16px;
    padding-left: 8px;
    .header-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #333;
    }
  }

  .search-input-wrapper {
    margin: 0 auto;
    // min-width: 180px;
    .search-input .el-input__inner {
      border-radius: 4px !important;
    }
    .import-button{
      width: 100px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  :deep .el-input-group__append{
    width: 80px;
    min-width: 80px;
  }
  .search-else-buttons {
    display: flex;
    gap: 8px;
    height: 40px;
    .import-button {
      flex: 1;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
// 三栏布局容器
.main-content {
  display: flex;
  align-items: stretch;
  margin-top: 15px;
  .el-col {
    display: flex;
    flex-direction: column; // Ensure columns stack vertically
    height: auto;
    // 最近导入卡片
    .recent-searches-card {
      flex: 1;
      display: flex;
      flex-direction: column;

      .recent-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .search-box {
        margin-bottom: 10px;

        .recent-search-input {
          width: 100%;
        }
      }

      .recent-list {
        flex: 1;
        min-height: 300px;
        border: 1px solid #eee;
        border-radius: 4px;
        max-height: 500px;
        overflow-y: auto;

        .recent-item {
          display: flex;
          flex-direction: column;
          padding: 8px;
          border-bottom: 1px solid #eee;
          cursor: pointer;

          &:hover, &.active {
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
        }
      }
    }
    // 股票详情卡片
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
    // 右侧第三列容器
    &:last-child {
      display: flex;
      flex-direction: column;
      gap: 15px;  // Add gap between cards
      .news-card, .technical-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-height: calc(50% - 10px); // 设置最大高度为半高减去间距的一半
        .card-header {
          margin-bottom: 10px;
          .header-title {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .news-list, .technical-list {
          flex: 1;
          min-height: 120px;
          max-height: calc(100% - 40px); // 留出标题的空间
          overflow-y: auto; // 确保垂直滚动
          scrollbar-width: thin; // 对Firefox有效
          &::-webkit-scrollbar {
            width: 6px; // 设置滚动条宽度
          }
          &::-webkit-scrollbar-thumb {
            background-color: #ddd; // 滚动条颜色
            border-radius: 3px;
          }
          &::-webkit-scrollbar-track {
            background-color: #f5f5f5; // 滚动条轨道颜色
          }
          .news-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            .news-content {
              margin-bottom: 4px;
              line-height: 1.4;
              font-size: 13px;
            }
            .news-time {
              color: #999;
              font-size: 11px;
            }
          }
          .indicator-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            .signal-buy { color: #f44336; }
            .signal-sell { color: #4caf50; }
            .signal-neutral { color: #ff9800; }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .el-col {
    width: 100%;
    max-width: 100% !important;
  }
  .search-else-buttons {
    margin-top: 10px;
  }
  .main-content {
    flex-direction: column;
  }
  // 在移动端视图下调整卡片高度
  .el-col:last-child {
    .news-card, .technical-card {
      max-height: 300px;
      margin-bottom: 15px;
    }
  }
}
</style>
