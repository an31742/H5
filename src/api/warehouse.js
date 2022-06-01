import request from '@/utils/request'

/**
 * 获取入库物资详情
 */
export function warehouseGet (params) {
  return request({
    url: `/storage/warehouse/warehouse_assets_in_get`,
    method: 'get',
    params: params
  })
}

export function warehouseAssetsStatus (params) {
  return request({
    url: '/storage/warehouse/warehouse_assets_in_status',
    method: 'get',
    params
  })
}

/**
 * 获取调拨物资详情
 */
export function schedulingGet (params) {
  return request({
    url: `/storage/warehouse/warehouse_scheduling_get`,
    method: 'get',
    params: params
  })
}

/**
 * 获取调拨入库确认
 */
export function schedulingStatus (params) {
  return request({
    url: `/storage/warehouse/warehouse_scheduling_status`,
    method: 'get',
    params: params
  })
}

/**
 * 固资流转
 */
export function flowListAssetsFlow (params) {
  return request({
    url: '/storage/assets_flow/flow_list',
    method: 'get',
    params
  })
}

export function confirmFexchage (params) {
  return request({
    url: '/storage/assets_flow/exchage_confirm',
    method: 'get',
    params
  })
}
