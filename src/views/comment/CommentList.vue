<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="margin-bottom: 10px">
        <el-button icon="el-icon-plus" type="primary" @click="$router.push('/comment/new')">新建评论</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.filter(data => !search || data.commentId.toString().toLowerCase().includes(search.toLowerCase())||
            data.title.toLowerCase().includes(search.toLowerCase()))"
          height="600"
          border
          style="width: 100%"
          :row-class-name="getRowClass"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>
                <ul style="list-style:none">
                  <li v-for="(item,key, index) in props.row.replies" :key="key" style="padding: 10px 10px;border-bottom: 1px dashed #e0e0e0;line-height: 18px;font-size: 12px">
                    <div style="float:left; display:inline-block; width: 30px; vertical-align: top;">
                      <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                    <div style="margin: 5px">
                      <span style="color: #2e97ff">{{ "@" + item.fromUser.nickname + (item.replyType === 'reply'? ' 回复 @' + item.toUser.nickname : '') + ":" }}</span>
                      <span style="display:inline-block;width: 400px;vertical-align: top;">{{ item.content }}</span>
                      <span style="padding: 0 5px 0 50px">
                        <el-link type="primary" :underline="false" style="font-size: 8px" icon="el-icon-edit" @click="onShowReplyTextarea(item)">回复</el-link>
                      </span>
                      <span style="padding: 0 5px">
                        <el-link type="danger" :underline="false" style="font-size: 8px" icon="el-icon-delete" @click="onDeleteReplyRow(index,item)">删除</el-link>
                      </span>
                      <div :class="activeCommentReplyId === item.commentReplyId ? '' : 'hidden-reply-textarea' " style="margin-top: 10px;width: 60%;">
                        <el-input v-model="reply.content" type="textarea" rows="3" :placeholder="'回复：'+ '@' + item.fromUser.nickname + '：' + item.content" />
                        <el-button style="margin-top: 10px" type="primary" size="mini" @click="onSubmitHiddenReplyTextarea(item, 'reply')">回复</el-button>
                      </div>
                    </div>

                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="commentId"
            label="No."
            width="50"
          />
          <el-table-column
            prop="fromUser.nickname"
            label="用户"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.fromUser.avatar"
                fit="fill"
              />
              <p style="margin: 0;font-size: 12px">{{ scope.row.fromUser.nickname }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="article.title"
            label="文章名"
            width="220"
          />
          <el-table-column
            prop="content"
            label="内容"
            width="300"
          />
          <el-table-column
            prop="createTime"
            label="评论时间"
            sortable
            width="150"
          />
          <el-table-column
            prop="likeTimes"
            label="点赞"
            width="80"
            sortable
            align="center"
          />

          <el-table-column
            prop="replyTimes"
            label="回复"
            sortable
            width="80"
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
                @click="onEditReplyRow(scope.$index, scope.row, 'comment')"
              >回复
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="onDeleteCommentRow(scope.$index, scope.row)"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-star-on"
                @click="onDeleteRow(scope.$index, scope.row)"
              >精选
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div v-if="showDialog">
      <el-dialog title="回复评论" center :visible.sync="showDialog" style="padding: 0 4rem">
        <el-form :model="editRow" style="padding: 0 20px">
          <el-form-item :label="'@'+editRow.fromUser.nickname+':'" style="text-align: center">
            <el-col :span="24">
              <el-input v-model="editRow.content" type="textarea" rows="5" />
            </el-col>
          </el-form-item>
          <el-form-item label="回复内容:" style="margin-top: 10px">
            <el-col :span="24">
              <el-input v-model="reply.content" type="textarea" rows="5" />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="onSaveReplyRow()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { deleteComment, getAllComment, updateComment } from '@/api/comment'
import { deepCopy, setPropertyNull } from '@/utils'
import { addReply, deleteReply } from '@/api/reply'
import { Message } from 'element-ui'

export default {
  name: 'CommentList',

  data() {
    return {
      tableData: [],
      search: '',
      showDialog: false,
      editRow: null,
      reply: {
        commentId: null,
        replyId: null,
        replyType: '',
        content: '',
        fromUserId: null,
        toUserId: null
      },
      activeCommentReplyId: ''
    }
  },

  mounted: function() {
    const _this = this
    getAllComment().then(response => {
      _this.tableData = response.data
    })
  },

  methods: {
    // 在评论下展开回复评论的文本框
    onShowReplyTextarea(row) {
      this.reply = setPropertyNull(this.reply)
      this.activeCommentReplyId = row.commentReplyId
    },
    // 提交回复评论，成功后隐藏回复的文本框
    onSubmitHiddenReplyTextarea(row, replyType) {
      console.log(row)
      this.reply.replyType = replyType
      // 回复"用户回复"
      this.reply.toUserId = row.fromUserId
      this.reply.commentId = row.commentId
      this.reply.replyId = row.commentReplyId
      this.activeCommentReplyId = ''
      this.onSaveReplyRow()
    },
    // 隐藏没有回复的评论的展开按钮
    getRowClass: function(row) {
      if (row.row.replies.length === 0) {
        return 'row-expand-cover'
      }
      return ''
    },
    onViewRow(index, row) {
    },
    // 打开回复评论的弹窗
    onEditReplyRow(index, row, replyType) {
      console.log(this.reply)
      this.reply = setPropertyNull(this.reply)
      console.log(this.reply)
      this.reply.replyType = replyType
      this.reply.content = ''
      // 回复文章评论
      if (replyType === 'comment') {
        this.reply.toUserId = row.fromUserId
        this.reply.commentId = row.commentId
        this.editRow = deepCopy(row)
      } else { // 回复用户回复
        this.reply.toUserId = row.fromUserId
        this.reply.replyId = row.replyId
        this.editRow = deepCopy(row)
      }
      this.showDialog = true
    },
    // 保存回复内容
    onSaveReplyRow() {
      const commentId = this.reply.commentId
      console.log(this.reply)
      addReply(this.reply).then(response => {
        console.log(response.data)
        this.tableData.filter(function(item) {
          if (item.commentId === commentId) {
            item.replies.push(response.data)
          }
        })
        Message.success(response.msg)
        this.showDialog = false
      })
    },
    onDeleteCommentRow(index, row) {
      deleteComment(row).then(response => {
        this.tableData.splice(this.tableData.indexOf(row), 1)
        Message.success(response.msg)
      })
    },
    onDeleteReplyRow(index, row) {
      console.log(row)
      const commentId = row.commentId
      deleteReply(row).then(response => {
        this.tableData.filter(function(item) {
          if (item.commentId === commentId) {
            item.replies.splice(item.replies.indexOf(row), 1)
          }
        })
        Message.success(response.msg)
      })
    },
    onSaveEditRow() {
      const _this = this
      const row = this.editRow
      updateComment(this.editRow).then(response => {
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
      const msg = []
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
        deleteComment(row).then(response => {
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

<style>
.row-expand-cover td:first-child .el-icon-arrow-right {
  visibility: hidden;
}
</style>
<style scoped>
.hidden-reply-textarea{
  display: none;
}
</style>
