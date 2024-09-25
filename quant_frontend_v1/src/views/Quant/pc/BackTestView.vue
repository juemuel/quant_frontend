<template>
  <div id="workingArea" class="page">
    <!-- 回测参数 -->
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="请选择指数:">
            <el-select v-model="data.currentIndex" placeholder="请选择指数" :loading="data.loading">
              <el-option v-for="item in data.indexes" :key="item.code" :label="`${item.name} - (${item.code})`"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="MA(均线):">
            <el-select v-model="data.ma" placeholder="请选择均线">
              <el-option label="5日" value="5" />
              <el-option label="10日" value="10" />
              <el-option label="20日" value="20" />
              <el-option label="60日" value="60" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手续费:">
            <el-select v-model="data.serviceCharge" placeholder="请选择手续费">
              <el-option label="无" value="0" />
              <el-option label="0.1%" value="0.001" />
              <el-option label="0.15%" value="0.0015" />
              <el-option label="0.2%" value="0.002" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="购买阈值:">
            <el-select v-model="data.buyThreshold" placeholder="请选择购买阈值">
              <el-option v-for="i in 9" :key="i" :label="`${i / 100 + 1}`" :value="i / 100 + 1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售阈值:">
            <el-select v-model="data.sellThreshold" placeholder="请选择出售阈值">
              <el-option v-for="i in 10" :key="i" :label="`${1 - i / 100}`" :value="1 - i / 100" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始日期:">
            <el-date-picker v-model="data.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
              placeholder="选择日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
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
        &nbsp;查询
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
        <!-- 收益年分布表 -->
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="data.activeProfitTab" @tab-click="handleProfitClick">
      <el-tab-pane label="交易小结" name="first">
        <!-- 交易小结表格 -->
      </el-tab-pane>
      <el-tab-pane label="交易明细表" name="second">
        <!-- 交易明细表 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import axios from 'axios';
import DateUtils from '@/utils/DateUtils'
import { nextTick, ref, onMounted, reactive, onBeforeMount } from 'vue'
import quantApi from '@/api/Quant/quantApi'
const data = reactive({
  loading: true,
  ma: 20,
  buyThreshold: 1.01,
  sellThreshold: 0.99,
  startDate: null, // 开始时间
  endDate: null, // 结束时间
  activeIncomeTab: 'first',
  activeProfitTab: 'first',
  serviceCharge: 0.0,
  // 1. 指数集合 由getCodes获取
  indexes: [
    {
      code: '',
      name: ''
    }
  ],
  // 2. 当前指数
  currentIndex: '000300',
  dates: [],
  indexDatas: [], // api某指数数据
  closePoints: [], // api某指数收盘价
  // flushDate: true,
  indexStartDate: null, // api某指数开始日期
  indexEndDate: null, // api某指数结束日期
  // 3. 收益数据
  profits: [], // api
  profitValues: [],
  maDatas: [], // api
  maValues: [],
  // 4. 交易数据
  trades: [], // api
  // 5. 收益小结（6个收益api字段）
  years: 0, // api
  indexIncomeTotal: 0, // api
  indexIncomeAnnual: 0, // api
  trendIncomeTotal: 0, // api
  trendIncomeAnnual: 0, // api
  annualProfits: [], // api
  annuals: [], // 年收益计算
  indexIncomes: [], // 收益数组
  trendIncomes: [], // 收益数组
  // 6. 交易统计（4个交易统计api字段）
  winCount: 0,
  lossCount: 0,
  avgWinRate: 0,
  avgLossRate: 0
})
// let chart4Profit = null;
// let chart4AnnualIncome = null;
// onBeforeMount(() => {
// })
onMounted(() => {
  fetchIndexes()
})
const simulate = async () => {
  try {
    // data.startDate = DateUtils.formatDate(data.startDate, 'yyyy-MM-dd')
    // data.endDate = DateUtils.formatDate(data.endDate, 'yyyy-MM-dd')
    const str = "/" + data.currentIndex + "/" + data.ma + "/" + data.buyThreshold + "/" + data.sellThreshold + "/" + data.serviceCharge + "/" + data.startDate + "/" + data.endDate + "/"
    const params = {
      url: str
    }
    quantApi.simulateTest(params).then((res) => {
      console.log('res', res)
      if (res.status === 200) {
        data.indexes = res.data
      }
      data.loading = false
    })
  } catch (error) {
    console.error('Failed to simulate:', error)
  }
}
const fetchIndexes = async () => {
  try {
    quantApi.getIndexes({}).then((res) => {
      console.log('res', res)
      data.indexes = []
      if (res.status === 200) {
        data.indexes = [...res.data]
        console.log('data.indexes', data.indexes)
        console.log('data.indexes', data.indexes[1].name)
        // nextTick(() => {
        //   simulate();
        // });
      }
    })
  } catch (error) {
    console.error('Failed to fetch indexes:', error)
  }
}
const onSearch = () => {
  simulate();
}
const changeParamWithFlushDate = (item) => {
  data.startDate = null;
  data.endDate = null;
  simulate();
}

const handleIncomeClick = (tab, event) => {
  console.log(tab, event)
}

const handleProfitClick = (tab, event) => {
  console.log(tab, event)
}
</script>

<style scoped lang="scss">
.page {
  height: calc(100vh - 45px);
}
</style>
