import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from '@/Layout/pc/LayoutView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: LayoutView,
    children: [
      { path: "", component: HomeView },
      {
        path: '/quant',
        name: 'quant',
        component: () => import('../views/Quant/pc/QuantView.vue')
      },
      {
        path: '/user-list',
        name: 'user-list',
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
