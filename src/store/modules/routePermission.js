import { asyncRouterMap, constantRouterMap } from '@/router/index.js'

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const routePermission = {
  state: {
    routes: constantRouterMap,
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routers) => {
      state.addRoutes = routers
      state.routes = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        // let accessedRoutes
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRouterMap || []
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)
        // }
        const accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default routePermission
