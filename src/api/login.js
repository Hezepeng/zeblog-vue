import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getUserInfo () {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout (token) {
  return request({
    url: '/logout',
    method: 'post',
    data: {
      token
    }
  })
}
