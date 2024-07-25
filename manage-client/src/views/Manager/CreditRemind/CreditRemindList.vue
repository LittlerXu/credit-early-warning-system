<template>
  <div>
    <el-card
      v-if="isCreditCondition"
      class="box-card"
      :body-style="{ height: '599.5px', padding: '0' }"
    >
      <div slot="header" class="card-header">
        专业:
        <el-select
          clearable
          v-model="para.major"
          placeholder="请选择专业"
          @change="filterStuList"
        >
          <el-option
            v-for="item in majorOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        年级:
        <el-select
          clearable
          v-model="para.grade"
          placeholder="请选择年级"
          class="second-select"
          @change="filterStuList"
        >
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-dropdown
          style="float: right; margin-left: 10px"
          :show-timeout="10"
          :hide-timeout="100"
          @command="dropDownClick"
        >
          <el-button type="primary">
            选择操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">一键提醒学生查看</el-dropdown-item>
            <a
              :href="
                this.$globalVar.EXCEL_BASEURL +
                `/admin/excelToExportStudent?token=${getToken()}`
              "
              ><el-dropdown-item :command="2"
                >导出未确认学生名单</el-dropdown-item
              ></a
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="success" round style="float: right;margin-left: 10px;"
                    @click="remindClick">一键提醒</el-button>
                <el-button type="warning" round style="float: right" @click="exportStudent">导出</el-button> -->
      </div>
      <el-tabs type="border-card" v-model="tabName" @tab-click="passReq">
        <el-tab-pane label="未确认">
          <el-table
            class="el-table"
            :data="notConfirmStudentList"
            highlight-current-row
            height="527px"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column
              prop="studentId"
              align="center"
              sortable
              label="学号"
            ></el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="currentMajor"
              align="center"
              label="专业"
            ></el-table-column>
            <el-table-column
              prop="currentGrade"
              align="center"
              label="年级"
            ></el-table-column>

            <!-- <el-table-column align='center' label="操作" width="150px">
                            <template slot-scope="scope">
                                <el-button round size="mini" type="warning" @click="checkClick(scope.row)">查看</el-button>
                            </template>
                        </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已确认"
          ><el-table
            class="el-table"
            :data="isConfirmStudentList"
            highlight-current-row
            height="527px"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column
              prop="studentId"
              align="center"
              sortable
              label="学号"
            ></el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="currentMajor"
              align="center"
              label="专业"
            ></el-table-column>
            <el-table-column
              prop="currentGrade"
              align="center"
              label="年级"
            ></el-table-column>

            <!-- <el-table-column align='center' label="操作" width="150px">
                            <template slot-scope="scope">
                                <el-button round size="mini" type="success" @click="checkClick(scope.row)">查看</el-button>
                            </template>
                        </el-table-column> -->
          </el-table></el-tab-pane
        >
        <el-tab-pane label="未收到通知"
          ><el-table
            class="el-table"
            :data="notReceiveStudentList"
            highlight-current-row
            height="527px"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column
              prop="studentId"
              align="center"
              sortable
              label="学号"
            ></el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="currentMajor"
              align="center"
              label="专业"
            ></el-table-column>
            <el-table-column
              prop="currentGrade"
              align="center"
              label="年级"
            ></el-table-column>

            <!-- <el-table-column align='center' label="操作" width="150px">
                            <template slot-scope="scope">
                                <el-button round size="mini"
                                plain type="warning" @click="checkClick(scope.row)">查看</el-button>
                            </template>
                        </el-table-column> -->
          </el-table></el-tab-pane
        >
        <!-- <el-tab-pane label="加载失败列表"><el-table class='el-table' :data="notReceiveStudentList" highlight-current-row
                        height="527px" v-loading="loading" element-loading-text="数据加载中"
                        element-loading-spinner="el-icon-loading">
                        <el-table-column prop="studentId" align='center' sortable label="学号"></el-table-column>
                        <el-table-column prop="name" align='center' label="姓名"></el-table-column>
                        <el-table-column prop="currentMajor" align='center' label="专业"></el-table-column>
                        <el-table-column prop="currentGrade" align='center' label="年级"></el-table-column>
                    </el-table></el-tab-pane> -->
      </el-tabs>
    </el-card>
    <el-card
      v-else
      class="box-card"
      :body-style="{
        height: '81vh',
        display: 'flex',
        'flex-direction': 'column',
        'flex-wrap': 'wrap',
        'justify-content': 'center',
        'align-items': 'center',
        'font-size': '16px',
      }"
    >
      <h1 v-if="!loading2">系统尚无学生学分情况, 点击开始导入</h1>
      <h1 v-else>后台正在导入中,请耐心等待...</h1>
      <el-button type="primary" :loading="loading2" style="width: 120px">{{
        loading2 ? "导入中" : "点击导入"
      }}</el-button>
    </el-card>

    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :total="totalPage"
      @current-change="currentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  reqProfessionalList,
  reqCascaderOptions,
  reqNotConfirmStudentList,
  reqIsConfirmStudentList,
  reqNotReceiveStudentList,
  checkQualificationWarning,
  excelToExportStudent,
} from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 总页数
      totalPage: 0,
      // 当前页
      currentPage: 1,
      // 每页条数
      pageSize: 10,
      //未点击确认按钮的学生列表
      notConfirmStudentList: [],
      //已点击确认按钮的学生列表
      isConfirmStudentList: [],
      //没有收到通知的学生列表
      notReceiveStudentList: [],
      //专业选项
      majorOptions: [],
      //年级选项
      gradeOptions: [],
      para: {
        major: "",
        grade: "",
        pageNum: 1,
        pageSize: 0,
      },
      //标签页名称
      tabName: "",
      //列表加载中
      loading: true,
      //'点击导入按钮'加载中
      loading2: false,
      //后端是否已有学分情况
      isCreditCondition: true,
      // 导出时域名
      url: "",
      //   标签
      label: "未确认",
    };
  },
  computed: {
    ...mapState("qualification", ["failureStudentList", "passedStudentList"]),
  },
  watch: {
    // tabName(newValue) {
    //     if (newValue == '0') {
    //         this.getQualificationFailure();
    //     } else {}
    //         this.getQualificationPassed()
    // }
  },
  methods: {
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;

      return token;
    },
    // 分页器
    currentChange(value) {
      this.currentPage = value;
      if (this.label == "未确认") {
        this.getNotConfirmStudentList();
      } else if (this.label == "已确认") {
        this.getIsConfirmStudentList();
      } else {
        this.getNotReceiveStudentList();
      }
    },
    prevClick() {
      this.currentPage--;
      if (this.label == "未确认") {
        this.getNotConfirmStudentList();
      } else if (this.label == "已确认") {
        this.getIsConfirmStudentList();
      } else {
        this.getNotReceiveStudentList();
      }
    },
    nextClick() {
      this.currentPage++;
      if (this.label == "未确认") {
        this.getNotConfirmStudentList();
      } else if (this.label == "已确认") {
        this.getIsConfirmStudentList();
      } else {
        this.getNotReceiveStudentList();
      }
    },
    //获取专业和年级选项
    async getMajorAndGrade() {
      this.majorOptions = (await reqProfessionalList()).data;
      this.gradeOptions = (await reqCascaderOptions()).data[0].children;
    },
    //获取未达标学生列表
    async getQualificationFailure() {
      this.loading = true;
      let code = await this.$store.dispatch(
        "qualification/getQualificationFailure",
        this.para
      );
      if (code != undefined) {
        this.loading = false;
      }
    },
    //获取已达标学生列表
    async getQualificationPassed() {
      this.loading = true;
      let code = await this.$store.dispatch(
        "qualification/getQualificationPassed",
        this.para
      );
      if (code != undefined) {
        this.loading = false;
      }
    },
    //获取未确认学生列表
    async getNotConfirmStudentList() {
      this.loading = true;
      this.para.pageNum = this.currentPage;
      this.para.pageSize = this.pageSize;
      let result = await reqNotConfirmStudentList(this.para);
      this.notConfirmStudentList = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    //获取已确认学生列表
    async getIsConfirmStudentList() {
      this.loading = true;
      this.para.pageNum = this.currentPage;
      this.para.pageSize = this.pageSize;
      let result = await reqIsConfirmStudentList(this.para);
      this.isConfirmStudentList = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    //获取没有收到通知学生列表
    async getNotReceiveStudentList() {
      this.loading = true;
      this.para.pageNum = this.currentPage;
      this.para.pageSize = this.pageSize;
      let result = await reqNotReceiveStudentList(this.para);
      this.notReceiveStudentList = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    //标签页切换时发请求
    passReq(tab) {
      this.label = tab.label;
      if (tab.label == "未确认") {
        this.getNotConfirmStudentList();
      } else if (tab.label == "已确认") {
        this.getIsConfirmStudentList();
      } else {
        this.getNotReceiveStudentList();
      }
    },
    //筛选学生列表
    filterStuList() {
      if (this.tabName == "0") {
        this.getNotConfirmStudentList();
      } else if (this.tabName == "1") {
        this.getIsConfirmStudentList();
      } else {
        this.getNotReceiveStudentList();
      }
    },
    //一键提醒按钮回调
    async remindClick() {
      let result = await checkQualificationWarning(this.para);
      if (result.code == 1) {
        this.$message({
          message: "一键提醒成功",
          type: "success",
        });
      } else {
        this.$message({
          message: result.msg,
          type: "error",
        });
      }
    },
    //导出按钮回调
    // exportStudent() {
    //   const link = document.createElement("a");
    //   link.href =
    //     this.$globalVar.EXCEL_BASEURL +
    //     `/admin/excelToExportStudent?token=${this.getToken()}`;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // },
    //查看按钮回调
    checkClick(checkRow) {
      window.sessionStorage.setItem(
        "stuQualificationDetail",
        JSON.stringify(checkRow)
      );
      this.$router.push({
        path: `/manager/qualificationdetail`,
        query: {
          checkRow,
        },
      });
    },
    //下拉菜单点击回调
    dropDownClick(command) {
      if (command == 1) {
        this.remindClick();
      } else {
        this.exportStudent();
      }
    },
  },
  mounted() {
    this.getMajorAndGrade();
    this.getNotConfirmStudentList();
  },
};
</script>

<style scoped>
.box-card {
  height: 100%;
}

.card-header {
  text-align: left;
  color: #409bff;
  font-size: 20px;
}

.second-select {
  margin-right: 40px;
}

.input-with-select {
  width: 300px;
}

.input-with-select .el-select {
  width: 75px;
}

body .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

.el-table__row {
  line-height: 20px;
}
</style>

<style>
.el-tabs__nav-scroll {
  text-align: left;
}

.el-tabs__nav {
  width: 100%;
}

#tab-3 {
  float: right;
}
</style>
