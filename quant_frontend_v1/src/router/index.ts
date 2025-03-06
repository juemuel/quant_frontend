import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from '@/Layout/pc/LayoutView.vue'
import { ElMessage } from 'element-plus'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LayoutView,
    children: [
      { path: '', redirect: '/home' },
      { path: '/home', component: HomeView },
      { // 市场行情
        path: '/market',
        children: [
          {
            path: 'myStocks',
            name: 'myStocks',
            component: () => import('../views/Market/pc/MyStocksView.vue')
          },
          {
            path: 'allStocks',
            name: 'allStocks',
            component: () => import('../views/Market/pc/AllStocksView.vue')
          },
          {
            path: 'allIndex',
            name: 'allIndex',
            component: () => import('../views/Market/pc/AllIndexView.vue')
          },
          {
            path: 'allFutures',
            name: 'allFutures',
            component: () => import('../views/Market/pc/AllFuturesView.vue')
          }
        ]
      },
      { // 量化中心
        path: '/quant',
        children: [
          {
            path: 'monitor',
            name: 'monitor',
            component: () => import('../views/Quant/pc/MonitorView.vue')
          },
          {
            path: 'backTest',
            name: 'backTest',
            component: () => import('../views/Quant/pc/BackTestView.vue')
          },
          {
            path: 'strategyMarket',
            name: 'strategyMarket',
            component: () => import('../views/Quant/pc/StrategyMarketView.vue')
          }
        ]
      },
      { // 系统管理
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
      { // 产品管理
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
      { // 订单管理
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
    component: () => import('../views/Login/pc/LoginView01.vue'),
    meta: {
      hideToolbar: true // 标记需要隐藏工具栏
    }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/DemoView.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  console.log('to', to)
  if (to.path === '/login01') {
    next();
  } else {
    const Authorization = localStorage.getItem('Authorization');
    console.log('Authorization', Authorization)
    if (Authorization === null || Authorization === '' || Authorization === undefined || Authorization === 'undefined') {
      ElMessage.error('请先登录');
      next('/login01');
    } else {
      next();
    }
  }
});
export default router
