<template>
  <div id="workingArea" class="page backtest-view-container">
    <el-row :gutter="20" class="main-layout-row">
      <!-- 左侧参数配置区 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="7" :xl="6" class="config-panel-col">
        <el-card class="config-panel-card" shadow="never">
          <template #header>
            <div class="clearfix">
              <span>参数配置</span>
            </div>
          </template>
          <el-form label-width="100px" label-position="top">
            <!-- 基本设置 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-gear"></i> 基本设置</div>
                <!-- Optional: Placeholder or actual controls can go here -->
              </div>
              <el-row :gutter="15">
                <el-col :md="12">
                  <!-- 策略名称 (示例，如果需要请在data中定义) -->
                  <el-form-item label="TODO策略名称">
                    <el-input v-model="data.strategyName" placeholder="例如：双均线策略" />
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="请选择指数">
                    <el-select v-model="data.currentIndex" placeholder="请选择指数" :loading="data.loading"
                      style="width: 100%;">
                      <el-option v-for="item in data.indexes" :key="item.code" :label="`${item.name} - (${item.code})`"
                        :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :md="12">
                  <!-- 初始资金 (示例，如果需要请在data中定义) -->
                  <el-form-item label="TODO初始资金">
                    <el-input v-model="data.initialCapitalInput" placeholder="例如：1000000">
                      <template #prepend>¥</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="时间框架">
                    <el-select v-model="data.timeFrame" placeholder="请选择时间框架" style="width: 100%;">
                      <el-option label="日线" value="daily" />
                      <el-option label="周线" value="weekly" />
                      <el-option label="月线" value="monthly" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :md="12">
                  <el-form-item label="开始日期">
                    <el-date-picker v-model="data.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                      placeholder="选择日期" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="结束日期">
                    <el-date-picker v-model="data.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                      placeholder="选择日期" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 信号参数 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-lightning-charge"></i> 信号参数</div>
              </div>
              <el-row :gutter="15">
                <el-col :md="12">
                  <el-form-item label="均线周期 (MA)">
                    <el-select v-model="data.ma" placeholder="请选择均线" style="width: 100%;">
                      <el-option label="5日" :value="5" />
                      <el-option label="10日" :value="10" />
                      <el-option label="20日" :value="20" />
                      <el-option label="50日" :value="50" />
                      <el-option label="100日" :value="100" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="均线类型">
                    <el-select v-model="data.maType" placeholder="请选择均线类型" style="width: 100%;">
                      <el-option label="SMA" value="SMA" />
                      <el-option label="EMA" value="EMA" />
                      <el-option label="WMA" value="WMA" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :md="12">
                  <!-- 慢线周期 (示例，如果需要请在data中定义 'maSlow') -->
                  <el-form-item label="*慢线周期 (可选)">
                    <el-input type="number" v-model="data.strategyParams.maSlowInput" placeholder="例如：20" />
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <!-- 快线周期 (示例，如果需要请在data中定义 'maFast') -->
                  <el-form-item label="*快线周期 (可选)">
                    <el-input type="number" v-model="data.strategyParams.maFastInput" placeholder="例如：5" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 交易触发参数 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-activity"></i> 交易触发</div>
              </div>
              <el-row :gutter="15">
                <el-col :md="12">
                  <el-form-item label="购买阈值">
                    <el-select v-model="data.tradingParams.buyThreshold" placeholder="请选择购买阈值" style="width: 100%;">
                      <el-option v-for="i in 9" :key="i" :label="`${(i / 100 + 1).toFixed(2)} (上涨${i}%时买入)`"
                        :value="i / 100 + 1" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="出售阈值">
                    <el-select v-model="data.tradingParams.sellThreshold" placeholder="请选择出售阈值" style="width: 100%;">
                      <el-option v-for="i in 10" :key="i" :label="`${(1 - i / 100).toFixed(2)} (下跌${i}%时卖出)`"
                        :value="1 - i / 100" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :md="12">
                  <el-form-item label="*最小信号强度">
                    <el-input-number v-model="data.tradingParams.minSignalStrength" :step="0.01" :min="0" :max="1"
                      style="width: 100%;" placeholder="例如：0.5" />
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="*信号确认周期数">
                    <el-input-number v-model="data.tradingParams.signalConfirmationCandles" :min="1" :max="10" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 交易执行 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-arrow-left-right"></i> 交易执行</div>
              </div>
              <el-row :gutter="15">
                <el-col :md="12">
                  <el-form-item label="手续费">
                    <el-select v-model="data.tradingParams.serviceCharge" placeholder="请选择手续费" style="width: 100%;">
                      <el-option label="无" :value="0" />
                      <el-option label="0.1%" :value="0.001" />
                      <el-option label="0.15%" :value="0.0015" />
                      <el-option label="0.2%" :value="0.002" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="12">
                  <el-form-item label="*滑点比例">
                    <el-input type="number" step="0.0001" v-model.number="data.tradingParams.slippage" placeholder="例如: 0.1"
                      style="width: 100%;">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :md="12">
                  <el-form-item label="*最小交易金额">
                    <el-input type="number" v-model.number="data.tradingParams.minTradeAmount" placeholder="例如: 100"
                      style="width: 100%;">
                      <template #prepend>¥</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 风险管理 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-shield-exclamation"></i>风险管理</div>
                <div class="header-controls">
                  <el-switch v-model="data.riskParams.enableRiskManagement" />
                  <label class="form-check-label" style="margin-left: 8px;">启用</label>
                </div>
              </div>

              <!-- 折叠区域 -->
              <transition name="slide">
                <div v-show="data.riskParams.enableRiskManagement">
                  <el-row :gutter="15">
                    <el-col :md="12">
                      <el-form-item label="*最大回撤限制(%)">
                        <el-input type="number" step="0.1" v-model.number="data.riskParams.maxDrawdown" placeholder="例如: 20.0">
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="12">
                      <el-form-item label="*单日最大损失(%)">
                        <el-input type="number" step="0.1" v-model.number="data.riskParams.dailyLossLimit" placeholder="例如: 3.0">
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :md="12">
                      <el-form-item label="*单笔交易风险(%)">
                        <el-input type="number" step="0.1" v-model.number="data.riskParams.positionRisk" placeholder="例如: 1.0">
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </transition>
            </div>

            <!-- 仓位管理 -->
            <div class="param-section">
              <div class="param-section-header-flex">
                <div class="section-title"><i class="bi bi-box-seam"></i> 仓位管理</div>
                <div class="header-controls">
                  <el-switch v-model="data.positionParams.enablePositionManagement" />
                  <label class="form-check-label" style="margin-left: 8px;">启用</label>
                </div>
              </div>

              <!-- 折叠区域 -->
              <transition name="slide">
                <div v-show="data.positionParams.enablePositionManagement">
                  <el-row :gutter="15">
                    <el-col :md="12">
                      <el-form-item label="*最大持仓">
                        <el-input type="number" step="1" v-model.number="data.positionParams.maxPositionsNum" placeholder="例如: 20.0">
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="12">
                      <el-form-item label="*最小持仓">
                        <el-input type="number" step="1" v-model.number="data.positionParams.minPositionsNum" placeholder="例如: 1.0">
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :md="12">
                      <el-form-item label="*最大加仓次数">
                        <el-input-number v-model="data.positionParams.pyramiding" :min="0" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </transition>
            </div>
            <!-- 按钮区域 -->
            <el-form-item>
              <el-button size="default" type="primary" @click="onSearch()" style="width: 100%;">
                <el-icon>
                  <Search />
                </el-icon>
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧回测结果显示区 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="17" :xl="18" class="results-panel-col">
        <el-card class="results-panel-card" shadow="never">
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
            </el-tab-pane>
            <el-tab-pane label="收益明细表" name="forth">
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import DateUtils from '@/utils/DateUtils'
import { nextTick, ref, onMounted, reactive, onUnmounted } from 'vue'
import quantApi from '@/api/quantApi'
import { ElMessage, makeInstaller } from 'element-plus';
import ProfitLineChart from '@/components/pc/Charts/ProfitLineChart.vue'
import AnnualIncomeChart from '@/components/pc/Charts/AnnualIncomeChart.vue'
import useStrategyParams from '@/composables/useStrategyParams';
import useTradingParams from '@/composables/useTradingParams';
import useRiskManagementParams from '@/composables/useRiskManagementParams';
import usePositionManagementParams from '@/composables/usePositionManagementParams';
/**
 * 指数选项
 */
interface IndexOption {
  code: string
  name: string
  market: string
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
interface TradeStatsData {
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
// 组合使用
const { strategyParams } = useStrategyParams()
const { tradingParams } = useTradingParams()
const { riskParams } = useRiskManagementParams()
const { positionParams } = usePositionManagementParams()

const data = reactive({
  loading: true,
  isSimulateLoading: true,
  activeIncomeTab: 'first',
  activeProfitTab: 'first',
  // 指数配置
  indexes: [] as IndexOption[], // 标的列表
  // 1. 参数区域
  // 基本设置
  instruments: 'stocks', // TODO：表单-标的类型(stocks、futures)
  currentIndex: {} as IndexOption, // 表单-标的
  strategyId: '', // 表单-策略ID（回显）
  strategyName: 'ma_strategy', // 表单-策略名称（选择回显）
  strategyType: '', // 表单-策略类型(回显)
  startDate: null as (string | null), // 表单-回测开始时间
  endDate: null as (string | null), // 表单-回测结束时间
  timeFrame: 'daily', // TODO:表单-时间框架/策略运行频率
  initialCapitalInput: 10000, // TODO:表单-初始资金，100万更符合实际回测需求
  dataSource: 'tushare', // TODO:表单-数据源
  performanceAttribution: false, // TODO：是否进行业绩归因分析
  // 模块化引入
  strategyParams,
  tradingParams,
  riskParams,
  positionParams,
  // ====== 新增字段 START ======
  // 6. 新增回测验证参数（先不考虑）
  enableBacktestValidation: false, // TODO：是否启用回测验证
  inSampleRatio: 0.7, // TODO：样本内数据比例70%
  outSampleRatio: 0.3, // TODO：样本外数据比例30%
  rollingWindow: 252, // TODO：滚动窗口252个交易日(1年)
  lookAheadCheck: true, // TODO：检查前瞻偏差
  survivorshipBiasAdjustment: true, // TODO：幸存者偏差调整
  benchmarkComparison: true, // TODO：与基准对比
  benchmark: '000300.SH', // TODO：表单-基准，设置默认基准为沪深300
  // 2. 回测区域
  // 数据源（指数+均线+本身收益数据（3个api数组，4个计算）
  maDatas: [] as MaData[], // api某指数均线数据, 明确类型
  // maValues: [], //TODO :计算的指数均线值（用于图表显示）
  // 新增数据
  index_info: {},
  strategy_info: {},
  trade_list: [] as TradeDetail[], // 明确类型
  trade_data: {} as TradeStatsData,
  // 需计算
  closePoints: [] as number[], // 计算的收盘价数组, 明确类型
  annuals: [] as string[], // 计算的年份数组, 明确类型
  dates: [] as string[], // 计算的日期数组, 明确类型
  multiTradeData: [] as TradeStatsData[],
  profitValues: [] as number[], // 计算的日收益数组（用于图表显示）, 明确类型
  annualProfitValues: [] as number[], //  计算的年收益数组（用于图表显示）, 明确类型
  multiTradeAnnualProfits: [] as AnnualProfit[], // 计算的年收益数组收益（可多个策略）, 明确类型
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
      if (data.indexes.length > 0) {
        data.currentIndex = data.indexes[0];
        onSearch() // 初始加载时执行一次查询
      }
    } else {
      ElMessage.error('获取指数列表失败！');
    }
  } catch (error) {
    console.error('Error in fetchIndexes:', error);
    ElMessage.error('获取指数列表异常！');
  } finally {
    data.loading = false; // 无论成功失败，结束loading状态
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
    console.log('选中的标的', data.currentIndex)
    const params = {
      strategy: 'ma_strategy',
      code: data.currentIndex.code,
      market: data.currentIndex.market,
      ma: Number(data.strategyParams.ma), // 确保是数字
      buyThreshold: Number(data.tradingParams.buyThreshold), // 确保是数字
      sellThreshold: Number(data.tradingParams.sellThreshold), // 确保是数字
      serviceCharge: Number(data.tradingParams.serviceCharge), // 确保是数字
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
      const newTradeData = {
        ...res.data.trade_stats,
        ...res.data.trade_profit,
        strategyName: `MA(${params.ma}) 指数(${params.code})`, // 添加策略名称
        investmentProfit: Number(((res.data.trade_profit.totalRate + 1) * 1000).toFixed(2)),
        winRate: res.data.trade_stats.totalTradeCount ? (res.data.trade_stats.winCount / res.data.trade_stats.totalTradeCount) : 0,
      };
      data.trade_data = newTradeData;
      console.log('交易数据（统计交易数据和资产变化）', data.trade_data)
      // 更新 multiTradeData，可以考虑只保留最新的，或者根据需求累加
      data.multiTradeData = [newTradeData]; // 这里替换为最新的，如果需要累加则用push
      // 更新图表所需数据
      if (res.data.index_daily_kline && Array.isArray(res.data.index_daily_kline)) {
        data.dates = res.data.index_daily_kline.map((item: any) => item.date);
        data.closePoints = res.data.index_daily_kline.map((item: any) => item.closePoint);
      }
      if (res.data.trade_profit && Array.isArray(res.data.trade_profit.dailyProfitList)) {
        data.profitValues = res.data.trade_profit.dailyProfitList.map((item: any) => item.value);
      }
      if (res.data.strategy_daily_ma && Array.isArray(res.data.strategy_daily_ma)) {
        data.maDatas = res.data.strategy_daily_ma;
      }

      ElMessage.success('模拟成功！');
    } else {
      ElMessage.error(res.message || '模拟失败！');
    }
  } catch (error) {
    console.error('Failed to simulate:', error);
    ElMessage.error('模拟请求异常！');
  } finally {
    data.isSimulateLoading = false;
  }
};

// function clearIndexCommonData() { // 似乎未使用，可以考虑移除
//   data.index_info = {}
// }

const onSearch = () => {
  // 可以在这里添加表单校验逻辑
  if (!data.currentIndex) {
    ElMessage.warning('请选择指数');
    return;
  }
  // 其他参数校验...
  simulate();
}
</script>
<style scoped lang="scss">
.backtest-view-container {
  padding: 15px;
  height: calc(100vh - 45px);
  box-sizing: border-box;
}

.main-layout-row,
.config-panel-col,
.results-panel-col {
  height: 100%;
}

.config-panel-card,
.results-panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep(.el-card__header) {
    flex-shrink: 0;
  }

  ::v-deep(.el-card__body) {
    flex-grow: 1;
    overflow-y: auto;
    padding: 15px;
  }
}

//TIPS：修复el-input-number输入框内数字遮挡的问题
::v-deep .el-input-number .el-input__inner {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.config-panel-card {
  ::v-deep(.el-form-item) {
    margin-bottom: 12px;
  }

  ::v-deep(.el-form-item__label) {
    padding-bottom: 2px;
  }
}

// 公共参数区块标题样式
.param-section {
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  :deep(.param-section-header-flex) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .section-title {
      font-size: 1.05rem;
      font-weight: 600;

      i {
        margin-right: 0.3rem;
      }
    }

    .header-controls {
      display: flex;
      align-items: center;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  /* 控制最大高度 */
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
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

// 响应式布局
@media (max-width: 992px) {
  .main-layout-row {
    flex-direction: column;
  }

  .config-panel-col,
  .results-panel-col {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }

  .results-panel-col {
    margin-bottom: 0;
  }

  .config-panel-card,
  .results-panel-card {
    max-height: none;
  }
}
</style>
