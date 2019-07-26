<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" auto-complete="on" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-col :span="10">
          <el-input v-model="form.title" />
        </el-col>
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-col :span="10">
          <el-radio-group v-model="form.label">
            <el-radio label="原创" />
            <el-radio label="转载" />
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-col :span="10">
          <el-select v-model="form.category" placeholder="选择文章类别">
            <el-option label="前端" value="前端" />
            <el-option label="Java" value="Java" />
            <el-option label=".NET" value=".NET" />
            <el-option label="NLP" value="NLP" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="创建时间" prop="time">
        <el-col :span="10">
          <el-input v-model="form.time" placeholder="打卡时间" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-col :span="10">
          <el-input v-model="form.remark" type="textarea" rows="6" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-edit" type="success" round @click="onSubmit">发表文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'NewUser',

  data() {
    return {}
  },

  mounted: function() {

  },

  methods: {}
}
</script>

<style scoped>

</style>
