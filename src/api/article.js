import request from '@/utils/request'

export function addArticle(article) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data: {
      article
    }
  })
}

export function updateArticle(article) {
  return request({
    url: '/article/updateArticle',
    method: 'post',
    data: {
      article
    }
  })
}

export function deleteArticle(article) {
  return request({
    url: '/article/deleteArticle',
    method: 'post',
    data: {
      article
    }
  })
}

export function getArticleList() {
  return request({
    url: '/article/getArticleList',
    method: 'get'
  })
}
