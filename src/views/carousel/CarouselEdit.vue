<template>
  <div class="app-container">
    <el-form ref="form" :model="carousel" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="轮播标题" prop="title">
        <el-col :span="8">
          <el-input v-model="carousel.title" />
        </el-col>
      </el-form-item>
      <el-form-item label="替换图片">
        <el-col :span="8">
          <el-upload
            ref="upload"
            :multiple="false"
            :headers="{ 'X-Token': getCookiesToken() }"
            :file-list="fileList"
            action=""
            accept="image/*"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-remove="handleBeforeRemove"
            :on-exceed="handleOnExceed"
            :auto-upload="false"
            list-type="picture"
            :http-request="submitUpload"
          >
            <el-button slot="trigger" size="small" type="primary">选取新的轮播图片</el-button>

            <div slot="tip" class="el-upload__tip">
              <div>
                <el-button size="small" type="success" @click="$refs.upload.submit()">上传到COS存储服务器</el-button>
              </div>
              只能上传jpg/png文件，且不超过10MB
              <el-progress v-show="startUpload" :percentage="uploadProgress" :status="uploadProgress===100?'success':null" />
            </div>

          </el-upload>
        </el-col>
        <el-col :span="2" />
      </el-form-item>
      <el-form-item label="图片路径" prop="imgUrl">
        <el-col :span="8">
          <el-input v-model="carousel.imgUrl" />
        </el-col>
        <el-col :span="2" />
      </el-form-item>
      <el-form-item label="略缩图路径" prop="thumbnailUrl">
        <el-col :span="8">
          <el-input v-model="carousel.thumbnailUrl" />
        </el-col>
      </el-form-item>
      <el-form-item label="跳转链接" prop="redirectUrl">
        <el-col :span="8">
          <el-input v-model="carousel.redirectUrl" />
        </el-col>
        <el-col :span="2">
          <el-button
            style="margin: 0 10px"
            icon="el-icon-key"
            size="medium"
            type="primary"
            @click="onShowArticleListDialog"
          >选择文章链接
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="顶置" prop="isTop">
        <el-col :span="10">
          <el-radio-group v-model="carousel.isTop">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="优先级" prop="rank">
        <el-col :span="8">
          <el-select v-model="carousel.rank" style="margin-left: 10px;" placeholder="请选择顶置优先等级">
            <el-option
              v-for="(item,key) in rankList"
              :key="key"
              :label="key"
              :value="item"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh-left" round @click="onReset">重置</el-button>
        <el-button icon="el-icon-zoom-in" round @click="onPreviewCarousel">预览</el-button>
        <el-button icon="el-icon-finished" type="primary" round :disabled="!formChanged" @click="onSubmit">更新</el-button>
      </el-form-item>

    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item>
          <el-image :src="carousel.imgUrl" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog title="选择文章并生成链接" center top="10vh" width="80%" :visible.sync="showArticleListDialog">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData.filter(data => !search || data.articleId.toString().toLowerCase().includes(search.toLowerCase())||
              data.title.toLowerCase().includes(search.toLowerCase()))"
            height="400"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="articleId"
              label="No."
              width="60"
            />
            <el-table-column
              prop="title"
              label="文章标题"
              width="300"
            />
            <el-table-column
              prop="originalType"
              label="类型"
              width="100"
              sortable
              :filters="[{ text: '原创', value: '原创' }, { text: '转载', value: '转载' }]"
              :filter-method="filterOriginalType"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.originalType === '转载' ? 'primary' : 'success'"
                  disable-transitions
                >{{ scope.row.originalType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              sortable
              width="180"
            />
            <el-table-column
              prop="readTimes"
              label="浏览量"
              sortable
              width="100"
            />
            <el-table-column
              prop="readTimes"
              label="点赞量"
              sortable
              width="100"
            />
            <el-table-column
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="onGenerateArticleLink(scope.$index, scope.row)"
                >选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { addCarousel, getCarouselById, updateCarousel } from '@/api/carousel'
import { uploadFileToCos } from '@/utils/cos'
import { getToken } from '@/utils/authorize'
import { compressImg, deepCopy } from '@/utils'
import { getArticleList } from '@/api/article'
export default {
  name: 'CarouselEdit',

  data() {
    return {
      search: '',
      message: '',
      originalCarousel: {
        title: '',
        imgUrl: '',
        thumbnailUrl: '',
        redirectUrl: null,
        rank: 0,
        isTop: false
      },
      carousel: {
        title: '',
        imgUrl: '',
        thumbnailUrl: '',
        redirectUrl: null,
        rank: 0,
        isTop: false
      },
      fileList: [],
      tableData: [],
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '轮播标题不能为空' }],
        imgUrl: [{ required: true, trigger: 'blur', message: '请上传轮播图片' }],
        thumbnailUrl: [{ required: true, trigger: 'blur', message: '请上传轮播图片' }],
        rank: [{ required: true, trigger: 'blur', message: '请选择轮播优先级' }],
        isTop: [{ required: true, trigger: 'blur', message: '请选择是否顶置' }]
      },
      rankList: {
        '0 (默认值)': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9 (优先度最高)': 9
      },
      showArticleListDialog: false,
      formChanged: false,
      dialogImageUrl: '',
      dialogVisible: false,
      startUpload: false
    }
  },
  computed: {
    uploadProgress() {
      return this.$store.getters.uploadProgress
    }
  },

  watch: {
    carousel: {
      handler: function(form, oldval) {
        this.formChanged = true
      },
      deep: true, // 对象内部的属性监听，也叫深度监听
      immediate: false
    }
  },
  mounted: function() {
    this.clearUploadProgress()
    const carouselId = this.$route.params.carouselId
    getCarouselById(carouselId).then(response => {
      this.carousel = response.data
      this.originalCarousel = deepCopy(response.data)
    })
  },
  destroy: function() {
    this.clearUploadProgress()
  },
  methods: {
    // 重置上传进度条信息为0
    clearUploadProgress() {
      this.$store.commit('SET_UPLOAD_PROGRESS', 0)
      this.startUpload = false
    },
    // 获取X-Token
    getCookiesToken() {
      return getToken()
    },
    // 显示文章列表 供轮播生成跳转链接
    onShowArticleListDialog() {
      if (this.tableData.length === 0) {
        const _this = this
        getArticleList().then(response => {
          _this.tableData = response.data
        })
      }
      this.showArticleListDialog = true
    },
    // 根据所选文章生成轮播的跳转链接
    onGenerateArticleLink(index, row) {
      Message.info('已生成文章链接')
      this.carousel.redirectUrl = '/article/detail/' + row.articleId
      this.showArticleListDialog = false
    },
    // 文章列表过滤类型钩子
    filterOriginalType(value, row) {
      return row.originalType === value
    },
    // 弹窗预览轮播效果
    onPreviewCarousel() {
      if (!this.carousel.imgUrl) {
        Message.warning('请先上传图片后再进行效果预览')
      } else {
        this.dialogVisible = true
      }
    },
    // 上传数量超出时的钩子
    handleOnExceed() {
      Message.warning('单个轮播只能上传一张图片')
    },
    // 移除上传文件前的钩子
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 重写upload上传的http-request钩子 实现图片上传
    submitUpload(fileInfo) {
      console.log(fileInfo)
      if (fileInfo.file.size > 10240000) {
        Message.warning('请上传小于10MB的图片')
        return
      }
      this.startUpload = true
      try {
        uploadFileToCos(fileInfo.file).then(response => {
          this.carousel.imgUrl = response.url
          Message.success('原图上传成功')
        }).then(() => {
          const quality = 1 / (Math.round(fileInfo.file.size / 1024 / 1024 + 1)) / 4
          console.log(quality)
          compressImg(fileInfo.file, quality).then(compressFile => {
            Message.info('开始生成压缩图片并上传...')
            uploadFileToCos(compressFile).then(response => {
              Message.success('压缩图上传成功')
              this.carousel.thumbnailUrl = response.url
            }).catch(error => {
              Message.error(error)
            })
          }).catch(error => {
            Message.error(error)
          })
        }).catch(error => {
          Message.error(error)
        })
      }catch (e) {
        Message.error(e)
      }

    },
    // 移除上传列表文件的钩子
    handleRemove(file, fileList) {
      this.clearUploadProgress()
    },

    // 上传图片预览的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 重置表单
    onReset() {
      this.carousel = deepCopy(this.originalCarousel)
      this.formChanged = false
      // 清除所有校验结果
      this.$refs.form.clearValidate()
      // 清空上传列表
      this.$refs.upload.clearFiles()
      // 清空上传进度条信息
      this.clearUploadProgress()
    },

    // 提交表单
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateCarousel(this.carousel).then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              center: true,
              duration: 3000
            })
          }).then(() => {
            this.$router.push('/carousel/list')
          })
        } else {
          Message.error('输入的信息有误，请检查后提交')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
