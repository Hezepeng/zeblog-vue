import request from '@/utils/request'

export function addArticle(article) {
  return request({
    url: '/article/add',
    method: 'post',
    data: article
  })
}

export function updateArticle(article) {
  return request({
    url: '/article/update',
    method: 'post',
    data: article
  })
}

export function deleteArticle(article) {
  return request({
    url: '/article/delete',
    method: 'post',
    data: article
  })
}

export function getArticleList() {
  return request({
    url: '/article/list',
    method: 'get'
  })
}

export function getArticleById(articleId) {
  return request({
    url: '/article/getArticleById',
    method: 'get',
    params: { articleId }
  })
}

export function uploadImage(image) {
  return request({
    url: '/article/uploadImage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: image
  })
}
