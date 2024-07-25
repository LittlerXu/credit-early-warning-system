<template>
  <div class="basicCourses">
    <div class="top">
      <div class="search">
        <el-input
          placeholder="请输入想要搜索的课程名称"
          prefix-icon="el-icon-search"
          v-model="courseName"
        >
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getBasicCourses"
        ></el-button>
      </div>
      <div class="add">
        <el-button type="primary" @click="openDialog">新增课程</el-button>
      </div>
    </div>
    <div class="table">
      <template>
        <el-table :data="tableData" style="width: 100%" border max-height="520">
          <el-table-column prop="courseCode" label="课程代码" width="180">
          </el-table-column>
          <el-table-column prop="courseName" label="课程名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-popconfirm
                title="确定删除吗？"
                @confirm="deleteRow(scope.row)"
              >
                <el-button slot="reference" type="text" size="small">
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 对话框 -->
    <el-dialog title="新增课程" :visible.sync="dialogVisible" width="30%">
      <div>
        课程代码：<el-input
          v-model="courseCode"
          placeholder="请输入课程代码"
        ></el-input>
      </div>
      <div>
        课程名称：<el-input
          v-model="courseName"
          placeholder="请输入课程名称"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqBasicCourses,
  reqAddCourseBase,
  reqDeleteBaseCourse,
} from "@/api/index";
export default {
  name: "BasicCourses",
  data() {
    return {
      // 对话框是否显示
      dialogVisible: false,
      // 参数
      courseName: "",
      courseCode: "",
      // 表格数据
      tableData: [],
    };
  },
  methods: {
    // 删除课程
    async deleteRow(row) {
      let res = await reqDeleteBaseCourse(row.courseCode);
      if (res.code == 1) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getBasicCourses();
      } else if (res.code == 0) {
        this.$message({
          message: "删除失败",
          type: "error",
        });
      }
    },
    // 新增课程
    async addCourse() {
      let data = {
        courseCode: this.courseCode,
        courseName: this.courseName,
        id: "",
      };

      let res = await reqAddCourseBase(data);
      if (res.code == 1) {
        this.$message({
          message: "新增课程成功",
          type: "success",
        });
        this.getBasicCourses();
        this.dialogVisible = false;
      } else {
        this.$message({
          message: "新增课程失败",
          type: "error",
        });
      }
    },
    openDialog() {
      this.dialogVisible = true;
    },

    // 获取表格数据
    async getBasicCourses() {
      let res = await reqBasicCourses(this.courseName);
      this.tableData = res.data;
      console.log(res);
    },
  },
  created() {
    this.getBasicCourses();
  },
};
</script>

<style lang="scss" scoped>
.basicCourses {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;

  .top {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .search {
      margin: 0 auto;
      width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
