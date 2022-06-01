import router from '@/router'
import store from '@/store'
import { Notify, Toast } from 'vant'
// import { getWxCode } from '@/utils/wx'
import { initShare } from '@/utils/share'
import { ssoTempTokenExchange } from '@/api/user'
import { getPageTitle, isApp } from '@/utils/index'
import { nativeRegisterBack, nativeLogin } from '@/utils/app'
import { getToken, setGroupId, setCompanyId } from '@/utils/auth'

// 登录
const doLogin = (appId) => {
  if (isApp()) {
    nativeLogin()
  } else {
    // getWxCode(to, next, true)
    const wl = window.location
    const redirectUri = `${wl.origin}${wl.pathname + wl.search}`
    const url = `${process.env.VUE_APP_API_BASE_SSO_URL}/minip/login?app_id=${appId}&mode=h5&from=${encodeURIComponent(redirectUri)}`

    window.location.replace(url)
  }
}

// 权限校验
function hasPermission (permissions) {
  if (!permissions) return true
  if (typeof (permissions) === 'string') {
    if (store.getters.userPermissions) {
      return store.getters.userPermissions.includes(permissions)
    }
    return false
  }
  const permissionList = store.getters.userPermissions
  return permissionList.some(role => permissions.indexOf(role) >= 0)
}

// https://juejin.cn/post/6844904078028308488
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    // 强制刷新当前网页
    window.location.reload()
  } else {
    // 其他错误自行处理
    console.log(error)
  }
})

router.afterEach((to, from) => {
  if (isApp()) {
    // 在每个页面监听
    nativeRegisterBack(() => {
      return { type: 'native' }
    })
  } else {
    setTimeout(() => {
      if (getToken()) {
        initShare(to) // 初始化分享
      }
    }, 300)
  }
})

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 设置 / 更新app_id
  if (to.query['app_id']) {
    store.commit('user/setAppId', to.query['app_id'])
  }

  // 设置 / 更新group_id 和 companyId（APP端内嵌H5页面时需要这俩）
  if (to.query['group_id'] || to.query['companyId']) {
    if (to.query['group_id']) {
      setGroupId(to.query['group_id'])
      delete to.query['group_id']
    }

    if (to.query['companyId']) {
      setCompanyId(to.query['companyId'])
      delete to.query['companyId']
    }
    // 不能next，会导致ios下微信签名时取的url不对
    // next({ path: to.path, query: to.query, replace: true })
  }

  // 处理query里的token
  if (to.query['token']) {
    const tk = to.query['token']
    delete to.query['token']
    // app里直接设置token
    if (isApp()) {
      store.commit('user/LOGIN', { token: tk })
      next({ path: to.path, query: to.query, replace: true })
    } else {
      // 传过来的是临时token，用临时token置换长期token
      try {
        const tkData = await ssoTempTokenExchange({ token: tk })
        store.commit('user/LOGIN', { token: tkData.data.token })
        Toast({ message: '登录成功', position: 'middle', duration: 3000 })
        if (hasPermission(to.meta.permission)) {
          next({ path: to.path, query: to.query, replace: true })
        } else {
          next({ path: '/403', replace: false, query: { noGoBack: true } })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  // 判断是否有appId
  const appId = store.getters.app_id
  if (!appId && !isApp()) {
    alert('页面参数错误')
    return
  }

  // 没有meta.auth，说明该页面可以不登录的情况下直接进入
  if (!to.meta.auth) {
    next()
    return
  }

  // 判断是否已登录
  const hasToken = getToken()
  if (hasToken) {
    // if (to.path === '/login') {
    //   next({ path: '/' })
    // } else {
    const user = store.getters.userData
    const hasGetUserInfo = user && user['id'] !== undefined

    try {
      // 根据用户信息决定跳转界面
      if (!hasGetUserInfo) {
        // 如果没有用户信息则获取
        try {
          // 先获取小区列表，因为getInfo需要groupId
          await store.dispatch('user/getGroups')
          await store.dispatch('user/getInfo')
          if (!isApp()) {
            await store.dispatch('common/getInfo')
          }
        } catch (e) {
          store.dispatch('user/logout')
        }
      }
      if (isApp()) {
        next()
      } else {
        if (hasPermission(to.meta.permission)) {
          next()
        } else {
          next({ path: '/403', replace: false, query: { noGoBack: true } })
        }
      }
    } catch (error) {
      store.dispatch('user/logout')
      Notify(error || '获取用户信息失败')

      // 登录
      doLogin(appId)
    }
    // }
  } else {
    // if (to.path === '/login') {
    //   next()
    // } else {

    // 登录
    doLogin(appId)

    // }
  }
})
