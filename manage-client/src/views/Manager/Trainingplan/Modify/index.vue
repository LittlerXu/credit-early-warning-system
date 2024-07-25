<template>
  <div class="modifyTrainingplan">
    <div class="top">
      <!-- 顶部学院选项 -->
      <div>
        <span style="font-size: 15px; color: #409bff">专业：</span>
        <el-input v-model="selectingMajor" placeholder="专业" readonly>
        </el-input>
        <span style="font-size: 15px; color: #409bff">年级：</span>
        <el-input v-model="selectingGrade" placeholder="年级" readonly>
        </el-input>
        <span style="font-size: 15px; color: #409bff">原版本：</span>
        <el-input v-model="selectingTag" placeholder="原版本" readonly>
        </el-input>
        <span style="font-size: 15px; color: #409bff">现版本：</span>
        <el-input v-model="newSelectingTag" placeholder="请输入现版本">
        </el-input>
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
        <el-button type="danger" slot="reference">确定修改</el-button>
      </el-popconfirm>
    </div>
    <el-empty
      description="此版本培养方案不存在"
      v-show="categories.length == 0"
    ></el-empty>

    <!-- 拖拽分类区域 -->
    <DragComponent_Modify
      :selectedSemester="selectedSemester"
      :selectedCredit="selectedCredit"
      :selectedGrade="selectedGrade"
      :categoriesData="categories"
      v-show="categories.length != 0"
    ></DragComponent_Modify>
  </div>
</template>

<script>
import DragComponent_Modify from "./DragCmponents-Modify";
import {
  reqTagList,
  reqAddTrainingPlan,
  reqTrainingPlanInfo,
  reqAddClassification,
  reqUpdateUnKnowCourse
} from "@/api";

export default {
  name: "ModifyTrainingplan",
  components: {
    DragComponent_Modify,
  },
  data() {
    return {
      // 选中的专业
      selectingMajor: "",
      // 选中的年级
      selectingGrade: "",
      // 输入的新的版本
      newSelectingTag: "",
      // 选中的版本
      selectingTag: "",
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
      // 右侧大类
      categories: [],
    };
  },
  created() {
    this.getAllModifyTrainplanData();
  },
  methods: {
    // 从后端获取所有需要的数据
    async getAllModifyTrainplanData() {
      // 从路由获取参数
      let { major, grade, tag } = this.$route.query;
      this.selectingMajor = major;
      this.selectingGrade = grade;
      this.selectingTag = tag;
      this.getTrainPlan();

      // 获取已有tag
      let tagListResult = await reqTagList();
      if (tagListResult.code == 1) {
        this.hadTags = tagListResult.data;
      } else if (tagListResult.code == 0) {
        this.$message({
          showClose: true,
          message: "获取版本出错",
          type: "error",
        });
      }
    },
    // 获取方案数据
    async getTrainPlan() {
      // loading
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      
      // 数据处理
      let trainingPlanDTO = {};
      trainingPlanDTO.grade = this.selectingGrade;
      trainingPlanDTO.major = this.selectingMajor;
      trainingPlanDTO.tag = this.selectingTag;

      let reqTrainingPlanInfoResult = await reqTrainingPlanInfo(
        trainingPlanDTO
      );
      if (reqTrainingPlanInfoResult.code == 1) {
        this.categories = reqTrainingPlanInfoResult.data.largeSubjects;
        loading.close();
      } else if (reqTrainingPlanInfoResult.code == 0) {
        this.$message({
          message: reqTrainingPlanInfoResult.msg,
          type: "error",
        });
        loading.close();
      } else if (reqTrainingPlanInfoResult.code == 302) {
        this.$message({
          message: reqTrainingPlanInfoResult.msg,
          type: "error",
        });
        loading.close();
        this.$router.push("/login");
      }
    },
    // 保存修改
    async saveChange() {
      // loading效果
      const loading = this.$loading({
        lock: true,
        text: "请等待一下哦（可能需要30s左右）",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      setTimeout(() => {
        loading.close();
      }, 30000);
      // 验证发送的课程数据参数不为空
      let validate = true;
      this.categories.forEach((bigCategories) => {
        bigCategories.smallSubjects.forEach((smallCategory) => {
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
      // 新增大类参数
      let classification = {};
      classification.categoriesData = JSON.parse(
        JSON.stringify(this.categories)
      );
      // 给categoriesData里的字符串改名,怎么给的数据和要提交的数据字段不一致啊

      classification.categoriesData.forEach((item, index1) => {
        item.smallCategories = item.smallSubjects;
        item.title = item.name;

        delete classification.categoriesData[index1].smallSubjects;
        delete classification.categoriesData[index1].name;
        item.smallCategories.forEach((item, index) => {
          item.title = item.name;
          delete classification.categoriesData[index1].smallCategories[index]
            .name;
        });
      });
      classification.college = "计算机科学与技术学院";
      classification.major = this.selectingMajor;
      classification.grade = this.selectingGrade;
      classification.tag = this.newSelectingTag;
      console.log("~~~~");
      console.log(classification);
      let classificationData = JSON.parse(JSON.stringify(classification));
      // 将数据格式化
      let coursesList = [];
      for (let i = 0; i < this.categories.length; i++) {
        let largeClassification = this.categories[i].name;
        for (let j = 0; j < this.categories[i].smallSubjects.length; j++) {
          let subClassification = this.categories[i].smallSubjects[j].name;
          for (
            let k = 0;
            k < this.categories[i].smallSubjects[j].course.length;
            k++
          ) {
            this.categories[i].smallSubjects[j].course[k].largeClassification =
              largeClassification;
            this.categories[i].smallSubjects[j].course[k].subClassification =
              subClassification;
            this.categories[i].smallSubjects[j].course[k].major =
              this.selectingMajor;
            this.categories[i].smallSubjects[j].course[k].tag =
              this.newSelectingTag;
            delete this.categories[i].smallSubjects[j].course[k].id;
            coursesList.push(this.categories[i].smallSubjects[j].course[k]);
          }
        }
      }
      let courses = {};
      courses.major = this.selectingMajor;
      courses.tag = this.newSelectingTag;
      courses.courses = coursesList;

      // 封装对象发送请求
      if (validate) {
        let result = await reqAddClassification(classificationData);
        console.log("```");
        console.log(classificationData);
        if (result.code == 1) {
          this.$message({
            message: "添加分类成功",
            type: "success",
          });
          // 大类设置完成再发送新增培养方案请求
          //#region
          console.log("````````");
          console.log(courses);
          let data = JSON.parse(JSON.stringify(courses));

          let reqAddTrainingPlanResult = await reqAddTrainingPlan(data);
          if (reqAddTrainingPlanResult.code == 1) {
            this.$message({
              showClose: true,
              message: reqAddTrainingPlanResult.data,
              type: "success",
            });
            // 添加培养方案之后发送请求
            let data = {
              major:this.selectingMajor,
              grade:this.selectingGrade,
              tag:this.newSelectingTag
            }
            let res  = await reqUpdateUnKnowCourse(data)
            if (res.code == 1) {
              this.$message({
                message:res.msg,
                type:"success"
              })
              loading.close();
            }else{
              this.$message({
                message:res.msg,
                type:"error"
              })
              loading.close();
            }
            loading.close();
            this.$router.push("/manager/check");
          } else if (reqAddTrainingPlanResult.code == 0) {
            this.$message({
              showClose: true,
              message: reqAddTrainingPlanResult.msg,
              type: "error",
            });
            loading.close();
          } else if (result.code == 302) {
            this.$message({
              message: result.msg,
              type: "error",
            });
            this.$router.push("/login");
            loading.close();
          }
          //#endregion
        } else if (result.code == 0) {
          this.$message({
            message: result.msg,
            type: "error",
          });
          loading.close();
        } else if (result.code == 302) {
          this.$message({
            message: result.msg,
            type: "error",
          });
          loading.close();
          this.$router.push("/login");
        }
      }
    },
    // 删除大类
    removeBigCategory(index) {
      console.log("删除大类");
      this.categories = this.categories.filter((item, itemIndex) => {
        return itemIndex != index;
      });
    },
    // 删除小类
    removeSmallCategory(bigCategoryIndex, smallCategoryIndex) {
      console.log("删除小类");
      this.categories[bigCategoryIndex].smallSubjects = this.categories[
        bigCategoryIndex
      ].smallSubjects.filter((item, index) => {
        return index != smallCategoryIndex;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 150px;
}
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
