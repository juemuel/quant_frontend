import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login01',
    name: 'login01',
    component: () => import('../views/Login/LoginView01.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
