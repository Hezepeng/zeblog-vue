<template>
  <div class="app-container">
    <el-form ref="article" :model="article" :rules="formRules" auto-complete="on">
      <el-form-item class="title-inline" prop="title">
        <el-col :span="8">
          <el-input v-model="article.title" placeholder="输入文章标题..." />
        </el-col>
        <el-col :span="14" class="style-select">
          <el-select v-model="article.codeStyle" placeholder="请选择代码风格">
            <el-option
              v-for="(item, key) in codeStyleList"
              :key="key"
              :label="key"
              :value="key"
            />
          </el-select>
          <el-button style="margin-left:20px" size="medium" type="success" @click="onPublish(0)">使用静态HTML发表</el-button>

          <el-button style="margin-left:20px" size="medium" type="primary" @click="onPublish(1)">使用MarkDown发表</el-button>

        </el-col>
      </el-form-item>
    </el-form>
    <div id="editor">
      <mavon-editor ref="md" v-model="article.markdownContent" :ishljs="true" :box-shadow="false" :code-style="article.codeStyle" @imgAdd="imgAdd" @save="onSave" />
    </div>

    <!-- TODO 尝试将dialog单独写成组件 -->
    <div v-if="showDialog">
      <el-dialog title="发布文章" top="8vh" width="50%" :visible.sync="showDialog" center>
        <el-form ref="form" label-position="left" :model="article" label-width="80px" :rules="formRules" style="padding: 0 2rem">
          <el-form-item label="文章标题" prop="title">
            <el-col :span="18">
              <el-input v-model="article.title" />
            </el-col>
          </el-form-item>
          <el-form-item label="文章标签" prop="tags">
            <el-tag
              v-for="tag in article.tags"
              :key="tag.tagName"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)"
            >
              {{ tag.tagName }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="mini" @click="showTagInput">+ New Tag</el-button>
          </el-form-item>
          <el-form-item label="文章分类" prop="categories">
            <el-checkbox-group v-model="article.categories">
              <el-checkbox v-for="(item,key) in userCategory" :key="key" :label="item">{{ item.categoryName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="文章类型" prop="originalType">
            <el-col :span="18">
              <el-radio-group v-model="article.originalType">
                <el-radio border size="medium" label="原创">原创</el-radio>
                <el-radio border size="medium" label="转载">转载</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="是否顶置" prop="isTop">
            <el-col :span="12">
              <el-checkbox v-model="article.isTop">顶置</el-checkbox>
              <el-select v-model="article.topRank" style="margin-left: 10px;" placeholder="请选择顶置优先等级" :disabled="!article.isTop">
                <el-option
                  v-for="(item,key) in topRankList"
                  :key="key"
                  :label="key"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="设置可见" prop="state">
<!--            <el-col :span="12">-->
<!--              <el-radio-group v-model="article.state">-->
<!--                <el-radio :label="1">公开</el-radio>-->
<!--                <el-radio :label="2">仅自己可见</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-col>-->
            <el-col :span="12">
              <el-radio-group v-model="article.state">
                <el-radio :label="0">HTML</el-radio>
                <el-radio :label="1">MarkDown</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <p class="footer-tip">温馨提示：请勿发布涉及政治、广告、营销、翻墙、违反国家法律法规等内容</p>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="onCancelDialog()">取 消</el-button>
          <el-button @click="onSaveToDrafts()">保存为草稿</el-button>
          <el-button type="primary" @click="onSubmit()">发布文章</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { addArticle, uploadImage } from '@/api/article'
const mavonEditor = require('mavon-editor')
import 'mavon-editor/dist/css/index.css'
import { getUserCategory } from '@/api/category'
export default {
  name: 'NewMavonEditor',
  components: { 'mavonEditor': mavonEditor.mavonEditor },
  data() {
    const validCategories = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择文章归档分类'))
      } else if (value.length === 0) {
        callback(new Error('请选择文章归档分类'))
      } else if (value.length > 8) {
        callback(new Error('最多选择8个文章分类'))
      } else {
        callback()
      }
    }
    const validTags = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请添加文章关键词标签'))
      } else if (value.length === 0) {
        callback(new Error('请添加文章关键词标签'))
      } else if (value.length > 8) {
        callback(new Error('最多添加8个文章关键词标签'))
      } else {
        callback()
      }
    }
    return {
      article: {
        title: '',
        codeStyle: 'github',
        markdownContent: '',
        htmlContent: '',
        markdownCatalog: '',
        htmlCatalog: '',
        originalType: '原创',
        isTop: false,
        topRank: null,
        tags: [{
          'articleTagId': null,
          'articleId': null,
          'tagName': 'Java'
        }],
        categories: [],
        state: 1
      },
      tags: ['Java'],
      userCategory: [],
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '文章名不能为空' }],
        originalType: [{ required: true, trigger: 'blur', message: '请选择文章类型' }],
        categories: [{ required: true, trigger: 'blur', validator: validCategories }],
        tags: [{ required: true, trigger: 'blur', validator: validTags }],
        state: [{ required: true, trigger: 'blur', message: '请选择是否公开' }]
      },
      inputVisible: false,
      inputValue: '',
      showDialog: false,
      topRankList: {
        '1 (优先度最低)': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9 (优先度最高)': 9
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
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true // 预览

      }
    }
  },

  mounted: function() {
    getUserCategory().then(response => {
      this.userCategory = response.data
    })
  },

  methods: {
    onPublish(state) {
      this.$refs.article.validate(valid => {
        if (valid) {
          this.article.state = state
          this.showDialog = true
        }
      })
    },
    imgAdd(pos, $file) {
      const formData = new FormData()
      formData.append('image', $file)
      uploadImage(formData).then(response => {
        this.$refs.md.$img2Url(pos, response.data.url)
      })
    },
    onSave(markdown, html) {
      Message.success('已保存到本地草稿箱')
      this.article.markdownContent = markdown
      this.article.htmlContent = html
      localStorage.setItem('editor', JSON.stringify(this.article))
      // const o = this.$refs.md.markdownIt
    },
    onSubmit() {
      this.$refs.article.validate(valid => {
        if (this.article.categories.length === 0 || this.article.categories.length > 8) {
          valid = false
          const msg = this.article.categories.length === 0 ? '请选择文章归档分类' : '最多选择8个文章分类'
          Message.warning(msg)
          return
        }
        if (this.article.tags.length === 0 || this.article.tags.length > 8) {
          valid = false
          const msg = this.article.tags.length === 0 ? '请选择文章关键词标签' : '最多选择8个关键词标签'
          Message.warning(msg)
          return
        }
        if (valid) {
          console.log(this.article)
          const editor = this.$refs.md
          // 获取html格式内容
          this.article.htmlContent = editor.d_render
          // 获取markdown格式内容
          this.article.markdownContent = editor.d_value
          this.showDialog = true
          addArticle(this.article).then(response => {
            Message.success(response.msg)
            this.showDialog = false
            this.$router.push('/article/detail/' + response.data.articleId)
          }).catch(() => {})
        }
      })
    },
    onCancelDialog() {
      this.showDialog = false
    },
    onSaveToDrafts() {
      // State 状态字段 0草稿 1公开 2私密 暂时用来区分html和MarkDown
      // this.article.state = 0
      this.onSubmit()
    },
    handleCloseTag(tag) {
      this.article.tags.splice(this.article.tags.indexOf(tag), 1)
    },

    showTagInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        if (this.article.tags.find(tag => {
          return tag.tagName === inputValue
        }) !== undefined) {
          Message.warning('标签被重复添加')
        } else {
          // 重新包装article.tags
          const tag = {}
          tag.articleTagId = null
          tag.articleId = null
          tag.tagName = inputValue
          this.article.tags.push(tag)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
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
#editor{
  margin: auto;
  height: 580px;
  z-index: 800;
  overflow: scroll !important;
}
.el-radio{
  margin-right: 1rem;
}
.v-note-wrapper{
  z-index: 800;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.footer-tip{
  color: #BA2924;
}
.el-dialog{
  margin-top: 8vh;
}
</style>

<style>
.v-note-op{
  background-color: #F6F8FA !important;
}
[type="button"]{
  -webkit-appearance: unset;
}
</style>
