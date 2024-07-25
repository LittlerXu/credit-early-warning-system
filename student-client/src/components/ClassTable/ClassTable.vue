<template>
  <div class="classTable">
    <template>
       <h1
        style="
          disaplay: block;
          height: 30px;
          border-bottom: 2px solid black;
          margin-bottom: 10px;
        "
      >
        {{ title }}
      </h1>
      <h4 style="color: #409eff" v-show="minCredits">
        总分： {{ minCredits }}
      </h4>
      <div class="score" v-show="credit && studentCredit">
        <i
          :style="{
            color:
              parseFloat(studentCredit) < parseFloat(credit)
                ? '#f56d6d'
                : '#67c23a',
          }"
          >{{studentCredit}}</i
        >/{{ credit}}
      </div>
     
      <el-table
        :data="tableData"
        style="width: 88%"
        :row-class-name="tableRowClassName"
        :tableStyle="tableStyle"
      >
        <el-table-column
          v-for="(item, index) in tableStyle"
          :prop="item.prop"
          :label="item.label"
          :key="index"
        >
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<style>
.el-table .warning-row {
  background: #f56c6c;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  name: "ClassTable",
  props: {
    // 小类最低学分
    minCredits: "",
    credit: "",
    studentCredit: "",
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    title: {
      type: String,
      default: "",
    },
    tableStyle: {
      type: Array,
      // 表格默认样式（如果是数组或对象设置默认值，则必须以函数返回格式）
      default: function () {
        return [
          {
            prop: "title",
            label: "课程名称",
          },
          {
            prop: "natureOfCourse",
            label: "课程性质",
          },
          {
            prop: "credits",
            label: "学分",
          },
          {
            prop: "gpa",
            label: "绩点",
          },
          {
            prop: "score",
            label: "成绩",
          },
        ];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 判断成绩是否合格从而切换不同背景
    tableRowClassName({ row, rowIndex }) {
      if (parseFloat(row.courseGrade) < 60) {
        return "warning-row";
      } else {
        return "success-row";
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.classTable {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-table {
    margin: 40px auto;
    margin-top: 10px;
    border: 1px solid #8cb5e8;
    border-radius: 5px;

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

  .el-pagination {
    margin: 20px auto;
  }
}
</style>
