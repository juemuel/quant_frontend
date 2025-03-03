<template>
  <div class="page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>策略市场</span>
        </div>
      </template>
      <el-table :data="data.strategies" v-loading="data.loading" stripe style="width: 100%">
        <el-table-column prop="name" label="策略名称" align="center"></el-table-column>
        <el-table-column prop="description" label="策略描述" align="center"></el-table-column>
        <el-table-column prop="author" label="作者" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" align="center">
          <template #default="scope">
            {{ scope.row.price }} 元
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" align="center">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900"></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleBuy(scope.row)">购买</el-button>
            <el-button type="info" size="small" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const data = reactive({
  loading: false,
  strategies: [
    {
      id: 1,
      name: '均线交叉策略',
      description: '基于多条均线的交叉信号进行交易',
      author: '量化专家',
      price: 299,
      rating: 4.5
    },
    {
      id: 2,
      name: 'MACD策略',
      description: '利用MACD指标的金叉死叉进行交易',
      author: '策略大师',
      price: 399,
      rating: 4.8
    },
    {
      id: 3,
      name: '趋势追踪策略',
      description: '结合多个技术指标进行趋势判断',
      author: '量化达人',
      price: 499,
      rating: 4.2
    }
  ]
})

const handleBuy = (strategy: any) => {
  ElMessage.success(`准备购买策略：${strategy.name}`)
}

const handleDetail = (strategy: any) => {
  ElMessage.info(`查看策略详情：${strategy.name}`)
}
</script>

<style scoped>
.page {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
