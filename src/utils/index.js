/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

export function deepCopy(obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

/**
 * 关闭当前浏览器窗口
 */
export function closeWindow() {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
    location.href = 'about:blank'
  } else {
    window.opener = null
    window.open('', '_self')
  }
  window.close()
}

/**
 * 复制对象 ，将对象的所有属性值设置成null
 * @param obj
 */
export function setPropertyNull(obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = null
      }
    }
  }
  return result
}

/**
 * 将对象的所有属性值设置成空字符串
 * @param obj
 */
export function setPropertyEmpty(obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = ''
      }
    }
  }
  return result
}

/**
 * 利用canvas压缩图片
 */
export function compressImg(file, quality) {
  console.log(file)
  let compressFile = null
  const fileName = file.name.substring(0, file.name.indexOf('.'))
  const fileType = file.name.substring(file.name.indexOf('.'))
  const newFileName = fileName + '_compress' + fileType
  console.log(newFileName)
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        const image = new Image() // 新建一个img标签（还没嵌入DOM节点)
        image.src = e.target.result
        image.onload = function() {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          const imageWidth = image.width * quality // 压缩后图片的大小
          const imageHeight = image.height * quality
          canvas.width = imageWidth
          canvas.height = imageHeight
          context.drawImage(image, 0, 0, imageWidth, imageHeight)
          const blob = dataURLtoBlob(canvas.toDataURL('image/png', quality))
          compressFile = new File([blob], newFileName, { type: 'image/png' })
          console.log(compressFile)
          resolve(compressFile)
        }
      }
    } catch (e) {
      reject('图片压缩出现异常')
    }
  })
}

/**
 * base64转Blob对象
 * @param dataurl base64字符串
 * @returns {Blob}
 */
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length; var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
