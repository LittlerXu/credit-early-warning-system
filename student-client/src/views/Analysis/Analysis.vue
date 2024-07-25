<template>
  <div class="analysis">
    <el-row>
      <el-col :span="7">
        <Histogram></Histogram>
      </el-col>
      <el-col :span="10">
        <div id="Piechart" style="width: 100%; height: 400px"></div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Histogram from "@/views/Analysis/Histogram/Histogram.vue";
// import china from "@/assets/china.json";
export default {
  name: "Analysis",
  components: {
    Histogram,
  },
  data() {
    return {
      // 散点数据
      points: [
        {
          name: "快手",
          value: [116.3, 40.05],
          itemStyle: { color: "#00eeff" },
        },
      ],
      // 线条数据
      linesData: [
        {
          coords: [
            [106.67, 26.44],
            [116.3, 40.05],
          ],
        }, //快手
      ],
      // 飞机svg
      planePath:
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z",
    };
  },
  mounted() {
    // this.initEcharts();
  },
  methods: {
    initEcharts() {
      var chartDom = document.getElementById("Histogram");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
          },
        ],
      };

      option && myChart.setOption(option);
    },
    initEcharts1() {
      var EarthMap = echarts.init(document.querySelector("#earthMap"));
      // 配置
      var option = {
        backgroundColor: "#0e2152", //背景颜色
        // 地图配置
        geo: {
          map: "china",
          // 地图上的文本标签
          label: {
            // 通常状态下的样式
            normal: {
              show: false,
              textStyle: {
                color: "#fff",
              },
            },
            // 鼠标放上去时的样式
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: "#5089EC",
              borderWidth: 1,
              // 地图区域的颜色
              areaColor: {
                type: "radial", //径向渐变
                x: 0.5, //圆心
                y: 0.5,
                r: 0.8, //半径
                colorStops: [
                  {
                    // 0%处的颜色
                    offset: 0,
                    color: "rgba(0,102,154,0)",
                  },
                  {
                    // 100%处的颜色
                    offset: 1,
                    color: "rgba(0,102,154,0.4)",
                  },
                ],
              },
            },
            emphasis: {
              areaColor: "#2386AD",
              borderWidth: 0,
            },
          },
        },
        // 散点系列数据
        series: [
          {
            // 带有涟漪特效动画的散点气泡图
            type: "effectScatter",
            // 该系列使用的坐标系：地理坐标系
            coordinateSystem: "geo",
            // 特效类型（涟漪）
            effectType: "ripple",
            // 配置何时显示特效。
            showEffectOn: "render",
            // 特效配置
            rippleEffect: {
              period: 10, //动画周期
              scale: 4, //波纹放大比例
              // 波纹的绘制方式
              brushType: "fill",
            },
            zlevel: 1, //所有图形的zlevel值
            data: this.points,
          },
          // 线条系列数据
          {
            type: "lines",
            zlevel: 2,
            symbol: ["none", "arrow"], //标记图形：箭头
            symbolSize: 10, //标记大小
            effect: {
              show: true,
              period: 1,
              trailLength: 0,
              symbol: this.planePath,
              symbolSize: 20,
            },
            lineStyle: {
              normal: {
                color: "#93EBF8",
                width: 2.5,
                opacity: 0.6,
                curveness: 0.2, //尾迹线条曲直度
              },
            },
            data: this.linesData,
          },
        ],
      };
      // 地图注册，第一个参数的名字必须与option.geo.map一致
      echarts.registerMap("china", china);
      EarthMap.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.analysis {
  width: 100%;
  height: 100vh;
  // background-color: #0e2152;
  border-radius: 6px;
  z-index: 999;
  background-color: #000816;
  background-image: url("../../../public/bg/bigBg.png");
  background-size: 100% 100%;
}
</style>
