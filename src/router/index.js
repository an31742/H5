import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function (location) {
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)

let routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('views/404.vue'),
    meta: { title: '404', keepAlive: true }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('views/403.vue'),
    meta: { title: '403', keepAlive: true }
  }
]

const routerContext = require.context('./', true, /\.js$/)
routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)

  // 兼容 import export 和 require module.export 两种规范
  routes = routes.concat(routerModule.default || routerModule)
})

routes = routes.concat({ path: '*', redirect: '/404' })

const createRouter = () => new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const myRouter = createRouter()

export default myRouter
