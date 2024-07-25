<template>
  <div>
    <el-dialog
      title="分配培养方案"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="main">
        <div class="left">
          <template>
            专业：<el-select
              v-model="selectingMajor"
              placeholder="请选择专业"
              @change="getGradesOptions"
            >
              <el-option
                v-for="item in majorOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>

          <template>
            版本：<el-select
              v-model="selectingTag"
              placeholder="请选择版本"
              :disabled="selectingMajor.length == 0"
            >
              <el-option
                v-for="item in tagOptions"
                :key="item.tag"
                :label="item.tag"
                :value="item.tag"
              >
              </el-option>
            </el-select>
          </template>
        </div>
        <div class="right">
          分配给：
          <el-select
            v-model="selectingGrades"
            multiple
            placeholder="请选择套分配的年级"
          >
            <el-option
              v-for="item in gradesOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="allocationScheme()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqUndistributedTags,
  reqProfessionalList,
  reqUndistributedGrades,
  reqSetTagWithGrades,
  reqGetAllTags,
  reqUpdateUnKnowCourse,
} from "@/api";
export default {
  data() {
    return {
      // 选中的专业
      selectingMajor: "",
      // 可选的专业数据
      majorOptions: [],
      // 选中的版本
      selectingTag: "",
      // 可选的版本数据
      tagOptions: [],
      // 选中的年级数组
      selectingGrades: [],
      // 多选框可选的年级数据
      gradesOptions: [],
    };
  },
  props: ["dialogVisible"],
  methods: {
    handleClose() {
      this.closeDialog();
    },
    //  关闭对话框
    closeDialog() {
      this.$parent.closeDialog();
    },
    // 获取可选数据
    async getData() {
      // 获取专业
      let reqUndistributedGrades = await reqProfessionalList();
      if (reqUndistributedGrades.code == 1) {
        this.majorOptions = reqUndistributedGrades.data;
      } else if (reqUndistributedGrades.code == 0) {
        this.$message({
          message: reqUndistributedGrades.msg,
          type: "error",
        });
      } else if (reqUndistributedGrades.code == 302) {
        this.$message({
          message: reqUndistributedGrades.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 获取多选框可选的年级数据和tag
    async getGradesOptions() {
      // 获取版本
      let reqTagListResult = await reqGetAllTags(this.selectingMajor);

      if (reqTagListResult.code == 1) {
        this.tagOptions = reqTagListResult.data;
      } else if (reqTagListResult.code == 0) {
        this.$message({
          message: reqTagListResult.msg,
          type: "error",
        });
      } else if (reqTagListResult.code == 302) {
        this.$message({
          message: reqTagListResult.msg,
          type: "error",
        });
        this.$router.push("/login");
      }

      // 获取可分配年级
      let reqUndistributedGradesResult = await reqUndistributedGrades(
        this.selectingMajor
      );
      if (reqUndistributedGradesResult.code == 1) {
        this.gradesOptions = reqUndistributedGradesResult.data;
      } else if (reqUndistributedGradesResult.code == 0) {
        this.$message({
          message: reqUndistributedGradesResult.msg,
          type: "error",
        });
      } else if (reqUndistributedGradesResult.code == 302) {
        this.$message({
          message: reqUndistributedGradesResult.msg,
          type: "error",
        });
        this.$router.push("/login");
      }
    },
    // 分配培养方案
    allocationScheme() {
      // loading效果
      const loading = this.$loading({
        lock: true,
        text: "请等待一下哦（可能需要30s左右）",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let gradeTagRelation = {};
      gradeTagRelation.major = this.selectingMajor;
      gradeTagRelation.tag = this.selectingTag;
      this.selectingGrades.forEach(async (item) => {
        gradeTagRelation.grade = item;
        let result = await reqSetTagWithGrades(gradeTagRelation);
        if (result.code == 1) {
          this.$message({
            message: `已将版本${this.selectingTag}分配给年级${item}`,
            type: "success",
          });
          // 分配培养方案之后发送请求
          let data = {
            major: this.selectingMajor,
            grade: item,
            tag: this.selectingTag,
          };
          let res = await reqUpdateUnKnowCourse(data);
          if (res.code == 1) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            loading.close();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
            loading.close();
          }
          this.$parent.closeDialog();
          this.$parent.getTrainPlans();
        } else if (result.code == 0) {
          this.$message({
            message: `版本${this.selectingTag}分配给年级${item}失败`,
            type: "error",
          });
        } else if (result.code == 302) {
          this.$message({
            message: result.msg,
          });
          this.$router.push("/login");
        }
      });
      this.closeDialog();
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .left {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    margin-right: 20px;
  }
  .right {
    margin-left: 20px;
  }
}
</style>
