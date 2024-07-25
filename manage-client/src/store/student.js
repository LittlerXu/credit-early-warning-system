import { reqStudentList, reqCascaderOptions } from "@/api";

export default {
  namespaced: true, //开启命名空间
  state: {
    studentList: [],
    cascaderOptions: [],
  },
  mutations: {
    GETSTUDENTLIST(state, studentList) {
      state.studentList = studentList;
    },
    GETCASCADEROPTIONS(state, cascaderOptions) {
      state.cascaderOptions = cascaderOptions;
    },
  },
  actions: {
    async getStudentList({ commit }, params = {}) {
      let result = await reqStudentList(params);
      if (result.code == 1) {
        commit("GETSTUDENTLIST", result.data);
        return result.code;
      }
    },
    async getCascaderOptions({ commit }) {
      let result = await reqCascaderOptions();
      if (result.code == 1) {
        commit("GETCASCADEROPTIONS", result.data);
      }
    },
  },
  getters: {

  },
};
