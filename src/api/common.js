import request from '@/utils/request'

/**
 * 获取公共信息
 */
export function minipCommonInfo () {
  return request({
    url: `/minip-staff/{appId}/common/app/info`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取上传token
 */
export function getUploadToken2 (data) {
  return request({
    url: '/pubsrv/upload/token',
    method: 'post',
    data: data
  })
}

/**
 * 获取腾讯云COS上传信息
 */
export function getTecentUploadToken (data) {
  return request({
    url: '/pubsrv/upload/cos_token',
    method: 'post',
    data: data
  })
}

/**
 * 获取配置信息
 */
export function getAppConfig () {
  return request({
    url: `/pubsrv/config/get`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取jssdk signature
 * @param params
 */
export function getSignature (data) {
  return request({
    url: `/minip-staff/{appId}/jssdk/signature`,
    method: 'post',
    data
  })
}
