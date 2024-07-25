<template>
  <div>
    <el-card class="box-card" :body-style="{ height: '599.5px', padding: '0' }">
      <div slot="header" class="card-header">
        专业:
        <el-select
          clearable
          v-model="para.major"
          placeholder="请选择专业"
          @change="filterStuList"
        >
          <el-option
            v-for="item in majorOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        年级:
        <el-select
          clearable
          v-model="para.grade"
          placeholder="请选择年级"
          class="second-select"
          @change="filterStuList"
        >
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        搜索:
        <el-input
          :placeholder="para.type == '1' ? '按学号搜索' : '按姓名搜索'"
          v-model="para.searchValue"
          class="input-with-select"
          @change="clearSelect"
        >
          <el-select v-model="para.type" slot="prepend" placeholder="请选择">
            <el-option label="学号" value="1"></el-option>
            <el-option label="姓名" value="0"></el-option>
          </el-select>
        </el-input>
      </div>
      <el-tabs type="border-card" v-model="tabName" @tab-click="passReq">
        <el-tab-pane label="未达标">
          <!-- 赛选是否已预警过 -->
          <el-radio-group v-model="isWarning" @input="getQualificationFailure">
            <el-radio :label="0">未预警</el-radio>
            <el-radio :label="1">已预警</el-radio>
          </el-radio-group>
          <el-table
            class="el-table"
            :data="failureStudentList"
            highlight-current-row
            height="527px"
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
              prop="name"
              align="center"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="currentMajor"
              align="center"
              label="专业"
            ></el-table-column>
            <el-table-column
              prop="currentGrade"
              align="center"
              label="年级"
            ></el-table-column>

            <el-table-column align="center" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button
                  round
                  size="mini"
                  type="warning"
                  @click="checkClick(scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已达标"
          ><el-table
            class="el-table"
            :data="passedStudentList"
            highlight-current-row
            height="527px"
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
              prop="name"
              align="center"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="currentMajor"
              align="center"
              label="专业"
            ></el-table-column>
            <el-table-column
              prop="currentGrade"
              align="center"
              label="年级"
            ></el-table-column>

            <el-table-column align="center" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button
                  round
                  size="mini"
                  type="success"
                  @click="checkClick(scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </el-card>
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
import { reqProfessionalList, reqCascaderOptions } from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 是否预警字段
      isWarning: 0,
      // 当前页
      currentPage: 1,
      // 每页条数
      pageSize: 10,
      //专业选项
      majorOptions: [],
      //年级选项
      gradeOptions: [],
      para: {
        major: "",
        grade: "",
        searchValue: "",
        type: "1",
        pageNum: 1,
        pageSize: 10,
        isQualificationWarning:"0"
      },
      //标签页名称
      tabName: "",
      //加载中
      loading: false,
    };
  },
  computed: {
    ...mapState("qualification", [
      "failureStudentList",
      "passedStudentList",
      "totalPage",
    ]),
  },
  methods: {
    // 分页器
    currentChange(val) {
      this.currentPage = val;
      this.getQualificationFailure();
    },
    preClick() {
      this.currentPage--;
      this.getQualificationFailure();
    },
    nextClick() {
      this.currentPage++;
      this.getQualificationFailure();
    },
    //获取专业和年级选项
    async getMajorAndGrade() {
      this.majorOptions = (await reqProfessionalList()).data;
      this.gradeOptions = (await reqCascaderOptions()).data[0].children;
    },
    //获取未达标学生列表
    async getQualificationFailure() {
      this.loading = true;
      this.para.pageNum = this.currentPage;
      this.para.pageSize = this.pageSize;
      this.para.isQualificationWarning = JSON.stringify(this.isWarning)
      let code = await this.$store.dispatch(
        "qualification/getQualificationFailure",
        this.para
      );
      if (code != undefined) {
        this.loading = false;
      }
    },
    //获取已达标学生列表
    async getQualificationPassed() {
      this.loading = true;
      let code = await this.$store.dispatch(
        "qualification/getQualificationPassed",
        this.para
      );
      if (code != undefined) {
        this.loading = false;
      }
    },
    //标签页切换时发请求
    passReq(tab) {
      if (tab.label == "未达标") {
        this.getQualificationFailure();
      } else {
        this.getQualificationPassed();
      }
    },
    //筛选学生列表
    filterStuList() {
      if (this.tabName == "0") {
        this.getQualificationFailure();
      } else {
        this.getQualificationPassed();
      }
    },
    //搜索
    clearSelect() {
      this.para.major = "";
      this.para.grade = "";
      this.filterStuList();
    },
    //查看按钮回调
    checkClick(checkRow) {
      window.sessionStorage.setItem(
        "stuQualificationDetail",
        JSON.stringify(checkRow)
      );
      // console.log(checkRow);
      this.$router.push({
        path: `/manager/qualificationdetail`,
        query: {
          checkRow,
        },
      });
    },
  },
  mounted() {
    this.getMajorAndGrade();
    this.getQualificationFailure();
  },
};
</script>

<style scoped>
.box-card {
  height: 100%;
}

.card-header {
  text-align: left;
  color: #409bff;
  font-size: 20px;
}

.second-select {
  margin-right: 40px;
}

.input-with-select {
  width: 300px;
}

.input-with-select .el-select {
  width: 75px;
}

body .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

.el-table__row {
  line-height: 20px;
}
</style>
