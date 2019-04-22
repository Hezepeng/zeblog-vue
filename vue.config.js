const path = require("path");
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias.set("@", resolve("src"));
    config.resolve.symlinks(true);
  }
};
