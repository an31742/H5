import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import { isApp, isIosApp } from '@/utils/index'
import { getToken, getGroupId, getCompanyId } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})

// 接口错误处理
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      this.$toast.fail({ // 403
        message: 'Forbidden ' + data.message,
        duration: 3 * 1000
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      this.$toast.fail({
        message: '登录信息认证失败',
        duration: 3 * 1000
      })

      if (getToken()) {
        store.dispatch('user/logout')
      }
    }
  }
  store.commit('updateLoading')
  return Promise.reject(error)
}

service.interceptors.request.use(
  config => {
    // 加上loading
    const dl = config.data && config.data._loading
    const pl = config.params && config.params._loading
    const loading = dl || pl || false
    let isRequestCommon = false
    if (config.data) {
      isRequestCommon = config.data.isRequestCommon
      delete config.data.isRequestCommon
    }
    if (config.params) {
      isRequestCommon = config.params.isRequestCommon
      delete config.params.isRequestCommon
    }
    if (loading) {
      config.data && delete config.data._loading
      config.params && delete config.params._loading
      store.commit('updateLoading', true)
    }

    // 请求头部带上token
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }

    // 请求头部带上groupid
    if (getGroupId()) {
      config.headers['groupid'] = getGroupId()
    }

    // H5里请求的时候，header里带上请求头app
    let app = 'h5_staff'
    if (isApp() && !isRequestCommon) {
      app = 'android_staff'
      if (isIosApp) {
        app = 'ios_staff'
      }
    }
    config.headers['app'] = app

    // APP里请求的时候，header里带上请求头platform && 替换接口地址
    if (isApp()) {
      if (!isRequestCommon) {
        config.url = config.url.replace(/minip-staff/g, 'app-staff')
      }
      const companyId = getCompanyId()
      if (companyId) {
        config.data = config.data || {}
        config.params = config.params || {}

        config.data.company_id = +companyId
        config.params.company_id = +companyId

        // 2021-04-07 去掉header里面的companyID
        // config.headers['companyID'] = +companyId
      }
    }

    // 替换app_id
    // const appId = store.getters.app_id
    // config.url = config.url.replace(/\{appId\}/g, appId)

    // 2021-01-08 去掉path里面的appId，仅common/app/info接口把appId追加到参数里
    const appId = store.getters.app_id
    config.url = config.url.replace(/\/\{appId\}/g, '')
    if (config.url.indexOf('common/app/info') > -1) {
      config.params.appid = appId
    }

    // 请求头部带上appid
    config.headers['appid'] = appId

    return config
  },
  error => {
    console.log(error, 'err')
    store.commit('updateLoading')
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    store.commit('updateLoading')
    // 如果返回的code是10101，说明token已经过期了
    // 此时就不用调退出登录接口，因为用过期的token调用退出登录接口也会提示10101，然后进入死循环
    // 所以这种情况下，就简单的删除本地cookie，然后刷新页面，重新进入sso登录页
    if (response.data.code === 10101) {
      Toast('登录状态失效，请重新登录')
      // 不能用store.dispatch('user/logout')
      store.commit('user/LOGOUT')
    }

    return response.data
  },
  err
)

export default service
