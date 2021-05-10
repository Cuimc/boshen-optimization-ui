// import 'babel-polyfill'
import Vue from 'vue'
import entry from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'


// 全量引入业务组件库
import businessUi from '../src/index'
import '../styles/index.less'

// 本项目语言
import enLocal from '../lib/locale/lang/en'
import zhLocal from '../lib/locale/lang/zh-cn'

// 代码高亮
import Highlight from './assets/js/highlight'
import './assets/css/base.less'

import ShCode from './components/Code.vue'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'


Vue.use(Highlight)
Vue.use(VueI18n)

Vue.use(ViewUI)

Vue.use(businessUi)

Vue.component('ShCode', ShCode)
// 使用业务组件库
// Vue.use(SearchHeader)

// eslint-disable-next-line new-cap

const messages = {
  en: Object.assign(enLocal),
  zh: Object.assign(zhLocal)
}
const i18n = new VueI18n({
  locale: 'zh', // set locale
  messages // set locale messages
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  render: h => h(entry)
}).$mount('#app')
