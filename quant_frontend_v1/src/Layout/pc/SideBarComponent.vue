<template>
  <el-menu
    :default-active="data.activeIndex"
    :default-opened="data.openedIndex"
    class="el-menu-vertical-demo"
    router
    @select="handleSelect"
    >
    <el-menu-item index="/home">
      <Icon :icon="data.menuList[0].icon" :width="20" :height="20" />
      &nbsp;&nbsp;{{ data.menuList[0].name }}
    </el-menu-item>
    <el-sub-menu
      v-for="(subItem) in data.menuList.slice(1)"
      :key="subItem.index"
      :index="subItem.index"
    >
      <template #title>
        <Icon :icon="subItem.icon" :width="20" :height="20" />
         &nbsp;&nbsp;{{ subItem.name }}
      </template>
      <el-menu-item
        v-for="(menuItem) in subItem.children"
        :key="menuItem.index"
        :index="menuItem.index"
      >
        <Icon :icon="menuItem.icon" :width="20" :height="20" />
         &nbsp;&nbsp;{{ menuItem.name }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex';
import Icon from '@/components/IconifyIcon.vue'
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
    index: '/quant',
    name: '量化系统',
    icon: 'ep:trend-charts',
    children: [
      { index: '/quant/recommend', name: '推荐系统', icon: 'ep:pointer' },
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
/**
 * 菜单栏点击事件
 * @param index 路径（从父路径到子路径名）
 * @param path 一般是二个字符串构成的路径数组，父路径名，和子路径名
 */
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
  background-color: #333 !important;
  color: rgb(191, 203, 217) !important;
}
::v-deep .el-sub-menu__title:hover{
  background-color: #333 !important;
}
.el-menu-item {
  background-color: #333  !important;
  color: rgb(191, 203, 217) !important;
}
.el-menu-item:hover{
  outline: 0 !important;
  color: #409EFF !important;
  background: #333 !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #409EFF !important;
}
</style>
