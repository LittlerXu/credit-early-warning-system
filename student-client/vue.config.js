const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath:'./',
  // 指定端口运行
  devServer: {
    // port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8086",
        pathRewrite: { "^/api": "" },
      },
    },
  },
})
