<template>
  <el-menu
    :default-active="data.activeIndex"
    :default-opened="data.openedIndex"
    class="el-menu-vertical-demo"
    router
    @select="handleSelect"
    :collapse="isCollapse"
    >
    <el-menu-item index="/home">
      <Icon :icon="data.menuList[0].icon" :width="20" :height="20" />
      <template #title>
        {{ data.menuList[0].name }}
      </template>
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
        <span>{{ subItem.name }}</span>
      </template>
      <el-menu-item
        v-for="(menuItem) in subItem.children"
        :key="menuItem.index"
        :index="menuItem.index"
      >
        <Icon :icon="menuItem.icon" :width="20" :height="20" />
        <template #title>
          {{ menuItem.name }}
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps } from 'vue';
import { useStore } from 'vuex';
import Icon from '@/components/IconifyIcon.vue'

const props = defineProps<{
  isCollapse: boolean
}>();

const data = reactive({
  activeIndex: '/home',
  openedIndex: ['/home'],
  menuList: [{
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
  }]
})
const store = useStore();
onMounted(() => {
  data.activeIndex = localStorage.getItem("sideBarDefaultActive") || "";
  data.openedIndex = (JSON.parse(localStorage.getItem("sideBarDefaultOpened") || "[]")) as string[]
})

function handleSelect (index: string, path: string[]) {
  console.log('select', index, path)
  const params = {
    index,
    path
  };
  store.commit('sidebarModule/set_sidebar_active', params);
  const navName = data.menuList.filter((item) => item.index === index);
  if (navName.length > 0) {
    store.commit('sidebarModule/set_nav_name', navName[0].name); // 调用 NAV_NAME 这个 mutation
  } else {
    store.commit('sidebarModule/set_nav_name', '');
  }
}
</script>
<style scoped lang="scss">
.el-menu {
  border: none;
  background-color: #304156 !important;
  color: rgb(191, 203, 217) !important;
}
::v-deep .el-sub-menu__title:hover{
  background-color: #263445 !important;
}
.el-menu-item {
  background-color: #304156 !important;
  color: rgb(191, 203, 217) !important;
}
.el-menu-item:hover{
  outline: 0 !important;
  color: #409EFF !important;
  background: #263445 !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #409EFF !important;
}
::v-deep .el-menu--popup {
  min-width: 160px;
  margin: 0 !important;
  padding: 0 !important;
  border: none;
  background-color: #304156 !important;
  position: fixed !important;
  left: 64px !important;
  top: 0 !important;
  transform: translateX(0) !important;
}
::v-deep .el-menu--popup .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  min-width: 160px;
}
::v-deep .el-menu--popup .el-menu-item:hover {
  background-color: #263445 !important;
  color: #fff !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #409EFF !important;
}
.menu-popo {
  border: none !important;
  padding: 0 !important;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  position: fixed !important;
  margin: 0 !important;
  transform: translateX(0) !important;
  transition: opacity 0.3s !important;
  background-color: #304156 !important;
  min-width: 160px !important;
  left: 64px !important;
  top: 0 !important;
}
::v-deep .el-menu--popup {
  border-radius: 0;
  transition: opacity 0.3s ease-in-out;
}
.el-menu-item span,
::v-deep .el-sub-menu__title span {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

::v-deep .el-menu--collapse .el-menu-item span,
::v-deep .el-menu--collapse .el-sub-menu__title span {
  opacity: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu--collapse {
  width: 64px;
}
</style>
