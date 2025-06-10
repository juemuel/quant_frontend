<template>
  <div class="sidebar-wrapper">
    <div class="menu-container">
      <el-menu
        :default-active="data.activeIndex"
        :default-opened="data.openedIndex"
        class="el-menu-vertical-demo"
        router
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/home">
          <Icon :icon="data.menuList[0].icon" :width="20" :height="20" />
          <span v-if="!isCollapse">{{ data.menuList[0].name }}</span>
        </el-menu-item>

        <el-sub-menu
          v-for="(subItem) in data.menuList.slice(1)"
          :key="subItem.index"
          :index="subItem.index"
          :popper-append-to-body="true"
          popper-class="menu-popo"
        >
          <template #title>
            <Icon :icon="subItem.icon" :width="20" :height="20" />
            <span v-if="!isCollapse">{{ subItem.name }}</span>
          </template>
          <el-menu-item
            v-for="(menuItem) in subItem.children"
            :key="menuItem.index"
            :index="menuItem.index"
          >
            <Icon :icon="menuItem.icon" :width="20" :height="20" />
            <span v-if="!isCollapse">{{ menuItem.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <!-- 折叠按钮始终固定在底部 -->
    <div class="sidebar-footer">
      <div class="tools">
        <!-- 非折叠状态下显示的按钮 -->
        <div v-if="!isCollapse" class="tool-group">
          <!-- 主题切换 -->
          <el-tooltip content="切换主题" placement="top">
            <div class="tool-btn" @click="toggleTheme">
              <el-icon>
                <Moon v-if="!isDarkMode" />
                <Sunny v-else />
              </el-icon>
            </div>
          </el-tooltip>
          <!-- 更多功能 -->
          <el-tooltip content="更多功能" placement="top">
            <div class="tool-btn" @click="showMoreOptions">
              <el-icon>
                <More />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
        <!-- 折叠按钮始终显示 -->
        <el-tooltip :content="isCollapse ? '展开' : '折叠'" placement="top">
          <div class="tool-btn" @click="toggleCollapse">
            <el-icon>
              <component :is="isCollapse ? ArrowRightBold : ArrowLeftBold" />
            </el-icon>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Icon from '@/components/IconifyIcon.vue'
import {
  ArrowLeftBold,
  ArrowRightBold,
  Setting,
  Moon,
  Sunny,
  Bell,
  User,
  More
} from '@element-plus/icons-vue'
const props = defineProps<{
  isCollapse: boolean,
  isDarkMode: boolean
}>()

const emit = defineEmits<{(e: 'update:is-collapse', value: boolean): void
}>()
const toggleCollapse = () => {
  emit('update:is-collapse', !props.isCollapse)
}
const toggleTheme = () => {
  console.log('toggleTheme')
}
const showMoreOptions = () => {
  console.log('showMoreOptions')
}
// menu 数据不变
const data = {
  activeIndex: '/home',
  openedIndex: ['/home'],
  menuList: [
    {
      index: '/home',
      name: '首页',
      icon: 'ep:home-filled'
    },
    {
      index: '/system',
      name: '系统管理',
      icon: 'ep:platform',
      children: [
        { index: '/system/userList', name: '用户列表', icon: 'ep:user' },
        { index: '/system/roleList', name: '角色列表', icon: 'ep:open' }
      ]
    },
    {
      index: '/market',
      name: '市场行情',
      icon: 'icon-park-outline:market',
      children: [
        { index: '/market/myStocks', name: '我的自选股', icon: 'subway:mark-2' },
        { index: '/market/allIndex', name: '指数中心', icon: 'hugeicons:market-analysis' },
        { index: '/market/allStocks', name: '股票中心', icon: 'hugeicons:apple-stocks' },
        { index: '/market/allFutures', name: '期货中心', icon: 'token:future' }
      ]
    },
    {
      index: '/quant',
      name: '量化系统',
      icon: 'ep:trend-charts',
      children: [
        { index: '/quant/monitor', name: '监控系统', icon: 'ep:monitor' },
        { index: '/quant/strategyMarket', name: '策略市场', icon: 'ep:shopping-bag' },
        { index: '/quant/backTest', name: '回测系统', icon: 'ep:data-line' }
      ]
    },
    {
      index: '/product',
      name: '商品系统',
      icon: 'ep:shop',
      children: [
        { index: '/product/productList', name: '产品列表', icon: 'ep:goods' },
        { index: '/product/discountList', name: '优惠活动', icon: 'ep:present' },
        { index: '/product/product', name: '购买产品', icon: 'ep:shopping-cart-full' }
      ]
    },
    {
      index: '/order',
      name: '订单',
      icon: 'ep:list',
      children: [
        { index: '/order/orderList', name: '订单列表', icon: 'ep:tickets' }
      ]
    }
  ]
}
</script>

<style scoped lang="scss">
::v-deep .el-icon{
  width: 20px;
  height: 20px;
  font-size: 20px;
}
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.menu-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;

  //tips: 优化菜单滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #59708a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #6c8ba4;
  }
}

.el-menu-vertical-demo {
  flex: 1;
  overflow-y: auto;
  border: none;
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px; // 留出更多空间
  background-color: #3a4d66;
  border-top: 1px solid #4a5b6d;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.tools {
  display: flex;
  gap: 12px;
}

.tool-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: #e0e7ef;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.tool-group {
  transition: opacity 0.3s ease;
  display: flex;
  gap: 12px;
}
</style>
