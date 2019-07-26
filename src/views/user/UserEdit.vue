<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="ID" prop="userId">
        <el-col :span="8">
          <el-input v-model="form.userId" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-col :span="8">
          <el-input v-model="form.username" disabled />
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
      <el-form-item label="密码" prop="password">
        <el-col :span="6">
          <el-input v-model="form.password" />
        </el-col>
        <el-col :span="2">
          <el-button
            class="password-button"
            icon="el-icon-key"
            round
            size="medium"
            type="success"
            @click="changePassword"
          >修改密码
          </el-button>
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
      <el-form-item label="最近登录" prop="lastLoginTime">
        <el-col :span="8">
          <el-input v-model="form.lastLoginTime" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="登录次数" prop="loginTimes">
        <el-col :span="8">
          <el-input v-model="form.loginTimes" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="注册时间" prop="createTime">
        <el-col :span="8">
          <el-input v-model="form.createTime" disabled />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-refresh-left" round @click="onReset">取消</el-button>

        <el-button icon="el-icon-finished" type="primary" round :disabled="!formChanged" @click="onSubmit">保存</el-button>
      </el-form-item>

    </el-form>
    <div v-if="showDialog">
      <el-dialog title="修改密码" width="30%" :visible.sync="showDialog" center>
        <el-form ref="editRow" :model="editRow" :rules="passwordRules" style="padding: 0 2rem">
          <el-form-item label="验证旧密码" prop="oldPassword">
            <el-col :span="24">
              <el-input v-model="editRow.oldPassword" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-col :span="24">
              <el-input v-model="editRow.newPassword" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item label="再次输入" prop="newPasswordAgain">
            <el-col :span="24">
              <el-input v-model="editRow.newPasswordAgain" type="password" />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancelEditRow()">取 消</el-button>
          <el-button type="primary" @click="onSaveEditRow()">确认修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkPassword, getUserInfo, updateUser } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'UserEdit',

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
      } else if (value !== this.editRow.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      message: '',
      form: {
        userId: '',
        username: '',
        role: '',
        password: '',
        nickname: '',
        email: '',
        name: '',
        phone: '',
        qq: '',
        wechat: '',
        loginTimes: 0,
        lastLoginTime: '',
        createTime: ''
      },
      formRules: {
        nickname: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        name: [{ required: true, trigger: 'blur', message: '性别不能为空' }]
      },
      passwordRules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '旧密码不能为空' }],
        newPassword: [{ required: true, trigger: 'blur', validator: validPassword }],
        newPasswordAgain: [{ required: true, trigger: 'blur', validator: validPasswordAgain }]
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
    getUserInfo().then(response => {
      this.form = response.data
    }).then(() => {
      this.formChanged = false
    })
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
      console.log(this.formChanged)
      if (this.formChanged) {
        getUserInfo().then(response => {
          this.form = response.data
        })
        this.formChanged = false
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateUser(this.form).then(response => {
            this.$message({
              message: '打卡成功！',
              type: 'success',
              center: true,
              duration: 3000
            })
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
.password-button {
  margin: 0 1rem;
}
</style>
