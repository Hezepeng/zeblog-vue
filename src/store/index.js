import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import getters from '@/store/getters'
import routePermission from '@/store/modules/routePermission'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import common from '@/store/modules/common'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    app,
    routePermission,
    settings,
    common
  },
  getters
})

export default store
