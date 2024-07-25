import axios from "axios";

//新建一个Axios实例对象
const mockRequests = axios.create({
  baseURL: "/mock",
  timeout: 5000,
});

//给requests添加请求拦截器
mockRequests.interceptors.request.use((config) => {
  //config: 配置对象,里面有一个属性很重要: headers请求头
  return config;
});

//给requests添加响应拦截器
mockRequests.interceptors.response.use(
  (res) => {
    //设置requests请求直接返回响应体,即数据
    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//对外暴露requests
export default mockRequests;
