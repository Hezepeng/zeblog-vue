import Vue from "vue";
import Vuex from "vuex";
import user from "@/store/modules/user";
import getters from "@/store/getters";
import routePermission from "@/store/routePermission";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    routePermission
  },
  getters
});
