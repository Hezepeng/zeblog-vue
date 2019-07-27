import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './plugins/element.js'
import '@/icons' // icon
import '@/permission'
import '@/styles/index.scss' // global css
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.use(mavonEditor)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

