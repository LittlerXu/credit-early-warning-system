<template>
  <div class="detail">
    <div>
      <el-alert
        :title="alertInfo.title"
        :type="alertInfo.type"
        :description="alertInfo.desc"
      >
      </el-alert>
    </div>

    <!-- 由于后端数据字段不一致，筛选功能暂时不做 -->
    <div class="topButtoon">
      <div class="item">
        <h1>年级：</h1>
        <el-select
          v-model="gradeValue"
          placeholder="请选择"
          @change="filterTrainPlan()"
        >
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="item">
        <h1>学期：</h1>
        <el-select
          v-model="semesterValue"
          placeholder="请选择"
          @change="filterTrainPlan()"
        >
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-empty
      description="暂无数据"
      v-show="smallCategory.length == 0"
    ></el-empty>
    <div
      v-for="item in tempSmallCategory"
      :key="item.title"
      style="width: 100%"
    >
      <ClassTablePlan
        ref="classtableplan"
        :minScore="item.minScore"
        :studentScore="item.studentScores"
        :title="item.title"
        :tableStyle="tableStyle"
        :selectedCoursesTableData="item.classes"
        :unSelectedCoursesTableData="item.unSelectCourses"
      ></ClassTablePlan>
    </div>
  </div>
</template>

<script>
import ClassTablePlan from "@/components/ClassTablePlan/ClassTablePlan.vue";
export default {
  name: "Detail",
  components: {
    ClassTablePlan,
  },
  data() {
    return {
      // 自定义表格样式
      tableStyle: [
        {
          prop: "title",
          label: "课程名称",
        },
        {
          prop: "natureOfCourse",
          label: "课程性质",
        },
        {
          prop: "credits",
          label: "学分",
        },
        {
          prop: "gpa",
          label: "绩点",
        },
        {
          prop: "score",
          label: "成绩",
        },
        {
          prop: "grade",
          label: "年级",
        },
        {
          prop: "semester",
          label: "学期",
        },
      ],
      // 顶部提示信息
      alertInfo: {
        title: "",
        type: "",
        decs: "",
      },
      // 所有小类数据
      smallCategory: [],
      // 为了方便筛选，先临时保存一份，不动原数据
      tempSmallCategory: [],
      // 可选年级
      gradeOptions: [
        {
          value: "一",
          label: "一",
        },
        {
          value: "二",
          label: "二",
        },
        {
          value: "三",
          label: "三",
        },
        {
          value: "四",
          label: "四",
        },
        {
          value: "",
          label: "所有年级",
        },
      ],
      // 选择的年级
      gradeValue: "",
      // 可选学期
      semesterOptions: [
        {
          value: "春夏",
          label: "春夏",
        },
        {
          value: "秋冬",
          label: "秋冬",
        },

        {
          value: "",
          label: "所有学期",
        },
      ],
      // 选择的学期
      semesterValue: "",
      // 动态显示学生学分
      studentScore: parseFloat(this.$route.query.studentScore),
    };
  },

  methods: {
    // 判断学分是否满足要求从而改变警告样式
    isGood(studentScore) {
      this.alertInfo.title = `模块：${this.$route.query.title}   最低要求学分：${this.$route.query.minScore}   您的学分：${this.$route.query.studentScore}`;
      if (this.$route.query.pass == 'true') {
        this.alertInfo.desc = "您的学分已满足要求，开心玩耍吧！";
        this.alertInfo.type = "success";
      } else {
        if (this.$route.query.minScore <= this.$route.query.studentScore) {
          this.alertInfo.desc = "您的部分模块未满足，加油！";
          this.alertInfo.type = "warning";
          return;
        }
        this.alertInfo.desc = "您的学分还未满足要求，加油！";
        this.alertInfo.type = "error";
      }
    },
    // 将获取到的数据根据是否已修进行分类
    dataSplitting(data) {
      // 要写屎山喽！！！ヽ(ー_ー)ノヽ(ー_ー)ノ
      data.forEach((smallCategory) => {
        smallCategory.unSelectCourses.forEach((item) => {
          // 两个数组字符对不上，重新设一个
          item.title = item.courseName;
          item.credits = item.credit;
        });
      });
      // 咦，也不多嘛，不过后端为什么学过的数据和为修的数据字符怎么对不上￣へ￣，还好我是高手
    },
    // 筛选功能
    filterTrainPlan() {
      // 学期或年级筛选一个
      if (this.gradeValue || this.semesterValue) {
        // 分类讨论
        // 只筛选年级
        if (this.gradeValue && !this.semesterValue) {
          // 烦死啦，这里数组要深拷贝，不然临时数据变了，原数据也会变，筛选个毛线(艹皿艹)
          this.tempSmallCategory = JSON.parse(
            JSON.stringify(this.smallCategory)
          );

          this.tempSmallCategory.forEach((item) => {
            item.classes = item.classes.filter((item) => {
              return item.grade == this.gradeValue;
            });
          });
          console.log(this.tempSmallCategory);
        }
        // 只筛选学期
        else if (!this.gradeValue && this.semesterValue) {
          this.tempSmallCategory = JSON.parse(
            JSON.stringify(this.smallCategory)
          );
          this.tempSmallCategory.forEach((item) => {
            item.classes = item.classes.filter((item) => {
              return item.semester == this.semesterValue;
            });
          });
        }
        // 都筛选
        else if (this.gradeValue && this.semesterValue) {
          this.tempSmallCategory = JSON.parse(
            JSON.stringify(this.smallCategory)
          );
          this.tempSmallCategory.forEach((item) => {
            item.classes = item.classes.filter((item) => {
              return (
                item.grade == this.gradeValue &&
                item.semester == this.semesterValue
              );
            });
          });
        }
      } // 学期和年级不筛选
      else if (!this.gradeValue && !this.semesterValue) {
        this.tempSmallCategory = JSON.parse(JSON.stringify(this.smallCategory));
      }
    },
    // 获取数据
    getStudentInfo() {
      let { title } = this.$route.query;
      this.$http
        .post(`/user/info?title=${title}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.smallCategory = result.data.data;
            // 将已修和未修课程数据字段保持一致
            this.dataSplitting(result.data.data);
            this.tempSmallCategory = JSON.parse(
              JSON.stringify(this.smallCategory)
            );
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
            // 重定向
            this.$router.replace("/login");
          }
        })
        .catch((err) => {
          this.$message({
            message: "网络出错！",
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.getStudentInfo();
    this.isGood();
  },
};
</script>

<style lang="scss" scoped>
.detail {
  .el-alert {
    margin: 0 auto;
    width: 80%;
    display: flex;
    justify-content: center;
  }
}
@media only screen and (min-width: 1000px) {
  .topButtoon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
