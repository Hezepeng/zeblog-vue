import request from '@/utils/request'

export function addReply(reply) {
  return request({
    url: '/reply/add',
    method: 'post',
    data: reply
  })
}

export function updateReply(reply) {
  return request({
    url: '/reply/update',
    method: 'post',
    data: reply
  })
}

export function deleteReply(reply) {
  return request({
    url: '/reply/delete',
    method: 'post',
    data: reply
  })
}

export function getAllReply() {
  return request({
    url: '/reply/getAllReply',
    method: 'get'
  })
}

export function getReplyById(replyId) {
  return request({
    url: '/reply/getReplyById',
    method: 'get',
    params: { replyId }
  })
}
