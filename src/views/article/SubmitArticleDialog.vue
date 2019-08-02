<template>
  <div v-if="showDialog">
    <el-dialog title="发布文章" width="40%" :visible.sync="showDialog" center>
      <el-form ref="form" :model="article" :rules="formRules" style="padding: 0 2rem">
        <el-form-item label="文章标题" prop="title">
          <el-col :span="24">
            <el-input v-model="article.title" />
          </el-col>
        </el-form-item>
        <el-form-item label="文章类型" prop="originalType">
          <el-col :span="12">
            <el-radio-group v-model="article.originalType">
              <el-radio border size="medium" label="原创">原创</el-radio>
              <el-radio border size="medium" label="转载">转载</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="" prop="isTop">
          <el-col :span="24">
            <el-checkbox v-model="article.isTop">顶置</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="" prop="codeStyle">
          <el-col :span="24">
            <el-select v-model="article.codeStyle" placeholder="请选择代码风格">
              <el-option
                v-for="(item, key) in codeStyleList"
                :key="key"
                :label="key"
                :value="key"
              />
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="onCancelEditRow()">取 消</el-button>
        <el-button @click="onCancelEditRow()">保存为草稿</el-button>
        <el-button type="primary" @click="onSaveEditRow()">发布文章</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SubmitArticleDialog',
  props: {
    submitArticle: {
      type: Object,
      default: function() {
        return {
          title: '',
          codeStyle: '',
          markdownContent: '',
          htmlContent: '',
          markdownCatalog: '',
          htmlCatalog: '',
          originalType: '',
          isTop: '',
          topRank: ''
        }
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '文章名不能为空' }],
        originalType: [{ required: true, trigger: 'blur', message: '请选择文章是否原创' }]
      },
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
      }
    }
  },
  mounted: function() {
    this.article = this.submitArticle
  },

  methods: {}
}
</script>

<style scoped>

</style>
