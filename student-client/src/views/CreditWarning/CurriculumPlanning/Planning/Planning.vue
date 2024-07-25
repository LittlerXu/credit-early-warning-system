<template>
  <div class="planing">
    <div class="alert">
      <el-alert
        :title="alertInfo.title"
        :type="alertInfo.type"
        :closable="false"
        center
      >
      </el-alert>
    </div>
    <div class="container">
      <div class="selected">
        <h1>已修（已选课程）</h1>
        <el-table
          :data="selectedCoursesTableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="title" label="课程名称" width="180">
          </el-table-column>
          <el-table-column prop="credits" label="学分" width="180">
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="semester"
            label="学期"
            width="180"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="moveToUnselected(scope.row, scope.$index)"
                type="text"
                size="small"
                :disabled="scope.row.status == '已过'"
                >移动到未修</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="unselected">
        <h1>未修（未选课程）</h1>
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
        </div>
        <el-table
          :data="tempUnSelectedCoursesTableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="title" label="课程名称" width="180">
          </el-table-column>
          <el-table-column prop="credits" label="学分" width="180">
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="semester"
            label="学期"
            width="180"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="moveToSelected(scope.row, scope.$index)"
                type="text"
                size="small"
                >移动到已修</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style>
.el-table .warning-row {
  background: #fef0f0;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  name: "Planing",
  data() {
    return {
      // 顶部提示信息
      alertInfo: {
        title: "",
        type: "error",
        unSelectScore: "0",
        totalScore: "",
      },
      // 已选课程表格数据
      selectedCoursesTableData: [],
      // 未修课程数据
      unSelectedCoursesTableData: [],
      // 为了方便筛选，先临时保存一份，不动原数据
      tempUnSelectedCoursesTableData: [],
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
    };
  },
  created() {
    this.getInfoByRoute();
    this.getStudentInfo();
  },
  methods: {
    // 筛选功能
    filterTrainPlan() {
      this.tempUnSelectedCoursesTableData = JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData)
      );
      // 学期或年级筛选一个
      if (this.gradeValue || this.semesterValue) {
        // 分类讨论
        // 只筛选年级
        if (this.gradeValue && !this.semesterValue) {
          // 烦死啦，这里数组要深拷贝，不然临时数据变了，原数据也会变，筛选个毛线(艹皿艹)
          this.tempUnSelectedCoursesTableData =
            this.tempUnSelectedCoursesTableData.filter((item) => {
              return item.grade == this.gradeValue;
            });
        }
        // 只筛选学期
        else if (!this.gradeValue && this.semesterValue) {
          this.tempUnSelectedCoursesTableData =
            this.tempUnSelectedCoursesTableData.filter((item) => {
              return item.semester == this.semesterValue;
            });
        }
        // 都筛选
        else if (this.gradeValue && this.semesterValue) {
          this.tempUnSelectedCoursesTableData =
            this.tempUnSelectedCoursesTableData.filter((item) => {
              return (
                item.semester == this.semesterValue &&
                item.grade == this.gradeValue
              );
            });
        }
      } // 学期和年级不筛选
      else if (!this.gradeValue && !this.semesterValue) {
      }
    },
    // 将获取到的数据根据是否已修进行分类
    dataSplitting(data) {
      // 要写屎山喽！！！ヽ(ー_ー)ノヽ(ー_ー)ノ
      data.forEach((item) => {
        item.classes.forEach((item) => {
          this.selectedCoursesTableData.push(item);
        });
        item.unSelectCourses.forEach((item) => {
          // 两个数组字符对不上，重新设一个
          item.title = item.courseName;
          item.credits = item.credit;
          this.unSelectedCoursesTableData.push(item);
        });
      });
      // 咦，也不多嘛，不过后端为什么学过的数据和为修的数据字符怎么对不上￣へ￣，还好我是高手
    },
    // 获取数据
    getStudentInfo() {
      let { title } = this.$route.query;
      this.$http
        .get(`/user/info?title=${title}`)
        .then((result) => {
          if (result.data.code == 1) {
            // 将数据进行处理
            this.dataSplitting(result.data.data);
            this.tempUnSelectedCoursesTableData = JSON.parse(
              JSON.stringify(this.unSelectedCoursesTableData)
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
    // 移动后重新计算分数
    computScore() {
      // 重新算分
      this.alertInfo.unSelectScore = 0;
      this.alertInfo.totalScore = 0;
      this.selectedCoursesTableData.forEach((item) => {
        if (item.status == "未过") {
          this.alertInfo.unSelectScore =
            parseFloat(this.alertInfo.unSelectScore) + parseFloat(item.credits);
        }
      });
      this.alertInfo.totalScore =
        parseFloat(this.alertInfo.studentScore) +
        parseFloat(this.alertInfo.unSelectScore);
      this.alertInfo.title = `模块：${this.alertInfo.moudleTitle}| 已修学分：${this.alertInfo.studentScore}|  未修学分：${this.alertInfo.unSelectScore}|  最低要求学分：${this.alertInfo.minScore}|  总分：${this.alertInfo.totalScore}`;
      if (
        parseFloat(this.alertInfo.totalScore) >=
        parseFloat(this.alertInfo.minScore)
      ) {
        this.alertInfo.type = "success";
      } else {
        this.alertInfo.type = "error";
      }
    },
    // 从路由获取信息
    getInfoByRoute() {
      let { title, studentScore, minScore } = this.$route.query;
      this.alertInfo.moudleTitle = title;
      this.alertInfo.studentScore = studentScore;
      this.alertInfo.minScore = minScore;
      this.alertInfo.totalScore =
        parseFloat(this.alertInfo.studentScore) +
        parseFloat(this.alertInfo.unSelectScore);
      this.alertInfo.title = `模块：${this.alertInfo.moudleTitle}| 已修学分：${this.alertInfo.studentScore}|  未修学分：${this.alertInfo.unSelectScore}|  最低要求学分：${this.alertInfo.minScore}|  总分：${this.alertInfo.totalScore}`;
      if (this.$route.query.studentScore >= this.$route.query.minScore) {
        this.alertInfo.type = "success";
      } else if (this.$route.query.studentScore < this.$route.query.minScore) {
        this.alertInfo.type = "error";
      }
    },
    // 表格判断是否选修添加样式
    tableRowClassName({ row, rowIndex }) {
      if (row.status == "已过") {
        return "success-row";
      } else {
        return "warning-row";
      }
    },
    // 移动到未修
    moveToUnselected(row, index) {
      this.unSelectedCoursesTableData.push(row);

      this.selectedCoursesTableData = this.selectedCoursesTableData.filter(
        (item, itemIndex) => {
          if (itemIndex != index) {
            return item;
          }
        }
      );
      this.tempUnSelectedCoursesTableData = JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData)
      );
      this.computScore();
    },
    // 移动到已修
    moveToSelected(row, index) {
      this.selectedCoursesTableData.push(row);

      this.unSelectedCoursesTableData = this.unSelectedCoursesTableData.filter(
        (item, itemIndex) => {
          if (itemIndex != index) {
            return item;
          }
        }
      );
      this.tempUnSelectedCoursesTableData = JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData)
      );
      this.computScore();
    },
  },
};
</script>

<style lang="scss" scoped>
.planing {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding: 80px;

  .alert {
    margin: 10px auto;
    position: fixed;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    // width: 100%;
    .el-alert {
      text-align: center;
    }
  }

  .container {
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .selected {
      .el-table {
        border: 1px solid #ccc;
        margin: 20px auto;
      }
    }

    .unselected {
      .el-table {
        border: 1px solid #ccc;
        margin: 20px auto;
      }
    }
  }
}
</style>
