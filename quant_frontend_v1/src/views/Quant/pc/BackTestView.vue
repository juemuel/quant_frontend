<template>
  <div id="workingArea" class="page">
    <el-card class="container">
      <el-form label-width="120px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="请选择指数:">
              <el-select v-model="data.currentIndex" placeholder="请选择指数" :loading="data.loading">
                <el-option v-for="item in data.indexes" :key="item.code" :label="`${item.name} - (${item.code})`"
                  :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="策略MA(均线):">
              <el-select v-model="data.ma" placeholder="请选择策略均线">
                <el-option label="5日" value="5" />
                <el-option label="10日" value="10" />
                <el-option label="20日" value="20" />
                <el-option label="50日" value="60" />
                <el-option label="100日" value="100" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="手续费:">
              <el-select v-model="data.serviceCharge" placeholder="请选择手续费">
                <el-option label="无" value="0" />
                <el-option label="0.1%" value="0.001" />
                <el-option label="0.15%" value="0.0015" />
                <el-option label="0.2%" value="0.002" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="购买阈值:">
              <el-select v-model="data.buyThreshold" placeholder="请选择购买阈值">
                <el-option v-for="i in 9" :key="i" :label="`${i / 100 + 1}`" :value="i / 100 + 1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="出售阈值:">
              <el-select v-model="data.sellThreshold" placeholder="请选择出售阈值">
                <el-option v-for="i in 10" :key="i" :label="`${1 - i / 100}`" :value="1 - i / 100" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="开始日期:">
              <el-date-picker v-model="data.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="结束日期:">
              <el-date-picker v-model="data.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                placeholder="选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="default" type="primary" @click="onSearch()">
          <el-icon>
            <Search />
          </el-icon>
          查询
        </el-button>
      </el-form>
      <!-- 标签页 -->
      <el-tabs v-model="data.activeIncomeTab" @tab-click="handleTabChange">
        <el-tab-pane label="策略统计" name="first">
          <el-table :data="data.multiTradeData" :loading="data.isSimulateLoading" :key="Math.random()" stripe
            style="width: 100%">
            <!-- 核心策略信息 -->
            <el-table-column prop="strategyName" label="策略名称" align="center"></el-table-column>

            <!-- 收益指标 -->
            <el-table-column prop="totalRate" label="总收益率" align="center">
              <template #default="scope">
                <span :class="scope.row.totalRate > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.totalRate * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="investmentProfit" label="*1000元投资收益" align="center">
              <template #default="scope">
                {{ scope.row.investmentProfit.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="annualRate" label="年化收益率" align="center">
              <template #default="scope">
                <span :class="scope.row.annualRate > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.annualRate * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>

            <!-- 交易统计 -->
            <el-table-column prop="totalTradeCount" label="总交易次数" align="center"></el-table-column>
            <el-table-column prop="winCount" label="盈利交易次数" align="center"></el-table-column>
            <el-table-column prop="lossCount" label="亏损交易次数" align="center"></el-table-column>
            <el-table-column prop="winRate" label="胜率" align="center">
              <template #default="scope">
                {{ (scope.row.winRate * 100).toFixed(2) }}%
              </template>
            </el-table-column>

            <!-- 盈亏比率 -->
            <el-table-column prop="avgWinRate" label="平均盈利比率" align="center">
              <template #default="scope">
                <span :class="scope.row.avgWinRate > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.avgWinRate * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="avgLossRate" label="平均亏损比率" align="center">
              <template #default="scope">
                <span :class="scope.row.avgLossRate > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.avgLossRate * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收益明细图" name="second">
          <ProfitLineChart v-if="data.activeIncomeTab === 'second'" :dates="data.dates" :close-points="data.closePoints"
            :profit-values="data.profitValues" :ma-datas="data.maDatas" />
          <!-- <AnnualIncomeChart v-if="data.activeIncomeTab === 'second'" :annuals="data.annuals"
            :index-incomes="data.indexIncomes" :trend-incomes="data.tradeIncomes" /> -->
        </el-tab-pane>
        <el-tab-pane label="收益明细表" name="forth">
          <!-- <el-table :data="data.annualProfits" :loading="data.isSimulateLoading" :key="Math.random()" stripe
            style="width: 100%">
            <el-table-column prop="year" label="年份" align="center"></el-table-column>
            <el-table-column label="指数收益" align="center">
              <template #default="scope">
                <span :class="scope.row.indexIncome > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.indexIncome * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="趋势投资收益" align="center">
              <template #default="scope">
                <span :class="scope.row.trendIncome > 0 ? 'label-red' : 'label-green'">
                  {{ (scope.row.trendIncome * 100).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
          </el-table> -->
        </el-tab-pane>
      </el-tabs>
      <!-- <el-tabs v-model="data.activeProfitTab" @tab-click="handleTabChange">
        <el-tab-pane label="策略交易统计√" name="first">
          <el-table :data="data.trade_stats" :loading="data.isSimulateLoading" :key="Math.random()" stripe
            style="width: 100%">
            <el-table-column prop="totalTradeCount" label="总交易次数" align="center"></el-table-column>
            <el-table-column prop="winCount" label="盈利交易次数" align="center"></el-table-column>
            <el-table-column prop="avgWinRate" label="平均盈利比率" align="center">
              <template #default="scope">
                {{ (scope.row.avgWinRate * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column prop="lossCount" label="亏损交易次数" align="center">
            </el-table-column>
            <el-table-column prop="avgLossRate" label="平均亏损比率" align="center">
              <template #default="scope">
                {{ (scope.row.avgLossRate * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column prop="winRate" label="胜率" align="center">
              <template #default="scope">
                {{ scope.row.winRate }}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交易明细表√" name="second">
          <el-table :data="data.trades" :loading="data.isSimulateLoading" :key="Math.random()" stripe
            style="width: 100%">
            <el-table-column label="盈/亏" align="center">
              <template #default="scope">
                <span v-if="scope.row.sellClosePoint > scope.row.buyClosePoint" class="label  label-red">盈利</span>
                <span v-else class="label label-green">亏损</span>
              </template>
            </el-table-column>
            <el-table-column prop="buyDate" label="购买日期" align="center"></el-table-column>
            <el-table-column prop="buyClosePoint" label="购买盘点" align="center"></el-table-column>
            <el-table-column prop="sellDate" label="出售日期" align="center"></el-table-column>
            <el-table-column label="出售盘点" align="center">
              <template #default="scope">
                <span v-if="scope.row.sellClosePoint === 0">n/a</span>
                <span v-else>{{ scope.row.sellClosePoint }}</span>
              </template>
            </el-table-column>
            <el-table-column label="盈亏比率" align="center">
              <template #default="scope">
                <span v-if="scope.row.sellClosePoint === 0">n/a</span>
                <span class="label"
                  :class="{ ' label-red': scope.row.sellClosePoint > scope.row.buyClosePoint, 'label-green': scope.row.sellClosePoint <= scope.row.buyClosePoint }"
                  v-else>{{ ((scope.row.sellClosePoint - scope.row.buyClosePoint) * 100 /
                    scope.row.buyClosePoint).toFixed(2)}}%</span>
              </template>
            </el-table-column>
            <el-table-column label="1000元投资收益" align="center">
              <template #default="scope">
                <span v-if="scope.row.sellClosePoint === 0">n/a</span>
                <span v-else>{{ (scope.row.rate * 1000).toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs> -->
    </el-card>
  </div>
</template>

<script setup lang="ts">
import DateUtils from '@/utils/DateUtils'
import { nextTick, ref, onMounted, reactive, onUnmounted } from 'vue'
import quantApi from '@/api/quantApi'
import { ElMessage } from 'element-plus';
import ProfitLineChart from '@/components/pc/Charts/ProfitLineChart.vue'
import AnnualIncomeChart from '@/components/pc/Charts/AnnualIncomeChart.vue'
/**
 * 指数选项
 */
interface IndexOption {
  code: string
  name: string
}

/**
 * 某日的MA均线数据
 */
interface MaData {
  date: string
  ma10?: number
  ma20?: number
  ma30?: number
  ma50?: number
  ma100?: number
}
/**
 * 收益数据
 */
interface ProfitData {
  value: number
}

/**
 * 指数数据项
 */
interface IndexData {
  date: string
  closePoint: number
}
/**
 * 年度收益数据项
 */
interface AnnualProfit {
  year: string
  indexIncome: number // 指数年收益率
  trendIncome: number // 趋势投资年收益率
}

/**
 * 交易统计数据
 */
interface TradeStatistic {
  winCount: number // 盈利次数
  lossCount: number // 亏损次数
  avgWinRate: number // 平均盈利比率
  avgLossRate: number // 平均亏损比率
  totalTradeCount: number // 总交易次数
  winRate: number // 胜率
}
/**
 * 交易明细
 */
interface TradeDetail {
  buyDate: string
  buyClosePoint: number
  sellDate: string
  sellClosePoint: number
  rate: number
}
interface TradeStatsData{
  strategyName: string; // 策略名称
  totalRate: number; // 总收益率
  annualRate: number; // 年均收益率
  avgLossRate: number; // 平均亏损比率
  avgWinRate: number; // 平均盈利比率
  lossCount: number; // 亏损次数
  winCount: number; // 盈利次数
  investmentProfit: number; // *计算投资收益=(1+收益率)*本金
  totalTradeCount: number; // *计算总交易次数=lossCount+winCount
  winRate: number; // *计算胜率=盈利次数 / 总交易次数
  annualProfitList: Array<AnnualProfit>,
  dailyProfitList: Array<ProfitData>
}
const data = reactive({
  loading: true,
  isSimulateLoading: true,
  activeIncomeTab: 'first',
  activeProfitTab: 'first',
  // 指数配置
  indexes: [],
  tacticsList: [{ id: 0, name: '趋势投资' }], // 投资类型选择列表
  currentIndex: '000300', // 表单-选中的指数
  ma: 20, // 表单-均线
  serviceCharge: 0.0, // 表单-手续费
  buyThreshold: 1.01, // 表单-购买阈值
  sellThreshold: 0.99, // 表单-出售阈值
  startDate: null, // 表单-开始时间
  endDate: null, // 表单-结束时间
  // 数据源（指数+均线+本身收益数据（3个api数组，4个计算）
  // maDatas: [], // api某指数均线数据
  // maValues: [], //TODO :计算的指数均线值（用于图表显示）
  // 新增数据
  index_info: {}, // 指数信息
  strategy_info: {}, // 策略信息
  trade_list: [], // 交易明细
  trade_data: {} as TradeStatsData, // 交易数据（统计与利润）
  // 需计算
  closePoints: [], // 计算的收盘价数组
  annuals: [], // 计算的年份数组
  dates: [], // 计算的日期数组
  multiTradeData: [] as TradeStatsData[], // 计算的多个策略统计数据
  profitValues: [], // 计算的日收益数组（用于图表显示）
  annualProfitValues: [], //  计算的年收益数组（用于图表显示）
  multiTradeAnnualProfits: [], // 计算的年收益数组收益（可多个策略）
})

onMounted(async () => {
  await initData(); // 等待数据加载完成
})
async function initData() {
  try {
    const response = await quantApi.getIndexes({})
    if (response.code === 200) {
      ElMessage.success('获取指数列表成功！');
      data.indexes = response.data;
      // 默认获取指数列表中的第一个指数
      // data.currentIndex = data.indexes[0].code;
      onSearch()
    } else {
      ElMessage.error('获取指数列表失败！');
    }
  } catch (error) {
    console.error('Error in fetchIndexes:', error);
  }
}
const handleTabChange = () => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 50);
};
const simulate = async () => {
  try {
    data.isSimulateLoading = true;

    const params = {
      strategy: 'ma_strategy',
      code: data.currentIndex,
      ma: data.ma,
      buyThreshold: data.buyThreshold,
      sellThreshold: data.sellThreshold,
      serviceCharge: data.serviceCharge,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    console.log('[api][params]/backtest/simulate', params);
    const res = await quantApi.simulateTest(params);
    console.log('[api][res]/backtest/simulate', res);
    if (res.code === 200) {
      data.strategy_info = res.data.strategy_info;
      data.index_info = res.data.index_info;
      data.trade_list = res.data.trades;
      data.trade_data = {
        ...res.data.trade_stats,
        ...res.data.trade_profit,
        investmentProfit: Number(((res.data.trade_profit.totalRate + 1) * 1000).toFixed(2)),
        winRate: res.data.trade_stats.winCount / res.data.trade_stats.totalTradeCount || 0, // 避免除以0
        // totalTradeCount: data.trade_data.winCount + data.trade_data.lossCount
      };
      console.log('交易数据（统计交易数据和资产变化）', data.trade_data)
      data.multiTradeData.push(data.trade_data);
      ElMessage.success('模拟成功！');
    } else {
      ElMessage.error('模拟失败！');
    }
  } catch (error) {
    console.error('Failed to simulate:', error);
  } finally {
    data.isSimulateLoading = false;
  }
};

function clearIndexCommonData() {
  data.index_info = {}
}

/** 获取[指数数据、均线数据、起始日期、持续年]->[日期、收盘价、均线数组、指数收益数组]
 * @param indexDatas
 * @param maDatas
 * @returns indexDatas、profits、maDatas；dates、maValues、profitValues
 */
/**
 * 获取交易类数据
 * @param trades 交易数组
 * @param tradeStastics 交易小结数组[{盈利交易次数、亏损交易次数、平均盈利比率、平均亏损比率}]->计算[总交易次数、胜率]
 * @returns trades、tradeStastics
 */
/**
 * 获取收益类数据
 * @param annualProfits 收益数据[{年份、年指数收益、年趋势收益}]，
 * @param multiTradeStats 策略收益数据[{某策略总交易次数、某策略总交易收益、总交易收益率、总盈利交易次数、总盈利交易收益、总盈利交易收益率、某策略总亏损交易次数、某策略总亏损交易收益、某策略总亏损交易收益率}]
 */
const onSearch = () => {
  simulate();
}
</script>

<style scoped lang="scss">
.page {
  height: calc(100vh - 45px);
  width: 100%;
  overflow: hidden;
}

.container {
  margin: 20px;
  max-height: 90vh;
  overflow: auto;
  width: auto;
}

.el-tabs__content {
  overflow: visible;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
  position: relative;
}

.label-green {
  color: green;
}

.label-red {
  color: red;
}
</style>
