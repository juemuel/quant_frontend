<template>
    <el-card class="recent-searches-card">
        <div class="recent-title">最近导入 (20)</div>
        <div class="search-box">
            <el-input v-model="searchInput" placeholder="搜索股票代码或名称" class="recent-search-input">
                <template #suffix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <div class="recent-list">
            <div v-for="(item, index) in props.recentSearches" :key="index" class="recent-item"
                :class="{ active: item.code === props.currentStock.code }">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-code">{{ item.code }}</span>
                <span :class="['item-change', item.changePercentage > 0 ? 'price-up' : 'price-down']">
                    {{ item.changePercentage > 0 ? '+' : '' }}{{ item.changePercentage }}%
                </span>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, PropType } from 'vue'
const props = defineProps({
    searchInput: String,
    recentSearches: {
        type: Array as PropType<any[]>,
        required: true
    },
    currentStock: {
        type: Object as PropType<any>,
        required: true
    },
})
const searchInput = ref('')
onMounted(() => {
    console.log(props)
    if (props.searchInput !== '' && props.searchInput) {
        searchInput.value = props.searchInput
    }
})
</script>
<style lang="scss" scoped>
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
</style>
