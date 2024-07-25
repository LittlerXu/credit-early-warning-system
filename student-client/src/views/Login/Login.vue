<template>
  <!-- <div>
    <img class="bg" src="/images/login-Bg.jpg" />
    <form class="form card">
      <div class="card_header">
        <img
          src="/icons/logo.png"
          alt=""
          style="width: 40px; height: 40px; margin-right: 10px"
        />
        <h1 class="form_heading">贵州大学学分预警系统</h1>
      </div>
      <div class="field">
        <label for="username">学号</label>
        <input
          class="input"
          type="text"
          placeholder="请输入用户名"
          v-model="userInfo.studentId"
        />
      </div>
      <div class="field">
        <label for="password">密码</label>
        <input
          class="input"
          type="password"
          placeholder="请输入密码"
          v-model="userInfo.password"
        />
      </div>
      <div class="field">
        <button
          class="button"
          @click="login()"
          type="button"
          :disabled="isDisable"
          v-if="!isDisable"
        >
          登录
        </button>
        <button
          class="button"
          type="button"
          :disabled="isDisable"
          v-if="isDisable"
        >
          登录中....
        </button>

        <div class="contact">首次登陆会要求修改密码,请牢记密码</div>
        <div class="contact">若有问题请加反馈Q群:258425467</div>
      </div>
    </form>
   
    <el-dialog
      title="建议修改密码以保证安全"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>密码长度应在6-20个字符之间</span>
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelAlign"
      >
        <el-form-item
          label="密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
        >
          <el-input v-model="formLabelAlign.setPassword1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="formLabelAlign.setPassword2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPassword">确 定 </el-button>
      </span>
    </el-dialog>
  </div> -->

  <div class="wrap">
    <div class="form">
      <div class="left">
        <video src="video/video.mp4" muted loop autoplay></video>
      </div>
      <div class="right">
        <div class="right-con">
          <h1>贵州大学学分预警系统</h1>
          <div class="contact">首次登陆会要求修改密码,请牢记密码</div>
          <div class="contact">若有问题请加反馈Q群:258425467</div>
          <h3>学号</h3>
          <input
            class="text"
            type="text"
            v-model="userInfo.studentId"
            @keyup.enter="login"
          />

          <h3>密码</h3>
          <input
            class="text"
            type="password"
            v-model="userInfo.password"
            @keyup.enter="login"
          />

          <input class="btn" type="submit" value="登录" @click="login" />
        </div>
      </div>
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="建议修改密码以保证安全"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <span>密码长度应在7-20个字符之间,只能包含数字和字母</span><br />
      <span style="color: red">建议先截屏保存修改后的密码</span><br />
      <span style="color: red">建议先截屏保存修改后的密码</span><br />
      <span style="color: red">建议先截屏保存修改后的密码</span>
      <el-form
        label-position="right"
        label-width="80px"
      >
        <el-form-item
          label="密码"
        >
          <el-input
            v-model="formLabelAlign.setPassword1"
            onkeyup="value=value.replace(/[\W]/g,'')"
            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="formLabelAlign.setPassword2"
            onkeyup="value=value.replace(/[\W]/g,'')"
            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPassword">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        studentId: "",
        password: "",
      },
      isDisable: false,
      dialogVisible: false,
      formLabelAlign: {
        setPassword1: "",
        setPassword2: "",
      },
    };
  },
  methods: {
    // 修改密码
    setPassword() {
      if (
        this.formLabelAlign.setPassword1.length > 20 ||
        this.formLabelAlign.setPassword1.length < 6
      ) {
        console.log(this.formLabelAlign.setPassword1.length);
        this.$message({
          message: "密码长度不合规范",
          type: "warning",
        });
      } else if (
        this.formLabelAlign.setPassword1 != this.formLabelAlign.setPassword2
      ) {
        this.$message({
          message: "两次密码不一致",
          type: "warning",
        });
      } else {
        this.$http
          .post(
            `/admin/updateUserPassword?password=${this.formLabelAlign.setPassword1}`
          )
          .then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: "修改密码成功,请重新输入密码登录",
                type: "success",
              });
              this.dialogVisible = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
            this.isDisable = false;
          });
      }
    },
    // 学生登录
    login() {
      this.isDisable = true;
      this.$http
        .post("/studentInfo/login", {
          username: this.userInfo.studentId,
          password: this.userInfo.password,
        })
        .then((response) => {
          let { code } = response.data;
          if (code == 1) {
            let studentAllInfo = response.data.data;
            window.sessionStorage.setItem(
              "info-student",
              JSON.stringify(studentAllInfo)
            );

            if (this.userInfo.password == 123456) {
              this.dialogVisible = true;
              return;
            }
            if (studentAllInfo.isConfirmGraduationWarning == "0") {
              this.alert();
            }
            this.$router.push("/home/mycourses");
            this.$message({
              message: "登录成功",
              type: "success",
            });
          } else if (code == 0) {
            this.$message.error(response.data.msg);
          }
          this.isDisable = false;
        })
        .catch((error) => {
          this.$message.error("登录失败!检查一下网络吧");
          this.isDisable = false;
        });
    },
    // 通知
    async alert() {
      const permission = await Notification.requestPermission();

      if (permission == "granted") {
        const notification = new Notification("贵州大学学分预警系统", {
          body: "有新的成绩需要查看哦！",
          icon: "https://www.gzu.edu.cn/_upload/tpl/00/02/2/template2/images/logo.png",
        });
        notification.addEventListener("click", () => {
          this.$router.push("/home/creditwarning/warningrecord");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// ::-webkit-scrollbar {
//   width: 0 !important;
// }

// // .slide-left-enter-active,
// // .slide-left-leave-active {
// //   height: 100%;
// //   will-change: transform;
// //   transition: all 500ms;
// //   position: absolute;
// //   backface-visibility: hidden;
// // }

// // .slide-left-enter {
// //   opacity: 0;
// //   transform: translate3d(100%, 0, 0);
// // }
// // .slide-left-leave-active {
// //   opacity: 0;
// //   transform: translate3d(-100%, 0, 0);
// // }

// // .routerView {
// //   margin-top: 70px;
// // }

// @media only screen and (min-width: 1000px) {
//   .bg {
//     position: fixed;
//     left: 0px;
//     top: 0px;
//     z-index: -1;
//     width: 100vw !important;
//     height: 100vh !important;
//   }

//   // 表单样式
//   .card {
//     width: 400px;
//     height: 300px;
//     border-radius: 15px;
//     transform: translateY(50%);
//     background: #f4f6fb;
//     border: 1px solid white;
//     box-shadow: 10px 10px 64px 0px rgba(180, 180, 207, 0.75);
//     -webkit-box-shadow: 10px 10px 64px 0px rgba(186, 186, 202, 0.75);
//     -moz-box-shadow: 10px 10px 64px 0px rgba(208, 208, 231, 0.75);
//   }

//   .form {
//     padding: 25px;
//     margin: auto;
//   }

//   .card_header {
//     display: flex;
//     align-items: center;
//   }

//   .form_heading {
//     font-size: 21px;
//     color: #7878bd;
//   }

//   .field {
//     padding-bottom: 10px;
//   }

//   .input {
//     border-radius: 5px;
//     background-color: #e9e9f7;
//     padding: 5px;
//     width: 100%;
//     color: #7a7ab3;
//     border: 1px solid #dadaf7;
//   }

//   .input:focus-visible {
//     outline: 1px solid #aeaed6;
//   }

//   .input::placeholder {
//     color: #bcbcdf;
//   }

//   label {
//     color: #b2bac8;
//     font-size: 14px;
//     display: block;
//     padding-bottom: 4px;
//   }

//   button {
//     background-color: #7878bd;
//     margin-top: 10px;
//     font-size: 14px;
//     padding: 7px 12px;
//     height: auto;
//     font-weight: 500;
//     color: white;
//     border: none;
//     border-radius: 3px;
//   }

//   button:hover {
//     background-color: #5f5f9c;
//   }

//   .contact {
//     color: #7878bd;
//     font-size: 12px;
//   }
// }

// @media only screen and (max-width: 999px) {
//   .bg {
//     position: fixed;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     z-index: -1;
//     // width: 100vw !important;
//     height: 100% !important;
//   }

//   // 表单样式
//   .card {
//     width: 350px;
//     height: 300px;
//     border-radius: 15px;
//     transform: translateY(50%);
//     background: #f4f6fb;
//     border: 1px solid white;
//     box-shadow: 10px 10px 64px 0px rgba(180, 180, 207, 0.75);
//     -webkit-box-shadow: 10px 10px 64px 0px rgba(186, 186, 202, 0.75);
//     -moz-box-shadow: 10px 10px 64px 0px rgba(208, 208, 231, 0.75);
//   }

//   .form {
//     padding: 25px;
//     margin: auto;
//   }

//   .card_header {
//     display: flex;
//     align-items: center;
//   }

//   .form_heading {
//     font-size: 21px;
//     color: #7878bd;
//   }

//   .field {
//     padding-bottom: 10px;
//   }

//   .input {
//     border-radius: 5px;
//     background-color: #e9e9f7;
//     padding: 5px;
//     width: 100%;
//     color: #7a7ab3;
//     border: 1px solid #dadaf7;
//   }

//   .input:focus-visible {
//     outline: 1px solid #aeaed6;
//   }

//   .input::placeholder {
//     color: #bcbcdf;
//   }

//   label {
//     color: #b2bac8;
//     font-size: 14px;
//     display: block;
//     padding-bottom: 4px;
//   }

//   button {
//     background-color: #7878bd;
//     margin-top: 10px;
//     font-size: 14px;
//     padding: 7px 12px;
//     height: auto;
//     font-weight: 500;
//     color: white;
//     border: none;
//     border-radius: 3px;
//   }

//   button:hover {
//     background-color: #5f5f9c;
//   }

//   .contact {
//     color: #7878bd;
//     font-size: 12px;
//   }
// }
</style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

.wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    to left top,
    #d16ba5,
    #c777b9,
    #ba83ca,
    #aa8fd8,
    #9a9ae1,
    #8aa7ec,
    #79b3f4,
    #69bff8,
    #52cffe,
    #41dfff,
    #46eefa,
    #5ffbf1
  );
}

.form {
  width: 900px;
  height: 560px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
}

.contact {
  color: #7878bd;
  font-size: 12px;
}

.left {
  width: 500px;
  height: 560px;
}

.left video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  width: 400px;
  height: 560px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-con {
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

h1 {
  font-size: 26px;
  color: #70b4e3;
  font-weight: 400;
  padding-bottom: 10px;
}

h3 {
  font-size: 12px;
  font-weight: 400;
  color: #70b4e3;
  padding: 20px 0;
}

.text {
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #70b4e3;
  color: #366ae6;
  background-color: rgba(0, 0, 0, 0);
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 50px;
  background-image: linear-gradient(120deg, #76daec 0%, #c5a8de 100%);
}

.btn:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
/*zhanwei*/
</style>
