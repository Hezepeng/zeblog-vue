const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias.set('@', resolve('src'))
    config.resolve.symlinks(true)
  }
}
