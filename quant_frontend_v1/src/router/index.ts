import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from '@/Layout/pc/LayoutView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: '/home',
    component: LayoutView,
    children: [
      { path: "/home", component: HomeView },
      {
        path: '/recommend',
        name: 'recommend',
        component: () => import('../views/Quant/pc/RecommendView.vue')
      },
      {
        path: '/backTest',
        name: 'backTest',
        component: () => import('../views/Quant/pc/BackTestView.vue')
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('../views/System/pc/UserListView.vue')
      }
    ]
  },
  {
    path: '/login01',
    name: 'login01',
    component: () => import('../views/Login/pc/LoginView01.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
