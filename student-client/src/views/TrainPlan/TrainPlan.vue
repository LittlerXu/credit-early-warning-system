<template>
  <div class="allCourses">
    <el-card shadow="always">
      当前正在使用<i style="color: #44a0ff;font-style: normal;">{{ major }}</i
      >专业、<i style="color: #44a0ff;font-style: normal;">{{ tag }}</i
      >版本的培养方案
    </el-card>
    <div class="topButtoon">
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
    <div class="totalScore">此培养方案总分：{{ totalCredits }}</div>
    <div
      class="bigCategory"
      v-for="bigCategory in tempTrainPlan"
      :key="bigCategory.name"
    >
      <h1 style="font-size: 34px">{{ bigCategory.name }}</h1>
      <h3 style="color: #;fontr-size:20px">总分： {{ bigCategory.minCredits }}</h3>
      <ClassTable
        v-for="(subCategoryItem, index) in bigCategory.smallSubjects"
        :key="index"
        :tableData="subCategoryItem.course"
        :title="subCategoryItem.name"
        :tableStyle="tableStyle"
        :minCredits="subCategoryItem.minCredits"
      >
      </ClassTable>
    </div>
  </div>
</template>

<script>
import ClassTable from "@/components/ClassTable/ClassTable.vue";

export default {
  name: "TrainPlan",
  data() {
    return {
      // 自定义表格样式
      tableStyle: [
        {
          prop: "courseName",
          label: "课程名称",
        },
        {
          prop: "credit",
          label: "学分",
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
      // 培养方案
      trainPlan: [],
      // 为了方便筛选，先临时保存一份，不动原数据
      tempTrainPlan: [],
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
      // 培养方案总分
      totalCredits: "",
      // 培养方案的版本
      tag: "",
      // 培养方案的专业
      major: "",
    };
  },
  components: {
    ClassTable,
  },
  methods: {
    // 获取配养方案
    async getTrainPlan() {
      // 等待效果
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 5000);
      let { grade, major } = JSON.parse(
        window.sessionStorage.getItem("info-student")
      );
      let result = await this.$http.post("/trainingPlan/getTrainingPlanInfo", {
        grade,
        major,
      });
      if (result.data.code == 1) {
        this.trainPlan = result.data.data.largeSubjects;
        this.totalCredits = result.data.data.totalCredits;
        this.tag = result.data.data.tag;
        this.major = result.data.data.major;
        // console.log(this.trainPlan);
        // 这里需要深拷贝
        this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
        loading.close();
      } else if (result.data.code == 302) {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
        // 重定向
        this.$router.replace("/login");
      } else {
        this.$message({
          message: result.data.msg,
          type: "error",
        });
        loading.close();
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
          this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
          this.tempTrainPlan.forEach((item) => {
            item.smallSubjects.forEach((item) => {
              item.course = item.course.filter((item) => {
                return item.grade == this.gradeValue;
              });
            });
          });
        }
        // 只筛选学期
        else if (!this.gradeValue && this.semesterValue) {
          this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
          this.tempTrainPlan.forEach((item) => {
            item.smallSubjects.forEach((item) => {
              item.course = item.course.filter((item) => {
                return item.semester == this.semesterValue;
              });
            });
          });
        }
        // 都筛选
        else if (this.gradeValue && this.semesterValue) {
          this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
          this.tempTrainPlan.forEach((item) => {
            item.smallSubjects.forEach((item) => {
              item.course = item.course.filter((item) => {
                return (
                  item.semester == this.semesterValue &&
                  item.grade == this.gradeValue
                );
              });
            });
          });
        }
      }
      // 学期和年级不筛选
      else if (!this.gradeValue && !this.semesterValue) {
        this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
      }
    },
  },
  created() {
    this.getTrainPlan();
  },
};
</script>

<style lang="scss" scoped>
.allCourses {
  width: 100%;
  // background-color: #fff;
  border-radius: 6px;

  .totalScore {
    color: #ff4d4f;
    background-color: #fff;
    font-size: 28px;
    margin-top: 20px;
    
  }

  .bigCategory {
    background: rgba(236, 245, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    margin: 40px auto;
  }
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
