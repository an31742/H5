import request from '@/utils/request'

/**
 * 小区收款码列表
 */
export function getVisitorList (data) {
  return request({
    url: `/minip-staff/{appId}/visit/list`,
    method: 'post',
    data
  })
}

export function getDoorList (data) {
  return request({
    url: `/minip-staff/{appId}/entrance/list`,
    method: 'post',
    data
  })
}
