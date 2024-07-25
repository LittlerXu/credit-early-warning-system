<template>
  <!-- 拖拽分类区域 -->
  <div class="container">
    <div class="courses">
      <el-input
        v-model="searchWord"
        placeholder="搜索课程"
        style="width: 80%"
        @keyup.enter.native="getCoursesData()"
      ></el-input>
      <draggable
        class="courseList"
        v-model="coursesData"
        group="courses"
        animation="500"
      >
        <div
          class="courseItem"
          v-for="(course, index) in coursesData"
          :key="index"
        >
          <div>{{ course.courseName }}</div>
          <div>{{ course.courseCode }}</div>
        </div>
      </draggable>
    </div>
    <div class="categories">
      <div class="categoriesList">
        <div
          class="bigCategoryItem"
          v-for="(bigCategory, bigCategoryIndex) in categoriesData"
          :key="bigCategory.name"
        >
          <div style="display: flex; align-items: center">
            <h1 style="display: block">{{ bigCategory.name }}</h1>

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="removeBigCategory(bigCategoryIndex)"
            ></el-button
            ><br />
          </div>
          <el-input
            v-model="bigCategory.minCredits"
            placeholder="请输入最低学分要求"
          ></el-input>
          <hr />
          <div
            class="smallCategoryItem"
            v-for="(
              smallCategory, smallCategoryIndex
            ) in bigCategory.smallSubjects"
            :key="smallCategory.name"
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <h3 style="display: block">{{ smallCategory.name }}</h3>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                circle
                @click="
                  removeSmallCategory(bigCategoryIndex, smallCategoryIndex)
                "
              >
              </el-button>
            </div>
            <el-input
              v-model="smallCategory.minCredits"
              placeholder="请输入最低学分要求"
            >
            </el-input>
            <draggable
              class="courseItemBox"
              v-model="smallCategory.course"
              group="courses"
              animation="500"
            >
              <div
                class="courseItem"
                v-for="(course, index) in smallCategory.course"
                :key="index"
              >
                {{ course.courseName }}<br />
                <el-input
                  v-model="course.courseCode"
                  placeholder="请设置课程代码"
                >
                </el-input>
                <el-select v-model="course.credit" placeholder="请设置学分">
                  <el-option
                    v-for="item in selectedCredit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select v-model="course.grade" placeholder="请设置年级">
                  <el-option
                    v-for="item in selectedGrade"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select v-model="course.semester" placeholder="请设置学期">
                  <el-option
                    v-for="item in selectedSemester"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { reqBasicCourses } from "@/api";
export default {
  name: "DragComponent-Add",
  components: {
    draggable,
  },
  props: [
    "selectedSemester",
    "selectedCredit",
    "selectedGrade",
    "categoriesData",
  ],
  data() {
    return {
      // 搜索课程关键词
      searchWord: "",
      // 基础课程
      coursesData: [],
    };
  },

  methods: {
    // 获取基础课程
    async getCoursesData() {
      // 获取基础课程
      let basicCoursesResult = await reqBasicCourses(this.searchWord);
      if (basicCoursesResult.code == 1) {
        this.coursesData = basicCoursesResult.data;
      } else if (basicCoursesResult.code == 0) {
        this.$message({
          showClose: true,
          message: basicCoursesResult.msg,
          type: "error",
        });
      }
    },
    // 删除大类
    removeBigCategory(index) {
      // prop不能在字组件中更改
      // 提交事件，让父组件修改
      this.$parent.removeBigCategory(index);
    },
    // 删除小类
    removeSmallCategory(bigCategoryIndex, smallCategoryIndex) {
      this.$parent.removeSmallCategory(bigCategoryIndex, smallCategoryIndex);
    },
  },
  created() {
    this.getCoursesData();
  },
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 800px;
  background-color: #ebeefa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  .courses {
    width: 48%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
    border-radius: 17px;

    .courseList {
      width: 80%;
      height: 90%;
      // background-color: black;
      background-color: #e7eefb;
      border-radius: 5px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      overflow: scroll;

      .courseItem {
        user-select: none;
        width: 300px;
        min-height: 50px;
        border-radius: 25px;
        background: rgba(245, 245, 245, 1);
        margin: 10px 0;
        font-weight: bold;
        font-size: 15px;
        color: rgba(102, 82, 241, 1);
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
        text-overflow: ellipsis;
      }
    }
  }

  .categories {
    width: 48%;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    border-radius: 17px;
    overflow: auto;

    .categoriesList {
      width: 80%;
      height: 100%;
      // background-color: black;

      .bigCategoryItem {
        width: 100%;
        // height: 100%;
        background-color: rgba(245, 245, 245, 1);
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
        margin: 20px 0;

        .smallCategoryItem {
          width: 334px;
          min-height: 200px;
          border-radius: 15px;
          background: rgba(231, 238, 251, 1);
          margin: 10px 0;

          .courseItemBox {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 200px;
            .courseItem {
              user-select: none;
              width: 300px;
              min-height: 50px;
              border-radius: 25px;
              background: rgba(245, 245, 245, 1);
              margin: 10px 0;
              line-height: 50px;
              font-weight: bold;
              font-size: 20px;
              color: rgba(102, 82, 241, 1);
            }
          }
        }
      }
    }
  }
}
</style>
