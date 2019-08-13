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
            :headers="{ 'X-Token': getCookiesToken() }"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
          >
            <i class="el-icon-plus" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
              <div>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到COS存储服务器</el-button>
              </div>
            </div>

          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
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
        <el-button icon="el-icon-finished" type="primary" round :disabled="!formChanged" @click="onSubmit">提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { addUser, checkPassword } from '@/api/user'
import { Message } from 'element-ui'
import { getToken } from '@/utils/authorize'
import { getTencentTempToken } from '@/api/common'

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
      dialogVisible: false
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
    getTencentTempToken().then(response => {
      console.log(response.data)
    })
  },

  methods: {
    uploadImage(){
      // 请求用到的参数
      var Bucket = 'test-1250000000';
      var Region = 'ap-guangzhou';
      var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
      var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';

      // 对更多字符编码的 url encode 格式
      var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
      };
    },
    // 上传文件
    uploadFile (file, callback) {
      var Key = 'dir/' + file.name; // 这里指定上传目录和文件名
      getAuthorization({Method: 'PUT', Pathname: '/' + Key}, function (err, info) {

        if (err) {
          alert(err);
          return;
        }

        var auth = info.Authorization;
        var XCosSecurityToken = info.XCosSecurityToken;
        var url = prefix + camSafeUrlEncode(Key).replace(/%2F/, '/');
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Authorization', auth);
        XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken);
        xhr.upload.onprogress = function (e) {
          console.log('上传进度 ' + (Math.round(e.loaded / e.total * 10000) / 100) + '%');
        };
        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 206) {
            var ETag = xhr.getResponseHeader('etag');
            callback(null, {url: url, ETag: ETag});
          } else {
            callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
          }
        };
        xhr.onerror = function () {
          callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
        };
        xhr.send(file);
      });
    };
    getCookiesToken() {
      return getToken()
    },
    submitUpload() {
      const upload = this.$refs.upload
      console.log(upload)
      this.$refs.upload.submit()
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
          addUser(this.form).then(response => {
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
