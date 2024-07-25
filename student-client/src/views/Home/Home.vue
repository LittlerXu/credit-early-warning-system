<template>
  <div>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside style="width:none">
          <Aside></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
          <div class="home" v-if="$route.path == '/home'">
            <img src="/icons/logo.png" alt="" />
            <h1>欢迎使用贵州大学学分预警系统</h1>
          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import Aside from "@/components/Aside/Aside.vue";

export default {
  name: "Home",
  components: {
    Header,
    Aside,
  },
  mounted() {},
};
</script>

<style lang="scss">
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0;
  width: 100%;
  // height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
}

.el-container {
  margin-top: 30px;

  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: calc(100% - 60px);
    border-right: 1px solid #ccc;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
  }
}
</style>