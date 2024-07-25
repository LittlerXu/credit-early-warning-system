<template>
  <div>
    <el-card
      class="box-card"
      :body-style="{ height: '100%', overflow: 'auto' }"
    >
      <div slot="header" style="text-align: center">
        <span style="font-size: 22px; color: #409eff"></span> &nbsp;<el-input
          placeholder="输入学号以搜索"
          v-model="searchValue"
          @change="getWarnRecords"
          style="width: 300px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            circle
            type="primary"
          ></el-button>
        </el-input>
      </div>
      <div class="warningRecord">
        <el-empty
          description="暂无预警记录"
          v-show="warnRecords.length == 0"
        ></el-empty>
        <div class="recordsBox" v-show="warnRecords.length != 0">
          <div
            class="record--1"
            v-for="warningRecord in warnRecords"
            :key="warningRecord.id"
            @click="
              goDetail(
                warningRecord.content,
                warningRecord.info,
                warningRecord.type,
                warningRecord.status
              )
            "
          >
          <div class="date">学号：{{ warningRecord.studentId }}</div>
            <div class="date">类型：{{ warningRecord.type }}</div>
            <div class="content">信息：{{ warningRecord.info }}</div>
            <div class="teacher">预警时间：{{ warningRecord.sendingTime }}</div>
          </div>
        </div>
      </div>
    </el-card>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :total="totalPage"
      @current-change="currentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reqCreditRemindRecord } from "@/api";
export default {
  name: "warningRecord",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      warnRecords: [],
      //搜索框:
      searchValue: "",
      totalPage: 0,
    };
  },
  methods: {
    // 分页器
    currentChange(value) {
      this.currentPage = value;
      this.getWarnRecords();
    },
    prevClick() {
      this.currentPage--;
      this.getWarnRecords();
    },
    nextClick() {
      this.currentPage++;
      this.getWarnRecords();
    },
    // 点击跳转到预警信息详情界面
    goDetail(data, info, type, status, studentId) {
      let content = data;

      if (type == "毕业资格提醒") {
      } else {
        this.$router.push({
          path: "/manager/warningdetail",
          query: {
            content,
            info,
            type,
            status,
          },
        });
      }
    },
    // 获取预警记录
    async getWarnRecords() {
      let result = await reqCreditRemindRecord(
        this.searchValue,
        this.currentPage,
        this.pageSize
      );
      if (result.code == 1) {
        this.warnRecords = result.data.list;
        this.totalPage = result.data.total;
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
  mounted() {
    this.getWarnRecords();
  },
};
</script>

<style lang="scss" scoped>
.warningRecord {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  font-size: 16px;

  .recordsBox {
    margin: 0 auto;
    // margin-top: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .record--1 {
      width: 80%;
      min-height: 50px;
      background-color: #fdf6ec;
      transition: border-radius cubic-bezier(0.075, 0.82, 0.165, 1) 1s,
        transform cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
      margin: 10px auto;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #e6a23c;

      position: relative;

      .new {
        width: 50px;
        height: 20px;
        position: absolute;
        right: 20px;
        top: -10px;
        background-color: #f56c6c;
        z-index: 999;
        color: #fff;
        text-align: center;
        line-height: 20px;
        border-radius: 10px;
      }

      &:hover {
        border-bottom-right-radius: 50px;
        border-top-left-radius: 50px;
        transform: scale(1.05);
        cursor: pointer;
      }
      .content {
        max-width: 30%;
      }
      .date {
        max-width: 30%;
      }

      .type {
        max-width: 30%;
      }
    }
  }
}
</style>
