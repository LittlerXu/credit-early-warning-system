<template>
  <div style="width: 100%; height: 100%">
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <h1>Excel导入培养方案</h1>
      <el-upload
        :on-progress="onProgress"
        :on-success="onSuccess"
        :on-error="onError"
        class="upload-demo"
        drag
        :action="$globalVar.EXCEL_BASEURL + `/admin/excelToSaveTrainingPlan`"
        accept=".xls, .xlsx"
        name="file"
        :headers="header"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择文件</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-drawer>
    <div class="category">
      <div class="item" @click="drawer = true">
        <img src="/icons/excelIcon.png" alt="" />
        <span>Excel导入</span>
      </div>
      <router-link to="/manager/addbigcategories">
        <div class="item">
          <img src="/icons/hand.jpg" alt="" />
          <span>手动导入</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      drawer: false,
      loading: null,
      // headers参数
      header: {
        Token: this.getToken(),
      },
    };
  },
  methods: {
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;
      return token;
    },
    // 文件上传时
    onProgress(event, file, fileList) {
      console.log(file.name);
      this.$message({
        message: `${file.name}正在生成`,
        type: "info",
      });
    },
    // 文件上传成功时
    onSuccess(event, file, fileList) {
      this.$message({
        message: `${file.name}生成成功`,
        type: "success",
      });
      let data = JSON.stringify(event.data);
      this.$router.push({
        path: "/manager/preview",
        query: {
          data,
        },
      });
    },
    // 文件上传失败
    onError(event, file, fileList) {
      this.$message({
        message: `${file.name}生成失败`,
        type: "error",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.category {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .item {
    width: 400px;
    background-color: #c0c4cc;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    border-radius: 9px;
    transition: all 0.4s;
    user-select: none;

    img {
      height: 200px;
      border-radius: 6px;
    }

    span {
      font-size: 17px;
      font-weight: bolder;
    }
  }

  .item:hover {
    border-radius: 17px;
    scale: 0.9;
  }
}
</style>
