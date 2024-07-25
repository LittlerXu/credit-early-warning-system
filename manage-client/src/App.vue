<template>
  <div id="app">
      <!--返回顶部 -->
    <el-backtop></el-backtop>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}

</script>

<style>
.el-alert__title {
    font-size: 20px !important;
    /* line-height: 18px; */
}

.el-alert__description{
  font-size: 17px !important;
}
</style>
