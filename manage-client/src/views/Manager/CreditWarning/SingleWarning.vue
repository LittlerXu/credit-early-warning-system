<template>
  <div>
    <div class="singleWarning" v-if="tableData.length == 0">
      <div class="upload">
        <el-upload
          :on-progress="onProgress"
          :on-success="onSuccess"
          class="upload-demo"
          drag
          :action="
            $globalVar.EXCEL_BASEURL + `/admin/excelToSaveStudentCourse3`
          "
          multiple
          :headers="header"
          accept=".xls, .xlsx"
          :on-error="onError"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </div>

    <div class="table" v-if="tableData.length != 0">
      <!-- 学生信息 -->
      <el-table
        :data="tableData"
        border
        highlight-current-row
        height="607px"
        style="margin-top: 8px"
        v-loading="loading"
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
          prop="info"
          align="center"
          label="信息"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="checkDetail(scope.row)" type="text" size="small"
              >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // headers参数
      header: {
        Token: this.getToken(),
      },
      tableData: [],
      loading: true,
    };
  },
  methods: {
    // 点击查看详情
    checkDetail(row) {
      let page = this.$router.resolve({
        path: "/manager/checkwarningdetail",
        query: {
          row: JSON.stringify(row),
        },
      });

      window.open(page.href, "warningdeatil");
    },
    // 文件上传时
    onProgress() {
      this.$loading();
    },
    // 文件上传错误时
    onError() {
      this.$message({
        message: "文件上传发生错误",
        type: "error",
      });
      this.$loading().close();
    },

    // 文件上传成功
    onSuccess(response, file, fileList) {
      this.tableData = response.data;
      this.loading = false;
      this.$loading().close();
    },
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;
      // console.log(token);
      return token;
    },
  },
};
</script>

<style lang="scss" scoped>
.singleWarning {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
