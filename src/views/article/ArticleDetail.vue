<template>
  <div class="app-container">
    <mavon-editor ref="md2" :hljs="true" :code-style="codeStyle" :subfield="false" :default-open="defaultData" :toolbars-flag="false" :box-shadow="false" :navigation="true" v-html="html" />
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
const mavonEditor = require('mavon-editor')
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'ArticleDetail',
  components: { 'mavonEditor': mavonEditor.mavonEditor },

  data() {
    return {
      articleId: '',
      codeStyle: '',
      title: '',
      html: '',
      defaultData: 'preview'
    }
  },

  mounted: function() {
    this.articleId = this.$route.params.articleId
    getArticleById(this.articleId).then(response => {
      this.html = response.data.htmlContent
      this.codeStyle = response.data.codeStyle === null ? 'xcode' : response.data.codeStyle
    })
  },

  methods: {
  }
}
</script>

<style scoped>
.title-inline{
  padding-right: 2rem;
}
.style-select {
  margin: 0 0 0 1rem;
}
.submit-button {
  margin: 0 0 0 1rem;
}
.el-radio{
  margin-right: 1rem;
}
.v-note-wrapper{
  z-index: 800;
}
</style>
