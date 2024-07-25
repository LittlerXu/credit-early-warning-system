<template>
  <div>
    <el-card class="box-card" :body-style="{ height: '100%', padding: '0' }">
      <div slot="header" class="card-header">
        专业:
        <el-select clearable v-model="para.major" placeholder="请选择专业">
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
        >
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          @click="filterStuList"
          :disabled="para.major.length == 0 && para.grade.length == 0"
          >确定
        </el-button>
        <el-button type="primary" @click="computCreit">计算学分 </el-button>
      </div>

      <el-tabs type="border-card" v-model="tabName" @tab-click="tabClick">
        <el-tab-pane label="未预警" name="unwarning">
          <el-table
            class="el-table"
            :data="unwarning"
            highlight-current-row
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            :row-style="changeColor"
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
            <el-table-column
              prop="creditWarningCount"
              align="center"
              label="已预警次数"
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
          <!-- <el-pagination background :pager-count="5" layout="prev, pager, next" :total="1000" hide-on-single-page @current-change="pageNumChange" @prev-click="pageNumChange" @next-click="pageNumChange">
                    </el-pagination> -->
        </el-tab-pane>

        <el-tab-pane label="已预警1次" name="warninged-first"
          ><el-table
            class="el-table"
            :data="warninged_first"
            highlight-current-row
            height="527px"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            :row-style="changeColor"
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
            <el-table-column
              prop="creditWarningCount"
              align="center"
              label="预警次数"
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已预警2次" name="warninged-second"
          ><el-table
            class="el-table"
            :data="warninged_second"
            highlight-current-row
            height="527px"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            :row-style="changeColor"
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
            <el-table-column
              prop="creditWarningCount"
              align="center"
              label="预警次数"
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="予以退学" name="withdraw">
          <el-table
            class="el-table"
            :data="expulsion"
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
            <el-table-column
              prop="creditWarningCount"
              align="center"
              label="预警次数"
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalPage"
      :current-page="para.pageNum"
      v-show="totalPage != ''"
      @next-click="nextClick"
      @prev-click="prevClick"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  reqProfessionalList,
  reqCascaderOptions,
  reqCreditFailure,
  reqCheckCreditFailure,
  reqCalculateCreditWarning,
} from "@/api";
export default {
  data() {
    return {
      //未预警学生列表
      unwarning: [],
      //已预警一次学生列表
      warninged_first: [],
      // 已预警2次的学生列表
      warninged_second: [],
      //予以退学学生列表
      expulsion: [],
      //专业选项
      majorOptions: [],
      //年级选项
      gradeOptions: [],
      // 总页数
      totalPage: 0,
      para: {
        major: this.$route.query.major || "",
        grade: this.$route.query.grade || "",
        count: 0,
        pageNum: 1,
        pageSize: 10,
      },
      //标签页名称
      tabName: "",
      //加载中
      loading: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 计算学分预警
    async computCreit() {
      // 先判断是否还有未计算的学生
      let res1 = await reqCheckCreditFailure();

      this.$message({
        dangerouslyUseHTMLString: true,
        message: "未计算的学生个数为：" + res1.data + "个.",
        type: "warning",
      });
      if (parseInt(res1.data) > 0) {
        const loading = this.$loading({
          lock: true,
          text: "计算需要大约2分钟，请耐心等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let res2 = await reqCalculateCreditWarning(this.para);
        
        if (res2.code == 1) {
          loading.close()
          this.$message({
            message: "计算完成，可以预警啦",
            type: "success",
          });
        }else {
          loading.close()
          this.$message({
            message:res2.msg,
            type:"error"
          })
        }
      } else {
        this.$message({
          message: "全部计算完毕！",
          type: "success",
        });
      }
    },
    // 切换tab标签格式化参数
    clearParmas() {
      this.para.pageNum = 1;
    },
    // 页码改变
    nextClick() {
      this.para.pageNum++;
      this.tabClick("pagination");
    },
    prevClick() {
      this.para.pageNum--;
      this.tabClick("pagination");
    },
    currentChange(Num) {
      this.para.pageNum = Num;
      this.tabClick("pagination");
    },
    // 点击tab切换标签
    tabClick(type) {
      if (type !== "pagination") {
        this.clearParmas();
      }

      switch (this.tabName) {
        case "unwarning":
          this.getCreditFailure();
          break;
        case "warninged-first":
          this.getWarningFirst();
          break;
        case "warninged-second":
          this.getWarningSecond();
          break;
        case "withdraw":
          this.getWarningThird();
          break;

        default:
          break;
      }
    },
    //获取专业和年级选项
    async getMajorAndGrade() {
      this.majorOptions = (await reqProfessionalList()).data;
      this.gradeOptions = (await reqCascaderOptions()).data[0].children;
    },
    //获取未预警学生列表
    async getCreditFailure() {
      // 初始判断路由是否有值
      this.loading = true;
      this.para.count = 0;
      let result = await reqCreditFailure(this.para);
      this.unwarning = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    // 获取预警一次学生列表
    async getWarningFirst() {
      this.loading = true;
      this.para.count = 1;
      let result = await reqCreditFailure(this.para);
      this.warninged_first = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    // 获取预警2次的学生列表
    async getWarningSecond() {
      this.loading = true;
      this.para.count = 2;
      let result = await reqCreditFailure(this.para);
      this.warninged_second = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    // 获取预警3次的学生列表即予以退学的学生列表
    async getWarningThird() {
      this.loading = true;
      this.para.count = 3;
      let result = await reqCreditFailure(this.para);
      this.expulsion = result.data.list;
      this.totalPage = result.data.total;
      if (result.code != undefined) {
        this.loading = false;
      }
    },
    //查看按钮回调
    checkClick(checkRow) {
      window.sessionStorage.setItem(
        "stuCreditDetail",
        JSON.stringify(checkRow)
      );
      let page = this.$router.resolve({
        path: `/manager/warningrecorddetail`,
        query: {
          checkRow: JSON.stringify(checkRow),
          major: this.para.major,
          grade: this.para.grade,
        },
      });

      window.open(page.href, "_blank");
    },
    //学生过滤
    filterStuList() {
      this.getCreditFailure();
    },
    //表格行的style的回调方法
    changeColor({ row, rowIndex }) {
      if (Number(row.creditWarningCount) == 2) {
        return { "background-color": "#fef0f0 " };
      } else if (Number(row.creditWarningCount) == 1) {
        return { "background-color": "#fdf6ec" };
      }
    },
  },
  mounted() {
    this.getMajorAndGrade();
    // this.getCreditFailure();
  },
};
</script>

<style scoped>
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
