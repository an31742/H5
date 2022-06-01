import request from '@/utils/request'

/**
 * 小区收款码列表
 */
export function getQrcodeList (params) {
  return request({
    url: `/minip-staff/{appId}/qrcode/list`,
    method: 'get',
    params
  })
}

/**
 * 获取收费二维码账单列表
 */
export function getQrcodeBillList (params) {
  return request({
    url: `/minip-staff/{appId}/qrcode/bill/list`,
    method: 'get',
    params
  })
}
