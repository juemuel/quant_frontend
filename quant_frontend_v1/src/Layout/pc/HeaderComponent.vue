<template>
  <div class="header-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="drop-down">
      <el-dropdown>
        <span class="el-dropdown-link">
          用户
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
.header-container {
  position: relative;
  width: 100%;
  height: 40px;
  background: #fff;
}

.breadcrumb {
  position: absolute;
  top: 15px;
  left: 15px;
}

.drop-down {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
</style>
