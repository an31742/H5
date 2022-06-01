import Vue from 'vue'
import 'lib-flexible'
import './utils/lazy_use'
import App from './App.vue'
import mixins from '@/mixin'
import app from '@/mixin/app'
import router from '@/router'
import store from '@/store'
import FastClick from 'fastclick'
import VueQriously from 'vue-qriously'
import 'utils/permission'
import permission from '@/directive/index.js' // 权限判断指令
import '@/icons' // icon
import '@/style/weui.min.css'
import '@/style/common.scss'
import animated from 'animate.css'
import { isApp } from '@/utils/index'
import Table from 'ant-design-vue/lib/table'
import 'ant-design-vue/lib/table/style/index.css'
import VueClipboard from 'vue-clipboard2'
import fslters from './utils/filters'

// import defaultSettings from '@/settings'
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'development') {
//   mockXHR()
// }

const url = window.location.href
if (url.indexOf('debug=1') > -1 || process.env.NODE_ENV !== 'production') {
  const VConsole = require('vconsole')
  // eslint-disable-next-line
  new VConsole()
}

if (process.env.NODE_ENV === 'production') {
  require('./utils/Sentry.js') // sentry上报
}

FastClick.attach(document.body)
FastClick.prototype.focus = function (targetElement) {
  targetElement.focus()
}

Vue.mixin(mixins) // 全局mixin
if (isApp()) {
  Vue.mixin(app) // 全局mixin
}
Vue.use(VueQriously)
Vue.use(animated)
Vue.use(permission)
Vue.use(Table)
Vue.use(VueClipboard)

Object.keys(fslters).forEach(key => {
  Vue.filter(key, fslters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
