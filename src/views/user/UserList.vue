<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.filter(data => !search || data.userId.toString().toLowerCase().includes(search.toLowerCase())||
            data.username.toLowerCase().includes(search.toLowerCase()))"
          height="600"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="userId"
            label="No."
            width="60"
          />
          <el-table-column
            prop="username"
            label="用户名"
            width="180"
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            width="120"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="120"
          />
          <el-table-column
            prop="role"
            label="角色"
            width="120"
            sortable
            :filters="[{ text: 'admin', value: '管理员' }, { text: 'editor', value: '普通用户' }]"
            :filter-method="filterLabel"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.role === 'admin' ? 'success' : 'primary'"
                disable-transitions
              >{{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="注册时间"
            sortable
            width="180"
          />
          <el-table-column
            prop="lastLoginTime"
            label="最近登录"
            width="180"
          />
          <el-table-column
            prop="loginTimes"
            label="登录次数"
            width="80"
          />
          <el-table-column
            align="center"
          >
            <template slot="header">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="onEditRow(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="onDeleteRow(scope.$index, scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div v-if="showDialog">
      <el-dialog title="编辑信息" :visible.sync="showDialog">
        <el-form :model="editRow" label-width="120px">
          <el-form-item label="备注信息">
            <el-col :span="16">
              <el-input v-model="editRow.remark" type="textarea" rows="5" />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="onSaveEditRow()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils'
import { deleteUser, getUserList, updateUser } from '@/api/user'

export default {
  name: 'UserList',

  data() {
    return {
      tableData: [],
      search: '',
      showDialog: false,
      editRow: null
    }
  },

  mounted: function() {
    const _this = this
    getUserList().then(response => {
      _this.tableData = response.data
    }).catch(() => {
    })
  },

  methods: {
    filterLabel(value, row) {
      return row.label === value
    },
    filterCategory(value, row) {
      return row.category === value
    },
    onEditRow(index, row) {
      this.editRow = deepCopy(row)
      this.showDialog = true
    },
    onSaveEditRow() {
      const _this = this
      const row = this.editRow
      updateUser(this.editRow).then(response => {
        console.log(this.editRow.username)
        this.tableData.filter(function(item) {
          if (item.id === row.id) {
            item.remark = row.remark
            _this.$message({
              message: '保存成功！',
              type: 'success',
              center: true,
              duration: 2000
            })
          }
          return item.id === row.id
        })
      }).then(() => {
        _this.editRow = null
        _this.showDialog = false
      })
    },
    onDeleteRow(index, row) {
      deleteUser(row).then(response => {
        this.tableData.splice(this.tableData.indexOf(row), 1)
        this.$message({
          message: '删除成功！',
          type: 'success',
          center: true,
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
