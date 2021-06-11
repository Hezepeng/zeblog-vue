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

export function getHotArticle() {
  return request({
    url: '/article/getHotArticle',
    method: 'get',
  })
}

export function getArticleByPage(page) {
  return request({
    url: '/article/getArticleByPage',
    method: 'get',
    params: { page }

  })
}

export function getArticleByTagId(tagId) {
  return request({
    url: '/article/getArticleByTagId',
    method: 'get',
    params: { tagId }
  })
}

export function getArticleByCategoryId(categoryId) {
  return request({
    url: '/article/getArticleByCategoryId',
    method: 'get',
    params: { categoryId }
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
