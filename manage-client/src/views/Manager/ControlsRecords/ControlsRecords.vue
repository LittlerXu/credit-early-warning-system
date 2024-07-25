<template>
  <div class="controlsRecords">
    <div class="table">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'importTime', order: 'descending' }"
      >
        <el-table-column prop="importTime" label="操作时间" sortable>
        </el-table-column>
        <el-table-column prop="excelName" label="文件名称"> </el-table-column>
        <el-table-column prop="importType" label="操作类型"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="check(scope.row)"
              type="text"
              size="small"
            >
              查看
            </el-button>

            <el-popconfirm
              title="确定移除吗？"
              @confirm="deletereRcord(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">
                移除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reqImportExcelList, reqDeleteInExcelName } from "@/api/index";
export default {
  name: "ControlsRecords",
  data() {
    return {
      // 表格数据
      tableData: [],
    };
  },
  methods: {
    // 获取操作列表
    async getRecords() {
      let res = await reqImportExcelList();
      if (res.code == 1) {
        this.tableData = res.data;
        // 格式化处理
        this.tableData.forEach((item) => {
          if (item.importType == 1) {
            item.importType = "学生信息";
          } else if (item.importType == 2) {
            item.importType = "选课信息";
          } else if (item.importType == 3) {
            item.importType = "培养方案信息";
          }
        });
        this.$message({
          message: "获取数据成功",
          type: "success",
        });
      } else {
        this.$message({
          message: res.msg,
          type: "type",
        });
      }
    },
    // 删除记录
    async deletereRcord(row) {
      let data = {
        excelName: row.excelName,
        id: row.id,
        importStatus: "",
        importTime: "",
        importType: row.importType == "学生信息" ? 1 : 2,
      };

      let res = await reqDeleteInExcelName(data);
      if (res.code == 1) {
        this.$message({
          message: "操作撤销成功",
          type: "success",
        });
        this.getRecords();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    // 查看记录
    check(row) {
      this.$router.push({
        path: "controlsrecords/detail",
        query: {
          type: row.importType == "学生信息" ? 1 : 2,
          excelId: row.id,
          docName: row.excelName,
        },
      });
    },
  },
  created() {
    this.getRecords();
  },
};
</script>

<style lang="scss" scoped>
.controlsRecords {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
  .table {
    height: 520px;
  }
}
</style>
