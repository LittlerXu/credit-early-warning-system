import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  //重定向
  {
    path: "*",
    redirect: () => {
      // 根据条件返回不同的路由地址
      if (!window.sessionStorage.getItem("info-admin")) {
        return "/login";
      } else {
        return "/manager/home";
      }
    },
  },
  {
    path: "/login",
    component: () => import("@/views/Login"),
    meta: { isNeedToken: false },
  },
  {
    path: "/manager",
    component: () => import("@/views/Manager"),
    meta: { isNeedToken: true },
    children: [
      //重定向
      {
        path: "/manager",
        redirect: "/manager/home",
        meta: { isNeedToken: true },
      },
      {
        path: "home",
        component: () => import("@/views/Manager/Home"),
        meta: { isNeedToken: true },
      },
      {
        path: "studentmanage",
        component: () => import("@/views/Manager/StudentManage"),
        meta: { isNeedToken: true },
        children: [],
      },
      {
        path: "courseselectionmanage",
        component: () => import("@/views/Manager/CourseSelectionManage"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningrecordlist",
        component: () =>
          import("@/views/Manager/CreditWarning/CreditWarningList"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningrecorddetail",
        component: () =>
          import("@/views/Manager/CreditWarning/CreditWarningDetail"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningrecordrecord",
        component: () =>
          import("@/views/Manager/CreditWarning/CreditWarningRecord"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningrecordempty",
        component: () =>
          import("@/views/Manager/CreditWarning/CreditWarningEmpty"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningremindlist",
        component: () =>
          import("@/views/Manager/CreditRemind/CreditRemindList"),
        meta: { isNeedToken: true },
      },
      {
        path: "warningremindrecord",
        component: () =>
          import("@/views/Manager/CreditRemind/CreditRemindRecord"),
        meta: { isNeedToken: true },
      },
      {
        path: "qualificationispassedlist",
        component: () =>
          import("@/views/Manager/Qualification/QualificationIsPassedList"),
        meta: { isNeedToken: true },
      },
      {
        path: "qualificationdetail",
        component: () =>
          import("@/views/Manager/Qualification/QualificationDetail"),
        meta: { isNeedToken: true },
      },
      {
        path: "qualificationrecord",
        component: () =>
          import("@/views/Manager/Qualification/QualificationRecord"),
        meta: { isNeedToken: true },
      },
      {
        path: "qualificationempty",
        component: () =>
          import("@/views/Manager/Qualification/QualificationEmpty"),
        meta: { isNeedToken: true },
      },
      {
        path: "check",
        component: () => import("@/views/Manager/Trainingplan/Check"),
        meta: { isNeedToken: true },
      },
      {
        path: "checkdetail",
        component: () =>
          import("@/views/Manager/Trainingplan/Check/CheckDetail"),
        meta: { isNeedToken: true },
      },
      {
        path: "modify",
        component: () => import("@/views/Manager/Trainingplan/Modify"),
        meta: { isNeedToken: true },
      },
      {
        path: "addbigcategories",
        component: () =>
          import("@/views/Manager/Trainingplan/Add/AddBigCategories"),
        meta: { isNeedToken: true },
      },
      {
        path: "assigncourses",
        component: () =>
          import("@/views/Manager/Trainingplan/Add/AssignCourses"),
        meta: { isNeedToken: true },
      },
      {
        path: "addcategory",
        component: () => import("@/views/Manager/Trainingplan/Add/Category"),
        meta: { isNeedToken: true },
      },
      {
        path: "preview",
        component: () => import("@/views/Manager/Trainingplan/Add/Preview"),
        meta: { isNeedToken: true },
      },
      {
        path: "studentcourse",
        component: () => import("@/views/MyCourses/MyCourses.vue"),
        meta: { isNeedToken: true },
      }, {
        path: "studentdetail",
        component: () => import("@/views/Detail/Detail.vue"),
        meta: { isNeedToken: true },
      },
      {
        path: "basiccourses",
        component: () => import("@/views/Manager/BasicCourses/BasicCourses.vue"),
        meta: { isNeedToken: true },
      },
      {
        path: "controlsrecords",
        component: () => import("@/views/Manager/ControlsRecords/ControlsRecords.vue"),
        meta: { isNeedToken: true },
      },
      {
        path: "controlsrecords/detail",
        component: () => import("@/views/Manager/ControlsRecords/Detail/Detail.vue"),
        meta: { isNeedToken: true },
      }, {
        path: "singleSemesterWarning",
        component: () => import("@/views/Manager/CreditWarning/SingleWarning.vue"),
        meta: { isNeedToken: true },
      }, {
        path: "warningdetail",
        component: () => import("@/views/WarningDetail/WarningDetail.vue"),
        meta: { isNeedToken: true },
      }, {
        path: "checkwarningdetail",
        component: () => import("@/views/Manager/CreditWarning/CheckDetail.vue"),
        meta: { isNeedToken: true },
      }
    ],
  },

];

const router = new VueRouter({
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  },
});

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
router.beforeEach((to, from, next) => {
  //如果路由需要跳转
  let info = window.sessionStorage.getItem("info-admin");
  // 判断是否需要进行token验证
  if (to.meta.isNeedToken) {
    //判断 如果本地有token的时候，可以进去
    if (info) {
      next(); //放行
    } else {
      alert("抱歉，您无权限查看！请登录后再继续！");
      router.push("/login");
    }
  } else {
    // 否则，放行
    next();
  }
});

export default router;
