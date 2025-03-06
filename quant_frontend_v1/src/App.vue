<template>
  <div id="app">
    <global-side-toolbar v-if="showToolbar" />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute()

const showToolbar = computed(() => {
  // 排除登录页和显式声明隐藏的页面
  return !route.meta.hideToolbar && route.name !== 'Login'
})
// 1. 增加窗口监听防抖
const debounce = (
  fn: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (entries.length > 0 && entries[0].target) {
        fn(entries, observer);
      }
    }, delay);
  };
};
// 修正ResizeObserver实现
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  private debouncedCallback: ReturnType<typeof debounce>;

  constructor(callback: any) { // 使用完整命名空间
    const wrappedCallback: any = (entries: any, observer: any) => {
      callback(entries, observer);
    };
    super(wrappedCallback);
    this.debouncedCallback = debounce(wrappedCallback, 200);
  }

  observe(target: Element, options?: any): void {
    this.debouncedCallback([], this);
    super.observe(target, options);
  }

  disconnect(): void {
    super.disconnect();
    if (this.debouncedCallback) {
      clearTimeout((this.debouncedCallback as any).timer);
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f2f2f2;  // 加个背景色区分头部
}
body {
  margin: 0;
  padding: 0;
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
.el-sub-menu__title {
  color: rgb(191, 203, 217) !important;
}
</style>
