import request from '@/utils/request'

/**
 * 工单统计
 */
export function workTotal (params) {
  return request({
    url: `/wfe/flow/instance/survey`,
    method: 'get',
    params
  })
}
