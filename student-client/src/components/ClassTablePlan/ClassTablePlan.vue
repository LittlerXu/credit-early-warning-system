<template>
  <div class="planing">
    <div class="container">
      <div class="selected">
        <div class="alert">
          <el-alert
            :title="alertInfo.title"
            :type="alertInfo.type"
            :closable="false"
            center
          >
          </el-alert>
        </div>
        <h1>已修（已选课程）</h1>
        <el-table
          :data="tempSelectedCoursesTableData"
          style="width: 90%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="title" label="课程名称"> </el-table-column>
          <el-table-column prop="credits" label="学分"> </el-table-column>
          <el-table-column prop="gpa" label="绩点"> </el-table-column>
          <el-table-column prop="score" label="成绩"> </el-table-column>
          <el-table-column prop="grade" label="年级"></el-table-column>
          <el-table-column prop="semester" label="学期"></el-table-column>
          <el-table-column fixed="right" label="操作">
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
      <el-collapse style="width: 90%">
        <el-collapse-item>
          <template slot="title">
            查看该类未修课程<i class="header-icon el-icon-info"></i
            ><img
              class="wudengfen"
              src="@/assets/images/chara_tati_01@2x.png"
              alt=""
            /><img
              class="wudengfen"
              src="@/assets/images/chara_tati_02@2x.png"
              alt=""
            /><img
              class="wudengfen"
              src="@/assets/images/chara_tati_03@2x.png"
              alt=""
            /><img
              class="wudengfen"
              src="@/assets/images/chara_tati_04@2x.png"
              alt=""
            /><img
              class="wudengfen"
              src="@/assets/images/chara_tati_05@2x.png"
              alt=""
            />
          </template>
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
              <el-table-column prop="title" label="课程名称"> </el-table-column>
              <el-table-column prop="credits" label="学分"> </el-table-column>
              <el-table-column prop="grade" label="年级"></el-table-column>
              <el-table-column prop="semester" label="学期"></el-table-column>
              <el-table-column fixed="right" label="操作">
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
        </el-collapse-item>
      </el-collapse>
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
  props: {
    title: {
      type: String,
      default: "",
    },
    minScore: {
      type: String,
      default: "",
    },
    studentScore: {
      type: Number,
      default: 0,
    },
    selectedCoursesTableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    unSelectedCoursesTableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 顶部提示信息
      alertInfo: {
        title: "",
        type: "error",
        unSelectScore: 0,
        totalScore: 0,
        minScore: 0,
        studentScore: 0,
      },
      unSelectedCoursesTableData_this: this.unSelectedCoursesTableData,
      // 为了方便筛选，先临时保存一份，不动原数据
      tempUnSelectedCoursesTableData: JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData)
      ),
      tempSelectedCoursesTableData: [],
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
      // 动态显示当前学分
      currentStudentScore: parseFloat(this.$route.query.studentScore),
    };
  },
  watch: {
    selectedCoursesTableData: {
      deep: true, // 深度监听每一个属性值, 如果是对象可以深度监听
      immediate: true, // 进入页面后立即自动调用handler函数
      handler(newValue) {
        this.tempSelectedCoursesTableData = newValue;
      },
    },
  },
  created() {
    this.getAlertInfo();
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
    // 移动后重新计算分数
    computScore() {
      // 重新算分
      this.alertInfo.unSelectScore = 0;
      this.alertInfo.totalScore = 0;
      this.tempSelectedCoursesTableData.forEach((item) => {
        if (item.status == "未过") {
          this.alertInfo.unSelectScore =
            parseFloat(this.alertInfo.unSelectScore) + parseFloat(item.credits);
        }
      });
      this.alertInfo.totalScore =
        parseFloat(this.alertInfo.studentScore) +
        parseFloat(this.alertInfo.unSelectScore);
      this.alertInfo.title = "";
      this.alertInfo.title = `模块：${this.title}| 已修学分：${this.alertInfo.studentScore}|  未修学分：${this.alertInfo.unSelectScore}|  最低要求学分：${this.alertInfo.minScore}|  总分：${this.alertInfo.totalScore}`;
      if (
        parseFloat(this.alertInfo.totalScore) >=
        parseFloat(this.alertInfo.minScore)
      ) {
        this.alertInfo.type = "success";
      } else {
        this.alertInfo.type = "error";
      }
    },
    // 处理小类警告
    getAlertInfo() {
      this.alertInfo.studentScore = this.studentScore;
      this.alertInfo.minScore = this.minScore;
      this.alertInfo.totalScore =
        parseFloat(this.alertInfo.studentScore) +
        parseFloat(this.alertInfo.unSelectScore);
      this.alertInfo.title = `模块：${this.title}| 已修学分：${this.alertInfo.studentScore}|  未修学分：${this.alertInfo.unSelectScore}|  最低要求学分：${this.alertInfo.minScore}|  总分：${this.alertInfo.totalScore}`;
      if (
        parseFloat(this.alertInfo.studentScore) >=
        parseFloat(this.alertInfo.minScore)
      ) {
        this.alertInfo.type = "success";
      } else if (
        parseFloat(this.alertInfo.studentScore) <
        parseFloat(this.alertInfo.minScore)
      ) {
        this.alertInfo.type = "error";
      }
    },
    // 表格判断是否选修添加样式
    tableRowClassName({ row, rowIndex }) {
      if (parseFloat(row.score) >= 60) {
        return "success-row";
      } else {
        return "warning-row";
      }
      return "";
    },
    // 移动到未修
    moveToUnselected(row, index) {
      this.unSelectedCoursesTableData_this.push(row);

      this.tempSelectedCoursesTableData =
        this.tempSelectedCoursesTableData.filter((item, itemIndex) => {
          if (itemIndex != index) {
            return item;
          }
        });
      this.tempUnSelectedCoursesTableData = JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData_this)
      );

      this.computScore();
    },

    // 移动到已修
    moveToSelected(row, index) {
      this.tempSelectedCoursesTableData.push(row);

      this.unSelectedCoursesTableData_this =
        this.unSelectedCoursesTableData_this.filter((item, itemIndex) => {
          if (itemIndex != index) {
            return item;
          }
        });
      this.tempUnSelectedCoursesTableData = JSON.parse(
        JSON.stringify(this.unSelectedCoursesTableData_this)
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
  padding: 5px;
  margin: 10px auto;

  .alert {
    margin: 10px auto;
    // width: 100%;
    .el-alert {
      text-align: center;
      .el-alert__title {
        font-size: 17px;
      }
    }
  }

  .container {
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .selected {
      width: 100%;
      .el-table {
        border: 1px solid #ccc;
        margin: 20px auto;
      }
    }
    .el-collapse {
      width: 80%;
      @media only screen and (min-width: 1000px) {
        .wudengfen {
          height: 40px;
          transition: all 0.3s;
          &:hover {
            scale: 2;
          }
        }
      }

       @media only screen and (max-width: 999px) {
        .wudengfen {
          height: 0px;
          transition: all 0.3s;
          &:hover {
            scale: 1.4;
          }
        }
      }
    }
    .unselected {
      width: 100%;
      .el-table {
        border: 1px solid #ccc;
        margin: 20px auto;
      }
    }
  }
}
</style>
