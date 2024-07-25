<template>
  <el-card :body-style="{ padding: 0, height: '599.5px' }">
    <div slot="header" class="clearfix">
      <el-page-header @back="goBack">
        <div slot="content">
          <span style="font-size: 14px">学生:</span>
          <span style="text-decoration: underline">{{ checkRow.name }}</span
          >({{ checkRow.studentId }}) &nbsp;&nbsp;<span style="font-size: 14px"
            >学分合计:</span
          ><span style="color: gray; font-size: 14px; margin-right: auto"
            ><span class="red">{{ totalCredit }}</span
            >/12
          </span>
          <!-- 发送预警按钮 -->
          <div>
            <el-popover v-model="visible">
              <el-button type="warning" round slot="reference"
                >发送预警
              </el-button>
              <!-- <div style="text-align: center; margin: 0;">
                                同时通过短信发送给: <br><span><el-checkbox v-model="isMessage.isStu">学生</el-checkbox>&nbsp; &nbsp;
                                    <el-checkbox v-model="isMessage.isPar">家长</el-checkbox></span> <br><br>
                                <span><el-button size="mini" type="text"
                                        @click="visible = false; isMessage.isStu = false; isMessage.isPar = false">取消</el-button>
                                    <el-button type="primary" :loading="loading" size="mini"
                                        @click="popoverSend">确定</el-button></span>
                            </div> -->
              <div style="text-align: center; margin: 0">
                学生号码: {{ checkRow.studentPhone }} <br />
                家长号码: {{ checkRow.parentPhone }} <br />
                短信内容: xxxxxx <br />
                <span
                  ><el-button
                    size="mini"
                    type="text"
                    @click="
                      visible = false;
                      isMessage.isStu = false;
                      isMessage.isPar = false;
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    :loading="loading"
                    size="mini"
                    @click="popoverSend"
                    >确定</el-button
                  ></span
                >
              </div>
            </el-popover>
          </div>
          <!-- 过滤学生按钮 -->
          <el-popconfirm title="确定过滤此学生吗？" @confirm="filterStudent">
            <el-button type="primary" round slot="reference">过滤</el-button>
          </el-popconfirm>
        </div>
      </el-page-header>
    </div>
    <div class="container">
      <el-table
        class="el-table"
        border
        :data="creditDetailList"
        :height="600"
        highlight-current-row
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column
          prop="courseCredit"
          label="学分"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="courseGrade"
          label="成绩"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="courseGpa"
          label="绩点"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import draggable from "vuedraggable";
import {
  reqCreditDetails,
  sendQualificationWarning,
  reqFilterStudents,
} from "@/api";
export default {
  //注册draggable组件
  components: {
    draggable,
  },
  data() {
    return {
      checkRow: {},
      creditDetailList: [],
      totalCredit: "",
      //预警按钮的弹出框
      visible: false,
      //预警时是否发送短信
      isMessage: {
        isStu: false,
        isPar: false,
      },
      //加载中
      loading: false,
    };
  },
  methods: {
    async filterStudent() {
      let res = await reqFilterStudents(this.checkRow.studentId);
      if (res.code == 1) {
        this.$message({
          message: "过滤成功",
          type: "success",
        });
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    goBack() {
      // this.$router.back();
      this.$router.push({
        path: "/manager/warningrecordlist",
        query: {
          major: this.$route.query.major,
          grade: this.$route.query.grade,
        },
      });
    },
    //获取所修课程列表
    async getCreditDetailList() {
      this.loading = true;
      let result = await reqCreditDetails(this.checkRow);
      this.creditDetailList = result.data.courses;
      this.totalCredit = result.data.totalCredit;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    //预警按钮弹出框确认按钮回调
    async popoverSend() {
      this.loading = true;
      let { studentId, studentPhone, parentPhone } = JSON.parse(
        this.$route.query.checkRow
      );
      let para = {
        studentId,
        studentPhone: this.isMessage.isStu ? studentPhone : "",
        parentPhone: this.isMessage.isPar ? parentPhone : "",
        content: JSON.stringify(this.creditDetailList),
        type: "0",
        status: "0",
        info: "学分预警信息",
      };
      let result = await sendQualificationWarning(para);
      if (result.code == 1) {
        this.$message({
          showClose: true,
          message: "发送成功",
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: result.msg || "出错了,请联系管理员",
          type: "error",
        });
      }
      this.visible = false;
      this.loading = false;
      this.isMessage.isPar = false;
      this.isMessage.isStu = false;
    },
  },
  mounted() {
    this.checkRow =
      JSON.parse(window.sessionStorage.getItem("stuCreditDetail")) ?? {};
    this.getCreditDetailList();
  },
  //进入守卫
  beforeRouteEnter(to, from, next) {
    if (window.sessionStorage.getItem("stuCreditDetail")) {
      next();
    } else {
      next({ path: "/manager/warningrecordempty" });
    }
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.box-card {
  width: 30%;
  height: 40%;
}

.el-checkbox {
  margin: 0;
}

.red,
.el-icon-error {
  color: red;
}

.green,
.el-icon-success {
  color: rgb(46, 233, 130);
}

.red,
.green {
  font-size: 20px;
}

.clearfix {
  line-height: 20px;
  font-size: 18px;
  text-align: left;
}
</style>

<style>
.el-page-header__content {
  flex-grow: 1;
}

.el-page-header__content > div {
  display: flex;
  align-items: center;
}

.el-page-header__left {
  align-items: center;
}
</style>
