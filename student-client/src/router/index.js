import Vue from "vue";
//1.导⼊
import Router from "vue-router";

//2.模块化机制 使⽤Router
Vue.use(Router);
//3.创建路由器对象
const router = new Router({
  //mode: 'history', //history模式 干净的网页地址 没有#/之类的符号存在
  // mode: 'history', //history
  routes: [
    {
      name: "home",
      path: "/home",
      component: () => import("@/views/Home/Home.vue"),
      meta: { isNeedToken: true },
      children: [
        {
          name: "myCourses",
          path: "mycourses",
          component: () => import("@/views/MyCourses/MyCourses.vue"),
          meta: { isNeedToken: true },
        },
        {
          name: "allcourses",
          path: "allcourses",
          component: () => import("@/views/TrainPlan/TrainPlan.vue"),
          meta: { isNeedToken: true },
        },
        {
          name: "detail",
          path: "detail",
          component: () => import("@/views/Detail/Detail.vue"),
          meta: { isNeedToken: true },
        }, {
          name: "warningRecord",
          path: "creditwarning/warningrecord",
          component: () => import("@/views/CreditWarning/WarningRecord/WarningRecord.vue"),
          meta: { isNeedToken: true },
        }, {
          name: "WarningDetail",
          path: "creditwarning/warningrecord/warningdetail",
          component: () => import("@/views/CreditWarning/WarningRecord/WarningDetail/WarningDetail.vue"),
          meta: { isNeedToken: true },
        }
      ],
    },
    {
      name: "myEcharts",
      path: "/myEcharts/index.html",
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/Login/Login.vue"),
    },
    {
      path: "*",
      redirect: () => {
        // 根据条件返回不同的路由地址
        if (!window.sessionStorage.getItem("info-student")) {
          return "/login";
        } else {
          return "/home";
        }
      },
    },
  ],
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  },
});

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
router.beforeEach((to, from, next) => {
  //如果路由需要跳转
  let info = window.sessionStorage.getItem("info-student");
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
