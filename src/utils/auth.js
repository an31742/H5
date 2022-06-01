import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'staff_h5_token'
const GroupIdKey = 'staff_h5_group_id'
const CompanyIdKey = 'staff_h5_company_id'
const AppIdKey = 'staff_h5_app_id'
const WxOpenIdKey = 'staff_h5_open_id'
const WxCodeKey = 'staff_h5_wx_code'

/**
 * 问题：由于现在是服务商模式，多个公众号可能会公用一个网址，所以会导致cookie串的问题
 * 方案：在存取token的时，加上app_id为前缀（注意：AppIdKey存取的时候不能加前缀，所以需要传{common: true}）
 */
const tokenPrefix = () => {
  return (store ? store.getters['app_id'] : '') + '_'
}
// 存取cookie
export function setCookie (name, value, opt) {
  const prefix = opt && opt.common ? '' : tokenPrefix()

  return Cookies.set(prefix + name, value, opt || { expires: 30 })
}
export function getCookie (name, opt) {
  const prefix = opt && opt.common ? '' : tokenPrefix()

  return Cookies.get(prefix + name)
}
export function removeCookie (name, opt) {
  const prefix = opt && opt.common ? '' : tokenPrefix()

  return Cookies.remove(prefix + name)
}

// 存取token
export function getToken () {
  return getCookie(TokenKey)
}
export function setToken (token) {
  return setCookie(TokenKey, token, { expires: 30 })
}
export function removeToken () {
  return removeCookie(TokenKey)
}

// 存取appId
export function getAppId () {
  return getCookie(AppIdKey, { common: true })
}
export function setAppId (appId) {
  return setCookie(AppIdKey, appId, { expires: 30, common: true })
}

// 存取微信授权code和对应的openid
export function getWeiXinCodeInfo () {
  let info = getCookie(WxCodeKey, { common: true })
  if (info) {
    try {
      info = JSON.parse(info)
    } catch (e) {
      info = {}
    }
  }

  return info || {}
}
export function setWeiXinCodeInfo (info) {
  return setCookie(WxCodeKey, JSON.stringify(info), { expires: 1, common: true })
}

// 存取companyId
export function getCompanyId () {
  return getCookie(CompanyIdKey)
}
export function setCompanyId (id) {
  return setCookie(CompanyIdKey, id, { expires: 30 })
}

// 存取groupId
export function getGroupId () {
  return getCookie(GroupIdKey)
}
export function setGroupId (groupId) {
  return setCookie(GroupIdKey, groupId, { expires: 30 })
}

// 如果没选择小区，则根据小区列表设置默认小区
export function setDefaultGroup (data) {
  const curGid = getGroupId()
  const list = data && data.list || []
  if (list && list[0]) {
    const sel = list.filter(item => item.id === +curGid)
    // 这里要判断本地存储的小区id是否在返回的list内，不在的话需要设置默认groupid
    if (!curGid || !sel || !sel.length) {
      const ugl = list[0]
      setGroupId(ugl.id)
    }
  } else {
    setGroupId(0) // 如果接口没返回小区列表，则清空本地存储
  }
}

// 存取wxOpenId
export function getWxOpenId () {
  return getCookie(WxOpenIdKey)
}
export function setWxOpenId (openId) {
  return setCookie(WxOpenIdKey, openId, { expires: 3 })
}
