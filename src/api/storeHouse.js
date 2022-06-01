import request from '@/utils/request'

/**
 * 筛选-仓库列表
 * @param data
 * @returns {AxiosPromise}
 */
export function wareHouseList (data) {
  return request({
    url: `/storage-v2/warehouse/list`,
    method: 'post',
    data: data
  })
}

/**
 * 仓库列表
 * @param data
 * @returns {AxiosPromise}
 */
export function assetsGroupList (data) {
  return request({
    url: `/storage-v2/assets/group/list`,
    method: 'post',
    data: data
  })
}
/**
 * 物资分类列表
 * @param data
 * @returns {AxiosPromise}
 */
export function levelTree (data) {
  return request({
    url: `/storage-v2/assets/level/tree`,
    method: 'post',
    data: data
  })
}
// 库存列表
export function warehouseInventoryList (data) {
  return request({
    url: `/storage-v2/warehouse_inventory/list`,
    method: 'post',
    data
  })
}

/**
 * 获取当前员工组织下的所有员工
 */
export function getStaffList (params) {
  return request({
    url: `/fpms/personnel/staff/list`,
    method: 'get',
    params: params
  })
}

/**
 * 领用申请新建
 */
export function receiveAdd (params) {
  return request({
    url: `/storage-v2/h5/receive/add`,
    method: 'post',
    data: params
  })
}

/**
 * 我的申请列表
 */
export function receiveList (params) {
  return request({
    url: `/storage-v2/h5/receive/list`,
    method: 'post',
    data: params
  })
}

/**
 * 我的领用申请详情
 */
export function receiveInfo (params) {
  return request({
    url: `/storage-v2/h5/receive/info`,
    method: 'post',
    data: params
  })
}

/**
 * 待我出库列表
 */
export function outList (params) {
  return request({
    url: `/storage-v2/h5/receive/warehouse_assets_out_list`,
    method: 'post',
    data: params
  })
}

export function assetsList (params) {
  return request({
    url: '/storage-v2/assets/list_for_select',
    method: 'post',
    data: params
  })
}
/**
 * 我的领用列表
 */
export function myRreceiveList (params) {
  return request({
    url: `/storage-v2/h5/receive/my_receive`,
    method: 'post',
    data: params
  })
}
/**
 * 确认出库
 */
export function exitWareHouse (params) {
  return request({
    url: `/storage-v2/h5/receive/exit_warehouse`,
    method: 'post',
    data: params
  })
}
/**
 * 物资列表
 */
export function assetsDetailList (params) {
  return request({
    url: `storage-v2/assets/detail/use_type_list`,
    method: 'post',
    data: params
  })
}
/**
 * 物资归还
 */
export function returnDone (params) {
  return request({
    url: `/storage-v2/return/return`,
    method: 'post',
    data: params
  })
}
/**
 * 物资归还
 */
export function qrCodeAssetsList (params) {
  return request({
    url: `/storage-v2/assets/detail/list`,
    method: 'post',
    data: params
  })
}
