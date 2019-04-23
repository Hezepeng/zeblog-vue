import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import getters from '@/store/getters'
import routePermission from '@/store/modules/routePermission'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    app,
    routePermission,
    settings
  },
  getters
})

export default store
