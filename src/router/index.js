import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/blog/home',
    component: () => import('@/views/blog/Home'),
    hidden: true
  },
  {
    path: '/blog/article/detail/:articleId',
    component: () => import('@/views/blog/Detail'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/home/Home'),
        meta: { title: '后台管理系统', icon: 'dashboard' }
      }
    ]
  }
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: {title: 'Example'},
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/home/Home'),
  //       meta: {title: 'Table'}
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/home/Home'),
  //       meta: {title: 'Tree'}
  //     }
  //   ]
  // }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [

  // 个人模块
  {
    path: '/my',
    component: Layout,
    children: [
      {
        path: 'edit',
        name: 'UserEdit',
        component: () => import('@/views/user/UserEdit'),
        meta: { title: '个人信息', icon: 'icon_namecard_fill' }
      }
    ]
  },

  // 用户模块
  {
    path: '/user',
    component: Layout,
    name: 'User',
    redirect: '/user/list',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'icon_meeting_fill',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'new',
        component: () => import('@/views/user/NewUser'),
        name: 'NewUser',
        meta: {
          role: ['admin'],
          title: '添加用户',
          icon: 'icon_newapplication_',
          noCache: true
          // 页面需要的权限
        }
      },
      {
        path: 'list',
        component: () => import('@/views/user/UserList'),
        name: 'UserList',
        meta: {
          role: ['admin', 'editor'],
          title: '用户列表',
          icon: 'nested',
          noCache: true
        } // 页面需要的权限
      }
    ]
  },

  // 分类模块
  {
    path: '/category',
    component: Layout,
    name: 'Category',
    redirect: '/category/list',
    alwaysShow: true,
    meta: {
      title: '分类管理',
      icon: 'tree',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/category/CategoryList'),
        name: 'CategoryList',
        meta: {
          role: ['admin','editor'],
          title: '分类列表',
          icon: 'icon_newgroup_fill',
          noCache: true
          // 页面需要的权限
        }
      }
    ]
  },

  // 文章模块
  {
    path: '/article',
    component: Layout,
    name: 'Article',
    redirect: '/article/list',
    alwaysShow: true,
    meta: {
      title: '文章管理',
      icon: 'icon_invite_fill',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'new',
        component: () => import('@/views/article/NewMavonEditor'),
        name: 'NewMavonEditor',
        meta: {
          role: ['admin', 'editor'],
          title: '新建博文',
          icon: 'form',
          noCache: false
          // 页面需要的权限
        }
      },
      {
        path: 'list',
        component: () => import('@/views/article/ArticleList'),
        name: 'ArticleList',
        meta: {
          role: ['admin', 'editor'],
          title: '博文列表',
          icon: 'table',
          noCache: true
        } // 页面需要的权限
      },
      {
        path: 'preview/:articleId',
        component: () => import('@/views/article/ArticleDetail'),
        name: 'ArticleDetail',
        alwaysShow: false,
        hidden: true,
        meta: {
          role: ['admin', 'editor'],
          title: '文章详情',
          icon: 'addteam',
          noCache: true
        } // 页面需要的权限
      },
      {
        path: 'edit/:articleId',
        component: () => import('@/views/article/ArticleEdit'),
        name: 'ArticleEdit',
        alwaysShow: false,
        hidden: true,
        meta: {
          role: ['admin', 'editor'],
          title: '编辑文章',
          icon: 'addteam',
          noCache: true
        } // 页面需要的权限
      }
    ]
  },

  // 评论模块
  {
    path: '/comment',
    component: Layout,
    name: 'Comment',
    redirect: '/',
    alwaysShow: true,
    meta: {
      title: '评论管理',
      icon: 'icon_message_fill',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'add',
        component: () => import('@/views/comment/NewComment'),
        name: 'NewComment',
        meta: {
          role: ['admin','editor'],
          title: '新建评论',
          icon: 'icon_newgroup_fill',
          noCache: true
          // 页面需要的权限
        }
      },
      {
        path: 'list',
        component: () => import('@/views/comment/CommentList'),
        name: 'CommentList',
        meta: {
          role: ['admin','editor'],
          title: '评论列表',
          icon: 'icon_newgroup_fill',
          noCache: true
          // 页面需要的权限
        }
      }
    ]
  },

  // 轮播模块
  {
    path: '/carousel',
    component: Layout,
    name: 'Carousel',
    redirect: '/carousel/list',
    alwaysShow: true,
    meta: {
      title: '轮播管理',
      icon: 'icon_photo_fill',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'new',
        component: () => import('@/views/carousel/NewCarousel'),
        name: 'NewCarousel',
        meta: {
          role: ['admin'],
          title: '新建轮播',
          icon: 'icon_work_fill',
          noCache: true
          // 页面需要的权限
        }
      },
      {
        path: 'list',
        component: () => import('@/views/carousel/CarouselList'),
        name: 'CarouselList',
        meta: {
          role: ['admin'],
          title: '轮播列表',
          icon: 'icon_work_fill',
          noCache: true
          // 页面需要的权限
        }
      },
      {
        path: 'edit/:carouselId',
        component: () => import('@/views/carousel/CarouselEdit'),
        name: 'CarouselEdit',
        hidden: true,
        meta: {
          role: ['admin'],
          title: '编辑轮播',
          icon: 'icon_work_fill',
          noCache: true
          // 页面需要的权限
        }
      }
    ]
  },

  // 友情链接模块
  {
    path: '/link',
    component: Layout,
    name: 'Link',
    redirect: '/category/list',
    alwaysShow: true,
    meta: {
      title: '友情链接',
      icon: 'icon_shakehands_fill',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/category/CategoryList'),
        name: 'LinkList',
        meta: {
          role: ['admin','editor'],
          title: '链接列表',
          icon: 'link',
          noCache: true
          // 页面需要的权限
        }
      }
    ]
  },

  // 网站设置模块
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'edit',
        name: 'Setting',
        component: () => import('@/views/user/UserEdit'),
        meta: { title: '网站设置', icon: 'icon_setting_fill' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
  mode: 'history',
  base: '/vue/'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
