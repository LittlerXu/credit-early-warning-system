<template>
  <div class="home">
    <CreditProfile></CreditProfile>
   
    <ClassTable
      :tableData="tempClassTable"
     
      :tableStyle="tableStyle"
    ></ClassTable>
  </div>
</template>

<script>
import CreditProfile from "./CreditProfile/CreditProfile.vue";
import ClassTable from "@/components/ClassTable/ClassTable.vue";
import { reqGetStudentYears } from "@/api/index";
export default {
  name: "myCourse",
  data() {
    return {
      // 是否被通知
      isConfirmGraduationWarning: "",
      // 所有成绩
      classTable: [],
      // 自定义表格样式
      tableStyle: [
        {
          prop: "courseName",
          label: "课程名称",
        },
        {
          prop: "subClassification",
          label: "课程性质",
        },
        {
          prop: "courseCredit",
          label: "学分",
        },
        {
          prop: "courseGpa",
          label: "绩点",
        },
        {
          prop: "courseGrade",
          label: "成绩",
        },
        {
          prop: "courseSelectGrade",
          label: "年级",
        },
        {
          prop: "courseSelectSemester",
          label: "学期",
        },
      ],
      // 为了方便筛选，先临时保存一份，不动原数据
      tempClassTable: [],
      // 可选年级
      gradeOptions: [],
      // 选择的年级
      gradeValue: "",
      // 可选学期
      semesterOptions: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },

        {
          value: "",
          label: "所有学期",
        },
      ],
      // 选择的学期
      semesterValue: "",
    };
  },
  created() {
    this.getStudentgrade();
    // this.getStudentYears();
  },
  methods: {
    async getStudentYears() {
      let studentId = this.$route.query.studentId;
      let res = await reqGetStudentYears(studentId);
      if (res.code == 1) {
        this.gradeOptions = res.data;
        this.gradeOptions.push({
          value: "",
        });
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    // 确认收到通知
    async confim() {
      let student = JSON.parse(window.sessionStorage.getItem("info-student"));
      let studentId = student.studentId;
      let result = await this.$http.post(
        `/admin/confirmQualificationWarning?StudentId=${studentId}`
      );
      if (result.data.code == "1") {
        this.isConfirmGraduationWarning = "1";
        student.isConfirmGraduationWarning = "1";
        student = JSON.stringify(student);
        window.sessionStorage.setItem("info-student", student);
      } else {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
      }
    },
    // 点击确定了解成绩
    async closeAlert() {
      let student = JSON.parse(window.sessionStorage.getItem("info-student"));
      let currentGrade = student.grade;
      let currentMajor = student.major;
      let studentId = student.studentId;
      let studentInfo = {};
      studentInfo.currentGrade = currentGrade;
      studentInfo.currentMajor = currentMajor;
      studentInfo.studentId = studentId;
      let result = await this.$http.post(
        "/admin/qualificationDetails",
        studentInfo
      );
      if (result.data.code == 1) {
        // console.log(result.data);
        let content = JSON.stringify(result.data.data);
        let student = JSON.parse(window.sessionStorage.getItem("info-student"));
        let { studentId } = student;
        let warningInfo = {};
        warningInfo.studentId = studentId;
        warningInfo.content = content;
        warningInfo.type = "2"; //定值
        // 插入数据库
        let res = await this.$http.post(
          "/admin/sentCreditWarning",
          warningInfo
        );
        if (res.data.code == "1") {
          // 发送后端确定通知
          this.confim();
          // 设置本地存储
          let type = "毕业提醒";
          let info = "毕业提醒";
          let status = "-1";
          this.$router.push({
            path: "/home/creditwarning/warningrecord/warningdetail",
            query: {
              content,
              info,
              type,
              status,
            },
          });
        } else {
          this.$message({
            message: result.data.msg,
            type: "error",
          });
        }
      } else {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
      }
    },
    // 筛选功能
    filterTrainPlan() {
      // 学期或年级筛选一个
      if (this.gradeValue || this.semesterValue) {
        // 分类讨论
        // 只筛选年级
        if (this.gradeValue && !this.semesterValue) {
          // 烦死啦，这里数组要深拷贝，不然临时数据变了，原数据也会变，筛选个毛线(艹皿艹)
          this.tempClassTable = JSON.parse(JSON.stringify(this.classTable));
          this.tempClassTable = this.tempClassTable.filter((item) => {
            return item.courseSelectGrade == this.gradeValue;
          });
        }
        // 只筛选学期
        else if (!this.gradeValue && this.semesterValue) {
          this.tempClassTable = JSON.parse(JSON.stringify(this.classTable));
          this.tempClassTable = this.tempClassTable.filter((item) => {
            return item.courseSelectSemester == this.semesterValue;
          });
        }
        // 都筛选
        else if (this.gradeValue && this.semesterValue) {
          this.tempClassTable = JSON.parse(JSON.stringify(this.classTable));
          this.tempClassTable = this.tempClassTable.filter((item) => {
            return (
              item.courseSelectSemester == this.semesterValue &&
              item.courseSelectGrade == this.gradeValue
            );
          });
        }
      } // 学期和年级不筛选
      else if (!this.gradeValue && !this.semesterValue) {
        this.tempClassTable = JSON.parse(JSON.stringify(this.classTable));
      }
    },
    //  获取学生学生所有课程的成绩
    getStudentgrade() {
      let studentId = this.$route.query.studentId;
      this.$http
        .post(`/user/studentgrade?studentId=${studentId}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.classTable = result.data.data;
            this.tempClassTable = JSON.parse(JSON.stringify(this.classTable));
          } else if (result.data.code == 0) {
            this.$message({
              message: result.msg,
              type: "error",
            });
          } else if (result.data.code == 302) {
            this.$message({
              message: result.data.msg,
              type: "error",
            });
            // 重定向
            this.$router.replace("/login");
          }
        })
        .catch(() => {
          this.$message({
            message: "网络出错！",
            type: "error",
          });
        });
    },
  },
  components: {
    CreditProfile,
    ClassTable,
  },
};
</script>

<style lang="scss" scoped>
// @media only screen and (min-width:1000px){
//   .select{
//     display: block;
//   }
// }
.alert {
  display: flex !important;
  align-items: center !important;
  justify-content: space-around !important;
  width: 100% !important;
}
.home {
  width: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding-top: 20px;
}

@media only screen and (min-width: 1000px) {
  .topButtoon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
