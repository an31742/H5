import request from '@/utils/request'

/**
 * 验证二维码
 */
export function verifyVisitByQrcode (data) {
  return request({
    url: `/minip-staff/{appId}/visit/verify`,
    method: 'post',
    data
  })
}
