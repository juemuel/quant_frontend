const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://192.168.8.128:8031', // 目标服务器地址
        changeOrigin: true, // 改变请求源
        pathRewrite: { '^/api': '' } // 重写路径
      }
    }
  }
})
