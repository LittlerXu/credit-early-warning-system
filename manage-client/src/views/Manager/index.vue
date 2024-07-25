<template>
  <div>
    <el-container class="el-container">
      <el-aside class="el-aside" style="width: none">
        <el-menu
          class="el-menu-vertical"
          style="text-align: left"
          :default-active="$route.path"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409bff"
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <el-menu-item index="/manager/home" route="/manager/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item
            index="/manager/studentmanage"
            route="/manager/studentmanage"
          >
            <i class="el-icon-s-custom"></i>
            <span slot="title">学生管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/courseselectionmanage">
            <i class="el-icon-s-unfold"></i>
            <span slot="title">选课管理</span>
          </el-menu-item>
          <el-submenu index="creditwarning">
            <template slot="title">
              <i class="el-icon-alarm-clock"></i>
              <span slot="title">学期学分预警</span>
            </template>
            <el-menu-item index="/manager/warningrecordlist">
              <i class="el-icon-s-order"></i>
              <span slot="title">预警列表</span>
            </el-menu-item>
            <el-menu-item index="/manager/warningrecorddetail">
              <i class="el-icon-s-management"></i>
              <span slot="title">学分详情</span>
            </el-menu-item>
            <el-menu-item index="/manager/warningrecordrecord">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">预警记录</span>
            </el-menu-item>
             <el-menu-item index="/manager/singleSemesterWarning">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">单学期学分预警</span>
            </el-menu-item>
          </el-submenu>
          <!-- 需求不需要，但仍存在，需要时打开 -->
          <!-- <el-submenu index="creditremind">
            <template slot="title">
              <i class="el-icon-message-solid"></i>
              <span slot="title">学分查看提醒</span>
            </template>
            <el-menu-item index="/manager/warningremindlist">
              <i class="el-icon-s-order"></i>
              <span slot="title">提醒列表</span>
            </el-menu-item>
            <el-menu-item index="/manager/warningremindrecord">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">提醒记录</span>
            </el-menu-item>
          </el-submenu> -->
          <el-submenu index="qualification">
            <template slot="title"
              ><i class="el-icon-s-claim"></i>
              <span>毕业资格审核</span></template
            >
            <el-menu-item index="/manager/qualificationispassedlist">
              <i class="el-icon-s-order"></i>
              <span slot="title">审核列表</span>
            </el-menu-item>
            <el-menu-item index="/manager/qualificationdetail">
              <i class="el-icon-s-claim"></i>
              <span slot="title">学分详情</span>
            </el-menu-item>
            <el-menu-item index="/manager/qualificationrecord">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">审核记录</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="trainingplan">
            <template slot="title"
              ><i class="el-icon-s-order"></i>
              <span>培养方案管理</span>
            </template>
            <el-menu-item index="/manager/check" route="/manager/check">
              <i class="el-icon-tickets"></i>
              <span slot="title">查看培养方案</span>
            </el-menu-item>

            <el-menu-item
              index="/manager/addcategory"
              route="/manager/addcategory"
            >
              <i class="el-icon-circle-plus"></i>
              <span slot="title">新增培养方案</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            index="/manager/basiccourses"
            route="/manager/basiccourses"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">基础课程管理</span>
          </el-menu-item>
          <el-menu-item
            index="/manager/controlsrecords"
            route="/manager/controlsrecords"
          >
            <i class="el-icon-finished"></i>
            <span slot="title">操作记录</span>
          </el-menu-item>
          <!-- <a href="/echart/index.html">
            <el-menu-item
              index="/echarts/index.html"
              route="echarts/index.html"
            >
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
      </el-aside>
      <el-container>
        <el-header class="el-header">
          <Header></Header>
        </el-header>
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  padding: 0;
}

.el-aside {
  background-color: #304156;
  color: #333;
  text-align: center;
  line-height: 200px;
  min-height: 100vh;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 40px;
}

body > .el-container {
  height: 100%;
  margin-bottom: 40px;
}
</style>
