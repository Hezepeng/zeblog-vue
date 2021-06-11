import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { setToken } from '@/utils/authorize' // progress bar style
import { asyncRouterMap, constantRouterMap } from '@/router/index.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/static/html/', '/blog/home', '/article/detail/'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = store.getters.token

  if (token !== null && token) {
    // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      } else {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('getUserInfo')
          .then(res => {
            // 拉取info
            const roles = new Array(res.data.role)
            store.dispatch('generateRoutes', roles).then(accessRoutes => {
              // 生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch(err => {
            if (err !== 'NEED_LOGIN') {
              Message.error(err)
              next(`/login?redirect=${to.path}`)
            }
            NProgress.done()
          })
      }
    }
  } else {
    if (to.query.hasOwnProperty('token')) {
      const token = to.query.token
      setToken(token)
      store.commit('SET_TOKEN', token)
      next(to.path)
      NProgress.done()
    } else {
      if (to.path.endsWith('.html') || whiteList.filter((url) => {
        return to.path.startsWith(url)
      }).length > 0) {
        next()
        NProgress.done()
        return
      }
      for (const route of constantRouterMap) {
        console.log(to.path)
        if (route.path === to.path) {
          next()
          NProgress.done()
          return
        }
      }
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
