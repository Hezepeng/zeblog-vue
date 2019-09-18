<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">文章分类</template>
          <el-menu-item index="2-1">Java</el-menu-item>
          <el-menu-item index="2-2">Vue</el-menu-item>
          <el-menu-item index="2-3">Python</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">Other</template>
            <el-menu-item index="2-4-1">MySQL</el-menu-item>
            <el-menu-item index="2-4-2">算法</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>标签页</el-menu-item>
        <el-menu-item index="4" @click="$router.push('/login')"><a target="_blank">管理后台</a></el-menu-item>
        <el-menu-item style="float: right" index="5" @click="redirectToQQlogin"><svg-icon style="width: 30px;height: 30px;vertical-align: middle" icon-class="qq_login" /></el-menu-item>
      </el-menu>
    </el-header>
    <el-row style="padding: 0px">
      <el-col :span="24">
        <el-carousel :interval="5000" trigger="click" height="350px">
          <el-carousel-item v-for="item in carouselList" :key="item">
            <el-image :src="item" fit="fill" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-main>

      <el-row :gutter="20">
        <el-col :span="18">
          <el-row>
            <el-col :span="24">
              <el-card class="box-card" :body-style="{ padding: '0px' }">
                <div class="article-title-card">
                  <span>{{ article.title }}</span>
                  <div class="tag-info">
                    <span v-for="(tag,key) in article.tags" :key="key">{{ tag.tagName }}</span>
                  </div>
                </div>
                <div class="article-content-card">
                  <mavon-editor ref="md2" :hljs="true" :code-style="codeStyle" :subfield="false" :default-open="defaultData" :toolbars-flag="false" :box-shadow="false" :navigation="true" v-html="html" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col>
              <el-card class="right-card">
                <div slot="header" style="text-align: left">
                  <span>热门文章</span>
                  <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                </div>
                <div class="hot-article-list">
                  <p v-for="o in 8" :key="o">
                    <a href="#">{{ '热门文章标题 ' + o }}</a>
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px">
            <el-col>
              <el-card class="right-card">
                <div slot="header" style="text-align: left">
                  <span>热门标签</span>
                  <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                </div>
                <div class="hot-tag-list">
                  <a v-for="(o,index) in tags" :key="o" href="#" :style="rgbArray[index].style">{{ o }}</a>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </el-main>
    <el-footer>
      <div style="text-align: center">
        <p style="margin:10px 0 5px 0;line-height:16px;font-size: 14px">Copyright © 2019 hezepeng.com 鄂ICP备16020493号-1</p>
        <p style="margin:5px 0 10px 0;line-height:16px;font-size: 14px">Powered by
          <svg-icon icon-class="github" /> <a href="https://www.github.com/Hezepeng">Hezepeng</a>
        </p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { getTencentQuickLoginUrl } from '@/api/common'
import { getArticleById } from '@/api/article'
const mavonEditor = require('mavon-editor')
export default {
  name: 'Detail',
  components: { 'mavonEditor': mavonEditor.mavonEditor },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      avatar: 'https://hezepeng-1252705718.cos.ap-guangzhou.myqcloud.com/icon/1%20%2817%29.jpg',
      carouselList: ['https://zeblog-1252705718.cos.ap-guangzhou.myqcloud.com/carousel/P80923-103050.jpg', 'https://zeblog-1252705718.cos.ap-guangzhou.myqcloud.com/carousel/P80923-103430.jpg'],
      tags: ['Java', 'Vue', 'Spring', 'MVC', '权限验证', '跨域请求', 'WebStorm配置', 'Vue CLI脚手架', '并发处理', '联合查询'],
      hslArray: [],
      articleId: '',
      codeStyle: '',
      html: '',
      defaultData: 'preview',
      article: {}
    }
  },
  computed: {
    rgbArray: function() {
      const self = this
      if (!this.hslArray.length) return []

      const rgbArray = self.hslArray.map(function(item) {
        return self.hslToRgb.apply(this, item)
      })
      return rgbArray.map(function(item) {
        return {
          value: item,
          style: { background: 'rgb(' + item.toString() + ')' }
        }
      })
    }
  },
  created: function() {
    this.hslArray = this.getHslArray()
  },
  mounted: function() {
    this.articleId = this.$route.params.articleId
    getArticleById(this.articleId).then(response => {
      this.html = response.data.htmlContent
      this.codeStyle = response.data.codeStyle === null ? 'xcode' : response.data.codeStyle
      this.article = response.data
    })
  },
  methods: {
    // 跳转到qq互联快捷登录页面
    redirectToQQlogin() {
      const redirect_url = 'http://47.100.207.45:8080/zeblog_war/home/redirect_to_vue'
      getTencentQuickLoginUrl(redirect_url).then(response => {
        window.location.href = response.data
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    /**
     * HSL颜色值转换为RGB
     * H，S，L 设定在 [0, 1] 之间
     * R，G，B 返回在 [0, 255] 之间
     *
     * @param H 色相
     * @param S 饱和度
     * @param L 亮度
     * @returns Array RGB色值
     */
    hslToRgb: function(H, S, L) {
      var R, G, B
      if (+S === 0) {
        R = G = B = L // 饱和度为0 为灰色
      } else {
        var hue2Rgb = function(p, q, t) {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1 / 6) return p + (q - p) * 6 * t
          if (t < 1 / 2) return q
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
          return p
        }
        var Q = L < 0.5 ? L * (1 + S) : L + S - L * S
        var P = 2 * L - Q
        R = hue2Rgb(P, Q, H + 1 / 3)
        G = hue2Rgb(P, Q, H)
        B = hue2Rgb(P, Q, H - 1 / 3)
      }
      return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)]
    },

    // 获取随机HSL
    randomHsl: function() {
      var H = Math.random()
      var S = Math.random()
      var L = Math.random()
      return [H, S, L]
    },

    // 获取HSL数组
    getHslArray: function() {
      var HSL = []
      var hslLength = 16 // 获取数量
      for (var i = 0; i < hslLength; i++) {
        var ret = this.randomHsl()

        // 颜色相邻颜色差异须大于 0.25
        if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
          i--
          continue // 重新获取随机色
        }
        // 柔和素色的特点 稍微低饱、足够亮的颜色
        // 饱和度
        ret[1] = 0.7 + (ret[1] * 0.05) // [0.1 - 0.4] 低饱和度生成柔和色
        // 亮度
        ret[2] = 0.65 + (ret[2] * 0.05) // [0.7 - 0.95] 高亮度生成柔和色  排除过亮过暗色

        // 数据转化到小数点后两位
        ret = ret.map(function(item) {
          return parseFloat(item.toFixed(2))
        })

        HSL.push(ret)
      }
      return HSL
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #555C63;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  padding-left: 0;
  padding-right: 0;
  /*padding: 0 20px;*/
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

.el-carousel__indicators--horizontal .el-carousel__indicators{
  line-height: 60px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.userinfo-card {
  padding: 5%;
  margin: 0 auto;
  /*background-color: #ffffff;*/
  background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  /*background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);*/
  line-height: 20px;
  height: 350px;
}

.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.article-title-card{
  padding: 20px;
  font-size: 22px;
  color: #ffffff;
  text-align: center;
  /*background-color: #E77F7B;*/
  /*background-image: linear-gradient(60deg, #03A9F4 0%, #8fb7e0 37%, #2cacd1 65%, #9bd2f1 100%);*/
  background-image: linear-gradient(60deg, #03A9F4 0%, #8fb7e0 37%, #bda6dc 65%, #9bd2f1 100%)
}
.article-title-card > .tag-info{
  line-height: 15px;
  margin: 10px 0 0 0;
  font-size: 13px;
  color: #e4e4e4;
  text-align: center;
}
.tag-info > span{
  padding: 2px 10px;
  /*background-color: #1482f0;*/
  /*border-radius: 13px;*/
}
.article-content-card{
  text-align: left;
  padding: 20px;
  font-size: 16px;
  color: #898989;
  line-height: 24px;
}
.article-content-card > p{
  margin: 0;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #edf1f2;
}
.article-content-card > .remark{
  margin: 0;
  text-align: left;
  color: #B4B4B4;
  font-size: 13px;
  line-height: 15px;
  padding: 10px 0 0 0;
}
.right-card{
  display: block;
  overflow: hidden;
}
.hot-article-list{
  font-size: 14px;
  line-height: 18px;
  text-align: left;
  color: #20a0ff;
}
.hot-article-list > p:first-child{
  margin: 0;
}
.hot-article-list > p{
  margin: 10px 0;
}

.hot-tag-list{
}

.hot-tag-list > a{
  display: inline-block;
  min-width: 10px;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
  background-color: #20a0ff;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 13px;
  color: #ffffff;
  margin: 5px 10px 0 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {

  clear: both;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

</style>

<style>

</style>
