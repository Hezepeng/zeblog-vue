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

export function getArticleCommentByArticleId() {
  return request({
    url: '/comment/getCommentByArticleId',
    method: 'get'
  })
}

export function getAllComment() {
  return request({
    url: '/comment/getAllComment',
    method: 'get'
  })
}

export function getAllMessage() {
  return request({
    url: '/comment/getAllMessage',
    method: 'get'
  })
}

export function getCommentById(commentId) {
  return request({
    url: '/comment/getCommentById',
    method: 'get',
    params: { commentId }
  })
}
