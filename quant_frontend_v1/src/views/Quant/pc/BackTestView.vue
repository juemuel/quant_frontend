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
            <el-form-item label="MA(均线):">
              <el-select v-model="data.ma" placeholder="请选择均线">
                <el-option label="5日" value="5" />
                <el-option label="10日" value="10" />
                <el-option label="20日" value="20" />
                <el-option label="60日" value="60" />
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
      <el-tabs v-model="data.activeIncomeTab" @tab-click="handleIncomeClick">
        <el-tab-pane label="收益小结" name="first">
          <!-- 收益小结表格 -->
        </el-tab-pane>
        <el-tab-pane label="收益折线图" name="second">
          <!-- 收益折线图 -->
        </el-tab-pane>
        <el-tab-pane label="收益年分布图" name="third">
          <!-- 收益年分布图 -->
        </el-tab-pane>
        <el-tab-pane label="收益年分布表" name="forth">
          <div class="label label-warning">收益年分布表</div>
          <table class="table table-striped table-bordered table-condensed">
            <thead>
              <th>年份</th>
              <th>指数收益</th>
              <th>趋势投资收益</th>
            </thead>
            <tbody>
              <!-- <tr v-for="bean in data.annualProfits">
                <td>
                  {{ bean.year }}
                </td>
                <td>
                  {{ (bean.indexIncome * 100).toFixed(2)}}%
                </td>
                <td>
                  {{ (bean.trendIncome * 100).toFixed(2)}}%
                </td>
              </tr> -->
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="data.activeProfitTab" @tab-click="handleProfitClick">
        <el-tab-pane label="策略交易统计" name="first">
          <el-table :data="data.tradeStastics" stripe style="width: 100%">
            <el-table-column prop="totalTradeCount" label="总交易次数" width="200" align="center"></el-table-column>
            <el-table-column prop="winCount" label="盈利交易次数" width="200" align="center"></el-table-column>
            <el-table-column prop="avgWinRate" label="平均盈利比率" width="200" align="center">
              <template #default="scope">
                {{ (scope.row.avgWinRate * 100).toFixed(2)}}%
              </template>
            </el-table-column>
            <el-table-column prop="lossCount" label="亏损交易次数" width="200" align="center">
            </el-table-column>
            <el-table-column prop="avgLossRate" label="平均亏损比率" width="200" align="center">
              <template #default="scope">
                {{ (scope.row.avgLossRate * 100).toFixed(2)}}%
              </template>
            </el-table-column>
            <el-table-column prop="winRate" label="胜率" width="200" align="center">
              <template #default="scope">
                {{ scope.row.winRate}}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交易明细表" name="second">
          <table class="table table-striped table-bordered table-condensed table-hover">
            <!-- <thead>
              <th>盈/亏</th>
              <th>购买日期</th>
              <th>购买盘点</th>
              <th>出售日期</th>
              <th>出售盘点</th>
              <th>盈亏比率</th>
              <th>1000元投资收益</th>
            </thead>
            <tbody>
              <tr v-for="bean in data.trades">
                <td>
                  <span v-if="bean.sellClosePoint > bean.buyClosePoint" class="label label-danger">盈利</span>
                  <span v-if="bean.sellClosePoint <= bean.buyClosePoint" class="label label-success">亏损</span>
                </td>
                <td>{{ bean.buyDate }}</td>
                <td>{{ bean.buyClosePoint }}</td>
                <td>{{ bean.sellDate }}</td>
                <td>
                  <span v-if="bean.sellClosePoint == 0">n/a</span>
                  <span v-if="bean.sellClosePoint != 0">{{ bean.sellClosePoint }}</span>
                </td>
                <td>
                  <span v-if="bean.sellClosePoint == 0">n/a</span>
                  <span class="label"
                    v-bind:class="{ 'label-danger': bean.sellClosePoint > bean.buyClosePoint, 'label-success': bean.sellClosePoint <= bean.buyClosePoint }"
                    v-if="bean.sellClosePoint != 0">{{ (bean.sellClosePoint - bean.buyClosePoint) * 100 / bean.buyClosePoint |
          formatNumberFilter(2) }}%</span>
                </td>
                <td>
                  <span v-if="bean.sellClosePoint == 0">n/a</span>
                  <span v-if="bean.sellClosePoint != 0">{{ bean.rate * 1000 | formatMoneyFilter }}</span>
                </td>
              </tr>
            </tbody> -->
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 回测参数 -->

  </div>
</template>

<script setup>
import axios from 'axios';
import DateUtils from '@/utils/DateUtils'
import { nextTick, ref, onMounted, reactive, onBeforeMount } from 'vue'
import quantApi from '@/api/Quant/quantApi'
const data = reactive({
  loading: true,
  activeIncomeTab: 'first',
  activeProfitTab: 'first',
  // 1. 配置项
  indexes: [ // 指数选择列表
    {
      code: '',
      name: ''
    }
  ],
  tacticsList: [{ // 投资类型选择列表
    id: 0,
    name: '趋势投资'
  }],
  currentIndex: '000300', // 表单-选中的指数
  indexStartDate: null, // 当前指数的开始日期
  indexEndDate: null, // 当前指数的结束日期
  ma: 20, // 表单-均线
  serviceCharge: 0.0, // 表单-手续费
  buyThreshold: 1.01, // 表单-购买阈值
  sellThreshold: 0.99, // 表单-出售阈值
  startDate: null, // 表单-开始时间
  endDate: null, // 表单-结束时间
  // 2. 指数+均线+本身收益数据（3个api数组，4个计算）
  indexDatas: [], // api某指数数据（对应的date日期、closePoints收盘价）
  maDatas: [], // api某指数均线数据
  profits: [], // api指数本身的日收益数据
  years: 0, // 持续年时长
  dates: [], // 计算的日期数组
  closePoints: [], // 计算的指数收盘价
  profitValues: [], // 计算的指数本身日收益数组（用于图表显示）
  maValues: [], // 计算的指数均线值（用于图表显示）
  // 3. 交易数据（1个api数组，4个api字段+2个计算）
  trades: [], // api交易数组
  tradeStastics: [{
    winCount: 0, // 盈利次数
    lossCount: 0, // 亏损次数
    avgWinRate: 0, // 平均盈利比率
    avgLossRate: 0, // 平均亏损比率
    totalTradeCount: 0, // 总交易次数：winCount+lossCount
    winRate: 0 // 胜率：((winCount/(winCount+lossCount))*100).toFixed(2)
  }],
  // 4. 收益数据（1个api数组，4个api字段，4计算）
  annualProfits: [], // api多类目年收益数组（年份year、指数收益indexIncome、趋势投资收益trendIncome）
  incomeStastics: [{
    indexIncomeTotal: 0, // api指数收益率数值
    indexIncomeAnnual: 0, // api指数年化收益率
    trendIncomeTotal: 0, // api趋势投资收益率数值
    trendIncomeAnnual: 0 // api趋势投资年化收益率
  }],
  annuals: [], // 计算的年份数组
  indexIncomes: [], // 计算的年指数收益数组
  trendIncomes: [] // 计算的年趋势收益数组收益数组
})
// let chart4Profit = null;
// let chart4AnnualIncome = null;
// onBeforeMount(() => {
// })
onMounted(() => {
  initData()
})
async function initData () {
  try {
    await fetchIndexes();
    onSearch();
  } catch (error) {
    console.error('Error in fetchIndexes:', error);
  }
}
const fetchIndexes = async () => {
  return new Promise((resolve, reject) => {
    quantApi.getIndexes({}).then((res) => {
      console.log('[api][res]/index-codes/getCodes', res);
      if (res.status === 200) {
        data.indexes = [...res.data];
        resolve(res);
      } else {
        reject(new Error('Failed to fetch indexes'));
      }
    }).catch((error) => {
      console.error('Failed to fetch indexes:', error);
      reject(error);
    });
  });
};
const simulate = async () => {
  try {
    // data.startDate = DateUtils.formatDate(data.startDate, 'yyyy-MM-dd')
    // data.endDate = DateUtils.formatDate(data.endDate, 'yyyy-MM-dd')
    const str = "/" + data.currentIndex + "/" + data.ma + "/" + data.buyThreshold + "/" + data.sellThreshold + "/" + data.serviceCharge + "/" + data.startDate + "/" + data.endDate + "/"
    const params = {
      url: str
    }
    quantApi.simulateTest(params).then((res) => {
      console.log('[api][res]/backtest/simulate', res)
      if (res.status === 200) {
        data.indexStartDate = res.data.indexStartDate;
        data.indexEndDate = res.data.indexEndDate;
        data.years = res.data.years
        clearIndexDatasAndMADatas()
        getIndexDatasAndMADatas(res.data.indexDatas, res.data.profits, res.data.maDatas)
        clearTradesDatas()
        getTradesDatas(res.data.trades, res.data.winCount, res.data.lossCount, res.data.avgWinRate, res.data.avgLossRate)

        data.annualProfits = [];
        data.annuals = [];
        data.indexIncomes = [];
        data.trendIncomes = [];

        // 某种策略的收益数据（2个api数组+4个api数值）

        // data.annualProfits = res.data.annualProfits;
        // data.tacticsResults.profitStastics = []
        // const item1 = {
        //   indexIncomeTotal: res.data.indexIncomeTotal,
        //   indexIncomeAnnual: res.data.indexIncomeAnnual,
        //   trendIncomeTotal: res.data.trendIncomeTotal,
        //   trendIncomeAnnual: res.data.trendIncomeAnnual
        // }
        // data.incomeStastics.push(item1)
      }
      data.loading = false
    })
  } catch (error) {
    console.error('Failed to simulate:', error)
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
 * 清空交易数据
 */
function clearTradesDatas () {
  data.trades = [];
  data.tradeStastics = []
}
/** * 获取[交易数据、盈利交易次数、亏损交易次数、平均盈利比率、平均亏损比率] ->[总交易次数、胜率]
 * @param trades 交易数组
 * @param winCount
 * @param lossCount
 * @param avgWinRate
 * @param avgLossRate
 * @returns trades、tradeStastics
 */
function getTradesDatas (trades, winCount, lossCount, avgWinRate, avgLossRate) {
  try {
    data.trades = trades
    const item = {
      winCount: winCount,
      lossCount: lossCount,
      avgWinRate: avgWinRate,
      avgLossRate: avgLossRate,
      totalTradeCount: winCount + lossCount,
      winRate: ((winCount / (winCount + lossCount)) * 100).toFixed(2)
    }
    data.tradeStastics.push(item)
  } catch (error) {
    console.error('Failed to getTradesDatas:', error)
  }
}
/** * 获取[指数数据、均线数据、起始日期、持续年]->[日期、收盘价、均线数组、指数收益数组]
 * @param indexDatas
 * @param profits
 * @param maDatas
 * @returns indexDatas、profits、maDatas；dates、maValues、profitValues
 */
function getIndexDatasAndMADatas (indexDatas, profits, maDatas) {
  try {
    data.indexDatas = indexDatas;
    data.maDatas = maDatas;
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
    console.log('获取指数数据和均线数据成功')
  } catch (error) {
    console.error('Failed to get indexDatasAndMADatas:', error)
  }
}

const onSearch = () => {
  simulate();
}

const handleIncomeClick = (tab, event) => {
  // console.log(tab, event)
}

const handleProfitClick = (tab, event) => {
  // console.log(tab, event)
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
}
</style>
