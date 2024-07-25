<template>
  <div class="modifyTrainingplan">
    <div class="top">
      <!-- 顶部学院选项 -->
      <div>
        <span style="font-size: 20px; color: #409bff">学院：</span>
        <el-select v-model="selectingCollege" placeholder="请选择学院">
          <el-option
            v-for="item in colleges"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="font-size: 20px; color: #409bff">专业：</span>
        <el-select v-model="selectingMajor" placeholder="请选择专业">
          <el-option
            v-for="item in majors"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="font-size: 20px; color: #409bff">版本：</span>
        <el-input
          v-model="tag"
          placeholder="请输入版本"
          style="width: 200px"
        ></el-input>
      </div>
      <!-- 确定修改按钮 -->
      <el-popconfirm
        confirm-button-text="十分肯定"
        cancel-button-text="再想想"
        icon="el-icon-info"
        icon-color="red"
        title="确定要修改吗？"
        @confirm="saveChange()"
      >
        <el-button type="danger" slot="reference">确定生成</el-button>
      </el-popconfirm>
    </div>
    <!-- 拖拽分类区域 -->
    <DragComponent_Add
      :selectedSemester="selectedSemester"
      :selectedCredit="selectedCredit"
      :selectedGrade="selectedGrade"
      :categories="categories"
    ></DragComponent_Add>
  </div>
</template>

<script>
import DragComponent_Add from "./DragCmponents-Add";
import {
  reqProfessionalList,
  reqTagList,
  reqAddTrainingPlan,
  reqAddClassification,
} from "@/api";

export default {
  name: "ModifyTrainingplan",
  components: {
    DragComponent_Add,
  },
  data() {
    return {
      // 选中的学院
      selectingCollege: "",
      // 选中的专业
      selectingMajor: "",
      // 版本
      tag: "",
      // 已有版本
      hadTags: [],
      // 可选学期
      selectedSemester: [
        {
          value: "春夏",
          label: "春夏",
        },
        {
          value: "秋冬",
          label: "秋冬",
        },
      ],
      // 可选学分
      selectedCredit: [
        {
          value: "0",
          label: "0",
        },
        {
          value: "0.5",
          label: "0.5",
        },
        {
          value: "1",
          label: "1",
        },
        {
          value: "1.5",
          label: "1.5",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "2.5",
          label: "2.5",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "3.5",
          label: "3.5",
        },
        {
          value: "4",
          label: "4",
        },
      ],
      // 可选年级
      selectedGrade: [
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
      ],
      // 可选学院
      colleges: [
        {
          value: "计算机科学与技术学院",
          label: "计算机科学与技术学院",
        },
      ],
      // 可选专业
      majors: [],
      // 右侧大类
      categories: [],
    };
  },
  created() {
    this.getAllModifyTrainplanData();
    this.getRouteData();
  },
  methods: {
    // 从后端获取所有需要的数据
    async getAllModifyTrainplanData() {
      // 获取专业列表
      let professionalListResult = await reqProfessionalList();
      if (professionalListResult.code == 1) {
        this.majors = professionalListResult.data;
      } else if (professionalListResult.code == 0) {
        this.$message({
          showClose: true,
          message: professionalListResult.msg,
          type: "error",
        });
      }
      // 获取已有tag
      let tagListResult = await reqTagList();
      console.log("获取tag：");
      console.log(tagListResult);
      if (tagListResult.code == 1) {
        tagListResult.data.forEach((item) => {
          this.hadTags.push(item.value);
        });
      } else if (tagListResult.code == 0) {
        this.$message({
          showClose: true,
          message: "获取tags出错",
          type: "error",
        });
      }
    },
    // 从路由提取信息
    getRouteData() {
      this.categories = this.$route.query.classification.categoriesData;
      let { college, major, tag } = this.$route.query.classification;
      this.selectingCollege = college;
      this.selectingMajor = major;
      this.tag = tag;
    },
    // 保存修改
    saveChange() {
      let trainingPlan = {};
      trainingPlan = this.$route.query.classification;
      trainingPlan.grade = "";

      let courseDTO = {};
      courseDTO.major = this.selectingMajor;
      courseDTO.tag = this.tag;
      // 将数据格式化
      let coursesList = [];
      for (let i = 0; i < this.categories.length; i++) {
        let largeClassification = this.categories[i].title;
        for (let j = 0; j < this.categories[i].smallCategories.length; j++) {
          let subClassification = this.categories[i].smallCategories[j].title;
          for (
            let k = 0;
            k < this.categories[i].smallCategories[j].courses.length;
            k++
          ) {
            this.categories[i].smallCategories[j].courses[
              k
            ].largeClassification = largeClassification;
            this.categories[i].smallCategories[j].courses[k].subClassification =
              subClassification;
            this.categories[i].smallCategories[j].courses[k].major =
              this.selectingMajor;
            this.categories[i].smallCategories[j].courses[k].tag = this.tag;
            delete this.categories[i].smallCategories[j].courses[k].id;
            coursesList.push(this.categories[i].smallCategories[j].courses[k]);
          }
        }
      }
      courseDTO.courses = coursesList;
      console.log(courseDTO);

      let data = {};
      data.trainingPlan = trainingPlan;
      data.courseDTO = courseDTO;
      data = JSON.stringify(data)
      this.$router.push({
        path: "/manager/preview",
        query: {
          data,
        },
      });
    },
    // async saveChange() {
    //   // 先校验tag是否与已有冲突
    //   if (this.hadTags.includes(this.tag)) {
    //     this.$message({
    //       showClose: true,
    //       message: "版本已存在，请换一个",
    //       type: "error",
    //     });
    //     return;
    //   }

    //   // 验证发送的课程数据参数不为空
    //   let validate = true;
    //   this.categories.forEach((bigCategories) => {
    //     if (bigCategories.minCredits.length == 0) {
    //       this.$message({
    //         message:"最低选修学分不能为空",
    //         type:"erro"
    //       })
    //     }
    //     bigCategories.smallCategories.forEach((smallCategory) => {
    //       if (smallCategory.courses.length == 0) {
    //         this.$message({
    //           message: "请不要将分类里留空！",
    //           type: "error",
    //         });
    //         validate = false;
    //         return;
    //       }

    //       smallCategory.courses.forEach((item) => {
    //         if (item.semester && item.credit && item.grade) {
    //         } else {
    //           validate = false;
    //           this.$message({
    //             message: "请输入完整的课程信息！",
    //             type: "error",
    //           });
    //           return;
    //         }
    //       });
    //     });
    //   });

    //   // 将数据格式化
    //   let coursesList = [];
    //   for (let i = 0; i < this.categories.length; i++) {
    //     let largeClassification = this.categories[i].title;
    //     for (let j = 0; j < this.categories[i].smallCategories.length; j++) {
    //       let subClassification = this.categories[i].smallCategories[j].title;
    //       for (
    //         let k = 0;
    //         k < this.categories[i].smallCategories[j].courses.length;
    //         k++
    //       ) {
    //         this.categories[i].smallCategories[j].courses[
    //           k
    //         ].largeClassification = largeClassification;
    //         this.categories[i].smallCategories[j].courses[k].subClassification =
    //           subClassification;
    //         this.categories[i].smallCategories[j].courses[k].major =
    //           this.selectingMajor;
    //         this.categories[i].smallCategories[j].courses[k].tag = this.tag;
    //         delete this.categories[i].smallCategories[j].courses[k].id;
    //         coursesList.push(this.categories[i].smallCategories[j].courses[k]);
    //       }
    //     }
    //   }
    //   let courses = {};
    //   courses.major = this.selectingMajor;
    //   courses.tag = this.tag;
    //   courses.college = this.selectingCollege;
    //   courses.grade = "";
    //   courses.courses = coursesList;
    //   // 封装对象发送请求
    //   if (validate) {
    //     // loading效果
    //     const loading = this.$loading({
    //       lock: true,
    //       text: "Loading",
    //       spinner: "el-icon-loading",
    //       background: "rgba(0, 0, 0, 0.7)",
    //     });
    //     // 先发送分类数据
    //     let classification = this.$route.query.classification;
    //     classification.grade = "";
    //     let data = JSON.parse(JSON.stringify(classification));
    //     console.log("```");
    //     console.log(data);
    //     // 发送后端
    //     let addClassificationResult = await reqAddClassification(data);
    //     if (addClassificationResult.code == 1) {
    //       this.$message({
    //         showClose: true,
    //         message: addClassificationResult.msg,
    //         type: "success",
    //       });
    //       // 发送整个培养方案数据
    //       let data = JSON.parse(JSON.stringify(courses));
    //       let reqAddTrainingPlanResult = await reqAddTrainingPlan(data);
    //       console.log("添加结果：");
    //       console.log(courses);
    //       console.log(reqAddTrainingPlanResult);
    //       if (reqAddTrainingPlanResult.code == 1) {
    //         this.$message({
    //           showClose: true,
    //           message: reqAddTrainingPlanResult.data,
    //           type: "success",
    //         });

    //         this.$router.push("/manager/addbigcategories");
    //         loading.close();
    //       } else if (reqAddTrainingPlanResult.code == 0) {
    //         this.$message({
    //           showClose: true,
    //           message: reqAddTrainingPlanResult.msg,
    //           type: "error",
    //         });
    //          loading.close();
    //       }
    //     } else if (addClassificationResult.code == 0) {
    //       this.$message({
    //         showClose: true,
    //         message: addClassificationResult.msg,
    //         type: "error",
    //       });
    //        loading.close();
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  box-sizing: border-box;
}
.modifyTrainingplan {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;

  .top {
    height: 60px;
    width: 100%;
    // background-color: rgb(253, 204, 212);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid rgb(181, 176, 176);
    // margin-bottom: 20px;
  }
}
</style>
