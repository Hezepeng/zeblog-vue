<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="margin-bottom: 10px">
        <el-button icon="el-icon-plus" type="primary" @click="onNewRow">新建分类</el-button>
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
            prop="articleCount"
            label="文章数"
            width="120"
            sortable
          />
          <el-table-column align="center">
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
                type="primary"
                @click="onEditRow(scope.$index, scope.row)"
              >顶置
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="onDeleteRow(scope.$index, scope.row)"
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
          <el-button type="primary" @click="onNewRow()">添加</el-button>
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
import { deleteArticle, updateArticle } from '@/api/article'
import { getUserCategory } from '@/api/category'
import { setPropertyNull } from '@/utils'

export default {
  name: 'CategoryList',

  data() {
    return {
      tableData: [],
      search: '',
      showNewDialog: false,
      showEditDialog: false,
      editRow: null,
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
    getUserCategory().then(response => {
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
    onNewRow() {
      this.newCategory = setPropertyNull(this.newCategory)
      this.showNewDialog = true
    },
    onEditRow(index, row) {
      this.editCategory = row
      this.showEditDialog = true
    },
    onCancelNewRow() {
      this.newCategory = setPropertyNull(this.newCategory)
      this.showNewDialog = false
    },
    onCancelEditRow() {
      this.editCategory = setPropertyNull(this.editCategory)
      this.showEditDialog = false
    },
    onSaveEditRow() {
      const _this = this
      const row = this.editRow
      updateArticle(this.editRow).then(response => {
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
      deleteArticle(row).then(response => {
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
