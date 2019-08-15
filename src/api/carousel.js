import request from '@/utils/request'

export function addCarousel(carousel) {
  return request({
    url: '/carousel/add',
    method: 'post',
    data: carousel
  })
}

export function updateCarousel(carousel) {
  return request({
    url: '/carousel/update',
    method: 'post',
    data: carousel
  })
}

export function deleteCarousel(carousel) {
  return request({
    url: '/carousel/delete',
    method: 'post',
    data: carousel
  })
}

export function getCarouselList() {
  return request({
    url: '/carousel/list',
    method: 'get'
  })
}

export function getCarouselById(carouselId) {
  return request({
    url: '/carousel/get',
    method: 'get',
    params: { carouselId }
  })
}

export function uploadImage(image) {
  return request({
    url: '/carousel/uploadImage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: image
  })
}
