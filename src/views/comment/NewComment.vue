<template>
  <div>
    <el-row>
      <el-col style="padding: 20px 10px 10px 10px">
        <span style="font-size: 22px;color:#7C7C7C">
          发表评论
        </span>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="padding: 10px">
        <el-input
          v-model="comment.content"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10}"
          placeholder="请输入评论内容"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col style="padding:10px;">
        <el-button type="primary" @click="onSubmit">发表评论</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
import { Message } from 'element-ui'

export default {
  name: 'NewComment',

  data() {
    return {
      comment: {
        articleId: 1,
        commentType: 'article',
        content: ''
      }
    }
  },

  mounted: function() {

  },

  methods: {
    onSubmit() {
      const comment = this.comment
      if (comment.content !== '' && comment.content !== null) {
        addComment(this.comment).then(() => {
          Message.success('信息已提交，感谢您的评论！')
          this.$router.push('/comment/list')
        })
      } else {
        Message.error('请先填写评论内容')
      }
    }
  }
}
</script>

<style scoped>

</style>
