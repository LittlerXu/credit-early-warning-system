<template>
  <div class="Histogram" id="Histogram"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Histogram",
  mounted() {
    this.initEcharts();
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
  },
};
</script>

<style lang="scss" scoped>
.Histogram {
  width:100%;
  height: 300px;
  // background-image: url("../../../bg/Histogram.png");
  // background-size: 100% 100%;
}
</style>
