const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"));
  }
};
