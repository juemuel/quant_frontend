<template>
  <div class="sidebar-container">
    <el-container style="height: 100%;">
      <el-aside class="side-bar">
        <div class="title">Juemuel's Workspace</div>
        <SideBarComponent />
      </el-aside>
      <el-container class="main-container">
        <el-header class="header">
          <HeaderComponent />
        </el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import HeaderComponent from "./HeaderComponent.vue";
import SideBarComponent from "./SideBarComponent.vue";
export default {
  name: "LayoutView",
  components: {
    SideBarComponent,
    HeaderComponent
  }
};
</script>

<style scoped>
.header {
  padding: 0;
}

.title {
  height: 50px;
  line-height: 50px;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  background-color: #2b2f3a;
  text-align: center;
}

.sidebar-container {
  height: 100%;
}

.side-bar {
  transition: width 0.28s;
  width: 210px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.main-container {
  min-height: 100%;
  -webkit-transition: margin-left 0.28s;
  transition: margin-left 0.28s;
  margin-left: 210px;
  position: relative;
}
</style>
