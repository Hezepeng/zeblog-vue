<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="margin-bottom: 10px">
        <el-button icon="el-icon-plus" type="primary" @click="onShowNewRowDialog">新建分类</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.filter(data => !search || data.categoryId.toString().toLowerCase().includes(search.toLowerCase())||
            data.categoryName.toLowerCase().includes(search.toLowerCase()))"
          height="600"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="categoryId"
            label="No."
            width="80"
          />
          <el-table-column
            prop="categoryName"
            label="分类名称"
            width="500"
          />
          <el-table-column
            prop="articles.length"
            label="文章数"
            width="120"
            sortable
          />
          <el-table-column align="center">
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
                @click="onShowEditRowDialog(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="onDeleteRow(scope.$index, scope.row)"
              >删除
              </el-button></template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div v-if="showNewDialog">
      <el-dialog title="新建分类" width="40%" :visible.sync="showNewDialog" center>
        <el-form ref="newRow" :model="newCategory" :rules="categoryRules" style="padding: 0 2rem">
          <el-form-item label="分类名称" prop="categoryName">
            <el-col :span="24">
              <el-input v-model="newCategory.categoryName" />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancelNewRow()">取 消</el-button>
          <el-button type="primary" @click="onSaveNewRow()">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="showEditDialog">
      <el-dialog title="新建分类" width="40%" :visible.sync="showEditDialog" center>
        <el-form ref="editRow" :model="editCategory" :rules="categoryRules" style="padding: 0 2rem">
          <el-form-item label="分类ID" prop="categoryId">
            <el-col :span="24">
              <el-input v-model="editCategory.categoryId" disabled />
            </el-col>
          </el-form-item>
          <el-form-item label="分类名称" prop="categoryName">
            <el-col :span="24">
              <el-input v-model="editCategory.categoryName" />
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
import {
  addCategory,
  deleteCategory,
  getUserCategoryWithArticle,
  updateCategory
} from '@/api/category'
import { deepCopy, setPropertyNull } from '@/utils'
import { Message } from 'element-ui'

export default {
  name: 'CategoryList',

  data() {
    return {
      tableData: [],
      search: '',
      showNewDialog: false,
      showEditDialog: false,
      newCategory: {
        categoryName: ''
      },
      editCategory: null,
      categoryRules: {
        categoryName: [{ required: true, trigger: 'blur', message: '分类名称不能为空' }],
        categoryId: [{ required: true, trigger: 'blur', message: '分类Id不能为空' }]
      }
    }
  },

  mounted: function() {
    const _this = this
    getUserCategoryWithArticle().then(response => {
      _this.tableData = response.data
    })
  },

  methods: {
    filterLabel(value, row) {
      return row.originalType === value
    },
    filterCategory(value, row) {
      return row.category === value
    },
    // 显示新建分类弹窗
    onShowNewRowDialog() {
      this.newCategory = setPropertyNull(this.newCategory)
      this.showNewDialog = true
    },
    // 保存新建分类
    onSaveNewRow() {
      this.$refs.newRow.validate(valid => {
        if (valid) {
          addCategory(this.newCategory).then(response => {
            // 获取返回的新增数据的对象
            const data = response.data
            data['articles'] = []
            // table新增一行数据
            this.tableData.push(data)
          }).then(() => {
            Message.success('添加成功')
            this.showNewDialog = false
          })
        }
      })
    },
    // 取消新建分类 退出弹窗
    onCancelNewRow() {
      this.newCategory = setPropertyNull(this.newCategory)
      this.showNewDialog = false
    },
    // 显示当前行编辑分类弹窗
    onShowEditRowDialog(index, row) {
      this.editCategory = deepCopy(row)
      this.showEditDialog = true
    },
    // 取消当前行对分类的编辑 退出弹窗
    onCancelEditRow() {
      this.editCategory = setPropertyNull(this.editCategory)
      this.showEditDialog = false
    },
    // 保存对当前行分类的编辑更改
    onSaveEditRow() {
      const _this = this
      const row = this.editCategory
      console.log(this.editCategory)
      updateCategory(row).then(response => {
        this.tableData.filter(function(item) {
          if (item.categoryId === row.categoryId) {
            item.categoryName = row.categoryName
            _this.$message({
              message: '修改成功',
              type: 'success',
              center: true,
              duration: 2000
            })
          }
          return item.categoryId === row.categoryId
        })
      }).then(() => {
        _this.editRow = setPropertyNull(this.editCategory)
        _this.showEditDialog = false
      })
    },
    // 删除行数据
    onDeleteRow(index, row) {
      deleteCategory(row).then(response => {
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
