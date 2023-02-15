/* eslint-disable */
const path = require('path')
const PageEntry = require('./script/pages-entry')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isTest = process.env.NODE_ENV === 'test' ? true : false
const isProd = process.env.NODE_ENV === 'production' ? true : false

const pagesConfig = {
  chunkConfig: {
    // 'lottie-web': ['lite-home']
  },
  templateMap: {
    'index': {
      title: '标题',
      template: 'public/index.html',
    },
  }
}

module.exports = {
  // 开发的时候开启报错
  lintOnSave: true,
  pages: PageEntry.getEntry(pagesConfig),
  outputDir: './dist',
  assetsDir: 'assets',
  publicPath: isTest || isProd ? '/gamehub/' : undefined,
  productionSourceMap: false,
  // 需要在项目中进行编译的依赖
  transpileDependencies: [],

  // 配置开发服务
  devServer: {
    open: true,
    openPage: 'home.html',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve('src/assets/style/tool.less')],
    },
  },
  configureWebpack: (config) => {
    config.resolve = {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    }
    // 线上 和 测试环境
    // if (isProd || isTest) {
    //   config.externals = {
    //     vue: 'Vue',
    //     axios: 'axios',
    //   }
    // }

    // config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
  },
  chainWebpack: (config) => {
    const opt = config.optimization
    opt.splitChunks(
      Object.assign({}, opt.get('splitChunks'), {
        // （默认值3）入口点上的最大并行请求数
        maxInitialRequests: 10,
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      })
    )
  }
}
