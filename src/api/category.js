import request from '@/utils/request'

export function addCategory(category) {
  return request({
    url: '/category/add',
    method: 'post',
    data: category
  })
}

export function updateCategory(category) {
  return request({
    url: '/category/update',
    method: 'post',
    data: category
  })
}

export function deleteCategory(category) {
  return request({
    url: '/category/delete',
    method: 'post',
    data: category
  })
}

export function getUserCategory() {
  return request({
    url: '/category/getUserCategory',
    method: 'get'
  })
}

export function getCategoryById(categoryId) {
  return request({
    url: '/category/getCategoryById',
    method: 'get',
    params: { categoryId }
  })
}
