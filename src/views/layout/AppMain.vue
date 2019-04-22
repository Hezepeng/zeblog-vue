<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",

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
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
