<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-for="item in cardItems" :key="item.type"  :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(item.type)">
        <div :class="['card-panel-icon-wrapper', item.iconClass]">
          <Icon :icon="item.icon" :width="24" :height="24" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ item.text }}</div>
          <count-to
            :start-val="0"
            :end-val="item.endVal"
            :duration="item.duration"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { CountTo } from 'vue3-count-to';
import Icon from '@/components/IconifyIcon.vue';
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['handleSetLineChartData']);
// 触发自定义事件
const handleSetLineChartData = (type) => {
  emit('handleSetLineChartData', type); // 冒泡 handleSetLineChartData 事件
};
const cardItems = ref([
  {
    type: 'newVisitis',
    text: '客户数',
    endVal: 102400,
    duration: 2600,
    iconClass: 'icon-people',
    icon: 'ep:user'
  },
  {
    type: 'messages',
    text: '已完成任务数',
    endVal: 81212,
    duration: 3000,
    iconClass: 'icon-message',
    icon: 'ep:success-filled'
  },
  {
    type: 'purchases',
    text: '已完成业绩',
    endVal: 9280,
    duration: 3200,
    iconClass: 'icon-money',
    icon: 'ep:check'
  },
  {
    type: 'shoppings',
    text: '其他',
    endVal: 13600,
    duration: 3600,
    iconClass: 'icon-shopping',
    icon: 'ep:data-analysis'
  }
]);

</script>
<style scoped lang="scss">
.panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3;
        }
      }
      .icon-people {
        color: #40c9c6;
        font-size: 44px;
      }
      .icon-success {
        font-size: 44px;
      }
      .icon-message {
        color: #36a3f7;
        font-size: 44px;
      }
      .icon-money {
        color: #f4516c;
        font-size: 44px;
      }
      .icon-shopping {
        color: #34bfa3;
        font-size: 44px;
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
