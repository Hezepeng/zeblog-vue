import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/authorize.js'
import { closeWindow } from './index'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token !== null) {
      config.headers['X-Token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log('发生错误')
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(async(response) => {
  /**
     * code为非0是抛错 可结合自己业务进行修改
     */
  const res = response.data

  if (res.status !== 0) {
    Message({
      message: res.msg,
      type: 'error',
      duration: 4 * 1000
    })

    // 10: Token 过期了 需要重新登录;
    if (res.status === 10) {
      MessageBox.confirm(res.msg, '登录验证失败', {
        confirmButtonText: '重新登录',
        cancelButtonText: '关闭页面',
        type: 'warning'
      }).then(() => {
        store.dispatch('fedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
        Message.warning('已取消登录')
        closeWindow()
      })
      return Promise.reject('NEED_LOGIN')
    }

    // 3: 当前用户访问接口的权限不够;
    if (res.status === 3) {
      let second = 3
      MessageBox.confirm(res.msg, '权限验证失败', {
        confirmButtonText: '我知道了',
        type: 'warning'
      }).then(() => {
        const msg = Message({
          message: '将在 ' + second.toString() + ' 秒后关闭本页面',
          type: 'warning',
          duration: 3000
        })
        setInterval(function() {
          second -= 1
          msg.message = '将在 ' + second.toString() + ' 秒后关闭本页面'
          if (second === 0) {
            router.back()
          }
        }, 1000)
      }).catch(() => {
      })
      return Promise.reject('NO_PERMISSION')
    }
    return Promise.reject('网络请求发生错误')
  } else {
    return response.data
  }
},
// TODO 访问到不存在的api时 会无限弹出ERROR
error => {
  // console.log('err' + error) // for debug
  Message({
    message: error.msg,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
