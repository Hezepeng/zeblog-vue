import request from '@/utils/request'

export function addComment(comment) {
  return request({
    url: '/comment/add',
    method: 'post',
    data: comment
  })
}

export function updateComment(comment) {
  return request({
    url: '/comment/update',
    method: 'post',
    data: comment
  })
}

export function deleteComment(comment) {
  return request({
    url: '/comment/delete',
    method: 'post',
    data: comment
  })
}

export function getArticleCommentList() {
  return request({
    url: '/comment/list',
    method: 'get',
    params: { commentType: 'article' }
  })
}

export function getMessageCommentList() {
  return request({
    url: '/comment/list',
    method: 'get',
    params: { commentType: 'message' }
  })
}

export function getCommentById(commentId) {
  return request({
    url: '/comment/getCommentById',
    method: 'get',
    params: { commentId }
  })
}

export function uploadImage(image) {
  return request({
    url: '/comment/uploadImage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: image
  })
}
