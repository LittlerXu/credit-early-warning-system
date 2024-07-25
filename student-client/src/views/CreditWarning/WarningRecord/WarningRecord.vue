<template>
  <div class="warningRecord">
    <h1 style="display: block; margin-top: 20px">预警记录</h1>
    <el-empty
      description="暂无预警记录"
      v-show="warnRecords.length == 0"
    ></el-empty>
    <div class="recordsBox" v-show="warnRecords.length != 0">
      <div
        :class="recordColor(warningRecord.status)"
        v-for="warningRecord in warnRecords"
        :key="warningRecord.id"
        @click="
          goDetail(
            warningRecord.content,
            warningRecord.info,
            warningRecord.type,
            warningRecord.status,
            warningRecord.id,
            warningRecord.isNew
          )
        "
      >
        <div class="type"><span>类型：</span>{{ warningRecord.type }}</div>
        <div class="content">信息：{{ warningRecord.info }}</div>
        <div class="date">预警时间：{{ warningRecord.sendingTime }}</div>
        <div class="new" v-if="warningRecord.isNew == 0">new</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "warningRecord",
  data() {
    return {
      warnRecords: [],
    };
  },
  methods: {
    // 判断预警类型设置样式
    recordColor(status) {
      // console.log(status);
      if (status == "0") {
        return "record-0";
      } else if (status == "1") {
        return "record-1";
      } else if (status == "-1") {
        return "record--1";
      }
    },
    // 确定阅读预警
    async confirmAlertInfo(id, type) {
      let result = await this.$http.post(
        `/admin/isNewWarning?warningId=${id}&type=${type}`
      );
      if (result.data.code == 1) {
        if (type == "毕业预警") {
          if (result.data.code == 1) {
            const permission = await Notification.requestPermission();
            if (permission == "granted") {
              const notification = new Notification("贵州大学学分预警系统", {
                body: "教师收到通知啦ヾ(๑╹◡╹)ﾉ",
                icon: "https://www.gzu.edu.cn/_upload/tpl/00/02/2/template2/images/logo.png",
              });
            }
          }
        }
      } else if (result.data.code == 0) {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
      } else if (result.data.code == 302) {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 点击跳转到预警信息详情界面
    async goDetail(data, info, type, status, id, isNew) {
      // 判断是否为新消息增加new样式
      if (isNew == "0") {
        this.confirmAlertInfo(id, type);

        let info_student = JSON.parse(
          window.sessionStorage.getItem("info-student")
        );
        let { studentId } = info_student;
        let result = await this.$http.post(
          `/admin/confirmQualificationWarning?StudentId=${studentId}`
        );
        if (result.data.code == 1) {
          let info_student = JSON.parse(
            window.sessionStorage.getItem("info-student")
          );
          info_student.isConfirmGraduationWarning = 1;
          window.sessionStorage.setItem(
            "info-student",
            JSON.stringify(info_student)
          );
        } else if (result.data.code == 0) {
          this.$message({
            message: result.data.msg + " 请刷新后重试！",
            type: "error",
          });
        } else if (result.data.code == 302) {
          this.$message({
            message: result.data.msg,
            type: "error",
          });
          this.$router.push("/login");
        }
      }

      let content = data;
      // 如果是毕业提醒，还要发请求拿数据并且插入到数据库
      // if (status == "-1") {
      //   let student = JSON.parse(window.sessionStorage.getItem("info-student"));
      //   let currentGrade = student.grade;
      //   let currentMajor = student.major;
      //   let studentId = student.studentId;
      //   let studentInfo = {};
      //   studentInfo.currentGrade = currentGrade;
      //   studentInfo.currentMajor = currentMajor;
      //   studentInfo.studentId = studentId;
      //   let result = await this.$http.post(
      //     "/admin/qualificationDetails",
      //     studentInfo
      //   );
      //   if (result.data.code == 1) {
      //     content = JSON.stringify(result.data.data);
      //     this.$router.push({
      //       path: "/home/creditwarning/warningrecord/warningdetail",
      //       query: {
      //         content,
      //         info,
      //         type,
      //         status,
      //       },
      //     });
      //   }
      // } else {
      //   this.$router.push({
      //     path: "/home/creditwarning/warningrecord/warningdetail",
      //     query: {
      //       content,
      //       info,
      //       type,
      //       status,
      //     },
      //   });
      // }

      if (type == "毕业资格提醒") {
        this.$router.push("/home/mycourses");
        this.$message({
          message: content,
        });
      } else {
        this.$router.push({
          path: "/home/creditwarning/warningrecord/warningdetail",
          query: {
            content,
            info,
            type,
            status,
          },
        });
      }
    },
    // 获取预警记录
    async getWarnRecords() {
      let info_student = JSON.parse(
        window.sessionStorage.getItem("info-student")
      );
      let studentId = info_student.studentId;
      let result = await this.$http.post(
        `/admin/getCreditWarningList?studentId=${studentId}`
      );

      if (result.data.code == 1) {
        this.warnRecords = result.data.data;
      } else if (result.data.code == 0) {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
      } else if (result.data.code == 302) {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.getWarnRecords();
  },
};
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 1000px) {
  .warningRecord {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    height: 90vh;
    overflow: scroll;
    .recordsBox {
      margin: 0 auto;
      margin-top: 30px;
      width: 90%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .record-1 {
        width: 80%;
        min-height: 50px;
        background-color: #f0f9eb;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #67c23a;
        position: relative;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
          cursor: pointer;
        }

        .content {
          max-width: 30%;
        }
        .date {
          max-width: 30%;
        }

        .type {
          max-width: 30%;
        }
      }

      .record-0 {
        width: 80%;
        min-height: 50px;
        background-color: #fef0f0;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #f56c6c;

        position: relative;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
          cursor: pointer;
        }
        .content {
          max-width: 30%;
        }
        .date {
          max-width: 30%;
        }

        .type {
          max-width: 30%;
        }
      }

      .record--1 {
        width: 80%;
        min-height: 50px;
        background-color: #fdf6ec;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #e6a23c;

        position: relative;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
          cursor: pointer;
        }
        .content {
          max-width: 30%;
        }
        .date {
          max-width: 30%;
        }

        .type {
          max-width: 30%;
        }
      }
    }
  }
}
@media only screen and (max-width: 999px) {
  .warningRecord {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    .recordsBox {
      margin: 0 auto;
      margin-top: 20px;
      width: 96%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .record-1 {
        width: 100%;
        min-height: 50px;
        background-color: #f0f9eb;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #67c23a;
        position: relative;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
        }

        .content {
          max-width: 30%;
          // padding: 10px 0;
          font-size: 12px;
        }

        .type {
          max-width: 30%;
          font-size: 12px;
        }

        .date {
          max-width: 30%;
          font-size: 12px;
        }
      }

      .record-0 {
        width: 100%;
        min-height: 50px;
        background-color: #fef0f0;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #f56c6c;
        position: relative;
        cursor: pointer;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
        }
        .content {
          max-width: 30%;
          // padding: 10px 0;
          font-size: 12px;
        }

        .type {
          max-width: 30%;
          font-size: 12px;
        }

        .date {
          max-width: 30%;
          font-size: 12px;
        }
      }

      .record--1 {
        width: 100%;
        min-height: 50px;
        background-color: #fdf6ec;
        transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
          transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
        margin: 10px auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #e6a23c;

        position: relative;

        .new {
          width: 50px;
          height: 20px;
          position: absolute;
          right: 20px;
          top: -10px;
          background-color: #f56c6c;
          z-index: 999;
          color: #fff;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
        }

        &:hover {
          border-bottom-right-radius: 50px;
          border-top-left-radius: 50px;
          transform: scale(1.05);
          cursor: pointer;
        }
        .content {
          max-width: 30%;
          // padding: 10px 0;
          font-size: 12px;
        }

        .type {
          max-width: 30%;
          font-size: 12px;
        }

        .date {
          max-width: 30%;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
