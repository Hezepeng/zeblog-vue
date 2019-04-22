<template>
  <div class="app-wrapper">
    <sidebar />
    <div class="main-container">
      <navbar />
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import Navbar from "@/views/layout/components/Navbar";
import Sidebar from "@/views/layout/components/Sidebar";
import AppMain from "@/views/layout/AppMain";
export default {
  name: "Layout",
  components: { AppMain, Sidebar, Navbar },
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

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
