const gulp = require('gulp')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const clean = require('gulp-clean')
const less = require('gulp-less')
const cleanCSS = require('gulp-clean-css')
const prefixer = require('gulp-autoprefixer')

const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 放置带有对应less文件的组件
const components = [
  'search-header',
  'virtual-wrap',
  'virtual-table',
  'business-tree'
]

gulp.task('build_components', () => {
  return new Promise((resolve, reject) => {
    const entryArr = {}
    components.forEach(name => {
      entryArr[name] = `./src/components/${name}/index.js`
    })
    webpack({
      mode: 'production',
      entry: entryArr,
      output: {
        path: path.resolve(process.cwd(), './lib'),
        filename: './[name]/index.js',
        chunkFilename: '[id].js',
        libraryTarget: 'umd'
      },
      resolve: {
        extensions: ['.js', '.vue'],
        alias: {},
        modules: ['node_modules']
      },
      performance: {
        hints: false
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
          {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
          },
          {
            test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
            loader: 'url-loader',
            options: {
              limit: 100000
            }
          }
        ]
      },
      plugins: [
        new VueLoaderPlugin()
      ]
    }, () => resolve())
  })
})

gulp.task('build_lang', () => {
  return new Promise((resolve, reject) => {
    const lang = [
      'en',
      'zh-cn'
    ]
    const langArr = {}
    lang.forEach(name => {
      langArr[name] = `./src/locale/lang/${name}.js`
    })
    webpack({
      mode: 'production',
      entry: langArr,
      output: {
        path: path.resolve(process.cwd(), './lib/locale/lang'),
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'umd'
      },
      resolve: {
        extensions: ['.js'],
        alias: {},
        modules: ['node_modules']
      },
      performance: {
        hints: false
      },
      module: {
        rules: [
          {
            test: /\.(jsx?|babel|es6)$/,
            include: process.cwd(),
            loader: 'babel-loader'
          }
        ]
      }
    }, () => resolve())
  })
})

gulp.task('copy_assets', () => {
  return Promise.all([
    gulp.src('styles/fonts/**/*')
      .pipe(gulp.dest('lib/font/fonts')),
    gulp.src('types/**/*.d.ts')
      .pipe(gulp.dest('lib'))
  ])
})

gulp.task('lib_rename', () => {
  return Promise.all([
    gulp.src('lib/index.umd.js')
      .pipe(rename({
        basename: 'index',
        extname: '.js'
      }))
      .pipe(gulp.dest('lib')),
    gulp.src('lib/index.umd.min.js')
      .pipe(rename({
        basename: 'index',
        suffix: '.min',
        extname: '.js'
      }))
      .pipe(gulp.dest('lib'))
  ])
})

gulp.task('build_style', () => {
  // font仅导出资源 不导出组件
  components.push('font')
  return Promise.all(components.map(name => {
    Promise.all([
      gulp.src('./styles/index.js')
        .pipe(gulp.dest(`lib/${name}/style`)),
      gulp.src(`./styles/components/${name}.less`)
        // 为了保证不会打包重复css，从而替换语法
        .pipe(replace(/(\/\*\*custom\*\*\/)/, `@import (reference) '../custom.less';\n`))
        .pipe(less())
        .pipe(prefixer({
          borwsers: ['last 1 version', '> 1%', 'not ie <= 8'],
          cascade: true,
          remove: true
        }))
        .pipe(cleanCSS())
        .pipe(rename({
          basename: 'style',
          extname: '.css'
        }))
        .pipe(gulp.dest(`lib/${name}/style`))
    ])
  }))
})

gulp.task('build_clean', () => {
  return gulp.src([
    'lib/demo.html'
  ])
    .pipe(clean())
})

gulp.task('build_reset', gulp.parallel('copy_assets', 'lib_rename', 'build_clean'))

gulp.task('build', gulp.series('build_components', 'build_lang', 'build_style', 'build_reset'))
