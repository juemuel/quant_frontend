<template>
  <div class="header-container">
    <!-- 左侧：面包屑 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：用户信息 -->
    <div class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          用户：{{ data.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logonOut">退出登录</el-dropdown-item>
            <el-dropdown-item>个人中心</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { routerKey, useRouter } from 'vue-router';
import { useStore } from 'vuex'
const router = useRouter()

const store = useStore()
const data = reactive({
  username: localStorage.getItem("userName") || '未知'
})
function logonOut () {
  console.log('logout')
  localStorage.clear()
  store.commit('userInfoModule/loginChange', {})
  router.push('/login01')
  ElMessage.success('退出成功')
}
</script>
<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px; // 统一高度
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 1000;

  .breadcrumb-wrapper {
    font-size: 14px;
    color: #666;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-dropdown-link {
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
  }
}
</style>
