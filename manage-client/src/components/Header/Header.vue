<template>
  <div class="header">
    <el-row type="flex" justify="space-between">
      <el-col
        :span="7"
        style="
          display: flex;
          align-items: center;
          justify-content: space-around;
        "
      >
        <router-link to="/home">
          <img src="/icons/logo.png" alt="" style="height: 60px" />
        </router-link>
        <h1 style="display: block">贵州大学学分预警系统</h1>
        <h3>管理端</h3>
      </el-col>

      <el-col :span="1" style="display: flex; align-items: center">
        <div style="height: 40px; width: 40px">
          <el-dropdown>
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉卡片 -->
              <div class="card">
                <div class="tools">
                  <div class="circle">
                    <span class="red box"></span>
                  </div>
                  <div class="circle">
                    <span class="yellow box"></span>
                  </div>
                  <div class="circle">
                    <span class="green box"></span>
                  </div>
                </div>
                <div class="card__content">
                  <div>管理员：{{ adminInfo.name }}</div>
                  <button id="button" @click="logout()">退出</button>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      adminInfo: {
        name: "",
      },
    };
  },
  methods: {
    
    // 从本地存储获取学生信息进行处理
    getAdminInfo() {
      let adminInfo = JSON.parse(window.sessionStorage.getItem("info-admin"));
      this.adminInfo.name = adminInfo.name;
    },
    // 退出
    logout() {
      window.sessionStorage.removeItem("info-admin");
      let info_admin = window.sessionStorage.getItem("info-admin");
      if (info_admin == null) {
        this.$router.push("/login");
        this.$message({
          message: "退出成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "退出失败,按道理来说不会出错，出错了就不知道，你强行退出吧",
          type: "error",
        });
      }
    },
  },
  created() {
    this.getAdminInfo();
  },
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid #ccc;
  height: 60px;
  width: 100%;
  background-color: #fff;
}
</style>

//下拉卡片样式
<style scoped>
.card__content {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  color: #409eff;
  font-size: 14px;
}
.card {
  width: 190px;
  margin: 0 auto;
  background-color: #f8fbfe;
  border-radius: 8px;
}

.tools {
  display: flex;
  align-items: center;
  padding: 9px;
}

.circle {
  padding: 0 4px;
}

.box {
  display: inline-block;
  align-items: center;
  width: 10px;
  height: 10px;
  padding: 1px;
  border-radius: 50%;
}

.red {
  background-color: #ff605c;
}

.yellow {
  background-color: #ffbd44;
}

.green {
  background-color: #00ca4e;
}
</style>
// 退出按钮样式
<style scoped>
#button {
  font-size: 14px;
  padding: 0.5em 2em;
  border: transparent;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  background: dodgerblue;
  color: white;
  border-radius: 4px;
}

button:hover {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(30, 144, 255, 1) 0%,
    rgba(0, 212, 255, 1) 100%
  );
}

button:active {
  transform: translate(0em, 0.2em);
}
</style>
