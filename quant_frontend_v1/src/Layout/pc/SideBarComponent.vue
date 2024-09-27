<template>
  <el-menu
    default-active="/home"
    class="el-menu-vertical-demo"
    router
    unique-opened>
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>首页
    </el-menu-item>
    <el-sub-menu index="/system">
      <template #title>
        <i class="el-icon-user-solid"></i>系统管理
      </template>
      <el-menu-item index="/system/userList">用户列表</el-menu-item>
      <el-menu-item index="/system/roleList">角色列表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/quant">
      <template #title>
        <i class="el-icon-s-order"></i>量化管理
      </template>
      <el-menu-item index="/quant/recommend">推荐系统</el-menu-item>
      <el-menu-item index="/quant/backTest">回测系统</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/product">
      <template #title>
        <i class="el-icon-s-order"></i>产品
      </template>
      <el-menu-item index="/product/productList">产品配置</el-menu-item>
      <el-menu-item index="/product/product">购买产品</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/order">
      <template #title>
        <i class="el-icon-s-order"></i>订单
      </template>
      <el-menu-item index="/order/orderList">订单列表</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">

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
