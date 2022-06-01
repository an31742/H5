import request from '@/utils/request'
const head = 'app_type=fw'

/**
 * 添加通行记录
 */
export function addStaff (data) {
  return request({
    url: `/parking/staff/add?${head}`,
    method: 'post',
    data
  })
}

/**
 * 共享车位订单详情
 */
export function getOrderInfo (params) {
  return request({
    url: `/parking/staff/info?${head}`,
    method: 'get',
    params
  })
}

/**
 * 查找位置树形结构
 */
export function getLocationTree (params) {
  return request({
    url: '/fpms/estate/location/tree',
    method: 'get',
    params: params
  })
}

/**
 * 查找位置树形结构
 */
export function getLocationTreeList (params) {
  return request({
    url: '/fpms/estate/location/list',
    method: 'get',
    params: params
  })
}

/**
 * 获取提示文案 参数
   publish: 发布文案 appointment: 预约文案 appointmentSuccess: 预约成功文案
 */
export function publishTxt (params) {
  return request({
    url: '/parking/h5/publish/text',
    headers: { auth: 'login' },
    method: 'get',
    params
  })
}
