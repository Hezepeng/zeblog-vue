import request from '@/utils/request'

export function getTencentTempToken() {
  return request({
    url: '/common/getTencentTempToken',
    method: 'get'
  })
}

export function updateArticle(article) {
  return request({
    url: '/article/update',
    method: 'post',
    data: article
  })
}
