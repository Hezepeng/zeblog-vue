<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.filter(data => !search || data.id.toString().toLowerCase().includes(search.toLowerCase())||
            data.title.toLowerCase().includes(search.toLowerCase()))"
          height="600"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="No."
            width="60"
          />
          <el-table-column
            prop="title"
            label="文章标题"
            width="180"
          />
          <el-table-column
            prop="category"
            label="文章分类"
            width="180"
            sortable
            :filters="[{ text: '前端', value: '前端' }, { text: 'Java', value: 'Java' }, { text: '.NET', value: '.NET' }, { text: 'NLP', value: 'NLP' }]"
            :filter-method="filterCategory"
            filter-placement="bottom-end"
          />
          <el-table-column
            prop="label"
            label="标签"
            width="120"
            sortable
            :filters="[{ text: '原创', value: '原创' }, { text: '转载', value: '转载' }]"
            :filter-method="filterLabel"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.label === '转载' ? 'primary' : 'success'"
                disable-transitions
              >{{ scope.row.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="创建时间"
            sortable
            width="180"
          />
          <el-table-column
            prop="remark"
            label="备注"
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
import { deleteArticle, getArticleList, updateArticle } from '@/api/article'

export default {
  name: 'ArticleList',

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
    getArticleList().then(response => {
      _this.tableData = response.data
      for (const item of _this.tableData) {
        item.time = item.time.replace('T', '')
      }
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
