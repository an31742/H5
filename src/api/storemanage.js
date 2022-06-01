import request from '@/utils/request'

/**
 * 获取入库物资详情
 */
export function warehouseGet (data) {
  return request({
    url: `/storage-v2/warehouse_in/get`,
    method: 'post',
    data
  })
}
/**
 * 获取采购详情
 */
export function purachGet (data) {
  return request({
    url: `/storage-v2/procurement/get`,
    method: 'post',
    data
  })
}

/**
 * 确认入库
 */
export function warehouseAssetsStatus (data) {
  return request({
    url: '/storage-v2/warehouse_in/done',
    method: 'post',
    data
  })
}

/**
 * 获取调拨物资详情
 */
export function schedulingGet (params) {
  return request({
    url: `/storage-v2/scheduling/get`,
    method: 'post',
    data: params
  })
}

/**
 * 获取调拨入库确认
 */
export function schedulingStatus (params) {
  return request({
    url: `/storage-v2/scheduling/done`,
    method: 'post',
    data: params
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
