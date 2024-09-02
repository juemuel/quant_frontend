<template>
  <div id="workingArea">
    <!-- 回测参数 -->
    <table class="inputTable">
      <tr>
        <td width="25%">
          <span data-toggle="tooltip" data-placement="top" title="选择某一个指数进行模拟回测">
            请选择指数:
            <span class="glyphicon glyphicon-question-sign"></span>
          </span>
        </td>
        <td width="25%">
          <select @change="changeParamWithFlushDate" @click="simulate" v-model="currentIndex" class="indexSelect form-control">
            <option v-for="bean in indexes" :value="bean.code" :key="bean.code">{{bean.name}} - ( {{bean.code}} )</option>
          </select>
        </td>
        <td width="25%"></td>
        <td width="25%"></td>
      </tr>
      <!-- 其他参数配置 -->
    </table>
    <!-- 标签页 -->
    <el-tabs v-model="activeIncomeTab" @tab-click="handleIncomeClick">
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
    <el-tabs v-model="activeProfitTab" @tab-click="handleProfitClick">
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
import { ref, onMounted } from 'vue'
const currentIndex = ref('')
const indexes = ref([])
const activeIncomeTab = ref('first')
const activeProfitTab = ref('first')

onMounted(() => {
  fetchIndexes()
})

const fetchIndexes = async () => {
  try {
    // 直接调用将以本地端口访问
    const response = await axios.get('/api/indexes')
    indexes.value = response.data
  } catch (error) {
    console.error('Failed to fetch indexes:', error)
  }
}

const changeParamWithFlushDate = () => {
  // 更新参数并刷新日期
}

const simulate = () => {
  // 模拟回测
}

const handleIncomeClick = (tab, event) => {
  console.log(tab, event)
}

const handleProfitClick = (tab, event) => {
  console.log(tab, event)
}
</script>

<style scoped>
</style>
