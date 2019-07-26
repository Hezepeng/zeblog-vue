import request from '@/utils/request'

export function addUser(user) {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      user
    }
  })
}

export function updateUser(form) {
  return request({
    url: '/user/update',
    method: 'post',
    data: form
  })
}

export function deleteUser(user) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: {
      user
    }
  })
}

export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function checkPassword(password) {
  return request({
    url: '/user/check',
    method: 'post',
    data: {
      password
    }
  })
}

