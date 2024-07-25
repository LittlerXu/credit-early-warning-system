let baseUrl = 'http://210.40.16.126:8090';

// 柱状图1模块 模块分析
(function () {
  //请求参数
  let adminInfo = JSON.parse(window.sessionStorage.getItem("info-admin"));
  let { token } = adminInfo;
  let Data = [
    ["level", "轻", "中", "重"],
    ["大一", 12, 13, 12],
    ["大二", 12, 34, 23],
    ["大三", 12, 23, 21],
    ["大四", 21, 16, 18],
  ];
  $.ajax({
    //请求方式
    type: "post",
    headers: {
      token: token,
    },
    //请求的媒体类型
    contentType: "application/json;charset=UTF-8",
    //请求地址
    url: baseUrl + `/admin/adminHistogram`,
    //数据，json字符串
    data: {},
    //请求成功
    success: function (result) {
      console.log(result);
      // 数据处理
      // result.data.forEach((item, index) => {
      //   Data[index + 1].push(parseInt(item.mildLevelCount));
      //   Data[index + 1].push(parseInt(item.mediumLevelCount));
      //   Data[index + 1].push(parseInt(item.severeLevelCount));
      // });
      // 去重

      // console.log(Data);

      // console.log(xData);
      // console.log(yData);

      // 实例化对象
      var myChart = echarts.init(document.querySelector(".bar .chart"));
      // 指定配置和数据
      var option = {
        color: ["#2f89cf", "#91CC75", "#FAC858"],
        legend: {},
        tooltip: {},
        dataset: {
          source: Data,
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: { color: "white" },
          },
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: { color: "white" },
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            backgroundStyle: {
              color: "#5470C6",
            },
          },
          {
            type: "bar",
            itemStyle: {
              show: true,
              lineStyle: { color: "white" },
            },
          },
          { type: "bar" },
        ],
      };

      // 把配置给实例对象
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });

      // 数据变化
      // var dataAll = [
      //   { year: "2019", data: [200, 300, 300, 900, 1500, 1200, 600] },
      //   { year: "2020", data: [300, 400, 350, 800, 1800, 1400, 700] }
      // ];

      // $(".bar h2 ").on("click", "a", function () {
      //   option.series[0].data = dataAll[$(this).index()].data;
      //   myChart.setOption(option);
      // });
    },
    //请求失败，包含具体的错误信息
    error: function (e) {
      console.log(e.status);
      console.log(e.responseText);
    },
  });
})();

// 折线图定制
(function () {
  //请求参数
  let studentInfo = JSON.parse(window.sessionStorage.getItem("info-admin"));
  let { token } = studentInfo;
  let xData = ['软件工程', '信息安全', '人工智能'];
  let yData1 = ['12', '234', '62'];
  let yData2 = ['123', '21', '86'];
  $.ajax({
    //请求方式
    type: "POST",
    headers: {
      token: token,
    },
    //请求的媒体类型
    contentType: "application/json;charset=UTF-8",
    //请求地址
    url: baseUrl + `/admin/adminLineChart`,
    //数据，json字符串
    data: {},
    //请求成功
    success: function (result) {
      console.log(result);
      // 数据处理
      result.data.forEach((item, index) => {
        xData.push(item.major);
        yData1.push(item.qualificationFailure);
        yData2.push(item.qualificationPassed);
      });

      // console.log(xData);
      // console.log(yData1);
      // console.log(yData2);

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.querySelector(".line .chart"));

      // 2. 指定配置和数据
      var option = {
        color: ["#00f2f1", "#ed3f35"],
        tooltip: {
          // 通过坐标轴来触发
          trigger: "axis",
        },
        legend: {
          // 距离容器10%
          right: "10%",
          // 修饰图例文字的颜色
          textStyle: {
            color: "#4c9bfd",
          },
          // 如果series 里面设置了name，此时图例组件的data可以省略
          // data: ["邮件营销", "联盟广告"]
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          show: true,
          borderColor: "#012f4a",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
          // 去除刻度
          axisTick: {
            show: false,
          },
          // 修饰刻度标签的颜色
          axisLabel: {
            interval: 0,//使x轴横坐标全部显示
            rotate: 30,//x轴文字倾斜角度
            color: "rgba(255,255,255,.7)",
          },
          // 去除x坐标轴的颜色
          axisLine: {
            show: true,
            lineStyle: { color: "white" },
          },
        },
        yAxis: {
          type: "value",
          // 去除刻度
          axisTick: {
            show: false,
          },
          // 修饰刻度标签的颜色
          axisLabel: {
            color: "rgba(255,255,255,.7)",
          },
          // 修改y轴分割线的颜色
          splitLine: {
            lineStyle: {
              color: "#012f4a",
            },
          },
        },
        series: [
          {
            name: "不满足人数",
            type: "line",
            stack: "总量",
            // 是否让线条圆滑显示
            smooth: true,
            data: yData1,
          },
          {
            name: "满足人数",
            type: "line",
            stack: "总量",
            smooth: true,
            data: yData2,
          },
        ],
      };
      // 3. 把配置和数据给实例对象
      myChart.setOption(option);

      // 重新把配置好的新数据给实例对象
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    //请求失败，包含具体的错误信息
    error: function (e) {
      console.log(e.status);
      console.log(e.responseText);
    },
  });
})();


// 学习进度柱状图模块
(function () {
  //请求参数
  let studentInfo = JSON.parse(window.sessionStorage.getItem("info-admin"));
  let { token } = studentInfo;
  let xData = ["人工智能", '软件工程', '信息安全'];
  let yData = [213, 234, 453];
  let schedule = [50, 54, 89];
  $.ajax({
    //请求方式
    type: "POST",
    headers: {
      token: token,
    },
    //请求的媒体类型
    contentType: "application/json;charset=UTF-8",
    //请求地址
    url: baseUrl + `/admin/adminTransverseLine`,
    //数据，json字符串
    data: {},
    //请求成功
    success: function (result) {
      console.log(`ewewe`);
      console.log(result);
      // 数据处理
      result.data.forEach((item) => {
        xData.push(item.major);
        yData.push(237);
        let o =
          80;
        schedule.push(o);
      });

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.querySelector(".bar1 .chart"));

      var data = schedule;
      var titlename = xData;
      var valdata = yData;
      var myColor = [
        "#1089E7",
        "#F57474",
        "#56D0E3",
        "#F8B448",
        "#8B78F6",
        "#282C34",
      ];
      option = {
        //图标位置
        grid: {
          top: "10%",
          left: "22%",
          bottom: "10%",
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            show: true,
            data: titlename,
            inverse: true,
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#fff",

              rich: {
                lg: {
                  backgroundColor: "#339911",
                  color: "#fff",
                  borderRadius: 15,
                  // padding: 5,
                  align: "center",
                  width: 15,
                  height: 15,
                },
              },
            },
          },
          {
            show: true,
            inverse: true,
            data: valdata,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff",
              },
            },
          },
        ],
        series: [
          {
            name: "条",
            type: "bar",
            yAxisIndex: 0,
            data: data,
            barCategoryGap: 50,
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: function (params) {
                  var num = myColor.length;
                  return myColor[params.dataIndex % num];
                },
              },
            },
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{c}%",
              },
            },
          },
          {
            name: "框",
            type: "bar",
            yAxisIndex: 1,
            barCategoryGap: 50,
            data: [100, 100, 100, 100],
            barWidth: 15,
            itemStyle: {
              normal: {
                color: "none",
                borderColor: "#00c1de",
                borderWidth: 3,
                barBorderRadius: 15,
              },
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    //请求失败，包含具体的错误信息
    error: function (e) {
      console.log(e.status);
      console.log(e.responseText);
    },
  });
})();




// 顶部数字
// (function () {
//   //请求参数
//   let studentInfo = JSON.parse(window.sessionStorage.getItem("info-student"));
//   let { token, studentId } = studentInfo;
//   let Data = [];
//   $.ajax({
//     //请求方式
//     type: "POST",
//     headers: {
//       token: token,
//     },
//     //请求的媒体类型
//     contentType: "application/json;charset=UTF-8",
//     //请求地址
//     url: `http://localhost:8090/user/allcourse?studentId=${studentId}`,
//     //数据，json字符串
//     data: {},
//     //请求成功
//     success: function (result) {
//       console.log(result);
//       let allstudentScore = 0;
//       let allminScore = 0;
//       result.data.forEach((item) => {
//         allstudentScore += parseFloat(item.studentScore);
//         allminScore += parseFloat(item.minScore);
//       });
//       document.getElementById("studentScore").innerText = allstudentScore;
//       document.getElementById("minScore").innerText = allminScore;
//     },
//     //请求失败，包含具体的错误信息
//     error: function (e) {
//       console.log(e.status);
//       console.log(e.responseText);
//     },
//   });
// })();
