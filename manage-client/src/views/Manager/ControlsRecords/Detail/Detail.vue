<template>
  <div class="detail">
    <span style="color: red; font-size: 17px"
      >{{ this.$route.query.docName }}导入了以下内容（默认仅展示其中100条数据）</span
    >
    <div class="table">
      <!-- 学生信息 -->
      <el-table
        v-if="$route.query.type == 1"
        :data="tableData"
        border
        highlight-current-row
        height="607px"
        style="margin-top: 8px"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          prop="studentId"
          align="center"
          label="学号"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="currentGrade"
          align="center"
          label="年级"
        ></el-table-column>
        <el-table-column
          prop="currentMajor"
          align="center"
          label="专业"
        ></el-table-column>
        <el-table-column
          prop="note"
          align="center"
          label="备注"
        ></el-table-column>
      </el-table>
      <!-- 选课信息 -->
      <el-table
        v-else
        :data="tableData"
        border
        highlight-current-row
        height="607px"
        style="margin-top: 8px"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          prop="studentId"
          align="center"
          sortable
          label="学号"
        ></el-table-column>
        <el-table-column
          prop="courseCode"
          align="center"
          label="课程代码"
        ></el-table-column>
        <el-table-column
          prop="courseName"
          align="center"
          label="课程名称"
        ></el-table-column>
        <el-table-column
          prop="courseGrade"
          align="center"
          label="分数"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reqSelectInExcelId2, reqSelectInExcelId1 } from "@/api/index";
export default {
  name: "Detail",
  data() {
    return {
      // 表格数据
      tableData: [],
    };
  },
  methods: {
    //获取表格数据
    async getTableData() {
      let { type, excelId } = this.$route.query;

      let res;
      if (type == 1) {
        res = await reqSelectInExcelId1(excelId);
      } else if (type == 2) {
        res = await reqSelectInExcelId2(excelId);
      }

      if (res.code == 1) {
        // this.tableData = res.data
        this.tableData = res.data.splice(0,100);
       
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
}
</style>
