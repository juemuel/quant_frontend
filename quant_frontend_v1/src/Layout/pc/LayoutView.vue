<template>
  <div class="page-container">
    <el-container style="height: 100%;">
      <el-aside class="side-bar" :class="{ 'is-collapsed': isCollapse }">
        <div class="title" :class="{ 'is-collapsed': isCollapse }">{{ isCollapse ? 'Jue' : 'Juemuel\'s Workspace' }}</div>
        <SideBarComponent :is-collapse="isCollapse" />
      </el-aside>
      <div class="hamburger-container" :class="{ 'is-collapsed': isCollapse }" @click="toggleSideBar">
        <Icon :icon="isCollapse ? 'ep:arrow-right-bold' : 'ep:arrow-left-bold'" :width="24" :height="24" style="color: #fff;" />
      </div>
      <el-container class="main-container" :class="{ 'is-collapsed': isCollapse }">
        <el-header class="header">
          <HeaderComponent />
        </el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import HeaderComponent from "./HeaderComponent.vue";
import SideBarComponent from "./SideBarComponent.vue";
import Icon from '@/components/IconifyIcon.vue';

const isCollapse = ref(false);

const toggleSideBar = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
.header {
  padding: 0;
  display: flex;
  align-items: center;
}

.hamburger-container {
  padding: 0 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: fixed;
  left: 210px;
  top: 60px;
  transform: translateY(0);
  height: 40px;
  line-height: 40px;
  background-color: #304156;
  z-index: 1002;
  display: flex;
  align-items: center;
  border-radius: 0 20px 20px 0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}

.hamburger-container:hover {
  background-color: #409EFF;
}
.title {
  height: 50px;
  line-height: 50px;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  background-color: #304156;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
}
.title.is-collapsed {
  font-size: 20px;
}
.page-container {
  height: 100%;
}
.side-bar {
  transition: all 0.28s ease-in-out;
  width: 210px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow-x: hidden;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.side-bar.is-collapsed {
  width: 64px !important;
}

.title {
  height: 50px;
  line-height: 50px;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  background-color: #304156;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
}
.hamburger-container.is-collapsed {
  left: 64px;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s ease-in-out;
  margin-left: 210px;
  position: relative;
}

.main-container.is-collapsed {
  margin-left: 64px;
}

.el-aside {
  overflow: hidden;
}
</style>
