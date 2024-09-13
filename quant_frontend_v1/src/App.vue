<template>
  <div id="app">
    <HeaderToolBar />
    <AsideBar />
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AsideBar from './components/pc/AsideBar.vue'
import HeaderToolBar from './components/pc/HeaderToolBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeaderToolBar,
    AsideBar
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
