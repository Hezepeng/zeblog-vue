<template>
  <div class="app-container">
    <el-form ref="form" :model="carousel" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="轮播标题" prop="title">
        <el-col :span="8">
          <el-input v-model="carousel.username" />
        </el-col>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-col :span="8">
          <el-upload
            ref="upload"
            :multiple="false"
            :headers="{ 'X-Token': getCookiesToken() }"
            :file-list="fileList"
            action=""
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-remove="handleBeforeRemove"
            :on-exceed="handleOnExceed"
            :auto-upload="false"
            :http-request="submitUpload"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

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
      <el-form-item label="姓名" prop="redirectUrl">
        <el-col :span="8">
          <el-input v-model="carousel.redirectUrl" />
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
        <el-button icon="el-icon-finished" type="primary" round :disabled="!formChanged" @click="onSubmit">提交</el-button>
      </el-form-item>

    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item>
          <el-image :src="carousel.imgUrl" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { addCarousel } from '@/api/carousel'
import { uploadFileToCos } from '@/utils/cos'
import { getToken } from '@/utils/authorize'
export default {
  name: 'NewCarousel',

  data() {
    return {
      message: '',
      carousel: {
        title: '',
        imgUrl: '',
        thumbnailUrl: '',
        redirectUrl: null,
        rank: 0,
        isTop: false
      },
      fileList: [],
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '轮播标题不能为空' }],
        imgUrl: [{ required: true, trigger: 'blur', message: '请上传轮播图片' }],
        thumbnailUrl: [{ required: true, trigger: 'blur', message: '请上传轮播图片' }],
        rank: [{ required: true, trigger: 'blur', message: '请选择轮播优先级' }],
        isTop: [{ required: true, trigger: 'blur', message: '请选择是否顶置' }]
      },
      rankList: {
        '0 (优先度最低)': 0,
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
      showDialog: false,
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

  },

  methods: {
    getCookiesToken() {
      return getToken()
    },
    onPreviewCarousel() {
      this.dialogVisible = true
    },
    handleOnExceed() {
      Message.warning('单个轮播只能上传一张图片')
    },
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    submitUpload(fileInfo) {
      console.log(fileInfo)
      this.startUpload = true
      uploadFileToCos(fileInfo.file).then(response => {
        // Message.info('开始压缩图片并上传')
        this.carousel.imgUrl = response.url
      }).then(() => {
        // const thumb = compressImg(fileInfo.file, 0.2)
        // uploadFileToCos(thumb)
      }).catch(error => {
        Message.error(error)
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onReset() {
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = null
        }
      }
      this.formChanged = false
      // 清除所有校验结果
      this.$refs.form.clearValidate()
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addCarousel(this.form).then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              center: true,
              duration: 3000
            })
          }).then(() => {
            this.$router.push('/user/list')
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
