<template>
    <div class="page">
        <el-card class="box-card">
        <template #header>
            <div class="card-header">
            <div class="filter-container">
                <el-input v-model="data.searchKeyword" placeholder="输入股票代码或名称搜索" class="filter-item" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
                <el-select v-model="data.industry" placeholder="行业分类" clearable @change="handleSearch" class="filter-item">
                <el-option v-for="item in data.industryOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="data.market" placeholder="市场类型" clearable @change="handleSearch" class="filter-item">
                <el-option v-for="item in data.marketOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="data.priceChange" placeholder="涨跌幅" clearable @change="handleSearch" class="filter-item">
                <el-option v-for="item in data.priceChangeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-button type="primary" @click="handleSearch" class="filter-item">搜索</el-button>
            </div>
            </div>
        </template>
        <el-table :data="data.stockList" v-loading="data.loading" stripe class="stock-table">
            <el-table-column prop="code" label="股票代码" align="center" min-width="100" />
            <el-table-column prop="name" label="股票名称" align="center" min-width="120" />
            <el-table-column prop="price" label="最新价" align="right" min-width="100">
            <template #default="scope">
                <span :class="scope.row.priceChange >= 0 ? 'price-up' : 'price-down'">
                {{ scope.row.price.toFixed(2) }}
                </span>
            </template>
            </el-table-column>
            <el-table-column prop="priceChange" label="涨跌幅" align="right" min-width="100">
            <template #default="scope">
                <span :class="scope.row.priceChange >= 0 ? 'price-up' : 'price-down'">
                {{ (scope.row.priceChange * 100).toFixed(2) }}%
                </span>
            </template>
            </el-table-column>
            <el-table-column prop="volume" label="成交量(手)" align="right" min-width="120">
            <template #default="scope">
                {{ (scope.row.volume / 100).toFixed(0) }}
            </template>
            </el-table-column>
            <el-table-column prop="amount" label="成交额(万)" align="right" min-width="120">
            <template #default="scope">
                {{ (scope.row.amount / 10000).toFixed(2) }}
            </template>
            </el-table-column>
            <el-table-column prop="marketValue" label="市值(亿)" align="right" min-width="120">
            <template #default="scope">
                {{ (scope.row.marketValue / 100000000).toFixed(2) }}
            </template>
            </el-table-column>
            <el-table-column prop="industry" label="所属行业" align="center" min-width="120" />
            <el-table-column prop="market" label="市场" align="center" min-width="100" />
            <el-table-column label="操作" align="center" fixed="right" width="100">
            <template #default="scope">
                <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
            v-model:current-page="data.currentPage"
            v-model:page-size="data.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="data.total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
        </div>
        </el-card>
    </div>
    </template>
    <script setup lang="ts">
    import { reactive } from 'vue'
    import { ElMessage } from 'element-plus'
    // 模拟数据
    const data = reactive({
        loading: false,
        searchKeyword: '',
        industry: '',
        market: '',
        priceChange: '',
        currentPage: 1,
        pageSize: 20,
        total: 100,
        industryOptions: [
        { value: '1', label: '金融行业' },
        { value: '2', label: '科技行业' },
        { value: '3', label: '医药行业' },
        { value: '4', label: '消费行业' },
        { value: '5', label: '制造业' }
        ],
        marketOptions: [
        { value: 'SH', label: '上证' },
        { value: 'SZ', label: '深证' },
        { value: 'BJ', label: '北证' }
        ],
        priceChangeOptions: [
        { value: '1', label: '涨幅>5%' },
        { value: '2', label: '涨幅>0%' },
        { value: '3', label: '跌幅>0%' },
        { value: '4', label: '跌幅>5%' }
        ],
        stockList: [
        {
            code: '600000',
            name: '浦发银行',
            price: 7.85,
            priceChange: 0.0356,
            volume: 123456700,
            amount: 98765432,
            marketValue: 23000000000,
            industry: '金融行业',
            market: '上证'
        },
        {
            code: '000001',
            name: '平安银行',
            price: 12.35,
            priceChange: -0.0245,
            volume: 98765400,
            amount: 123456789,
            marketValue: 34000000000,
            industry: '金融行业',
            market: '深证'
        }
        ]
    })
    // 搜索处理
    const handleSearch = () => {
        data.loading = true
        // TODO: 调用后端接口获取数据
        setTimeout(() => {
        data.loading = false
        ElMessage.success('搜索成功')
        }, 1000)
    }
    // 分页大小改变
    const handleSizeChange = (val: number) => {
        data.pageSize = val
        handleSearch()
    }
    // 当前页改变
    const handleCurrentChange = (val: number) => {
        data.currentPage = val
        handleSearch()
    }
    // 查看详情
    const handleDetail = (row: any) => {
        ElMessage.info(`查看股票详情：${row.code} ${row.name}`)
    }
    </script>
    <style scoped lang="scss">
    .page {
        height: calc(100vh - 45px);
        padding: 16px;
        box-sizing: border-box;
    }
    .box-card {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .filter-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        .filter-item {
        min-width: 160px;
        }
    }
    .stock-table {
        flex: 1;
        margin: 16px 0;
    }
    .price-up {
        color: #f56c6c;
        font-weight: 500;
    }
    .price-down {
        color: #67c23a;
        font-weight: 500;
    }
    .pagination-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
    }
</style>
