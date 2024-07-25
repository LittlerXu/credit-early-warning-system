<template>
  <div class="allCourses">
    <h1>预览培养方案</h1>
    <div class="topButtoon">
      年级：
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
      学期：<el-select
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

      <!-- 确定修改按钮 -->
      <el-popconfirm
        confirm-button-text="十分肯定"
        cancel-button-text="再想想"
        icon="el-icon-info"
        icon-color="red"
        title="确定要修改吗？"
        @confirm="saveChange()"
      >
        <el-button type="danger" slot="reference">确定修改</el-button>
      </el-popconfirm>
    </div>

    <div class="totalScore" v-show="totalCredits.length != 0">
      此培养方案总分：{{ totalCredits }}
    </div>
    <div
      class="bigCategory"
      v-for="bigCategory in tempTrainPlan"
      :key="bigCategory.title"
    >
      <h1 style="font-size: 34px">{{ bigCategory.title }}</h1>
      <h3 style="color: #409eff">总分： {{ bigCategory.minCredits }}</h3>
      <ClassTable
        v-for="(subCategoryItem, index) in bigCategory.smallCategories"
        :key="index"
        :tableData="subCategoryItem.course"
        :title="subCategoryItem.title"
        :tableStyle="tableStyle"
        :minCredits="subCategoryItem.minCredits"
      ></ClassTable>
    </div>
  </div>
</template>

<script>
import ClassTable from "@/components/ClassTable/ClassTable.vue";
import { reqAddClassification, reqAddTrainingPlan } from "@/api";
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
      // 已有tag
      hadTags: [],
      // 选中专业
      selectingMajor: "",
      // 选中的tag
      tag: "",
      // 选中的学院
      selectingCollege: "",
    };
  },
  components: {
    ClassTable,
  },
  methods: {
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
            item.smallCategories.forEach((item) => {
              item.course = item.course.filter((item) => {
                console.log(item);
                return item.grade == this.gradeValue;
              });
            });
          });
        }
        // 只筛选学期
        else if (!this.gradeValue && this.semesterValue) {
          this.tempTrainPlan = JSON.parse(JSON.stringify(this.trainPlan));
          this.tempTrainPlan.forEach((item) => {
            item.smallCategories.forEach((item) => {
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
            item.smallCategories.forEach((item) => {
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
    // 从路由获取数据
    getDataByRoute() {
      let data = JSON.parse(this.$route.query.data);
      // 参数以及大类
      let trainingPlan = data.trainingPlan;
      // 大类里的课程，需要处理与大类结合
      let courseDTO = data.courseDTO;

      this.tag = trainingPlan.tag;
      this.selectingCollege = trainingPlan.college;
      this.selectingMajor = trainingPlan.major;

      trainingPlan.categoriesData.forEach((item1, index1) => {
        let largeClassification = item1.title;
        item1.smallCategories.forEach((item2, index2) => {
          let subClassification = item2.title;
          item2.course = [];
          courseDTO.courses.forEach((item3) => {
            if (
              item3.largeClassification == largeClassification &&
              item3.subClassification == subClassification
            ) {
              item2.course.push(item3);
            }
          });
          item2.courses = item2.course;
        });
      });

      this.trainPlan = trainingPlan.categoriesData;
      this.tempTrainPlan = JSON.parse(
        JSON.stringify(trainingPlan.categoriesData)
      );
    },
    // 发送后端生成培养方案
    async saveChange() {
      // 先校验tag是否与已有冲突
      if (this.hadTags.includes(this.tag)) {
        this.$message({
          showClose: true,
          message: "版本已存在，请换一个",
          type: "error",
        });
        return;
      }

      // 验证发送的课程数据参数不为空
      let validate = true;
      this.trainPlan.forEach((bigCategories) => {
        if (bigCategories.minCredits.length == 0) {
          this.$message({
            message: "最低选修学分不能为空",
            type: "erro",
          });
        }
        
        bigCategories.smallCategories.forEach((smallCategory) => {
          // if (smallCategory.course.length == 0) {
          //   this.$message({
          //     message: "请不要将分类里留空！",
          //     type: "error",
          //   });
          //   validate = false;
          //   return;
          // }

          smallCategory.course.forEach((item) => {
            if (item.semester && item.credit && item.grade) {
            } else {
              validate = false;
              this.$message({
                message: "请输入完整的课程信息！",
                type: "error",
              });
              return;
            }
          });
        });
      });

      // 将数据格式化
      let coursesList = [];
      for (let i = 0; i < this.trainPlan.length; i++) {
        let largeClassification = this.trainPlan[i].title;
        for (let j = 0; j < this.trainPlan[i].smallCategories.length; j++) {
          let subClassification = this.trainPlan[i].smallCategories[j].title;
          for (
            let k = 0;
            k < this.trainPlan[i].smallCategories[j].course.length;
            k++
          ) {
            this.trainPlan[i].smallCategories[j].course[k].largeClassification =
              largeClassification;
            this.trainPlan[i].smallCategories[j].course[k].subClassification =
              subClassification;
            this.trainPlan[i].smallCategories[j].course[k].major =
              this.selectingMajor;
            this.trainPlan[i].smallCategories[j].course[k].tag = this.tag;
            delete this.trainPlan[i].smallCategories[j].course[k].id;
            coursesList.push(this.trainPlan[i].smallCategories[j].course[k]);
          }
        }
      }
      let courses = {};
      courses.major = this.selectingMajor;
      courses.tag = this.tag;
      courses.college = this.selectingCollege;
      courses.grade = "";
      courses.courses = coursesList;
      // 封装对象发送请求
      if (validate) {
        // loading效果
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        setTimeout(() => {
          loading.close();
        }, 5000);
        // 先发送分类数据
        // let routeData = JSON.parse(this.$route.query.data);

        // let classification = routeData.trainingPlan;
        let classification = {};
        classification.categoriesData = this.trainPlan;
        classification.grade = "";
        classification.major = this.selectingMajor;
        classification.college = this.selectingCollege;
        classification.tag = this.tag;

        let data = JSON.parse(JSON.stringify(classification));
        // 发送后端
        console.log(data);
        let addClassificationResult = await reqAddClassification(data);
        if (addClassificationResult.code == 1) {
          this.$message({
            showClose: true,
            message: addClassificationResult.msg,
            type: "success",
          });
          // 发送整个培养方案数据
          let data = JSON.parse(JSON.stringify(courses));
          let reqAddTrainingPlanResult = await reqAddTrainingPlan(data);
          console.log("添加结果：");
          console.log(courses);
          console.log(reqAddTrainingPlanResult);
          if (reqAddTrainingPlanResult.code == 1) {
            this.$message({
              showClose: true,
              message: reqAddTrainingPlanResult.data,
              type: "success",
            });

            this.$router.push("/manager/check");
            loading.close();
          } else if (reqAddTrainingPlanResult.code == 0) {
            this.$message({
              showClose: true,
              message: reqAddTrainingPlanResult.msg,
              type: "error",
            });
            loading.close();
          }
        } else if (addClassificationResult.code == 0) {
          this.$message({
            showClose: true,
            message: addClassificationResult.msg,
            type: "error",
          });
          loading.close();
        }
      }
    },
  },
  created() {
    this.getDataByRoute();
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
    font-size: 17px;
    padding: 10px 0;
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
</style>
