import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login/Login";
import Home from "@/views/home/Home";
import AdminPage from "@/views/permission/AdminPage";
import RootPermission from "@/views/permission/RootPermission";
import Layout from "@/views/layout/Layout";

Vue.use(Router);

// const dashboard = resolve => require(["@/views/dashboard/index"], resolve);

//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Layout,
    name: "首页",
    meta: {
      icon: "",
      title: "首页",
      noCache: true
    }
  }
];

//实例化vue的时候只挂载constantRouter
export default new Router({
  routes: constantRouterMap
});

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: "/permission",
    component: RootPermission,
    name: "权限测试",
    meta: {
      role: ["admin", "super_editor"],
      meta: {
        icon: "",
        title: "权限测试",
        noCache: true
      }
    }, //页面需要的权限
    children: [
      {
        path: "/admin",
        component: AdminPage,
        name: "子权限测试页",
        meta: {
          role: ["admin", "super_editor"],
          meta: {
            icon: "",
            title: "子权限测试页",
            noCache: true
          }
        } //页面需要的权限
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];
