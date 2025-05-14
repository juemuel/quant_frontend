<template>
  <div class="stock-market-container">
    <!-- 市场概况 -->
    <el-row :gutter="20" class="market-row">
      <el-col
        v-for="(marketGroup, index) in processedMarkets"
        :key="index"
        :span="8"
        class="card-col"
      >
        <CarouselCard
          :market-list="marketGroup"
          :title="['股票', '指数', '期货'][index]"
        />
      </el-col>
    </el-row>
    <!-- 股票导入 -->
    <el-card class="search-card">
      <div class="card-header">
        <span class="header-title">股票导入</span>
        <el-tooltip content="支持输入股票代码/名称/简拼进行搜索" placement="top">
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <!-- 改用flex容器代替el-row -->
      <div class="input-group input-actions">
        <div class="input-wrap">
          <el-input
            v-model="searchInput"
            placeholder="输入股票代码/名称/简拼"
            size="large"
            clearable
            @keyup.enter="handleCodeImport"
          >
            <template #append>
              <el-button
                type="primary"
                class="import-button"
                :disabled="!searchInput"
                @click="handleCodeImport"
              >
                导入
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="button-wrap">
          <el-button
            class="import-button"
            type="primary"
            size="large"
            plain
            :icon="UploadFilled"
            @click="showFileDialog = true"
          >
            文件导入
          </el-button>
          <el-button
            class="import-button"
            type="success"
            size="large"
            plain
            :icon="Picture"
            @click="showImageDialog = true"
          >
            图片识别
          </el-button>
        </div>
      </div>
    </el-card>
    <!-- 三栏布局 -->
    <el-row :gutter="20" class="main-content">
      <!-- 最近导入列表 -->
      <RecentItemsCard :recent-searches="recentSearches" :current-stock="currentStock" :search-input="recentSearchInput" />
      <!--图形区 -->
      <StockDetailCard :stock="currentStock"/>
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
import CarouselCard from '@/components/pc/CarouselCard.vue';
import { todayMarkets, favoriteMarkets } from '@/mock/home'
import { ElMessage, ElTooltip } from 'element-plus';
import RecentItemsCard from '@/components/pc/RecentItemsCard.vue';
import StockDetailCard from '@/components/pc/Charts/StockDetailCard.vue';
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
onMounted(() => {
  console.log('MOUNTED')
});
</script>
<style scoped lang="scss">
$card-min-width: 380px;

.el-icon{
  font-size: 16px;
}
::v-deep .el-tooltip__trigger{
    height: 16px !important;
    padding-left: 5px;
}
.stock-market-container {
  padding: 20px 100px 20px 100px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}
/* Market Cards */
.market-card, .search-card, .stock-detail-card, .news-card, .technical-card, .recent-searches-card {
  margin-bottom: 20px;
  border-radius: 4px;
  min-width: $card-min-width;
}

// 可选：添加响应式布局
@media (max-width: 768px) {
  .market-row {
    flex-direction: column;
    align-items: stretch;

    .card-col {
      width: 100%;
      max-width: 100%;
    }
  }
  .search-card .input-actions {
    flex-direction: column;
    align-items: stretch;

    .input-wrap,
    .button-wrap {
      width: 100%;
      flex: none;
    }
  }
}
// 市场概览区域
.market-row{
  margin: 0 auto !important;
  width: 100%; // 保证卡片在视口较宽时填满空间
  display: flex;
  flex-wrap: wrap; // 允许 el-col 自动换行
  justify-content: space-between;
  margin-bottom: 20px;
  .card-col {
    padding: 0 0 !important;
    min-width: $card-min-width; // 每个卡片最小宽度
    max-width: 100%;   // 在极窄设备上允许单列撑满
    flex: 1 0 $card-min-width;   // 弹性伸缩，基础宽度为 380px
  }
  :deep(.el-row__wrapper) {
    display: flex;
    flex-wrap: wrap;
  }
}
// 搜索区域
.search-card {
  margin: 0 auto !important;
  width: 100%; // 保证卡片在视口较宽时填满空间
  display: flex;
  flex-wrap: wrap; // 允许 el-col 自动换行
  margin-bottom: 20px;
  .card-header {
    text-align: left;
    margin-bottom: 16px;
    padding-left: 8px;
    width: auto;
    max-width: 40%;
    .header-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #333;
    }
  }
  .input-actions {
    display: flex;
    flex-wrap: wrap; // 允许子元素换行
    gap: 10px;
    min-width: 340px;
    .input-wrap {
      flex: 1 1 340px; // 至少占 450px，可伸缩
      min-width: 340px;
      :deep .el-input-group__append{
        width: 80px;
        min-width: 80px;
      }
    }
    .button-wrap {
      display: flex;
      flex-wrap: wrap; // 可选：允许按钮在更小宽度下换行
      gap: 10px;
      min-height: 40px; /* 改为最小高度，避免屏幕上按钮文字被截断或图标显示不全。 */
      min-width: 340px;
      .import-button {
        flex: 1 1 80px;
        min-width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
// 三栏布局容器
.main-content {
  margin: 0 auto !important;
  width: 100%; // 保证卡片在视口较宽时填满空间
  display: flex;
  flex-wrap: wrap; // 允许 el-col 自动换行
  margin-bottom: 20px;
  .recent-searches-card,
  .stock-detail-card,
  .news-card,
  .technical-card {
    padding: 0 0 !important;
    width: 100%; // 占满父容器
    box-sizing: border-box;
  }

  @media (min-width: 992px) {
    .recent-searches-card {
      flex: 0 0 20%;
    }

    .stock-detail-card {
      flex: 0 0 50%;
    }

    .news-card,
    .technical-card {
      flex: 0 0 25%;
    }
  }

  @media (max-width: 992px) {
    flex-direction: column;

    .recent-searches-card,
    .stock-detail-card,
    .news-card,
    .technical-card {
      flex: 1 1 auto;
      margin-bottom: 15px;
    }
  }

//   // 股票详情卡片

//   // 右侧第三列容器
//   &:last-child {
//     display: flex;
//     flex-direction: column;
//     gap: 15px;  // Add gap between cards
//     .news-card, .technical-card {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       max-height: calc(50% - 10px); // 设置最大高度为半高减去间距的一半
//       .card-header {
//         margin-bottom: 10px;
//         .header-title {
//           font-size: 16px;
//           font-weight: bold;
//         }
//       }
//       .news-list, .technical-list {
//         flex: 1;
//         min-height: 120px;
//         max-height: calc(100% - 40px); // 留出标题的空间
//         overflow-y: auto; // 确保垂直滚动
//         scrollbar-width: thin; // 对Firefox有效
//         &::-webkit-scrollbar {
//           width: 6px; // 设置滚动条宽度
//         }
//         &::-webkit-scrollbar-thumb {
//           background-color: #ddd; // 滚动条颜色
//           border-radius: 3px;
//         }
//         &::-webkit-scrollbar-track {
//           background-color: #f5f5f5; // 滚动条轨道颜色
//         }
//         .news-item {
//           padding: 8px 0;
//           border-bottom: 1px solid #eee;
//           .news-content {
//             margin-bottom: 4px;
//             line-height: 1.4;
//             font-size: 13px;
//           }
//           .news-time {
//             color: #999;
//             font-size: 11px;
//           }
//         }
//         .indicator-item {
//           display: flex;
//           justify-content: space-between;
//           padding: 8px 0;
//           border-bottom: 1px solid #eee;
//           font-size: 14px;
//           .signal-buy { color: #f44336; }
//           .signal-sell { color: #4caf50; }
//           .signal-neutral { color: #ff9800; }
//         }
//       }
//     }
//   }
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
