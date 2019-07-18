<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-col :span="10">
          <el-input v-model="form.title" />
        </el-col>
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-col :span="10">
          <el-radio-group v-model="form.label">
            <el-radio label="原创" />
            <el-radio label="转载" />
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-col :span="10">
          <el-select v-model="form.category" placeholder="选择文章类别">
            <el-option label="前端" value="前端" />
            <el-option label="Java" value="Java" />
            <el-option label=".NET" value=".NET" />
            <el-option label="NLP" value="NLP" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="创建时间" prop="time">
        <el-col :span="10">
          <el-input v-model="form.time" placeholder="打卡时间" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-col :span="10">
          <el-input v-model="form.remark" type="textarea" rows="6" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-edit" type="success" round @click="onSubmit">发表文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'NewArticle',

  data() {
    return {
      message: '',
      form: {
        id: '',
        title: '',
        category: '',
        label: '',
        time: parseTime(new Date(), ''),
        remark: ''
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        category: [{ required: true, trigger: 'blur', message: '性别不能为空' }],
        label: [{ required: true, trigger: 'blur', message: '打卡类型不能为空' }]
      }
    }
  },

  watch: {},

  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // addAttendance(this.form).then(response => {
          //   this.$message({
          //     message: '打卡成功！',
          //     type: 'success',
          //     center: true,
          //     duration: 3000
          //   })
          const _this = this
          this.$message({
            message: '打卡成功！',
            type: 'success',
            center: true,
            duration: 3000
          })
          setTimeout(function() {
            _this.$router.push('/article/list')
          }, 1000)
        } else {
          console.log('输入数据不合法！')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
