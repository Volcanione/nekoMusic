// const autoprefixer = require('autoprefixer')
// const pxtorem = require('postcss-pxtorem')

// module.exports = {
//   outputDir: 'docs',
//   publicPath: process.env.NODE_ENV === 'production' ? '/mymusic/' : '/',
//   css: {
//     loaderOptions: {
//       // postcss: {
//       //   plugins: {
//       //     autoprefixer: {
//       //       browsers: ['Android >= 4.0', 'iOS >= 7']
//       //     },
//       //     'postcss-pxtorem': {
//       //       rootValue: 37.5,
//       //       propList: ['*']
//       //     }
//       //   }
//       // }
//     }
//   }
// }

module.exports = {
  productionSourceMap: false
  //   devServer: {
  //     // 代理
  //     proxy: {
  //       // /api 表示webpack-dev-server代理的接口地址（以 /api 开头）
  //       '/api': {
  //         // 代理的目标服务器地址
  //         target: 'http://localhost:3000',
  //         // https请求需要该设置
  //         secure: false,
  //         // 必须设置该项
  //         changeOrigin: true,
  //         // 远程服务器的接口地址：http://m.beequick.cn/data/home
  //         // 本地访问的地址：/api/home
  //         // '/api/home' 路径重写为：'/home'
  //         pathRewrite: { '^/api': '' }
  //       }
  //     }
  //   }
}
