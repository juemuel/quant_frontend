<template>
  <el-menu default-active="2" class="el-menu-vertical-demo">
    <el-menu-item index="1">
      <i class="el-icon-s-home"></i>首页
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <i class="el-icon-s-order"></i>量化管理
      </template>
      <!-- <router-link to="/quant"> -->
      <el-menu-item index="2-1">回测系统</el-menu-item>
      <!-- </router-link> -->
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <i class="el-icon-user-solid"></i>系统管理
      </template>
      <!-- <router-link to="/userList"> -->
      <el-menu-item index="3-1">用户列表</el-menu-item>
      <!-- </router-link> -->
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">

</script>
<style scoped lang="scss">
a {
  text-decoration: none;
  color: inherit;
}
.el-menu-vertical-demo{
  --el-menu-bg-color: rgb(178, 201, 94)
}

.el-menu {
  border: none;
  background-color: #233142;
  color: rgb(191, 203, 217) !important;
}
.el-sub-menu__title{
  color: rgb(191, 203, 217) !important;
}
.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: #304055;
    color: #ffffff;
}
.el-menu-item.is-active,
.el-sub-menu__title.is-active {
  background-color: #304055;
  color: #ffffff;
}
.el-menu-item,
.el-sub-menu__title {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  background-color: #233142;
  color: rgb(191, 203, 217) ;
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
  position: relative;
  text-align: left;
}
// /* 重置 CSS 变量 */
// :root {
//   --el-menu-text-color: rgb(191, 203, 217) !important;
// }
// .el-menu .el-sub-menu__title {
//   color: rgb(191, 203, 217) !important;
//   --el-menu-text-color: rgb(191, 203, 217) !important;
// }
.el-menu-item:focus,
.el-menu-item:hover,
.el-sub-menu__title:focus,
.el-sub-menu__title:hover {
  background-color: #304055;
  color: #ffffff;
}

.el-menu-item:focus i,
.el-menu-item:hover i,
.el-sub-menu__title:focus i,
.el-sub-menu__title:hover i {
  color: #ffffff;
}
</style>
