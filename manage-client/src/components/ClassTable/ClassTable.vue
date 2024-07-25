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
    tableData: {
      type: Array,
      default: function () {
        return []
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
    // 小类最低学分
    minCredits:""
  },
  data() {
    return {};
  },
  methods: {
    // 判断成绩是否合格从而切换不同背景
    tableRowClassName({ row, rowIndex }) {
      if (parseFloat(row.grade) < 60) {
        return "warning-row";
      } else {
        return "";
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
  }

  .el-pagination {
    margin: 20px auto;
  }
}
</style>