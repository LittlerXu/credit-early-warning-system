import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

//引入子仓库
import student from "./student";
import qualification from "./qualification";

export default new Vuex.Store({
  modules: {
    student,
    qualification,
  },
});
