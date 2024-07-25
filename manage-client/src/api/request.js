import axios from "axios";
//引入进度条
import nProgress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";


//新建一个Axios实例对象
const requests = axios.create({
  // baseURL: "http://210.40.16.126:8090",
  baseURL: "/api",
  timeout: 300000,
});

//给requests添加请求拦截器
requests.interceptors.request.use((config) => {
  
  //在请求头中添加token
  if (JSON.parse(window.sessionStorage.getItem("info-admin"))) {
    config.headers.token = JSON.parse(
      sessionStorage.getItem("info-admin")
    ).token;
  }
  //进度条开始动
  nProgress.start();
  //config: 配置对象,里面有一个属性很重要: headers请求头
  return config;
});

//给requests添加响应拦截器
requests.interceptors.response.use(
  (res) => {
    //进度条结束
    nProgress.done();
    //设置requests请求直接返回响应体,即数据
    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//对外暴露requests
export default requests;
