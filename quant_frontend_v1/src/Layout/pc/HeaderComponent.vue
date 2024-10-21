<template>
  <div class="header-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="drop-down">
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
  position: relative;
  width: 100%;
  height: 45px;
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
