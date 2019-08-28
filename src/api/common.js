import request from '@/utils/request'

export function getTencentTempToken() {
  return request({
    url: '/common/getTencentTempToken',
    method: 'get'
  })
}

export function getTencentQuickLoginUrl() {
  return request({
    url: '/user/qqQuickLogin',
    method: 'get',
  })
}
