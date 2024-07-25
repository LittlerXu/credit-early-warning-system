<template>
  <div class="aside">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      collapse-transition
      :collapse="isCollapse"
    >
      <router-link to="/home/allcourses">
        <el-menu-item index="/home/allcourses">
          <i class="el-icon-s-grid"></i>
          <span slot="title">培养方案</span>
        </el-menu-item>
      </router-link>
      <router-link to="/home/mycourses">
        <el-menu-item index="/home/mycourses">
          <i class="el-icon-trophy"></i>
          <span slot="title">课程成绩</span>
        </el-menu-item>
      </router-link>
      <router-link to="/home/creditwarning/warningrecord"
        ><el-menu-item index="/home/creditwarning/warningrecord">
          <i class="el-icon-alarm-clock"></i>
          <span slot="title">预警记录</span>
        </el-menu-item>
      </router-link>
      <!-- <a href="/echart/index.html"  >
        <el-menu-item index="/echart/index.html">
          <i class="el-icon-s-data"></i>
          <span slot="title">学情分析</span>
        </el-menu-item>
      </a> -->
    </el-menu>
    <el-button
      type="primary"
      icon="el-icon-s-fold"
      circle
      @click="isCollapse = !isCollapse"
    ></el-button>
  </div>
</template>

<style>
@media only screen and (min-width: 1000px) {
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
    min-height: 400px;
  }
}

@media only screen and (max-width: 999px) {
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 120px;
    min-height: 400px;
  }
}
</style>

<script>
export default {
  name: "Aside",
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
