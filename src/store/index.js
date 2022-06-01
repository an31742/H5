import Vue from 'vue'
import Vuex from 'vuex'
import { getToken } from '@/utils/auth'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default new Vuex.Store({
  state: {
    loading: false, // loading加载
    direction: 'forward' // 页面切换方向
  },
  getters: {
    token: state => state.user.token || getToken(),
    userData: state => state.user.user,
    userPermissions: state => state.user.permissions,
    commonInfo: state => state.common.info,
    userGroupList: state => state.user.userGroupList,
    weiXinBindInfo: state => state.user.weiXinBindInfo,
    initWxConfigUrl: state => state.common.initWxConfigUrl,
    pageLoading: state => state.common.loading,
    appConfig: state => state.common.appConfig,
    wxOpenId: state => state.user.wx_open_id,
    app_id: state => state.user.app_id,
    updateListData: state => state.getHomeReclaim.updateListData,
    formModel: state => state.workorder.formModel,
    materialList: state => state.workorder.materialList,
    selectList: state => state.workorder.selectList
  },
  mutations: {
    // 更新页面切换方向
    updateDirection (state, direction) {
      state.direction = direction
    },
    // loading框
    updateLoading (state, loading) {
      state.loading = loading || false
    }
  },
  actions: {

  },
  modules
})
