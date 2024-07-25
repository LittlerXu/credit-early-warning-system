<template>
  <div>
    <el-card :body-style="{ height: '635px' }">
      <div style="text-align: left">
        <el-cascader :options="cascaderOptions" value="major" v-model="classAndGrade" :props="{
          checkStrictly: true,
          label: 'value',
          expandTrigger: 'hover',
        }" clearable @change="getStudentList" ref="cascader" style="width: 310px; margin-right: 10px"></el-cascader>
        <el-input placeholder="输入学生学号以搜索" v-model="stuId" @focus="clearCascader" style="width: 300px">
          <el-button slot="append" icon="el-icon-search" circle type="primary" @click="getStudentList"></el-button>
        </el-input>
        <el-switch v-model="isNote" active-text="已备注学生" inactive-text="" @change="selectNote">
        </el-switch>

        <el-button type="success" round @click="importClick" style="float: right; margin-left: 10px"
          size="mini">导入</el-button>

        <el-popconfirm :title="tipText + '确定更新吗？'" @confirm="changeClick">
          <el-button slot="reference" type="warning" round style="float: right" size="mini">更新
          </el-button>
        </el-popconfirm>

        <el-button type="primary" round @click="
          dialogVisible = true;
        dialogHeader = '新增学生信息';
        " style="float: right" size="mini">添加</el-button>
        <!-- <el-button type="info">导出Excel表格</el-button> -->
      </div>
      <el-row>
        <el-table :data="studentList" border highlight-current-row height="607px" style="margin-top: 8px"
          @select="selectClick" @select-all="selectClick" v-loading="loading" element-loading-text="数据加载中"
          element-loading-spinner="el-icon-loading">
          <el-table-column fixed="left" align="center" type="selection">
          </el-table-column>
          <el-table-column prop="studentId" align="center" label="学号"></el-table-column>
          <el-table-column prop="name" align="center" label="姓名"></el-table-column>
          <el-table-column prop="currentGrade" align="center" label="年级"></el-table-column>
          <el-table-column prop="currentMajor" align="center" label="专业"></el-table-column>
          <el-table-column prop="note" align="center" label="备注"></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" plain round size="mini" @click="check(scope.row)">查看
              </el-button>
              <el-button type="warning" plain round size="mini" @click="editClick(scope.row)">编辑
              </el-button>

              <el-popconfirm title="确定删除该学生吗？" @confirm="deleteClick(scope.row)">
                <el-button slot="reference" round size="mini" type="danger" plain>删除
                </el-button>
              </el-popconfirm>

              <el-button round size="mini" type="danger" plain @click="
                (changePasswordDialog = true),
                (form.studentId = scope.row.studentId)
                ">
                修改密码
              </el-button>
            </template>
            <template slot="header">
              <el-button round size="mini" type="danger" plain @click="deleteSelectClick">删除所选</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <UpdateStuInfo :dialogVisible="dialogVisible" :cascaderOptions="cascaderOptions" :editRow="editRow"
      :dialogHeader="dialogHeader" @switchDialog="switchDialog" />
    <!-- 导入弹窗 -->
    <el-dialog title="导入学生信息" :visible.sync="dialogVisible2">
      <div class="item">
        年级：<el-select v-model="courseSelectGrade" placeholder="请选择年级">
          <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        学期：<el-select v-model="courseSelectSemester" placeholder="请选择学期">
          <el-option v-for="item in semesterOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-upload class="upload-demo" drag :action="$globalVar.EXCEL_BASEURL +
        `/admin/excelToSaveStudent?grade1=${courseSelectGrade}&semester=${courseSelectSemester}`
        " accept=".xls, .xlsx" :headers="header" :on-error="importError" :on-success="onSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择文件</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改学生密码" :visible.sync="changePasswordDialog">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.configPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="pageSize"
      :current-page="currentPage" @current-change="currentChange" @prev-click="preClick" @next-click="nextClick">
    </el-pagination>
  </div>
</template>

<script>
import UpdateStuInfo from "@/components/UpdateStuInfo/UpdateStuInfo.vue";
import {
  deleteStudentInfo,
  changeStudentInfo,
  reqStudentList,
  reqTipToChangeStudentInfo,
  reqChangeStudentPassword,
} from "@/api";
import { mapState } from "vuex";
export default {
  components: {
    UpdateStuInfo,
  },
  data() {
    return {
      // 修改密码form表单数据
      form: {
        password: "",
        configPassword: "",
        studentId: "",
      },
      // 修改密码对话框显示
      changePasswordDialog: false,
      // 选择的年级
      courseSelectGrade: "",
      // 年级选项
      gradeOptions: [
        {
          label: "大一",
          value: "1",
        },
        {
          label: "大二",
          value: "2",
        },
        {
          label: "大三",
          value: "3",
        },
        {
          label: "大四",
          value: "4",
        },
      ],
      // 选择的学期
      courseSelectSemester: "",
      // 学期选项
      semesterOptions: [
        {
          label: "上",
          value: "1",
        },
        {
          label: "下",
          value: "2",
        },
      ],
      //级联选择器所选选项
      classAndGrade: [],
      //搜索框内容
      stuId: "",
      //被选中的行
      selection: [],
      //控制对话框是否弹出
      dialogVisible: false,
      //对话框header
      dialogHeader: "",
      //导入弹窗
      dialogVisible2: false,
      //要编辑的行
      editRow: {},
      //加载中
      loading: false,
      //   学生列表
      studentList: [],
      //   当前列表总页数
      totalPage: 0,
      // 当前页
      currentPage: 1,
      //   每页条数
      pageSize: 10,
      //   是否选择已备注学生
      isNote: false,
      // headers参数
      header: {
        Token: this.getToken(),
      },
      // 点击更新确认的提示
      tipText: "",
    };
  },
  computed: {
    ...mapState("student", ["cascaderOptions"]),
  },
  methods: {
    // 修改学生密码
    async changePassword() {
      let data = {
        password: this.form.password,
        configPassword: this.form.configPassword,
        studentId: this.form.studentId,
      };
      let res = await reqChangeStudentPassword(data);
      if (res.code == 1) {
        this.$message({
          message: "修改密码成功",
          type: "success",
        });
        this.changePasswordDialog = false;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    // 点击更新按钮获取提示信息
    async getPopconfirmTip() {
      let res = await reqTipToChangeStudentInfo();
      this.tipText = res.data;
    },
    // 导入成功
    onSuccess(res) {
      this.dialogVisible = false;
    },
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;
      return token;
    },
    // 跳转页面查看学生成绩
    check(row) {
      this.$router.push({
        path: "/manager/studentCourse",
        query: {
          studentId: row.studentId,
          major: row.currentMajor,
          grade: row.currentGrade,
        },
      });
    },
    // 选择是否备注
    selectNote() {
      this.getStudentList();
    },
    //获取学生列表
    async getStudentList() {
      this.loading = true;
      let getStudentListPara;
      if (this.stuId == "") {
        getStudentListPara = {
          studentMajor: this.classAndGrade[0] || "",
          grade: this.classAndGrade[1] || "",
          studentId: this.stuId,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          note: this.isNote ? "1" : "0",
        };
      } else {
        getStudentListPara = {
          studentMajor: this.classAndGrade[0] || "",
          grade: this.classAndGrade[1] || "",
          studentId: this.stuId,
          pageSize: 1,
          pageNum: 1,
          note: this.isNote ? "1" : "0",
        };
      }

      let result = await reqStudentList(getStudentListPara);
      if (result.code == 1) {
        this.studentList = result.data.list;
        this.totalPage = result.data.total;
        this.loading = false;
      }
    },
    // 分页器操作
    currentChange(val) {
      this.currentPage = val;
      this.getStudentList();
    },
    preClick() {
      this.currentPage--;
      this.getStudentList();
    },
    nextClick() {
      this.currentPage++;
      this.getStudentList();
    },
    //获取级联选择的选项
    getCascaderOptions() {
      this.$store.dispatch("student/getCascaderOptions");
    },
    //点击搜索时清空级联选择器
    clearCascader() {
      this.$refs.cascader.$refs.panel.clearCheckedNodes();
    },
    //自定义事件监听函数: 将dialogVisible值转为false
    switchDialog(isReq) {
      this.dialogVisible = false;
      //添加/编辑对话框关闭时重置editRow
      this.editRow = {};
      //如果修改/新增了学生信息, 则重新请求一次学生列表
      if (isReq == true) {
        this.getStudentList();
      }
    },
    //复选框点击回调
    selectClick(selection) {
      this.selection = selection;
    },
    //编辑按钮回调函数
    editClick(row) {
      this.dialogHeader = "编辑学生信息";
      this.editRow = {
        deptAndGrade: [row.currentMajor, row.currentGrade],
        name: row.name,
        studentId: row.studentId,
        id: row.id,
        note: row.note,
      };
      this.dialogVisible = true;
    },
    //删除按钮回调
    async deleteClick(checkRow) {
      let arr = [];
      arr[0] = checkRow;
      let result = await deleteStudentInfo(arr);
      if (result.code == 1) {
        this.getStudentList();
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: result.msg,
          type: "error",
        });
      }
    },
    //删除所选按钮回调
    async deleteSelectClick() {
      let result = await deleteStudentInfo(this.selection);
      if (result.code == 1) {
        this.getStudentList();
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: result.msg,
          type: "error",
        });
      }
    },
    //更新按钮回调
    async changeClick() {
      changeStudentInfo()
        .then((result) => {
          if (result.code == 1) {
            this.getStudentList();
            this.$message({
              showClose: true,
              message: "更新成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: result.msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            showClose: true,
            message: error,
            type: "error",
          });
        });
    },
    //导入按钮回调
    importClick() {
      this.dialogVisible2 = true;
    },
    //导入失败的回调
    importError(err, file, fileList) {
      this.$message({
        message: "导入失败",
        type: "error",
        showClose: true,
      });
    },
  },
  mounted() {
    this.getStudentList();
    this.getCascaderOptions();
    this.getPopconfirmTip();
  },
};
</script>

<style lang="scss" scoped>
.el-col-10 {
  width: 25.66667%;
}
</style>
