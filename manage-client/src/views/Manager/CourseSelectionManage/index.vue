<template>
  <div>
    <el-card :body-style="{ height: '635px' }">
      <div style="text-align: left">
        <el-cascader
          :options="cascaderOptions"
          value="major"
          v-model="classAndGrade"
          :props="{
            checkStrictly: true,
            label: 'value',
            expandTrigger: 'hover',
          }"
          clearable
          @change="changeEvent"
          ref="cascader"
          style="width: 310px; margin-right: 10px"
        ></el-cascader>
        <el-input
          placeholder="输入学号以搜索"
          v-model="stuId"
          @change="changeEvent"
          @focus="clearCascader"
          style="width: 300px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            circle
            type="primary"
          ></el-button>
        </el-input>
        <el-button
          type="success"
          round
          @click="importClick(2)"
          style="float: right; margin-left: 10px"
          >上学期导入
        </el-button>
        <el-button
          type="success"
          round
          @click="importClick(1)"
          style="float: right; margin-left: 10px"
          >全部成绩导入
        </el-button>
      </div>
      <el-row>
        <el-table
          :data="courseSelectionList"
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
      </el-row>
    </el-card>
    <!-- 导入弹窗 -->
    <el-dialog
      title="导入学生上学期成绩"
      :visible.sync="dialogVisible2"
      @close="changeEvent"
    >
      <div class="item">
        年级：<el-select v-model="courseSelectGrade" placeholder="请选择年级">
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item">
        学期：<el-select
          v-model="courseSelectSemester"
          placeholder="请选择学期"
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
      <el-upload
        class="upload-demo"
        drag
        :action="
          $globalVar.EXCEL_BASEURL +
          `/admin/excelToSaveStudentCourse2?courseSelectGrade=${courseSelectGrade}&courseSelectSemester=${courseSelectSemester}`
        "
        :headers="header"
        accept=".xls, .xlsx"
        :on-error="importError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择文件</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
    </el-dialog>
    <el-dialog
      title="导入学生全部学期成绩"
      :visible.sync="dialogVisible1"
      @close="changeEvent"
    >
      <el-upload
        class="upload-demo"
        drag
        :action="$globalVar.EXCEL_BASEURL + `/admin/excelToSaveStudentCourse`"
        :headers="header"
        accept=".xls, .xlsx"
        :on-error="importError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择文件</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
    </el-dialog>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalPage"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="currentChange"
      @prev-click="preClick"
      @next-click="nextClick"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reqCascaderOptions, reqCourseSelectionList } from "@/api";
export default {
  data() {
    return {
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
      //级联选择所有选项
      cascaderOptions: [],
      //选课列表
      courseSelectionList: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 10,
      //级联选择器所选选项
      classAndGrade: [],
      //搜索框内容
      stuId: "",
      //单学期导入弹窗
      dialogVisible2: false,
      // 全部导入弹窗
      dialogVisible1: false,
      //加载中
      loading: false,
      // headers参数
      header: {
        Token: this.getToken(),
      }
    };
  },
  methods: {
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;
      // console.log(token);
      return token;
    },
    //获取选课列表
    async getCourseSelectionList() {
      let para = {
        studentMajor: this.classAndGrade[0] || "",
        grade: this.classAndGrade[1] || "",
        studentId: this.stuId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      let result = await reqCourseSelectionList(para);
      if (result.code == 1) {
        this.loading = false;
        return result.data;
      }
    },

    // 分页器
    currentChange(val) {
      this.currentPage = val;
      this.getCourseSelectionList().then((res) => {
        this.courseSelectionList = res.list;
        this.totalPage =res.total
      });
    },

    preClick() {
      this.currentPage--;
      this.getCourseSelectionList().then((res) => {
        this.courseSelectionList = res.list;
        this.totalPage = res.total 
      });
    },
    nextClick() {
      this.currentPage++;
      console.log(this.currentPage);
      this.getCourseSelectionList().then((res) => {
        this.courseSelectionList = res.list;
        this.totalPage = res.total
      });
    },
    //获取级联选择的选项
    async getCascaderOptions() {
      this.cascaderOptions = (await reqCascaderOptions()).data;
    },
    //点击搜索时清空级联选择器
    clearCascader() {
      this.$refs.cascader.$refs.panel.clearCheckedNodes();
    },
    //数据筛选/进入页面的第一次请求/导入完毕后的请求
    changeEvent() {
      this.currentPage = 1;
      this.getCourseSelectionList().then((res) => {
        this.courseSelectionList = res.list;
        this.totalPage = res.total
      });
    },
    //导入按钮回调
    importClick(type) {
      if (type == 1) {
        this.dialogVisible1 = true;
      } else if (type == 2) {
        this.dialogVisible2 = true;
      }
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
    this.getCascaderOptions();
    this.changeEvent();
    this.getToken();
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
</style>
