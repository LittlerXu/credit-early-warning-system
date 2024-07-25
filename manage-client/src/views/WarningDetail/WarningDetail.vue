<template>
  <div class="warningDetail">
    <div class="title">
      <el-alert
        :title="info"
        :type="status == '0' ? 'error' : 'success'"
        :description="title"
        :closable="false"
        center
      >
      </el-alert>
    </div>
    <div class="content" v-if="type == '学分预警'">
      <classTable
        :tableData="courseLargeClassificationAndCourses"
        :title="'所有成绩'"
        :tableStyle="tableStyle"
      >
      </classTable>
    </div>
    <div class="content" v-else>
      <div v-for="item in courseLargeClassificationAndCourses" :key="item.id">
        <classTable
          :tableData="item.courseList"
          :title="item.name"
          :credit="item.credit"
          :studentCredit="item.studentCredit"
          :tableStyle="tableStyle"
        >
        </classTable>
      </div>
    </div>
  </div>
</template>

<script>
import classTable from "@/components/ClassTable/ClassTable.vue";
export default {
  name: "WarningDetail",
  components: {
    classTable,
  },
  data() {
    return {
      // 自定义表格样式
      tableStyle: [
        {
          prop: "courseName",
          label: "课程名称",
        },
        {
          prop: "subClassification",
          label: "课程性质",
        },
        {
          prop: "courseCredit",
          label: "学分",
        },
        {
          prop: "courseGpa",
          label: "绩点",
        },
        {
          prop: "courseGrade",
          label: "成绩",
        },

        {
          prop: "status",
          label: "是否通过",
        },
      ],
      // 课程表数据
      courseLargeClassificationAndCourses: [],
      // 应获学分
      totalCredits: 0,
      // 学生学分
      studentTotalCredits: "",
      //   预警信息
      info: "",
      //   title
      title: "",
      // 预警类型
      type: "",
      // 是否通过
      status: "0",
    };
  },
  methods: {
    // 从路由中获取数据
    getDataByRoute() {
      let data = JSON.parse(this.$route.query.content);
      let typeData = this.$route.query.type;
      this.type = typeData;
      if (this.type === "毕业预警" || "毕业提醒") {
        let infoData = this.$route.query.info;
        this.info = infoData;
        this.status = this.$route.query.status;
        this.totalCredits = data.totalCredits;
        this.studentTotalCredits = data.studentTotalCredits;
        this.title =
          `应获学分:${this.totalCredits || 0}  ` +
          " | " +
          `  学生获得学分:${this.studentTotalCredits || 0}`;
        this.courseLargeClassificationAndCourses =
          data.courseLargeClassificationAndCourses;
      }
      if (this.type === "学分预警") {
        let infoData = this.$route.query.info;
        this.info = infoData;
        let totalCredits = 0;
        data.forEach((item) => {
          totalCredits += parseFloat(item.courseCredit);
        });
        this.totalCredits = totalCredits
        this.title = `总学分为：${this.totalCredits || 0}`;
        this.courseLargeClassificationAndCourses = data;
      }
    },
  },
  created() {
    this.getDataByRoute();
  },
};
</script>

<style lang="scss" scoped>
.warningDetail {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
}

.el-alert__title {
  font-size: 20px;
  font-weight: bold;
}
.el-alert__description {
  font-size: 20px;
  font-weight: bold;
}
</style>
