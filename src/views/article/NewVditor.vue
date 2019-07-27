<template>
  <div class="app-container">
    <el-form>
      <el-form-item class="title-inline">
        <el-col :span="8">
          <el-input v-model="title" placeholder="输入文章标题..." />
        </el-col>
        <el-col :span="12" class="style-select">
          <el-select v-model="codeStyle" placeholder="请选择代码风格">
            <el-option
              v-for="(item, key) in codeStyleList"
              :key="key"
              :label="key"
              :value="key"
            />
          </el-select>
          <el-button size="medium" type="primary">发表文章</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <div id="vditor" />
  </div></template>

<script>
import { Message } from 'element-ui'
import Vditor from 'vditor'
import 'vditor/src/assets/scss/classic.scss'

export default {
  name: 'NewVditor',
  data() {
    return {
      title: '',
      html: '',
      defaultData: 'preview',
      markdownContent: '',
      codeStyle: 'xcode',
      codeStyleList: {
        'agate': 1,
        'androidstudio': 1,
        'arduino-light': 1,
        'arta': 1,
        'ascetic': 1,
        'atelier-cave-dark': 1,
        'atelier-cave-light': 1,
        'atelier-dune-dark': 1,
        'atelier-dune-light': 1,
        'atelier-estuary-dark': 1,
        'atelier-estuary-light': 1,
        'atelier-forest-dark': 1,
        'atelier-forest-light': 1,
        'atelier-heath-dark': 1,
        'atelier-heath-light': 1,
        'atelier-lakeside-dark': 1,
        'atelier-lakeside-light': 1,
        'atelier-plateau-dark': 1,
        'atelier-plateau-light': 1,
        'atelier-savanna-dark': 1,
        'atelier-savanna-light': 1,
        'atelier-seaside-dark': 1,
        'atelier-seaside-light': 1,
        'atelier-sulphurpool-dark': 1,
        'atelier-sulphurpool-light': 1,
        'atom-one-dark': 1,
        'atom-one-light': 1,
        'brown-paper': 1,
        'codepen-embed': 1,
        'color-brewer': 1,
        'darcula': 1,
        'dark': 1,
        'darkula': 1,
        'default': 1,
        'docco': 1,
        'dracula': 1,
        'far': 1,
        'foundation': 1,
        'github-gist': 1,
        'github': 1,
        'googlecode': 1,
        'grayscale': 1,
        'gruvbox-dark': 1,
        'gruvbox-light': 1,
        'hopscotch': 1,
        'hybrid': 1,
        'idea': 1,
        'ir-black': 1,
        'kimbie.dark': 1,
        'kimbie.light': 1,
        'magula': 1,
        'mono-blue': 1,
        'monokai-sublime': 1,
        'monokai': 1,
        'obsidian': 1,
        'ocean': 1,
        'paraiso-dark': 1,
        'paraiso-light': 1,
        'pojoaque': 1,
        'purebasic': 1,
        'qtcreator_dark': 1,
        'qtcreator_light': 1,
        'railscasts': 1,
        'rainbow': 1,
        'routeros': 1,
        'school-book': 1,
        'solarized-dark': 1,
        'solarized-light': 1,
        'sunburst': 1,
        'tomorrow-night-blue': 1,
        'tomorrow-night-bright': 1,
        'tomorrow-night-eighties': 1,
        'tomorrow-night': 1,
        'tomorrow': 1,
        'vs': 1,
        'vs2015': 1,
        'xcode': 1,
        'xt256': 1,
        'zenburn': 1
      },
      vditor: null
    }
  },

  mounted: function() {
    this.vditor = new Vditor('vditor', { height: 800, preview: { hljs: { style: this.codeStyle }}})
    this.vditor.focus()
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
