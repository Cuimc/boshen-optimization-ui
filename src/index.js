import locale from './locale'
import SearchHeader from './components/search-header'
import VirtualWrap from './components/virtual-wrap'
import VirtualTable from './components/virtual-table'
import BusinessTree from './components/business-tree'

import './font'

const components = {
  SearchHeader,
  VirtualWrap,
  VirtualTable,
  BusinessTree
}
let _Vue = null

const install = function (Vue, opts = {}) {
  _Vue = Vue
  if (install.installed) return
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  Vue.prototype.$shui = {
    size: opts.size || ''
  }

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })
  // 绑定全局组件
  // Vue.prototype.$Notice = Notice
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const API = {
  version: '0.0.1',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  ...components
}

API.lang = (code) => {
  const langObject = window['shscBusinessUI'].langs[code]
  if (langObject && code === langObject.b.locale) locale.use(langObject)
  else console.log(`The ${code} language pack is not loaded.`)
}

export default API
