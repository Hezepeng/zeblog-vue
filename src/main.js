import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App.vue'
import router from '@/router'
import store from '@/store'
// import './plugins/element.js'
import '@/icons' // icon
import '@/permission'
import '@/styles/index.scss' // global css

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

