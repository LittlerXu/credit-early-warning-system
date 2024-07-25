import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import App from "./App.vue";
import { addListener, launch } from 'devtools-detector';


// 1. add listener
// addListener(
//   isOpen => {
//     if (isOpen) { 
//       window.location.replace('https://www.gzu.edu.cn/')
//     }
//   }
// );
// // 2. launch detect
// launch();




Vue.config.productionTip = false;

// 使用element-ui
Vue.use(ElementUI);

// 引入 axios
//#region
import axios from "axios";
// 挂载一个自定义属性$http
Vue.prototype.$http = axios;
// 全局配置axios请求根路径(axios.默认配置.请求根路径)
// axios.defaults.baseURL = "http://210.40.16.126:8090";
axios.defaults.baseURL = "/api";
// 请求拦截器
axios.interceptors.request.use((config) => {
  //在请求头中添加token
  if (JSON.parse(window.sessionStorage.getItem("info-student"))) {
    config.headers.token = JSON.parse(
      sessionStorage.getItem("info-student")
    ).token;
  }
  return config;
});
//#endregion

new Vue({
  // 4.挂载根实例
  router,
  render: (h) => h(App),
}).$mount("#app");



// 用户跳转到其他页面时通知
// document.addEventListener('visibilitychange',() => {
//   if (document.visibilityState === 'hidden') {
//     new Notification("成绩看完了嘛?ヾ(｡｀Д´｡)ﾉ彡",{
//       icon:'https://47.109.54.120:14264/down/IiQ5E5FtHWjk.jpg'
//     })
//   }
// })