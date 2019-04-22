<template>
  <div id="Home">
    <div class="dashboard-container">
      <div class="dashboard-text">name:{{ name }}</div>
      <div class="dashboard-text">
        roles:<span v-for="role in roles" :key="role">{{ role }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",

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
    },
    ...mapGetters(["name", "roles"])
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
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style scoped></style>
