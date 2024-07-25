<template>
  <div class="check">
    <div class="top">
      <!-- 顶部学院选项 -->
      <div>
        <span style="font-size: 20px; color: #409bff">专业：</span>
        <el-select
          v-model="selectingMajor"
          placeholder="请选择专业"
          @change="selectMajor"
        >
          <el-option
            v-for="item in selectedInfo"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="font-size: 20px; color: #409bff">年级：</span>
        <el-select
          v-model="selectingGrade"
          placeholder="请选择年级"
          :disabled="!selectingMajor"
          @change="getTrainPlans"
        >
          <el-option
            v-for="item in grades"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="button">
        <el-button type="primary" @click="allocationScheme">分配方案</el-button>
      </div>
    </div>

    <!-- 所有已分配培养方案表 -->
    <div class="tableTitle">已应用培养方案列表</div>
    <div class="table">
      <el-table :data="trainPlanTableData" border style="width: 100%">
        <el-table-column prop="major" label="专业" width="180">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="180">
        </el-table-column>
        <el-table-column prop="tag" label="版本"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              plain
              type="primary"
              @click="goDetail(scope.row)"
              size="small"
              >查看
            </el-button>
            <el-button
              plain
              type="warning"
              size="small"
              @click="goModify(scope.row)"
              >修改
            </el-button>

            <el-popconfirm
              title="确定删除吗？"
              @confirm="removeTagRelationship(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="small"
                plain
              >
                删 除
              </el-button>
            </el-popconfirm>

            <a
              :href="
                $globalVar.EXCEL_BASEURL +
                `/admin/excelToExportTrainingPlan?major=${
                  scope.row.major
                }&tag=${scope.row.tag}&token=${getToken()}`
              "
            >
              <el-button plain type="success" size="small">导出</el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 所有未分配培养方案表 -->
    <div class="tableTitle">未应用培养方案列表</div>
    <div class="table">
      <el-table
        :data="undistributedTrainPlanTableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="major" label="专业" width="180">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="180">
        </el-table-column>
        <el-table-column prop="tag" label="版本"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="goDetail(scope.row)"
              type="primary"
              size="small"
              plain
              >查看
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="goModify(scope.row)"
              plain
              >修改
            </el-button>
            <el-button
              type="danger"
              plain
              size="small"
              @click="removeTag(scope.row)"
            >
              删 除
            </el-button>
            <a
              :href="
                $globalVar.EXCEL_BASEURL +
                `/admin/excelToExportTrainingPlan?major=${
                  scope.row.major
                }&tag=${scope.row.tag}&token=${getToken()}`
              "
            >
              <el-button plain type="success" size="small">导出 </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="dialog">
      <AllocationScheme :dialogVisible="dialogVisible"></AllocationScheme>
    </div>
  </div>
</template>

<script>
import {
  reqTagWithGrades,
  reqMajorsGradesList,
  reqUndistributedTags,
  reqDeleteOneTag,
  reqDeleteTagWithGrades,
} from "@/api";
import AllocationScheme from "@/components/AllocationSchemeComponent/AllocationSchemeComponent.vue";
export default {
  name: "Check",
  components: { AllocationScheme },
  data() {
    return {
      // 对话框是否显示
      dialogVisible: false,
      // 选中的专业
      selectingMajor: "",
      // 版本
      selectingGrade: "",
      // 已有版本
      grades: [],
      // 右侧大类
      categories: [],
      // 可选信息
      selectedInfo: [],
      // 已分配培养方案数据
      trainPlanTableData: [],
      // 未分配培养方案数据
      undistributedTrainPlanTableData: [],
    };
  },
  methods: {
    //  返回token
    getToken() {
      let info = JSON.parse(window.sessionStorage.getItem("info-admin"));
      let { token } = info;

      return token;
    },
    // 删除培养方案对应关系
    async removeTagRelationship(item) {
      let reqDeleteTagWithGradesResult = await reqDeleteTagWithGrades(item.id);
      if (reqDeleteTagWithGradesResult.code == 1) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getTrainPlans();
      } else if (reqDeleteTagWithGradesResult.code == 0) {
        this.$message({
          message: reqDeleteTagWithGradesResult.msg,
          type: "error",
        });
      } else if (reqDeleteTagWithGradesResult.code == 302) {
        this.$message({
          message: reqDeleteTagWithGradesResult.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 删除某一版培养方案
    async removeTag(item) {
      let reqDeleteOneTagResult = await reqDeleteOneTag(item);
      if (reqDeleteOneTagResult.code == 1) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getTrainPlans();
      } else if (reqDeleteOneTagResult.code == 0) {
        this.$message({
          message: reqDeleteOneTagResult.msg,
          type: "error",
        });
      } else if (reqDeleteOneTagResult.code == 302) {
        this.$message({
          message: reqDeleteOneTagResult.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 跳转到修改培养方案页面
    goModify(data) {
      let { major, grade, tag } = data;
      this.$router.push({
        path: "/manager/modify",
        query: { major, grade, tag },
      });
    },
    //  关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    // 分配方案
    allocationScheme() {
      this.dialogVisible = true;
    },
    // 跳转到培养方案详情页面
    goDetail(data) {
      let { major, grade, tag } = data;
      this.$router.push({
        path: "/manager/checkdetail",
        query: {
          major,
          grade,
          tag,
        },
      });
    },
    // 获取未分配培养方案数据
    async getUndistributedTags() {
      let reqUndistributedTagsResult = await reqUndistributedTags("");
      if (reqUndistributedTagsResult.code == 1) {
        this.undistributedTrainPlanTableData = reqUndistributedTagsResult.data;
      } else if (reqUndistributedTagsResult.code == 0) {
        this.$message({
          message: reqUndistributedTagsResult.msg,
          type: "error",
        });
      } else if (reqUndistributedTagsResult.code == 302) {
        this.$message({
          message: reqUndistributedTagsResult.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 获取所有培养方案数据以及对话框数据
    async getTrainPlans() {
      // 等待效果
      const loading = this.$loading({
        lock: true,
        text: "请等待一下哦",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      setTimeout(() => {
        loading.close();
      }, 30000);
      let gradeTagRelation = {};
      gradeTagRelation.major = this.selectingMajor;
      gradeTagRelation.grade = this.selectingGrade;
      gradeTagRelation.tag = "";
      let result = await reqTagWithGrades(gradeTagRelation);
      if (result.code == 1) {
        this.trainPlanTableData = result.data;
        this.getUndistributedTags();
      } else if (result.code == 0) {
        this.$message({
          message: result.msg,
          type: "error",
        });
      } else if (result.code == 302) {
        this.$message({
          message: result.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
      loading.close();
    },
    // 选择专业获取版本
    selectMajor() {
      this.selectedInfo.forEach((item) => {
        if (item.value == this.selectingMajor) {
          this.grades = item.children;
          return;
        }
      });
    },
    // 获取获取专业年级
    async getMajorsGradesList() {
      let result = await reqMajorsGradesList();
      if (result.code == 1) {
        this.selectedInfo = result.data;
      } else if (result.code == 0) {
        this.$message({
          message: result.msg,
          type: "error",
        });
      } else if (result.code == 302) {
        this.$message({
          message: result.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.getTrainPlans();
    this.getMajorsGradesList();
  },
};
</script>

<style lang="scss" scoped>
.check {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;

  .top {
    height: 60px;
    width: 100%;
    // background-color: rgb(253, 204, 212);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid rgb(181, 176, 176);
    // margin-bottom: 20px;
  }

  .tableTitle {
    width: fit-content;
    background-color: #f8f8f8;
    color: #409eff;
    border-radius: 5px;
    margin: 0 auto;
    padding: 5px;
    font-size: 17px;
  }
}
</style>
