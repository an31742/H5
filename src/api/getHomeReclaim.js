import request from '@/utils/request'

const BASE = '/minip-staff/recycle/'
/**
 * 新增估价单
 */
export function addAppraisal (data) {
  return request({
    url: `${BASE}appraisal/add`,
    method: 'post',
    data
  })
}

/**
 * 获取估价列表
 */
export function getAppraisalList (params) {
  return request({
    url: `${BASE}appraisal/list`,
    method: 'get',
    params
  })
}

/**
 * 获取估价单详情
 */
export function getAppraisalDetail (params) {
  params._loading = true
  return request({
    url: `${BASE}appraisal/get`,
    method: 'get',
    params
  })
}

/**
 * 确认估价单
 */
export function setAppraisal (data) {
  return request({
    url: `${BASE}appraisal/confirm`,
    method: 'post',
    data
  })
}

/**
 * 获取回收订单
 */
export function getReclaimList (params) {
  return request({
    url: `${BASE}order/list`,
    method: 'get',
    params
  })
}

/**
 * 获取回收订单详情
 */
export function getReclaimDetail (params) {
  params._loading = true
  return request({
    url: `${BASE}order/get`,
    method: 'get',
    params
  })
}

/**
 * 修改订单状态
 */
export function putOrderStatus (data) {
  return request({
    url: `${BASE}order/confirm`,
    method: 'POST',
    data
  })
}
