<template>
  <div id="Home">
    <div class="dashboard-container">
      <el-row>
        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div class="card-left-icon">
              <i class="el-icon-location svg-icon"></i>
            </div>
            <div class="card-right-text">
              <div class="card-right-title">今日访问</div>
              <div class="card-right-data">239</div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div class="card-left-icon">
              <i class="el-icon-s-comment svg-icon"></i>
            </div>
            <div class="card-right-text">
              <div class="card-right-title">今日评论</div>
              <div class="card-right-data">3</div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div class="card-left-icon">
              <i class="el-icon-star-on svg-icon"></i>
            </div>
            <div class="card-right-text">
              <div class="card-right-title">今日点赞</div>
              <div class="card-right-data">18</div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div class="card-left-icon">
              <i class="el-icon-s-claim svg-icon"></i>
            </div>
            <div class="card-right-text">
              <div class="card-right-title">今日发布</div>
              <div class="card-right-data">0</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="6">
          <el-button type="primary" @click="$router.push('/blog/home')">进入前端首页</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['name', 'roles'])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.box-card {
  width: 80%;
  padding: 5%;
  margin: 0 auto;
  /*background-color: #ffffff;*/
  background-image: linear-gradient(135deg, #45c5ff 0%, #03A9F4 75%, #80a0fd 100%);
  /*background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);*/
  /*background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);*/
}
.card-right-text{
  float: right;
  text-align: right;
  /*margin: 2rem 8rem 8rem 0;*/
}
.card-left-icon{
  margin: 5% 0;
  padding: 2%;
  float: left;
  /*background-color: #1482f0;*/
  /*border-radius: 50%;*/
}
.card-left-icon .svg-icon{
  font-size: 40px;
  color: #ffffff;
}
.card-right-title{
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  padding: 5px 0;
}
.card-right-data{
  color: #ffffff;
  font-size: 26px;
  font-weight: bolder;
}
</style>

<style scoped></style>
