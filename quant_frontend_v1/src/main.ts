import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import Vconsole from "vconsole";
import GlobalSideToolbar from '@/components/pc/GlobalSideToolbar.vue'

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const vconsole = new Vconsole();
}
const app = createApp(App)
app.component('GlobalSideToolbar', GlobalSideToolbar)
app.use(store).use(ElementPlus).use(router).mount('#app')
