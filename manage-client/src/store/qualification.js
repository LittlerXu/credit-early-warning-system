import {
  reqQualificationFailure,
  reqQualificationPassed,
} from "@/api";

export default {
  namespaced: true, //开启命名空间
  state: {
    //未达到毕业资格学生列表
    failureStudentList: [],
    //已达到毕业资格学生列表
    passedStudentList: [],
    // 总页数
    totalPage:0
  },
  mutations: {
    GETQUALIFICATIONFAILURE(state, failureStudentList) {
      state.failureStudentList = failureStudentList.list;
      state.totalPage = failureStudentList.total
    },
    GETQUALIFICATIONPASSED(state, passedStudentList) {
      state.passedStudentList = passedStudentList.list;
      state.totalPage = passedStudentList.total
    },
  },
  actions: {
    async getQualificationFailure({ commit }, para) {
      let result = (await reqQualificationFailure(para));
      commit("GETQUALIFICATIONFAILURE", result.data);
      return result.code;
    },
    async getQualificationPassed({ commit }, para) {
      let result = (await reqQualificationPassed(para));
      commit("GETQUALIFICATIONPASSED", result.data);
      return result.code;
    },
  },
  getters: {},
};
