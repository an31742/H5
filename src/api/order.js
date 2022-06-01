import request from '@/utils/request'

/**
 * 查询待办工单 - 暂不支持分页，全量返回，后续升级
 * page   int   Y
 * page_size   int   Y
 */
export function minipStaffOrderTodoList (params) {
  return request({
    url: `/minip-staff/{appId}/dispatch/order/todo/list`,
    method: 'get',
    params
  })
}

/**
 * 查询已办工单 - 暂不支持分页，全量返回，后续升级
 * page   int   Y
 * page_size   int   Y
 */
export function minipStaffOrderDoneList (params) {
  return request({
    url: `/minip-staff/{appId}/dispatch/order/done/list`,
    method: 'get',
    params
  })
}

/**
 * 查询工单详情
 * id   int   Y
 */
export function minipStaffOrderGet (params) {
  return request({
    url: `/minip-staff/{appId}/dispatch/order/get`,
    method: 'get',
    params
  })
}

/**
 * 维修完成
 * dispatch_order_id   int   Y
 * node_record_id   string   Y
 */
export function minipStaffRepairOrderDone (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/dispatch/order/repair/done`,
    method: 'post',
    data
  })
}

/**
 * 验证完成
 * dispatch_order_id   int   Y
 * node_record_id   string   Y
 * is_ok   bool   Y
 */
export function minipStaffRepairVerifyDone (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/dispatch/order/verify/done`,
    method: 'post',
    data
  })
}

export function minipStaffAcceptOrderDone (data) {
  return request({
    url: `/minip-staff/{appId}/dispatch/order/accept/done`,
    method: 'post',
    data
  })
}
