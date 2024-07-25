<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="30%"
    top="5vh"
    :close-on-click-modal="false"
    @open="openEvent"
    @close="closeDialog"
  >
    <span slot="title" style="font-weight: 900; font-size: 18px">{{
      dialogHeader
    }}</span>
    <el-form
      ref="form"
      :model="form"
      label-position="top"
      :hide-required-asterisk="true"
      :rules="rules"
    >
      <el-form-item label="专业及年级" prop="deptAndGrade">
        <el-cascader-panel
          :options="cascaderOptions"
          v-model="form.deptAndGrade"
          :props="{ label: 'value' }"
        ></el-cascader-panel>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="form.studentId"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          v-model="form.note"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="switchDialog">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { updateStudentList } from "@/api";
export default {
  name: "UpdateStuInfo",
  props: ["dialogVisible", "cascaderOptions", "editRow", "dialogHeader"],
  data() {
    return {
      form: {
        deptAndGrade: [],
        name: "",
        studentId: "",
        note: "",
      },
      rules: {
        deptAndGrade: {
          required: true,
          message: "请选择专业及年级",
          trigger: "change",
        },
        name: { required: true, message: "请输入学生姓名", trigger: "change" },
        studentId: { required: true, message: "请输入学号", trigger: "change" },
      },
      //是否发送了请求
      isReq: false,
      //确认按钮的加载中
      loading: false,
    };
  },
  computed: {
    reqForm() {
      let { form } = this;
      return {
        currentMajor: form.deptAndGrade[0],
        currentGrade: form.deptAndGrade[1],
        name: form.name,
        studentId: form.studentId,
        id: this?.editRow?.id ?? null,
        note: form.note,
      };
    },
  },
  methods: {
    //触发自定义事件: 将dialogVisible值转为false
    switchDialog() {
      this.$emit("switchDialog", this.isReq);
    },
    //确认按钮的回调函数
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          //发送请求
          let result = await updateStudentList(this.reqForm);
          if (result.code == 1) {
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success",
            });
            this.isReq = true;
          } else {
            this.$message({
              showClose: true,
              message: "出错了,请联系管理员",
              type: "error",
            });
          }
          this.loading = false;
          this.switchDialog();
        } else {
          this.$message({
            showClose: true,
            message: "请正确填写学生信息",
            type: "warning",
          });
          return false;
        }
      });
    },
    //对话框打开时的回调函数
    openEvent() {
      let { deptAndGrade, name, studentId ,note} = this.editRow;
      this.form = deptAndGrade ? { deptAndGrade, name, studentId,note } : form;
      this.isReq = false;
    },
    //对话框关闭时的回调函数
    closeDialog() {
      //点击关闭按钮关闭对话框时,dialogVisible的值不会自动变为false, 需要手动修改
      this.switchDialog();
      //清空表单和重置表单验证
      this.form = {
        deptAndGrade: [],
        name: "",
        studentId: "",
        note:""
      };
      this.$refs.form.clearValidate();
    },
  },
  mounted() {},
};
</script>
<style scoped>
* {
  text-align: left;
}
</style>
