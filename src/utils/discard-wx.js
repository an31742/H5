import store from '@/store'
import { minipCommonUserInfo } from '@/api/user'
import { Toast } from 'vant'
import { getWeiXinCodeInfo, setWeiXinCodeInfo } from '@/utils/auth'
const whiteList = ['/login'] // 白名单列表

// 微信授权获取code
export async function getWxCode (to, next, btc) {
  const query = to.query
  const code = query.code || ''
  const appId = store.getters.app_id
  if (!appId) {
    alert('页面参数错误')
    return
  }

  const info = await store.dispatch('common/getInfo')
  const wxAppId = info['wx_h5staff_app_id'] || ''
  const params = `?redirect=${encodeURIComponent(to.fullPath)}`
  if (code && query.state === 'complete') {
    let user = null
    // cookie存取授权code对应的用户信息，防止某些手机上授权多次回跳导致第二次用同一个code获取不到用户信息的问题
    let userInfo = getWeiXinCodeInfo()
    if (userInfo && userInfo[code]) {
      user = userInfo[code]
    } else {
      user = await minipCommonUserInfo({ code, appid: wxAppId, endpoint: 2, redirect_url: 'https://h5-staff.gmtech.top/' })
      userInfo = {}
      userInfo[code] = user
      setWeiXinCodeInfo(userInfo)
    }

    if (user && user.code === 200) {
      const wxOpenId = user.data && user.data.openid
      store.commit('user/SetOpenId', wxOpenId)

      // 获取该微信已绑定的账号 mobile  token  avatar
      if (user.data.mobile && user.data.token) {
        store.commit('user/SetWeiXinBindInfo', user.data)
      }

      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login${params}`)
      }
    } else {
      Toast({ message: user.msg || '微信授权错误', position: 'middle', duration: 3000 })
    }
  } else {
    const path = window.location.origin // 默认跳回到登录页
    const dist = btc ? `${to.fullPath}` : `/login${params}`
    const redirectUrl = encodeURIComponent(`${path}${dist}`)
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxAppId}`
    url += `&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo`
    url += `&state=complete#wechat_redirect`

    location.replace(url)
  }
}
