const path = require("path");
module.exports = {
  lintOnSave: false,
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  }
};
