<template>
  <div class="creditProfile">
    <template>
      <h1
        style="
          disaplay: block;
          height: 30px;
          border-bottom: 2px solid black;
          margin-bottom: 10px;
        "
      >
        请选择一个进行规划
      </h1>
      <el-empty
        description="暂无数据"
        v-show="studentAllCourses.length == 0"
      ></el-empty>
      <div class="allCategories">
        <div
          class="categoryItem"
          v-for="(value, index) in studentAllCourses"
          :key="index"
          @click="goPlanning(value.title, value.studentScore, value.minScore)"
        >
          <div class="title">{{ value.title }}</div>
          <div class="score">
            <i
              :style="{
                color:
                  parseFloat(value.studentScore) < parseFloat(value.minScore)
                    ? '#f56d6d'
                    : '#67c23a',
              }"
              >{{ value.studentScore }}</i
            >/{{ value.minScore }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CreditProfile",
  data() {
    return {
      studentAllCourses: [],
    };
  },
  methods: {
    // 点击跳转到详情页
    goPlanning(title, studentScore, minScore) {
      let studentId = JSON.parse(
        window.sessionStorage.getItem("info-student")
      ).studentId;
      this.$router.push(
        `/home/creditwarning/curriculumplanning/planning?title=${title}&studentScore=${studentScore}&minScore=${minScore}&studentId=${studentId}`
      );
    },
    getAllCourse() {
      // 获取后端数据

      this.$http
        .post(`/user/allcourse`)
        .then((result) => {
          if (result.data.code == 1) {
            this.studentAllCourses = result.data.data;
          } else if (result.data.code == 0) {
            this.$message({
              message: "数据请求失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "网络出错！",
            type: "error",
          });
        });
      // this.$store.dispatch("getAllcourse", studentId);
    },
  },
  mounted() {
    this.getAllCourse();
  },
};
</script>

<style lang="scss" scoped>
.creditProfile {
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  .allCategories {
    width: 96%;
     background: linear-gradient(135deg, #a7cee0 50%, #d0dea7);
    margin: 0 auto;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    border-radius: 17px;

    .categoryItem:hover {
      background: rgba(255, 255, 255, 0);
    }

    .categoryItem {
      width: 30%;
      height: 110px;
      margin: 20px 0;
      background: rgba(255, 255, 255, 0.25);
      // background-color: #f56d6d;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      cursor: pointer;
      transition: all 0.3s;

      .title {
        width: 90%;
        height: 50px;
        // background-color: pink;
        font-size: 30px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .score {
        // background-color: pink;
        width: 90%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-size: 40px;
      }
    }
  }
}
</style>
