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
        学分概况
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
          @click="goDetail(value.title, value.studentScore, value.minScore,value.pass)"
        >
          <div class="title">{{ value.title }}</div>
          <div class="score">
            <i :style="{ color: scoreColor(value) }">{{ value.studentScore }}</i
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
    //判断字体颜色
    scoreColor(score) {
      
      if (score.pass) {
        return "#67c23a";
      } else {
        if (score.minScore <= score.studentScore) {
          return "yellow";
        }
        return "#f56d6d";
      }
    },
    // 点击跳转到详情页
    goDetail(title, studentScore, minScore,pass) {
      let studentId = this.$route.query.studentId;
      this.$router.push(
        `/manager/studentDetail?title=${title}&studentScore=${studentScore}&minScore=${minScore}&studentId=${studentId}&major=${this.$route.query.major}&grade=${this.$route.query.grade}&pass=${pass}`
      );
    },
    getAllCourse() {
      // 获取后端数据
      let { studentId, grade, major } = this.$route.query;
      let data = {
        grade,
        major,
        studentId,
      };
      this.$http
        .post(`/user/allcourse`, data)
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
@media only screen and (min-width: 1000px) {
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
}

@media only screen and (max-width: 999px) {
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
        width: 45%;
        height: 90px;
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
          font-size: 20px;
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
          font-size: 18px;
        }
      }
    }
  }
}
</style>
