<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
    <!--        <el-submenu index="2">-->
    <!--          <template slot="title">文章分类</template>-->
    <!--          <el-menu-item index="2-1">Java</el-menu-item>-->
    <!--          <el-menu-item index="2-2">Vue</el-menu-item>-->
    <!--          <el-menu-item index="2-3">Python</el-menu-item>-->
    <!--          <el-submenu index="2-4">-->
    <!--            <template slot="title">Other</template>-->
    <!--            <el-menu-item index="2-4-1">MySQL</el-menu-item>-->
    <!--            <el-menu-item index="2-4-2">算法</el-menu-item>-->
    <!--          </el-submenu>-->
    <!--        </el-submenu>-->
    <!--        <el-menu-item index="3" disabled>标签页</el-menu-item>-->
    <el-menu-item index="4" @click="$router.push('/admin/home')"><a target="_blank">管理后台</a></el-menu-item>
    <el-menu-item style="float: right" index="5" @click="redirectToQQLogin">
      <div v-if="token===null || token===undefined">
        <svg-icon
          style="width: 30px;height: 30px;vertical-align: middle"
          icon-class="qq_login"
        />
        <span>快捷登录</span>
      </div>
      <div v-else>
        <img
          class="head-img"
          style="width: 35px;height: 35px;vertical-align: middle;border-radius: 100px"
          :src="avatar"
        >
        <div class="head-dot" />
        <span>{{ this.name }}</span>
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { getTencentQuickLoginUrl } from '@/api/common'
import { getToken } from '@/utils/authorize'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeMenu',

  data() {
    return {
      activeIndex: '-1',
      token: getToken()
    }
  },

  mounted: function() {

  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  methods: {
    // 跳转到qq联快捷登录页面
    redirectToQQLogin() {
      if (this.token !== null && this.token !== undefined) {
        this.$router.push('/admin/home')
        return
      }
      const redirect_url = window.location.href
      getTencentQuickLoginUrl(redirect_url).then(response => {
        window.location.href = response.data
      })
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style>
.head-dot {
  width: 8px;
  height: 8px;
  background-color: mediumspringgreen;
  border-radius: 50%;
  position: absolute;
  bottom: 10px;
  left: 48px;
}
</style>
<style scoped>

</style>
