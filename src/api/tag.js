import request from '@/utils/request'

export function addTag(tag) {
  return request({
    url: '/tag/add',
    method: 'post',
    data: tag
  })
}

export function updateTag(tag) {
  return request({
    url: '/tag/update',
    method: 'post',
    data: tag
  })
}

export function deleteTag(tag) {
  return request({
    url: '/tag/delete',
    method: 'post',
    data: tag
  })
}

export function getUserTag() {
  return request({
    url: '/tag/getUserTag',
    method: 'get'
  })
}

export function getTagById(tagId) {
  return request({
    url: '/tag/getTagById',
    method: 'get',
    params: { tagId }
  })
}
