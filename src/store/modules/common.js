import { minipCommonInfo } from '@/api/common'

export default {
  namespaced: true,
  state: {
    info: '',
    loading: false, // 全局loading
    wxConfig: false,
    appConfig: {},
    initWxConfigUrl: '' // 微信授权接口url
  },
  mutations: {
    SET_INIT_WX_CONFIG_URL (state, url = '') {
      state.initWxConfigUrl = url
    },
    SET_COMMON_INFO (state, info = {}) {
      state.info = info
      localStorage.setItem('common_info', JSON.stringify(info))
    },
    setLoading (state, loading = false) {
      state.loading = loading
    },
    setWxConfig (state, val) {
      state.wxConfig = val
    },
    SET_APP_CONFIG: (state, config) => {
      state.appConfig = config
    }
  },
  actions: {
    // get common info
    getInfo ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        minipCommonInfo(payload).then(res => {
          const { data } = res
          commit('SET_COMMON_INFO', data)

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    info (state) {
      return state.info
    }
  }
}
