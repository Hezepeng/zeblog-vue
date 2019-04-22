<template>
  <p>这是AdminPage，需要admin权限才能进入</p>
</template>

<script>
export default {
  name: "AdminPage",

  props: {
    status: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      message: "hello world",
      oldMessage: "hello"
    };
  },

  computed: {
    reversedMessage: function() {
      return this.message + this.message;
    }
  },

  watch: {
    oldMessage: function(val) {
      this.message = val + " ";
    }
  },

  created: function() {
    // `this` 指向 vm 实例
    console.log("message is: " + this.message);
  },

  mounted: function() {
    // `this` 指向 vm 实例
    console.log("message is: " + this.message);
  },

  methods: {
    showMsg: function() {
      // `this` 在方法里指向当前 Vue 实例
    }
  }
};
</script>

<style scoped>

</style>
