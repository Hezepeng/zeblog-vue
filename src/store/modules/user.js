import { login, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/authorize'
import { Message } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data
            Message({
              message: response.msg,
              type: 'success',
              duration: 3 * 1000
            })
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(response => {
            const data = response.data
            if (data.role && data.role.length > 0) {
              // 验证返回的roles是否是一个非空数组
              const roles = new Array(data.role)
              commit('SET_ROLES', roles)
            } else {
              reject('getInfo: roles must be a non-null array !')
            }
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    fedLogOut({ commit }) {
      return new Promise(resolve => {
        console.log('开始fedLogOut')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
