<template>
  <div class="app-container">
    <mavon-editor ref="md2" :subfield="false" :default-open="defaultData" :toolbars-flag="false" :box-shadow="false" :navigation="true" v-html="html" />
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'NewMavonEditor',
  data() {
    return {
      title: '',
      html: '',
      defaultData: 'preview',
      markdownContent: '',
    }
  },

  mounted: function() {

  },

  methods: {
    onSave(markdown, html) {
      Message.success('已保存到本地草稿箱')
      console.log(markdown)
      console.log(html)
      const o = this.$refs.md.markdownIt
      console.log(o)
      this.html = html
    }
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

</style>
