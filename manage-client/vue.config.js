const { defineConfig } = require('@vue/cli-service')
// const data = require('./public/config.json');
module.exports = defineConfig({
  transpileDependencies: true,

  //关闭语法检查
  lintOnSave: false,

  productionSourceMap: false,

  devServer: {
    // port: 3000,

    proxy: {
      "/api": {
        target: "http://localhost:8086",
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
