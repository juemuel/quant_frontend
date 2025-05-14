<template>
    <el-card class="market-card">
    <!-- <div class="category-title">{{ props.title }}市场</div> -->
    <el-carousel
        :interval="props.interval"
        indicator-position="none"
        :autoplay="true"
    >
        <el-carousel-item
        v-for="market in props.marketList"
        :key="market.title"
        >
        <div class="carousel-content">
            <div class="card-header">
            <span class="header-title">{{ market.title }}</span>
            <span class="update-time">{{ market.updateTime }}</span>
            </div>
            <div class="stock-grid">
            <!-- 涨幅列 -->
            <div class="stock-column">
                <div class="column-title">涨幅前5</div>
                <div
                v-for="(item, idx) in market.topGainers"
                :key="idx"
                class="stock-item"
                >
                <div class="stock-name">{{ item.name }}</div>
                <div class="stock-code">{{ item.code }}</div>
                <div :class="['stock-price', 'price-up']">{{ item.price }}</div>
                <div :class="['stock-change', 'price-up']">
                {{ item.change }}%
                </div>
                </div>
            </div>
            <!-- 跌幅列 -->
            <div class="stock-column">
                <div class="column-title">跌幅前5</div>
                <div
                v-for="(item, idx) in market.topLosers"
                :key="idx"
                class="stock-item"
                >
                <div class="stock-name">{{ item.name }}</div>
                <div class="stock-code">{{ item.code }}</div>
                <div :class="['stock-price', 'price-down']">{{ item.price }}</div>
                <div :class="['stock-change', 'price-down']">
                {{ item.change }}%
                </div>
                </div>
            </div>
            </div>
        </div>
        </el-carousel-item>
    </el-carousel>
    </el-card>
</template>
<script setup lang="ts">
import { ref, defineProps, onMounted, PropType } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'
const carouselRef = ref(null)

const props = defineProps({
    title: String,
    marketList: {
        type: Array as PropType<Array<{
            title: string
            updateTime: string
            topGainers: any[]
            topLosers: any[]
        }>>,
        required: true
    },
    interval: {
        type: Number,
        default: 5000
    }
})
onMounted(()=>{
    console.log(props.marketList)
})
</script>
<style lang="scss" scoped>
.market-card {
  width: 100%;
  min-width: 380px; // 固定最小宽度
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  // 分类标题
//   .category-title {
//     text-align: left;
//     font-size: 18px;
//     font-weight: 600;
//     color: #303133;
//     margin-bottom: 16px;
//     padding-left: 8px;
//     border-left: 4px solid #409eff;
//   }

  // 轮播容器调整
  :deep(.el-carousel) {
    .el-carousel__container {
      height: 300px; // 根据实际内容高度调整
    }

    // 自定义指示器
    .el-carousel__indicators {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);

      .el-carousel__indicator {
        padding: 6px 4px;

        .el-carousel__button {
          width: 20px;
          height: 3px;
          border-radius: 1px;
          background: #dcdfe6;
          transition: all 0.3s;
        }

        &.is-active .el-carousel__button {
          background: #409eff;
          width: 30px;
        }
      }
    }
  }
}

.carousel-content {
  padding: 12px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    padding-left: 8px;
    border-left: 4px solid #409eff;
    .update-time {
      color: #909399;
      font-size: 12px;
    }
  }
}

/* 今日股票、指数、期货排行 */
.stock-grid {
  display: flex;
  gap: 10px;
  .stock-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    .column-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
      text-align: center;
    }
    .stock-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(2, 1fr);
      gap: 1px;
      padding: 3px 5px;
      border-bottom: 1px dashed #eee;
      line-height: 1.2;
      text-align: left;
      .stock-name {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
      }
      .stock-code {
        color: #909399;
        font-size: 11px;
        text-align: right;
      }
      .stock-price {
        font-size: 14px;
        font-weight: 600;
      }
      .stock-change {
        font-size: 11px;
        text-align: right;
      }
      .price-up {
        color: #f56c6c;
      }
      .price-down {
        color: #67c23a;
      }
    }
  }
}
</style>
