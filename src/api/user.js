import request from '@/utils/request'

/**
 * 用sso那边传过来的临时token去置换长期token
 */
export function ssoTempTokenExchange (data) {
  return request({
    url: '/sso/temp/token/exchange',
    method: 'post',
    data: data
  })
}

/**
 * 退出登录
 */
export function minipCommonUserLogout (params) {
  return request({
    url: `/sso/staff/logout`,
    method: 'get',
    params
  })
}

/**
 * 获取用户权限信息
 */
export function minipCenterInfo () {
  return request({
    url: `/minip-staff/{appId}/center/info`,
    method: 'get',
    params: {}
  })
}

/**
 * 用户反馈
 * content   string    Y
 * pictures   string    N
 */
export function minipUserFeedBackAdd (data) {
  return request({
    url: `/minip-staff/{appId}/feedback/add`,
    method: 'post',
    data
  })
}

// /**
//  * 获取微信用户公开信息 && 微信自动登录
//  * code   string   Y   微信授权获取的code
//  */
// export function minipCommonUserInfo (params) {
//   return request({
//     url: `/sso-v2/weixin/h5/code/verify`,
//     method: 'get',
//     params
//   })
// }

// /**
//  * 发送短信验证码
//  * mobile   string    Y   手机号
//  */
// export function minipSmsCode (data) {
//   data._loading = true
//   return request({
//     url: `/sso-v2/sms/send`,
//     method: 'post',
//     data
//   })
// }

// /**
//  * 短信登录
//  * mobile   string   Y
//  * code   int   Y
//  */
// export function minipStaffSmsLogin (data) {
//   const openId = data['wx_open_id'] || ''
//   // eslint-disable-next-line
//   const { mobile, code } = data
//   return request({
//     url: `/sso-v2/sms/login`,
//     method: 'post',
//     data: { mobile, code: code, open_id: openId, _loading: true, redirect_url: 'https://h5-staff.gmtech.top/', endpoint: 2 }
//   })
// }

// /**
//  * 用户名密码登录
//  * user_name   string   Y
//  * password   int   Y
//  * wx_open_id   string   N
//  */
// export function minipPasswordLogin (data) {
//   const openId = data['wx_open_id'] || ''
//   // eslint-disable-next-line
//   const { user_name, password, randstr, ticket } = data
//   return request({
//     url: `/sso-v2/account/login`,
//     method: 'post',
//     data: { user_name, password, randstr, ticket, wx_open_id: openId, _loading: true, redirect_url: 'https://h5-staff.gmtech.top/', endpoint: 2 }
//   })
// }

// /**
//  * 修改密码 - 发送验证码
//  */
// export function minipPasswordModifySmsCode (data) {
//   data._loading = true
//   return request({
//     url: `/sso-v2/password/modify/sms/send`,
//     method: 'post',
//     data
//   })
// }

// /**
//  * 修改密码
//  * code   string   Y
//  * password   string   Y
//  * password_repeat   string   Y
//  */
// export function minipPasswordModify (data) {
//   // eslint-disable-next-line
//   const { code, password, password_repeat } = data
//   return request({
//     url: `/sso-v2/password/modify`,
//     method: 'post',
//     data: { code, password, password_repeat }
//   })
// }

// /**
//  * 重置密码 - 发送验证码
//  *  mobile  string  Y
//  */
// export function minipPasswordResetSmsCode (data) {
//   data._loading = true
//   return request({
//     url: `/sso-v2/password/reset/sms/send`,
//     method: 'post',
//     data
//   })
// }

// /**
//  * 重置密码
//  * mobile   string   Y
//  * code   string   Y
//  * password   string   Y
//  * password_repeat   string   Y
//  */
// export function minipPasswordReset (data) {
//   // eslint-disable-next-line
//   const { mobile, code, password, password_repeat } = data
//   return request({
//     url: `/sso-v2/password/reset`,
//     method: 'post',
//     data: { mobile, code, password, password_repeat }
//   })
// }

// /**
//  * 通过手机号获取公司列表
//  *  mobile  手机号
//  */
// export function ssoWeiXinH5MobileCompany (params) {
//   return request({
//     url: `/sso/weixin/h5/mobile/company`,
//     method: 'get',
//     params
//   })
// }
