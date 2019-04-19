module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/recommended", "@vue/prettier"],
  // required to lint *.vue files 使用 html参数
  plugins: ['html', 'prettier'],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "quotes": [1, "double"]
  },

  parserOptions: {
    parser: "babel-eslint"
  }
};
