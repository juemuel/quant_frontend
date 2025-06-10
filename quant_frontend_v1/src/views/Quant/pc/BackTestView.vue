<template>
  <div id="workingArea" class="page">
    <el-card class="container">
      <el-form label-width="120px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="请选择指数:">
              <el-select v-model="data.currentIndex" placeholder="请选择指数" :loading="data.loading">
                <el-option v-for="item in data.indexes" :key="item.code" :label="`${item.name} - (${item.code})`" :value="item.code" />
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
              <el-date-picker v-model="data.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="结束日期:">
              <el-date-picker v-model="data.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
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
        <el-tab-pane label="收益小结√" name="first">
          <el-table :data="data.incomeStastics" :loading="data.isSimulateLoading" :key="Math.random()" stripe style="width: 100%">
            <el-table-column prop="title" label="投资类型"  align="center"></el-table-column>
            <el-table-column prop="years" label="投资时长 (年)" align="center">
            </el-table-column>
            <el-table-column prop="incomeTotal" label="1000元投资收益" align="center">
              <template #default="scope">
                {{ ((scope.row.incomeTotal+1) * 1000).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="incomeTotal" label="总收益率" align="center">
              <template #default="scope">
                {{ (scope.row.incomeTotal * 100).toFixed(2)}}%
              </template>
            </el-table-column>
            <el-table-column prop="incomeAnnual" label="年化收益率" align="center">
              <template #default="scope">
                {{ (scope.row.incomeAnnual * 100).toFixed(2)}}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收益折线图√" name="second">
          <ProfitLineChart
            v-if="data.activeIncomeTab === 'second'"
            :dates="data.dates"
            :close-points="data.closePoints"
            :profit-values="data.profitValues"
            :ma-datas="data.maDatas"
          />
        </el-tab-pane>
        <el-tab-pane label="收益年分布图√" name="third">
          <AnnualIncomeChart
            v-if="data.activeIncomeTab === 'third'"
            :annuals="data.annuals"
            :index-incomes="data.indexIncomes"
            :trend-incomes="data.trendIncomes"
          />
        </el-tab-pane>
        <el-tab-pane label="收益年分布表√" name="forth">
          <el-table :data="data.annualProfits" :loading="data.isSimulateLoading" :key="Math.random()" stripe style="width: 100%">
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="data.activeProfitTab" @tab-click="handleTabChange">
        <el-tab-pane label="策略交易统计√" name="first">
          <el-table :data="data.tradeStastics" :loading="data.isSimulateLoading" :key="Math.random()" stripe style="width: 100%">
            <el-table-column prop="totalTradeCount" label="总交易次数" align="center"></el-table-column>
            <el-table-column prop="winCount" label="盈利交易次数" align="center"></el-table-column>
            <el-table-column prop="avgWinRate" label="平均盈利比率" align="center">
              <template #default="scope">
                {{ (scope.row.avgWinRate * 100).toFixed(2)}}%
              </template>
            </el-table-column>
            <el-table-column prop="lossCount" label="亏损交易次数" align="center">
            </el-table-column>
            <el-table-column prop="avgLossRate" label="平均亏损比率" align="center">
              <template #default="scope">
                {{ (scope.row.avgLossRate * 100).toFixed(2)}}%
              </template>
            </el-table-column>
            <el-table-column prop="winRate" label="胜率" align="center">
              <template #default="scope">
                {{ scope.row.winRate}}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交易明细表√" name="second">
          <el-table :data="data.trades" :loading="data.isSimulateLoading" :key="Math.random()"  stripe style="width: 100%">
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
                  v-else>{{ ((scope.row.sellClosePoint - scope.row.buyClosePoint) * 100 / scope.row.buyClosePoint).toFixed(2)}}%</span>
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
      </el-tabs>
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
 * 收益小结
 */
interface IncomeStatistic {
  title: string // 投资类型
  years: string // 投资时长（字符串形式）
  incomeTotal: number // 总收益率
  incomeAnnual: number // 年化收益率
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
/**
 * 整体数据状态
 */
interface BackTestData {
  initialScale: number
  largestScale: number
  resizeTimeout: number | null
  loading: boolean
  isSimulateLoading: boolean
  activeIncomeTab: string
  activeProfitTab: string

  indexes: IndexOption[] // 指数列表
  tacticsList: { id: number; name: string }[] // 投资策略列表
  currentIndex: string // 当前选中的指数代码
  ma: number // 均线天数
  serviceCharge: number // 手续费率
  buyThreshold: number // 购买阈值
  sellThreshold: number // 出售阈值
  startDate: string | null // 开始日期
  endDate: string | null // 结束日期

  // 数据源
  indexDatas: IndexData[] // 指数原始数据
  maDatas: MaData[] // 均线数据
  profits: ProfitData[] // 日收益数据
  indexStartDate: string | null
  indexEndDate: string | null

  // 图表用数据
  dates: string[]
  closePoints: number[]
  profitValues: number[]
  maValues: number[]

  // 交易相关
  trades: TradeDetail[]
  tradeStastics: TradeStatistic[]

  // 收益统计
  years: number
  annualProfits: AnnualProfit[]
  incomeStastics: IncomeStatistic[]

  annuals: string[]
  indexIncomes: number[]
  trendIncomes: number[]
}
const data = reactive<BackTestData>({
  initialScale: 600,
  largestScale: 1300,
  resizeTimeout: null,
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
  indexDatas: [], // api某指数数据（对应的date日期、closePoints收盘价）
  maDatas: [], // api某指数均线数据
  profits: [], // api指数本身的日收益数据
  indexStartDate: null, // 当前指数的开始日期
  indexEndDate: null, // 当前指数的结束日期
  // 图表用数据
  dates: [], // 计算的日期数组
  closePoints: [], // 计算的指数收盘价
  profitValues: [], // 计算的指数本身日收益数组（用于图表显示）
  maValues: [], // 计算的指数均线值（用于图表显示）
  // 交易数据（1个api数组，4个api字段+2个计算）
  trades: [], // api交易数组
  tradeStastics: [{
    winCount: 0, // 盈利次数
    lossCount: 0, // 亏损次数
    avgWinRate: 0, // 平均盈利比率
    avgLossRate: 0, // 平均亏损比率
    totalTradeCount: 0, // 计算的总交易次数：winCount+lossCount
    winRate: 0 // 计算的胜率：((winCount/(winCount+lossCount))*100).toFixed(2)
  }],
  // 收益统计（1个api数组，4个api字段，4计算）
  years: 0, // 投资持续年时长
  annualProfits: [], // api多类目年收益数组（年份year、指数收益indexIncome、趋势投资收益trendIncome）
  incomeStastics: [{
    title: '',
    years: '',
    incomeTotal: 0,
    incomeAnnual: 0
  }],
  annuals: [], // 计算的年份数组
  indexIncomes: [], // 计算的年指数收益数组
  trendIncomes: [] // 计算的年趋势收益数组收益数组
})
onMounted(async () => {
  await initData(); // 等待数据加载完成
})
function initData () {
  getIndexCodes()
}
async function getIndexCodes() {
  try {
    const response = await quantApi.getIndexes({})
    if (response.code === 200) {
      ElMessage.success('获取指数列表成功！');
      data.indexes = response.data;
      onSearch();
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
    // data.startDate = DateUtils.formatDate(data.startDate, 'yyyy-MM-dd')
    // data.endDate = DateUtils.formatDate(data.endDate, 'yyyy-MM-dd')
    data.isSimulateLoading = true
    const str = "/" + data.currentIndex + "/" + data.ma + "/" + data.buyThreshold + "/" + data.sellThreshold + "/" + data.serviceCharge + "/" + data.startDate + "/" + data.endDate + "/"
    const params = {
      url: str
    }
    quantApi.simulateTest(params).then((res) => {
      console.log('[api][res]/backtest/simulate', res)
      if (res.code === 200) {
        data.indexStartDate = res.data.indexStartDate;
        data.indexEndDate = res.data.indexEndDate;
        data.years = res.data.years
        clearIndexDatasAndMADatas()
        getIndexDatasAndMADatas(res.data.indexDatas, res.data.profits, res.data.maDatas)
        clearTradesDatas()
        getTradesDatas(res.data.trades, res.data.tradeStastics)
        clearIncomeDatas()
        getIncomeDatas(res.data.annualProfits, res.data.incomeStastics)
      }
      data.loading = false
    })
  } catch (error) {
    console.error('Failed to simulate:', error)
  } finally {
    data.isSimulateLoading = false
  }
}
/**
 * 清空指数数据(日期、收盘价)、均线数据、均线数组、指数数据、指数收益数组
 */
function clearIndexDatasAndMADatas () {
  data.indexDatas = []
  data.maDatas = []
  data.profits = []
  data.dates = []
  data.closePoints = []
  data.maValues = []
  data.profitValues = []
}
/**
 * 清空持续年、收益数据、收益小结；计算的年份数组、指数收益数组、趋势收益数组
 */
function clearIncomeDatas () {
  data.years = 0;
  data.annualProfits = [];
  data.incomeStastics = [];
  data.annuals = [];
  data.indexIncomes = [];
  data.trendIncomes = []
}
/**
 * 清空交易数据、交易小结
 */
function clearTradesDatas () {
  data.trades = [];
  data.tradeStastics = []
}

/** * 获取[指数数据、均线数据、起始日期、持续年]->[日期、收盘价、均线数组、指数收益数组]
 * @param indexDatas
 * @param profits
 * @param maDatas
 * @returns indexDatas、profits、maDatas；dates、maValues、profitValues
 */
function getIndexDatasAndMADatas (indexDatas: any, profits: any, maDatas: any) {
  try {
    data.indexDatas = indexDatas;
    data.maDatas = maDatas.map((item: any) => ({
      date: item.date,
      ma10: item.value[0],
      ma20: item.value[1],
      ma30: item.value[2],
      ma50: item.value[3],
      ma100: item.value[4]
    }));
    data.profits = profits;
    // 确保数据长度一致
    if (data.indexDatas.length !== data.profits.length || data.indexDatas.length !== data.maDatas.length) {
      throw new Error('Data lengths do not match');
    }
    for (let i = 0; i < data.indexDatas.length; i++) {
      const indexData = data.indexDatas[i];
      data.dates.push(indexData.date);
      data.closePoints.push(indexData.closePoint);
      const profit = data.profits[i];
      data.profitValues.push(profit.value);
      const ma = data.maDatas[i];
      data.maValues.push(ma.value);
    }
    console.log('获取指数数据和均线数据成功', data.profitValues, data.maValues)
  } catch (error) {
    console.error('Failed to get indexDatasAndMADatas:', error)
  }
}
/**
 * 获取交易类数据
 * @param trades 交易数组
 * @param tradeStastics 交易小结数组[{盈利交易次数、亏损交易次数、平均盈利比率、平均亏损比率}]->计算[总交易次数、胜率]
 * @returns trades、tradeStastics
 */
function getTradesDatas(trades: TradeDetail[], tradeStastics: TradeStatistic[]) {
  try {
    data.trades = trades
    data.tradeStastics = tradeStastics.map(item => ({
      winCount: item.winCount,
      lossCount: item.lossCount,
      avgWinRate: item.avgWinRate,
      avgLossRate: item.avgLossRate,
      totalTradeCount: item.winCount + item.lossCount,
      winRate: parseFloat(((item.winCount / (item.winCount + item.lossCount)) * 100).toFixed(2))
    }))
    console.log('获取交易类数据成功', data.tradeStastics)
  } catch (error) {
    console.error('Failed to getTradesDatas:', error)
  }
}
/**
 * 获取收益类数据
 * @param annualProfits 收益数据[{年份、年指数收益、年趋势收益}]，
 * @param incomeStastics 收益小结[{某策略总交易次数、某策略总交易收益、总交易收益率、总盈利交易次数、总盈利交易收益、总盈利交易收益率、某策略总亏损交易次数、某策略总亏损交易收益、某策略总亏损交易收益率}]
 */
function getIncomeDatas(annualProfits: AnnualProfit[], incomeStastics: IncomeStatistic[]) {
  try {
    data.annualProfits = annualProfits;
    for (let i = 0; i < annualProfits.length; i++) {
      data.annuals.push(annualProfits[i].year);
      data.indexIncomes.push(annualProfits[i].indexIncome * 100);
      data.trendIncomes.push(annualProfits[i].trendIncome * 100);
    }
    data.incomeStastics = incomeStastics.map(item => ({
      incomeTotal: item.incomeTotal,
      years: item.years,
      title: item.title,
      incomeAnnual: item.incomeAnnual
    }))
    console.log('获取收益数据和收益小结成功', data.incomeStastics)
  } catch (error) {
    console.error('Failed to getIncomeDatas:', error)
  }
}
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
.container{
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
.label-green{
  color: green;
}
.label-red{
  color: red;
}
</style>
