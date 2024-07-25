<template>
  <!-- <div>
    <img class="bg" src="./images/login-Bg.jpg" />

    <form class="form card">
      <div class="card_header">
        <img
          src="./images/logo.png"
          alt=""
          style="width: 40px; height: 40px; margin-right: 10px"
        />
        <h1 class="form_heading">贵州大学学分预警系统</h1>
       
      </div>
      <div class="field">
        <label for="username">用户名</label>
        <input
          id="username"
          class="input"
          type="text"
          placeholder="请输入用户名"
          v-model="userInfo.username"
        />
      </div>
      <div class="field">
        <label for="password">密码</label>
        <input
          id="password"
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
      </div>
    </form>
  </div> -->

  <div class="wrap">
    <div class="form">
      <div class="left">
        <video src="video/video.mp4" muted loop autoplay></video>
      </div>
      <div class="right">
        <div class="right-con">
          <h1>学分预警系统 管理端</h1>
          <h3>账号</h3>
          <input class="text" type="text" v-model="userInfo.username" @keyup.enter="login"/>
          <h3>密码</h3>
          <input class="text" type="password" v-model="userInfo.password" @keyup.enter="login"/>
          <input class="btn" type="submit" value="登录" @click="login" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqUserLogin } from "@/api";
export default {
  name: "AdminLogin",
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      isDisable: false,
    };
  },
  methods: {
    // 管理员登录
    async login() {
      this.isDisable = true;
      let result = await reqUserLogin(this.userInfo);
      if (result.code == 1) {
        window.sessionStorage.setItem(
          "info-admin",
          JSON.stringify(result.data)
        );
        this.$message({
          message: "登录成功",
          type: "success",
        });
        this.isDisable = false;
        this.$router.push("/manager");
      } else if (result.code == 0) {
        this.$message({
          message: result.msg,
          type: "error",
        });
        this.isDisable = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    overflow: hidden;
}

.wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to left top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
}

.form {
    width: 900px;
    height: 560px;
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
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
    background: rgba(255,255,255,0.9);
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






// ::-webkit-scrollbar {
//   width: 0 !important;
// }

// .slide-left-enter-active,
// .slide-left-leave-active {
//   height: 100%;
//   will-change: transform;
//   transition: all 500ms;
//   position: absolute;
//   backface-visibility: hidden;
// }

// .slide-left-enter {
//   opacity: 0;
//   transform: translate3d(100%, 0, 0);
// }

// .slide-left-leave-active {
//   opacity: 0;
//   transform: translate3d(-100%, 0, 0);
// }

// .routerView {
//   margin-top: 70px;
// }

// .bg {
//   position: fixed;
//   left: 0px;
//   top: 0px;
//   z-index: -1;
//   width: 100vw !important;
//   height: 100vh !important;
// }

// // 表单样式
// .card {
//   width: 400px;
//   height: 300px;
//   border-radius: 15px;
//   transform: translateY(50%);
//   background: #f4f6fb;
//   border: 1px solid white;
//   box-shadow: 10px 10px 64px 0px rgba(180, 180, 207, 0.75);
//   -webkit-box-shadow: 10px 10px 64px 0px rgba(186, 186, 202, 0.75);
//   -moz-box-shadow: 10px 10px 64px 0px rgba(208, 208, 231, 0.75);
// }

// .form {
//   padding: 25px;
//   margin: auto;
// }

// .card_header {
//   display: flex;
//   align-items: center;
// }

// .form_heading {
//   font-size: 21px;
//   color: #7878bd;
// }

// .field {
//   padding-bottom: 10px;
// }

// .input {
//   border-radius: 5px;
//   background-color: #e9e9f7;
//   padding: 5px;
//   width: 100%;
//   color: #7a7ab3;
//   border: 1px solid #dadaf7;
// }

// .input:focus-visible {
//   outline: 1px solid #aeaed6;
// }

// .input::placeholder {
//   color: #bcbcdf;
// }

// label {
//   color: #b2bac8;
//   font-size: 14px;
//   display: block;
//   padding-bottom: 4px;
// }

// button {
//   background-color: #7878bd;
//   translate: 155px;
//   margin-top: 40px;
//   font-size: 14px;
//   padding: 7px 12px;
//   height: auto;
//   font-weight: 500;
//   color: white;
//   border: none;
//   border-radius: 3px;
// }

// button:hover {
//   background-color: #5f5f9c;
// }



</style>


