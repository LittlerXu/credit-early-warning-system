<template>
  <div class="header">
    <el-row type="flex" justify="space-between">
      <el-col
        :span="10"
        style="
          display: flex;
          align-items: center;
          justify-content: sapce-around;
        "
      >
        <router-link to="/home">
          <img src="/icons/logo.png" alt="" id="logo" />
        </router-link>
        <h1 id="title">贵州大学学分预警系统</h1>
      </el-col>

      <el-col :span="2" style="display: flex; align-items: center">
        <div class="logout">
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
                  <div>{{ studentInfo.college }}学院</div>
                  <div>{{ studentInfo.major }}</div>
                  <div>学号：{{ studentInfo.studentId }}</div>
                  <div>姓名：{{ studentInfo.name }}</div>
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
      studentInfo: {},
    };
  },
  methods: {
    // 从本地存储获取学生信息进行处理
    getStudentInfo() {
      let studentInfo = JSON.parse(
        window.sessionStorage.getItem("info-student")
      );
      this.studentInfo = studentInfo;
    },
    // 退出
    logout() {
      window.sessionStorage.removeItem("info-student");
      let info_student = window.sessionStorage.getItem("info-student");
      if (info_student == null) {
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
  mounted() {
    this.getStudentInfo();
  },
};
</script>

<style lang="scss" scoped>
@media only screen and(min-width: 1000px) {
  img {
    transition: all 50s;
  }
  img:hover {
    rotate: 100turn;
  }
  .header {
    border-bottom: 1px solid #ccc;
    min-height: 60px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ccc;

    #logo {
      height: 60px;
    }

    #title {
      display: block;
      font-size: 1.3rem;
    }
    .logout {
      height: 40px;
      width: 40px;
    }
  }
}

@media only screen and(max-width: 999px) {
  .header {
    border-bottom: 1px solid #ccc;
    min-height: 60px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    #logo {
      height: 35px;
    }
    #title {
      display: block;
      font-size: 10px;
    }
    .logout {
      height: 40px;
      width: 40px;
      margin: 0 auto;

      .el-avatar{
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>

//下拉卡片样式
<style scoped>
@media only screen and (min-width: 1000px) {
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
}

@media only screen and (max-width: 999px) {
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
}

</style>
// 退出按钮样式
<style scoped>
@media only screen and (min-width: 1000px) {
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
}

@media only screen and (max-width: 999px) {
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
}
</style>
