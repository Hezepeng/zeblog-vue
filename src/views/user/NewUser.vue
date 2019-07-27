<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-col :span="8">
          <el-input v-model="form.username" />
        </el-col>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-col :span="8">
          <el-input v-model="form.nickname" />
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-col :span="8">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-col :span="10">
          <el-radio-group v-model="form.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="editor">普通用户</el-radio>
            <el-radio label="visitor">游客</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="8">
          <el-input v-model="form.password" />
        </el-col>
      </el-form-item>
      <el-form-item label="再次输入" prop="passwordAgain">
        <el-col :span="8">
          <el-input v-model="form.passwordAgain" />
        </el-col>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-col :span="8">
          <el-input v-model="form.phone" />
        </el-col>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-col :span="8">
          <el-input v-model="form.email" />
        </el-col>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-col :span="8">
          <el-input v-model="form.qq" />
        </el-col>
      </el-form-item>
      <el-form-item label="微信" prop="wechat">
        <el-col :span="8">
          <el-input v-model="form.wechat" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh-left" round @click="onReset">重置</el-button>

        <el-button icon="el-icon-finished" type="primary" round :disabled="!formChanged" @click="onSubmit">注册</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { addUser, checkPassword } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'NewUser',

  data() {
    const validPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6 - 18个字符'))
      } else {
        callback()
      }
    }
    const validPasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      message: '',
      form: {
        username: '',
        role: '',
        password: '',
        passwordAgain: '',
        nickname: '',
        email: '',
        name: '',
        phone: '',
        qq: '',
        wechat: ''
      },
      formRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        nickname: [{ required: true, trigger: 'blur', message: '昵称不能为空' }],
        name: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        role: [{ required: true, trigger: 'blur', message: '角色不能为空' }],
        email: [{ required: true, trigger: 'blur', message: '邮箱不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validPassword }],
        passwordAgain: [{ required: true, trigger: 'blur', validator: validPasswordAgain }]
      },
      showDialog: false,
      editRow: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      formChanged: false
    }
  },

  watch: {
    form: {
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
    changePassword() {
      this.showDialog = true
    },
    onSaveEditRow() {
      const editRow = this.editRow

      if (editRow.oldPassword === '' || editRow.newPassword === '') {
        Message.warning('请输入完整的信息后提交')
        return
      }
      checkPassword(this.editRow.oldPassword).then(() => {
        this.form.password = this.editRow.newPassword
        this.showDialog = false
        this.editRow.oldPassword = ''
        this.editRow.newPassword = ''
        this.editRow.newPasswordAgain = ''
        Message.success('密码修改成功')
      }).catch(() => {

      })
    },
    onCancelEditRow() {
      this.showDialog = false
      this.editRow.oldPassword = ''
      this.editRow.newPassword = ''
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
