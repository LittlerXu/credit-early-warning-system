import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element.js'
Vue.config.productionTip = false

// 全局变量
Vue.prototype.$globalVar = {
  // excel导入导出接口
  // EXCEL_BASEURL: "http://210.40.16.126:8090"
  EXCEL_BASEURL: "/api"
};




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
  if (JSON.parse(window.sessionStorage.getItem("info-admin"))) {
    config.headers.token = JSON.parse(
      sessionStorage.getItem("info-admin")
    ).token;
  }
  return config;
});
//#endregion

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
