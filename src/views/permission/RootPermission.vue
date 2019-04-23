<template>
  <div id="RootPermission">
    <p>这是RootPermission页面，需要admin权限才能进入</p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'RootPermission'

}
</script>

<style scoped>

</style>
