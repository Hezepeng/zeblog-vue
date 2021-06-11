<template>
  <el-container>
    <el-header>
      <home-menu />
      <carousel-list></carousel-list>
    </el-header>
    <el-row style="padding: 0px">
      <el-col :span="24">
        <el-carousel :interval="5000" trigger="click" class="carousel-height">
          <el-carousel-item v-for="item in carouselList" :key="item">
            <el-image :src="item" fit="zoom" class="carousel-height">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-main>
      <el-row :gutter="20">
        <el-col v-loading="loading" :xs="24" :sm="18" :md="18" :lg="18" :xl="18" style="margin-top: 20px">
          <el-row v-for="article in articleList" :key="article.articleId" style="margin-bottom: 20px">
            <el-col :span="24">
              <el-card v-loading="loading" class="box-card" :body-style="{ padding: '0px' }">
                <div class="article-title-card">
                  <svg-icon v-if="article.isTop" icon-class="zhiding"
                            style="position: absolute;left: -1px;top:-1px;height: 60px;width: 60px">
                  </svg-icon>
                  <router-link :to="'/article/detail/'+article.articleId"><span>{{ article.title }}</span>
                  </router-link>
                  <div class="tag-info">
                    <span v-for="(tag,key) in article.tags" :key="key"><a @click="onShowTagArticle(tag.tagId)">{{ tag.tagName }}</a></span>
                  </div>
                </div>
                <div class="article-content-card">
                  <p style="max-height: 195px;overflow: hidden;text-overflow: ellipsis;" v-html="article.htmlContent" />
                  <div class="remark">
                    <span><svg-icon
                      style="margin-right:5px;"
                      icon-class="icon_calendar_fill"
                    />{{ article.createTime }}</span>
                    <span><svg-icon style="margin:0 5px;" icon-class="eye-open" />{{ article.readTimes }}</span>
                    <span><svg-icon
                      style="margin:0 5px;"
                      icon-class="icon_message_fill"
                    />{{ article.thumbsUpTimes }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-pagination
              background
              :page-size="5"
              :current-page="pageCount"
              layout="prev, pager, next"
              :total="articleTotalCount"
              @current-change="pageCountChanged"
              @prev-click="onPrevPage"
              @next-click="onNextPage"
            >
            </el-pagination>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" :offset="initOffset" style="margin-top: 20px">
          <el-row style="margin-bottom: 20px">
            <el-card class="userinfo-card" :body-style="{ padding: '0 10px 10px 10px' }">
              <div slot="header" class="clearfix">
                <div style="float: left">
                  <el-image
                    style="width: 80px; height: 80px"
                    :src="avatar"
                    fit="fill"
                  />
                </div>
                <div style="text-align: left;position: relative;margin-left: 5rem;font-size:1.2rem;padding-left: 20px">
                  <p>何泽鹏</p>
                  <p>Java开发工程师</p>
                </div>
              </div>
              <div class="line" />
              <el-row :gutter="20">
                <el-col :span="6" style="font-size: 40px">
                  <svg-icon icon-class="icon_QQ" />
                </el-col>
                <el-col :span="6" style="font-size: 40px">
                  <svg-icon icon-class="icon_weichat" />
                </el-col>
                <el-col :span="6" style="font-size: 40px">
                  <svg-icon icon-class="icon_xinlang" />
                </el-col>
                <el-col :span="6" style="font-size: 40px">
                  <svg-icon icon-class="icon_Qzone" />
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top: 20px">
                <el-col v-for="o in 3" :key="o" :span="8">
                  <div style="background: #B5C0CF;height: auto;text-align: center">
                    <p style="line-height: 20px;padding-top: 5px;margin: 0 auto;font-size: 13px">精选</p>
                    <p style="line-height: 20px;padding-bottom:5px;margin: 0 auto;font-size: 13px">20</p>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 20px">
                <div style="background: #589EF8;height: auto;text-align: center;">
                  <p style="line-height: 20px;padding-top: 5px;margin: 0 auto;font-size: 13px">待上线运行</p>
                  <p style="line-height: 20px;padding-bottom:5px;margin: 0 auto;font-size: 13px">第 112 天</p>
                </div>
              </el-row>
            </el-card>
          </el-row>

          <el-row style="margin-bottom: 20px">
            <el-col>
              <el-card class="right-card">
                <div slot="header" style="text-align: left">
                  <span>热门文章</span>
                  <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                </div>
                <div v-loading="loading" class="hot-article-list">
                  <p v-for="article in hotArticleList" :key="article.articleId">
                    <router-link :to="'/article/detail/'+article.articleId"><span>{{ article.title }}</span>
                    </router-link>
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 20px">
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
      <div>
        <el-row justify="center">
          <el-col>
            <p style="margin:10px 0 5px 0;line-height:16px;font-size: 14px">Copyright © 2019 <a
              href="http://www.beian.miit.gov.cn"
            >鄂ICP备16020493号</a>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p style="margin:5px 0 10px 0;line-height:16px;font-size: 14px">Powered by
              <svg-icon icon-class="github" />
              <a href="https://www.github.com/Hezepeng">Hezepeng</a>
            </p>
          </el-col>
        </el-row>

      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { getArticleByCategoryId, getArticleByPage, getArticleByTagId, getHotArticle } from '@/api/article'
import HomeMenu from '@/views/blog/HomeMenu'

export default {
  name: 'Home',
  components: {HomeMenu},

  data () {
    return {
      articleTotalCount: 0,
      pageCount: 1,
      avatar: 'https://hezepeng-1252705718.cos.ap-guangzhou.myqcloud.com/icon/1%20%2817%29.jpg',
      carouselList: ['https://zeblog-1252705718.cos.ap-guangzhou.myqcloud.com/carousel/desktop_pic_1.png', 'https://zeblog-1252705718.cos.ap-guangzhou.myqcloud.com/carousel/desktop_pic_0.jpg'],
      tags: ['Java', 'Vue', 'Spring', 'MVC', '权限验证', 'Redis', 'MySQL', 'Vue CLI脚手架', 'AOP', 'JVM'],
      hslArray: [],
      articleList: [],
      hotArticleList: [],
      articleLoading: true,
      initOffset: 18,
      loading: true,
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
          style: {background: 'rgb(' + item.toString() + ')'}
        }
      })
    }
  },
  created: function() {
    this.hslArray = this.getHslArray()
  },
  mounted: function() {
    getArticleByPage(this.pageCount).then(response => {
      this.initOffset = 0
      this.articleList = response.data.articleList
      this.articleTotalCount = response.data.articleTotalCount
      this.articleLoading = false
    }).then(() => {
      this.loading = false
    })
    getHotArticle().then(response => {
      this.hotArticleList = response.data
    })
  },
  methods: {
    pageCountChanged (page) {
      this.pageCount = page
      this.loading = true
      getArticleByPage(page).then(response => {
        this.initOffset = 0
        this.articleList = response.data.articleList
        this.articleTotalCount = response.data.articleTotalCount
        this.articleLoading = false
      }).then(() => {
        this.loading = false
      })
    },
    onPrevPage () {
      this.pageCount -= 1
    },
    onNextPage () {
      this.pageCount += 1
    },
    onShowTagArticle (tagId) {
      getArticleByTagId(tagId)
    },
    onShowCategoryArticle (categoryId) {
      getArticleByCategoryId(categoryId)
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

.el-carousel__indicators--horizontal .el-carousel__indicators {
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

.article-title-card {
  padding: 18px;
  font-size: 28px;
  color: #ffffff;
  text-align: center;
  /*background-color: #E77F7B;*/
  /*background-image: linear-gradient(60deg, #03A9F4 0%, #8fb7e0 37%, #2cacd1 65%, #9bd2f1 100%);*/
  background-image: linear-gradient(60deg, #1eb2f5 0%, #03A9F4 37%, #03A9F4 65%, #1eb2f5 100%);

  /*background-image: linear-gradient(60deg, #03A9F4 0%, #8fb7e0 37%, #bda6dc 65%, #9bd2f1 100%)*/
}

.article-title-card > .tag-info {
  line-height: 15px;
  margin: 10px 0 0 0;
  font-size: 13px;
  color: #ffffff;
  text-align: center;
}

.tag-info > span {
  padding: 2px 10px;
  /*background-color: #1482f0;*/
  /*border-radius: 13px;*/
}

.article-content-card {
  text-align: left;
  padding: 20px;
  font-size: 16px;
  color: #898989;
  line-height: 24px;
}

.article-content-card > p {
  margin: 0;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #edf1f2;
}

.article-content-card > .remark {
  margin: 0;
  text-align: left;
  color: #B4B4B4;
  font-size: 13px;
  line-height: 15px;
  padding: 10px 0 0 0;
}

.right-card {
  display: block;
  overflow: hidden;
}

.hot-article-list {
  font-size: 14px;
  line-height: 18px;
  text-align: left;
  color: #20a0ff;
}

.hot-article-list > p:first-child {
  margin: 0;
}

.hot-article-list > p {
  margin: 10px 0;
}

.hot-tag-list {
}

.hot-tag-list > a {
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

el-main {
  padding: 0 20px;
}

</style>

<style>
.carousel-height {
  height: 300px !important;
}

.el-carousel__container {
  height: 300px;

}

/*@media screen and (max-width: 500px) {*/
/*  .carousel-height {*/
/*    height: 220px;*/
/*  }*/
/*}*/
/*@media screen and (min-width: 501px) and (max-width: 800px){*/
/*  .carousel-height {*/
/*    height: 320px;*/
/*  }*/
/*}*/
</style>
