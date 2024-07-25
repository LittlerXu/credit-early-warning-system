<template>
  <div class="addCategories">
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
            :label="item.label"
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
        title="确定分好了？"
        @confirm="goModifyTrainingplan()"
      >
        <el-button type="danger" slot="reference">分类好了</el-button>
      </el-popconfirm>
    </div>

    

    <!-- 新增分类区域 -->
    <div class="container">
      <div
        class="bigCategory"
        v-for="(bigCategory, bigCategoryIndex) in categories"
        :key="bigCategoryIndex"
      >
        <h1>{{ bigCategory.title }}</h1>
        <div
          class="smallCategory"
          v-for="(
            smallCategory, smallCategoryIndex
          ) in bigCategory.smallCategories"
          :key="smallCategoryIndex"
        >
          <h3>{{ smallCategory.title }}</h3>
        </div>
        <div class="smallCategory">
          <el-input
            v-model="smallCategoryName"
            placeholder="新增小类"
            @keyup.enter.native="addSmallCategory(bigCategoryIndex)"
          ></el-input>
        </div>
      </div>
      <div class="bigCategory">
        <el-input
          v-model="bigCategoryName"
          placeholder="新增大类"
          @keyup.enter.native="addBigCategory()"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { reqAddClassification, reqProfessionalList, reqTagList } from "@/api";
export default {
  name: "AddCategories",
  data() {
    return {
      // 所有分类
      categories: [],
      // 新增小类名字
      smallCategoryName: "",
      //   新增大类名字
      bigCategoryName: "",
      // 选中的学院
      selectingCollege: "",
      // 选中的专业
      selectingMajor: "",
      // 版本
      tag: "",
      // 已有版本
      hadTags: [],
      // 可选学院
      colleges: [
        {
          value: "计算机科学与技术学院",
          label: "计算机科学与技术学院",
        },
      ],
      // 可选专业
      majors: [
        {
          value: "软件工程",
          label: "软件工程",
        },
      ],
    };
  },
  methods: {
    // 获取专业，版本信息
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
    // 跳转到分类页面
    async goModifyTrainingplan() {
      // 先校验tag是否与已有冲突
      if (this.hadTags.includes(this.tag)) {
        this.$message({
          showClose: true,
          message: "版本已存在，请换一个",
          type: "error",
        });
        return;
      }

      // 数据整理
      let categoriesData = this.categories;
      let classification = {};
      classification.college = this.selectingCollege;
      classification.major = this.selectingMajor;
      classification.tag = this.tag;
      classification.categoriesData = categoriesData;
      // 路由跳转传参
      this.$router.push({
        path: `/manager/assigncourses`,
        query: { classification },
      });
    },
    // 新增小类
    addSmallCategory(bigCategoryIndex) {
      if (this.smallCategoryName.length != 0) {
        let newSmallCategory = {};
        newSmallCategory.title = this.smallCategoryName;
        newSmallCategory.courses = [];
        this.categories[bigCategoryIndex].smallCategories.push(
          newSmallCategory
        );
        this.smallCategoryName = "";
      } else {
        // this.$message({
        //   message: "请输入小类名字！",
        //   type: "error",
        // });
        let newSmallCategory = {};
        newSmallCategory.title = "默认";
        newSmallCategory.courses = [];
        this.categories[bigCategoryIndex].smallCategories.push(
          newSmallCategory
        );
        this.smallCategoryName = "";
      }
    },
    // 新增大类
    addBigCategory() {
      if (this.bigCategoryName.length != 0) {
        let newBigCategory = {};
        newBigCategory.title = this.bigCategoryName;
        newBigCategory.smallCategories = [];
        this.categories.push(newBigCategory);
        this.bigCategoryName = "";
      } else {
        this.$message({
          message: "请输入大类名字！",
          type: "error",
        });
      }
    },
  },
  created() {
    this.getAllModifyTrainplanData();
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.addCategories {
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

  .container {
    width: 100%;
    min-height: 400px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex-direction: column;

    .bigCategory {
      width: 80%;
      min-height: 100px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-radius: 9px;
      margin: 10px auto;

      .smallCategory {
        width: 80%;
        min-height: 50px;
        background-color: #e7eefb;
        border-radius: 8px;
        margin: 10px auto;
        line-height: 50px;
      }
    }
  }
}
</style>
