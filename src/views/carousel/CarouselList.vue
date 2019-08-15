<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="margin-bottom: 10px">
        <el-button icon="el-icon-plus" type="primary" @click="$router.push('/carousel/new')">新建轮播</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.filter(data => !search || data.carouselId.toString().toLowerCase().includes(search.toLowerCase())||
            data.title.toLowerCase().includes(search.toLowerCase()))"
          height="600"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="carouselId"
            label="No."
            width="60"
          />

          <el-table-column
            prop="thumbnailUrl"
            label="图片"
            width="190"
            align="center"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 160px; height: 90px"
                :src="scope.row.thumbnailUrl"
                fit="fill"
              />
            </template>
          </el-table-column>

          <el-table-column
            prop="title"
            label="轮播标题"
            width="300"
          />
          <el-table-column
            prop="redirectUrl"
            label="跳转链接"
            sortable
            width="150"
          />
          <el-table-column
            prop="isTop"
            label="顶置"
            width="100"
            sortable
            :filters="[{ text: '是', value: 'true' }, { text: '否', value: 'false' }]"
            :filter-method="filterIsTop"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isTop === true ? 'success' : 'primary'"
                disable-transitions
              >{{ scope.row.isTop === true ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="rank"
            label="优先级"
            sortable
            width="120"
          />

          <el-table-column
            prop="clickTimes"
            label="点击量"
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
                @click="onViewRow(scope.$index, scope.row)"
              >查看
              </el-button>
              <el-button
                size="mini"
                type="success"
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

import { deleteCarousel, getCarouselList, updateCarousel } from '@/api/carousel'

export default {
  name: 'CarouselList',

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
    getCarouselList().then(response => {
      _this.tableData = response.data
    })
  },

  methods: {
    onShowNewRowDialog(row) {
      this.showDialog = true
    },
    filterIsTop(value, row) {
      return row.isTop === value
    },
    onViewRow(index, row) {
    },
    onEditRow(index, row) {
      this.$router.push('/carousel/edit/' + row.carouselId)
    },
    onSaveEditRow() {
      const _this = this
      const row = this.editRow
      updateCarousel(this.editRow).then(response => {
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
      const articleInfo = []
      const msg = []
      articleInfo.push('要删除的轮播信息如下')
      articleInfo.push('标题：' + row.title)
      // articleInfo.push('浏览量 ：' + row.readTimes)
      articleInfo.push('此操作将永久删除该轮播信息, 是否继续?')
      const h = this.$createElement
      msg.push(h('p', null, '要删除的轮播信息如下'))
      msg.push(h('p', null, '标题：' + row.title))
      msg.push(h('img', { style: 'height:90px;width:160px', attrs: { src: row.thumbnailUrl }}, null))
      msg.push(h('p', null, '此操作将永久删除该轮播信息, 是否继续?'))
      this.$confirm('警告提示', {
        title: '警告提示',
        message: h('div', null, msg),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteCarousel(row).then(response => {
          this.tableData.splice(this.tableData.indexOf(row), 1)
          this.$message({
            message: response.msg,
            type: 'success',
            center: true,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
