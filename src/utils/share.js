import store from '@/store'
import { Toast } from 'vant'
import wx from 'weixin-js-sdk'
import { getSignature } from '@/api/common'
import { getAppId } from '@/utils/auth'

const jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems', 'scanQRCode', 'updateAppMessageShareData', 'updateTimelineShareData', 'getLocation', 'openLocation']

// 获取微信签名，初始化分享
export function initShare (to) {
  const url = window.location.href.split('#')[0] // 当前页地址
  const isIos = window['__wxjs_is_wkwebview'] // 是否是ios
  let initUrl = store.getters.initWxConfigUrl // 初次进入页面的url

  if (isIos && !initUrl) {
    initUrl = url
    store.commit('common/SET_INIT_WX_CONFIG_URL', url)
  }

  // ios下用首次进入页面的url，android下用当前页url
  getSignature({ url: isIos ? initUrl : url }).then(res => {
    if (res.code === 200) {
      res = res.data || {}
      wx.config({
        // 咱也不懂这是为撒会写这个
        debug: url.indexOf('helloworld=1') > -1,
        appId: res.app_id,
        nonceStr: res.nonce,
        timestamp: res.timestamp,
        signature: res.signature,
        jsApiList: jsApiList,
        openTagList: ['wx-open-launch-weapp']
      })

      wx.ready(() => {
        sessionStorage.setItem('hasWxReady', '1')
      })

      wx.error((err) => {
        console.log('error ' + JSON.stringify(err))
      })

      return
    }
    Toast.fail(res.msg || '分享签名获取失败')
  })
}

// 更新分享信息
export function setShareInfo (name, link, info = {}) {
  link = link.split('#')[0]
  link += link.indexOf('?') > -1 ? '&' : '?'
  if (link.indexOf('app_id=') < 0) {
    link += 'app_id=' + getAppId() // 不带app_id的链接，需要拼接上参数app_id
  }
  info = Object.assign({}, info)
  let obj = {
    imgUrl: 'https://pms-static.gmtech.top/pubsrv/2020428/0a2d1a5e-8953-11ea-9f06-525400f72349.png',
    link: link,
    success: (res) => {
      console.log('share success', res)
    },
    fail: (err) => {
      console.log('share fail', err)
    }
  }
  obj = Object.assign(obj, info)

  return obj
}
// 更新分享信息，即重新调用一遍wx.xxx
export function updateShareInfo (name, info) {
  const obj = setShareInfo(name, location.href, info)

  // wx.onMenuShareAppMessage(obj)
  // wx.onMenuShareTimeline(obj)
  wx.updateAppMessageShareData(obj)
  wx.updateTimelineShareData(obj)
}
