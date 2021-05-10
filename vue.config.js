const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'docs',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: config => {
    config.entry.app = './examples/main.js'
    config.performance = {
      hints: false
    }
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('@', resolve('src'))
    config.output
      .set('libraryExport', 'default')
      .set('library', 'shscBusinessUI')
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 100000 }))
  },
  devServer: {
    open: true
  }
}
