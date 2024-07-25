<template>
  <div id="app">
    <!--返回顶部 -->
    <el-backtop></el-backtop>
    <!-- 整个页面视口 -->
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {},
  mounted() {
    console.log(
      `
  _           _____ 
 | |         / ____|
 | |        | |  __ 
 | |        | | |_ |
 | |____    | |__| |
 |______|    \_____|
                    
                    
`
    );
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* font-family: "宋体"; */
}


a {
  text-decoration: none;
  line-height: 0;
}

.el-alert__title {
    font-size: 20px !important;
    /* line-height: 18px; */
}

.el-alert__description{
  font-size: 17px !important;
}
</style>
