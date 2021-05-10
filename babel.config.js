module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // cli3 不能重复配置，不然会报错
    // 'transform-vue-jsx',
    // ['import', {
    //   libraryName: 'shsc-ui',
    //   style: true,
    //   customName: require('path').resolve(__dirname, './customName.js')
    // }]
  ]
}
