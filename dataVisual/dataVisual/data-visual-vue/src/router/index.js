import Vue from 'vue'
import Router from 'vue-router'
// import DividerComponent from 'vue/src/'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '后台数据管理系统',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '后台数据管理系统', icon: 'dashboard' }
    }]
  },
  {
    path: '/excel',
    component: Layout,
    // name: 'excel数据处理',
    children: [
      {
        path: 'index',
        name: '数据管理',
        component: () => import('@/views/table/index'),
        meta: { title: '数据管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/prediction',
    component: Layout,
    name: '电极帽寿命与质量预测',
    meta: { title: '电极帽寿命与质量预测', icon: 'form' },
    children: [
      {
        path: 'resistance',
        name: '电极帽质量预测',
        component: () => import('@/views/prediction/prediction_resistance.vue'),
        meta: { title: '电极帽质量预测', icon: 'form' }
      },
      {
        path: 'difference',
        name: '电极帽寿命预测',
        component: () => import('@/views/prediction/prediction_difference.vue'),
        meta: { title: '电极帽寿命预测', icon: 'form' }
      }
    ]
  },
  {
    path: '/optimization',
    component: Layout,
    children: [
      {
        path: 'optimization',
        name: '参数优化',
        component: () => import('@/views/optimization/optimization.vue'),
        meta: { title: '参数优化', icon: 'form' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
