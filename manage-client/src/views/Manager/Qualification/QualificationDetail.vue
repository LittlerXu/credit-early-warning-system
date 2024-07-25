<template>
  <el-card :body-style="{ padding: 0, height: '595px' }">
    <div slot="header" class="clearfix">
      <el-page-header @back="goBack">
        <div slot="content">
          <span style="font-size: 14px">学生:</span>
          <span style="text-decoration: underline">{{
            this.checkRow.name
          }}</span
          >({{ this.checkRow.studentId }}) &nbsp;&nbsp;<span
            style="font-size: 14px"
          >
            <i
              style="font-size: 20px"
              :class="{
                'el-icon-error':
                  Number(this.completedCourse.studentTotalCredits) <
                  Number(this.completedCourse.totalCredits),
                'el-icon-success':
                  Number(this.completedCourse.studentTotalCredits) >=
                  Number(this.completedCourse.totalCredits),
              }"
            ></i
            >学分合计:</span
          ><span style="color: gray; font-size: 14px; margin-right: auto"
            ><span
              :class="{
                red:
                  Number(this.completedCourse.studentTotalCredits) <
                  Number(this.completedCourse.totalCredits),
                green:
                  Number(this.completedCourse.studentTotalCredits) >=
                  Number(this.completedCourse.totalCredits),
              }"
              >{{ this.completedCourse.studentTotalCredits }}</span
            >/{{ this.completedCourse.totalCredits }}</span
          >

          <div>
            <el-popover v-model="visible">
              <el-button type="warning" round slot="reference"
                >发送预警</el-button>
              <!-- <el-button v-if="isPassed" type="success" round slot="reference">
                发送提醒
              </el-button> -->
              <!-- <div style="text-align: center; margin: 0;">
                                同时通过短信发送给: <br><span><el-checkbox v-model="isMessage.isStu">学生</el-checkbox>&nbsp; &nbsp;
                                    <el-checkbox v-model="isMessage.isPar">家长</el-checkbox></span> <br><br>
                                <span><el-button size="mini" type="text"
                                        @click="visible = false; isMessage.isStu = false; isMessage.isPar = false">取消</el-button>
                                    <el-button type="primary" :loading="loading" size="mini"
                                        @click="popoverSend">确定</el-button></span>
                            </div> -->
              <div style="text-align: center; margin: 0">
                <span
                  ><el-button size="mini" type="success" @click="popoverSend(1)"
                    >通过</el-button
                  >
                  <el-button
                    type="danger"
                    :loading="loading"
                    size="mini"
                    @click="popoverSend(0)"
                    >未通过</el-button
                  ></span
                >
              </div>
            </el-popover>
          </div>
        </div>
      </el-page-header>
    </div>
    <div class="container">
      <el-card
        class="box-card"
        :body-style="{ padding: 0, height: '250px' }"
        v-for="(
          item, index
        ) in completedCourse.courseLargeClassificationAndCourses"
        :key="index"
      >
        <div slot="header" class="clearfix">
          {{ item.name == "学科大类" ? "学科大类（必修）" : item.name }}&nbsp;<i
            :class="{
              'el-icon-error': creditSum(item.courseList) < item.credit,
              'el-icon-success': creditSum(item.courseList) >= item.credit,
            }"
          ></i>
          <span style="float: right; color: gray; font-size: 14px">
            <span
              :class="{
                red: creditSum(item.courseList) < item.credit,
                green: creditSum(item.courseList) >= item.credit,
              }"
              >{{ creditSum(item.courseList) }}
            </span>
            /{{ item.credit }}
          </span>
        </div>
        <draggable
          v-model="
            completedCourse.courseLargeClassificationAndCourses[index]
              .courseList
          "
          group="people"
          animation="100"
          :forceFallback="true"
          dragClass="dragbox"
          ghostClass="ghost"
          @add="updateCredit"
          class="draggable"
        >
          <transition-group>
            <el-tag
              effect="plain"
              v-for="course in item.courseList"
              :key="course.id"
            >
              {{ course.courseName }}
              <span
                style="
                  display: inline-block;
                  height: 32px;
                  font-size: 14px;
                  font-weight: 700;
                  color: whitesmoke;
                  background-color: #66b1ff;
                "
                >{{ course.courseCredit }}</span
              >
            </el-tag>
          </transition-group>
        </draggable>
      </el-card>
    </div>
  </el-card>
</template>

<script>
import draggable from "vuedraggable";
import { reqCompletedCourse, sendQualificationWarning } from "@/api";
export default {
  //注册draggable组件
  components: {
    draggable,
  },
  data() {
    return {
      checkRow: {},
      completedCourse: {},
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
  computed: {
    //判断是否达到毕业要求:
    // isPassed() {
    //   return Number(this.completedCourse.studentTotalCredits) >=
    //     Number(this.completedCourse.totalCredits) &&
    //     this.completedCourse.courseLargeClassificationAndCourses.every(
    //       (item) => Number(item.studentCredit) >= Number(item.credit)
    //     )
    //     ? true
    //     : false;
    // },
  },

  methods: {
    // 返回
    goBack() {
      // console.log("test");
      this.$router.back();
    },
    //获取各版块学分
    async getCompletedCourse() {
      let { studentId, currentGrade, currentMajor, isQualificationWarning } =
        this.checkRow;
      if (isQualificationWarning == 0) {
        this.completedCourse = (
          await reqCompletedCourse({
            studentId,
            currentGrade,
            currentMajor,
            isQualificationWarning,
          })
        ).data;
      } else {
        let completedCourse = (
          await reqCompletedCourse({
            studentId,
            currentGrade,
            currentMajor,
            isQualificationWarning,
          })
        ).data;

        this.completedCourse = JSON.parse(completedCourse);
        // console.log(this.completedCourse);
      }
    },
    //统计各板块学分
    creditSum(arr) {
      return arr.reduce((pre, item) => pre + Number(item.courseCredit), 0);
    },
    //拖动完成后更新所有板块的学分
    updateCredit() {
      this.completedCourse.courseLargeClassificationAndCourses.forEach(
        (item) => (item.studentCredit = String(this.creditSum(item.courseList)))
      );
    },
    //预警按钮弹出框确认按钮回调
    async popoverSend(status) {
      this.loading = true;
      let { studentId, studentPhone, parentPhone } = this.checkRow;
      let para = {
        studentId,
        studentPhone: this.isMessage.isStu ? studentPhone : "",
        parentPhone: this.isMessage.isPar ? parentPhone : "",
        content: JSON.stringify(this.completedCourse),
        type: "1",
        status: JSON.stringify(status),
        info: "毕业预警信息",
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
          message: "出错了,请联系管理员",
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
      JSON.parse(window.sessionStorage.getItem("stuQualificationDetail")) ?? {};
    this.getCompletedCourse();
  },
  //进入守卫
  beforeRouteEnter(to, from, next) {
    console.log(to);
    if (window.sessionStorage.getItem("stuQualificationDetail")) {
      next();
    } else {
      next({ path: "/manager/qualificationempty" });
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
  align-content: space-around;
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

/* 拖拽区域样式 */
.draggable > span {
  display: block;
  /* display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center; */

  height: 215px;
  overflow: auto;
}

.dragbox,
.ghost {
  color: #ffffff !important;
  background-color: #409eff !important;
}

.el-tag {
  margin: 5px 10px;
  border-radius: 16px;
  overflow: hidden;
  padding-right: 0;
  font-weight: 700;
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
