import { getTencentTempToken } from '@/api/common'
import store from '@/store'
var COS = require('cos-js-sdk-v5')
// 请求用到的参数
var Bucket = 'zeblog-1252705718'
var Region = 'ap-guangzhou'
var protocol = location.protocol === 'https:' ? 'https:' : 'http:'
var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/'

// 对更多字符编码的 url encode 格式
var camSafeUrlEncode = function(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

// 上传文件
export function uploadFileToCos(file) {
  var Key = 'carousel/' + file.name // 这里指定上传目录和文件名
  return new Promise((resolve, reject) => {
    getCosToken({ Method: 'PUT', Pathname: '/' + Key })
      .catch(() => {
        return Promise.reject('获取签名出错')
      })
      .then(res => {
        var auth = res.Authorization
        var XCosSecurityToken = res.XCosSecurityToken
        var url = prefix + camSafeUrlEncode(Key).replace(/%2F/, '/')
        var xhr = new XMLHttpRequest()
        xhr.open('PUT', url, true)
        xhr.setRequestHeader('Authorization', auth)
        XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken)
        xhr.upload.onprogress = function(e) {
          console.log('上传进度 ' + (Math.round(e.loaded / e.total * 10000) / 100) + '%')
          store.commit('SET_UPLOAD_PROGRESS', Math.round((e.loaded / e.total * 10000) / 100))
        }
        xhr.onload = function() {
          if (xhr.status === 200 || xhr.status === 206) {
            const ETag = xhr.getResponseHeader('etag').replace(/"/g, '')
            resolve({ ETag: ETag, url: url })
          } else {
            reject('文件 ' + Key + ' 上传失败，状态码：' + xhr.status)
          }
        }
        xhr.onerror = function() {
          reject('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则')
        }
        xhr.send(file)
      })
  })
}

// 计算签名
function getCosToken(options) {
  return new Promise(function(resolve, reject) {
    const res = {}
    getTencentTempToken().then(response => {
      const credentials = response.data.credentials
      res.XCosSecurityToken = credentials.sessionToken
      res.Authorization = COS.getAuthorization({
        SecretId: credentials.tmpSecretId,
        SecretKey: credentials.tmpSecretKey,
        Method: options.Method,
        Pathname: options.Pathname
      })
      resolve(res)
    }).catch(() => {
      reject('获取签名出错')
    })
  })
}
