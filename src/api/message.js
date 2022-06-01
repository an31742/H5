import request from '@/utils/request'

/**
 * 消息列表
 * page   int   Y
 * page_size   int   Y
 */
export function minipStaffMessageList (params) {
  return request({
    url: `/minip-staff/{appId}/message/list`,
    method: 'get',
    headers: { auth: 'group,login' },
    params
  })
}

/**
 * 消息详情
 * id   int   Y
 */
export function minipStaffMessageGet (params) {
  return request({
    url: `/minip-staff/{appId}/message/get`,
    method: 'get',
    headers: { auth: 'group,login' },
    params
  })
}

/**
 * 消息阅读
 * id   int   Y
 */
export function minipStaffMessageRead (data) {
  return request({
    url: `/minip-staff/{appId}/message/read`,
    method: 'post',
    headers: { auth: 'group,login' },
    data
  })
}

/**
 * 标记全部阅读
 * id   int   Y
 */
export function minipStaffMessageReadAll (data) {
  return request({
    url: `/minip-staff/{appId}/message/read-all`,
    method: 'post',
    data
  })
}

/**
 * 未读消息统计
 */
export function minipStaffMessageStatistics (params) {
  return request({
    url: `/minip-staff/{appId}/message/statistics`,
    method: 'get',
    params
  })
}
