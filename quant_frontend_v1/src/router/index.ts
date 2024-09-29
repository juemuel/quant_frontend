import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from '@/Layout/pc/LayoutView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LayoutView,
    children: [
      { path: '', redirect: '/home' },
      { path: '/home', component: HomeView },
      {
        path: '/quant',
        children: [
          {
            path: 'recommend',
            name: 'recommend',
            component: () => import('../views/Quant/pc/RecommendView.vue')
          },
          {
            path: 'backTest',
            name: 'backTest',
            component: () => import('../views/Quant/pc/BackTestView.vue')
          }
        ]
      },
      {
        path: '/system',
        children: [
          {
            path: 'userList',
            name: 'userList',
            component: () => import('../views/System/pc/UserListView.vue')
          },
          {
            path: 'roleList',
            name: 'roleList',
            component: () => import('../views/System/pc/RoleListView.vue')
          }
        ]
      },
      {
        path: '/product',
        children: [
          {
            path: 'productList',
            name: 'productList',
            component: () => import('../views/Product/pc/ProductListView.vue')
          },
          {
            path: 'discountList',
            name: 'discountList',
            component: () => import('../views/Product/pc/DiscountListView.vue')
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('../views/Product/pc/ProductView.vue')
          }
        ]
      },
      {
        path: '/order',
        children: [
          {
            path: 'orderList',
            name: 'orderList',
            component: () => import('../views/Order/pc/OrderListView.vue')
          }
        ]
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
