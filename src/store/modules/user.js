import { setToken, removeToken, getAppId, setAppId, getWxOpenId, setWxOpenId, setDefaultGroup, setGroupId } from '@/utils/auth'
// import { minipStaffSmsLogin, minipPasswordLogin, minipCenterInfo, minipCommonUserLogout } from 'api/user'
import { minipCenterInfo, minipCommonUserLogout } from 'api/user'
import { staffGroupList } from '@/api/check'
import { nativeLogin } from '@/utils/app'
import { isApp } from '@/utils/index'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state: {
    user: '',
    permissions: [],
    wx_open_id: getWxOpenId() || '',
    weiXinBindInfo: {},
    token: '',
    userGroupList: [],
    app_id: getAppId() || ''
  },
  mutations: {
    LOGIN (state, data) {
      const userToken = data.token
      state.token = userToken
      setToken(userToken)
    },

    SetUserData (state, userData = {}) {
      state.user = userData
      localStorage.setItem('userDate', JSON.stringify(userData))
    },

    SetUserPermission (state, permission = []) {
      state.permissions = permission
      localStorage.setItem('userPermission', JSON.stringify(permission))
    },

    LOGOUT (state) {
      state.user = null
      state.token = null
      state.permissions = []
      removeToken()
      setGroupId('')
      localStorage.removeItem('userDate')
      localStorage.removeItem('userPermission')

      // 如果是在APP里面，则不刷新页面，直接调用登录
      if (isApp()) {
        nativeLogin()
      } else {
        location.reload()
      }
    },

    SetOpenId (state, openId = '') {
      state.wx_open_id = openId
      setWxOpenId(openId)
    },

    SetWeiXinBindInfo (state, obj = {}) {
      state.weiXinBindInfo = obj
    },

    setAppId (state, appId = '') {
      state.app_id = appId
      setAppId(appId)
    },

    setGroupList (state, list = []) {
      state.userGroupList = list
    }
  },
  actions: {
    // async login (state, data) {
    //   try {
    //     const api = data.pwd ? minipPasswordLogin : minipStaffSmsLogin
    //     let res = data // 默认是直接微信登录
    //     if (!data.loginByWeiXin) {
    //       res = await api(data)
    //     }
    //
    //     if (res.code === 200) {
    //       state.commit('LOGIN', res.data)
    //       Toast({ message: '登录成功', position: 'middle', duration: 1500 })
    //
    //       setTimeout(() => {
    //         const redirect = data.$route.query.redirect || '/'
    //
    //         // 直接刷新页面，防止用户信息不更新的问题
    //         window.location.replace(redirect)
    //       }, 0)
    //     } else {
    //       Toast({ message: res.msg || '登录失败', position: 'middle', duration: 3000 })
    //     }
    //   } catch (error) {}
    // },

    // 登出
    async logout (state, data) {
      try {
        const res = await minipCommonUserLogout()
        if (res.code === 200) {
          state.commit('LOGOUT')
        } else {
          Toast({ message: res.msg || '登出失败', position: 'middle', duration: 3000 })
        }
      } catch (error) {}
    },

    // get user info
    getInfo ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        minipCenterInfo(payload).then(response => {
          const { data } = response
          console.log('getInfo', data)
          if (!data) {
            reject(new Error('登录信息已过期，请重新登录'))
          }
          commit('SetUserData', data)
          let userPermission = []
          if (Array.isArray(data.resource_code_list)) {
            userPermission = data.resource_code_list// .filter(val => val.indexOf('FPMS_MENU_CODE_H5') > -1)
          }
          if (Array.isArray(data.action_code_list)) {
            userPermission = userPermission.concat(data.action_code_list)
          }
          commit('SetUserPermission', userPermission)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取员工拥有的小区
    getGroups ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        staffGroupList(payload).then(response => {
          let { data } = response
          data = data || {}
          setDefaultGroup(data)
          commit('setGroupList', data && data.list ? (data.list || []) : [])
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    token (state) {
      return state.token
    },
    user (state) {
      return state.user
    },
    permissions (state) {
      return state.permissions
    },
    userGroupList (state) {
      return state.userGroupList
    }
  }
}
