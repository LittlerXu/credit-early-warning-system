<template>
  <div class="checkDetail">
    <div class="top">
      <el-descriptions
        class="margin-top"
        title="该学期已修课程如下"
        :column="3"
        border
      >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            学生姓名
          </template>
          {{ row.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            学号
          </template>
          {{ row.studentId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            专业
          </template>
          {{ row.currentMajor }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            信息
          </template>
          <el-tag size="small">{{ row.info }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            年级
          </template>
          {{ row.currentGrade }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            总学分
          </template>
          {{ totalCreit }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="table">
      <template>
        <el-table
          :data="row.studentCourseList"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="courseName" label="课程名称">
          </el-table-column>
          <el-table-column prop="courseCredit" label="学分"> </el-table-column>
          <el-table-column prop="courseGpa" label="绩点"> </el-table-column>
          <el-table-column prop="courseGrade" label="分数"> </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckDetail",
  data() {
    return {
      // 路由传的参数
      row: {},
    };
  },
  computed: {
    totalCreit() {
      let total = 0;
      this.row.studentCourseList.forEach((item) => {
        if (item.courseGrade >= 60) {
          total += parseFloat(item.courseCredit);
        }
      });
      return total;
    },
  },
  methods: {
    // 从路由获取数据
    getTableDataByRoute() {
      let { row } = this.$route.query;
     
      this.row = JSON.parse(row);
     
      
    },
    // 判断样式
    tableRowClassName({ row, rowIndex }) {
      if (row.status === "未过") {
        return "warning-row";
      } else if (row.status === "已过") {
        return "success-row";
      }
      return "";
    },
  },
  created() {
    this.getTableDataByRoute();
  },
};
</script>

<style lang="scss" scoped>
.checkDetail {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
}
</style>

<style>
.el-table .warning-row {
  background: #f56c6c;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
