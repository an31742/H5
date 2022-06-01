import request from '@/utils/request'

/**
 * 盘点任务列表
 * 1 //待提交
 * 2 //复核中
 * 3 //已完成
 */
export function materialsList (data) {
  return request({
    url: `/storage-v2/check_task/list`,
    method: 'post',
    data: data
  })
}

/**
 *
 * 物资盘点统计
 */
export function materialsTotal (data) {
  return request({
    url: `/storage-v2/check_task/stat_count`,
    method: 'post',
    data: data
  })
}

/**
 *
 * 物资盘点查看
 */
export function getMaterialsDetail (data) {
  return request({
    url: `/storage-v2/check_task/get_task`,
    method: 'post',
    data: data
  })
}

/**
 *
 * 物资盘点详情下的表格数据
 */
export function getDetailTable (data) {
  return request({
    url: `/storage-v2/check_task/get_without_fixed_assets`,
    method: 'post',
    data: data
  })
}
/**
 *
 * 物资盘点详情下的表格数据-固定资产
 */
export function getDetailTable1 (data) {
  return request({
    url: `/storage-v2/check_task/get_fixed_assets`,
    method: 'post',
    data: data
  })
}

/**
 *
 * 资产类型
 */
export function getSearchTypeList () {
  return request({
    url: `/storage-v2/assets/group/list`,
    method: 'post'
  })
}
/**
 *
 * 仓库列表
 */
export function getWarehouseList (data) {
  return request({
    url: `/storage-v2/warehouse/list`,
    method: 'post',
    data: data
  })
}

/**
 *
 * 盘点任务复核-终止、回退、确认按钮接口
 */
export function checkTask (data) {
  return request({
    url: `/storage-v2/check_task/re_check`,
    method: 'post',
    data: data
  })
}
/**
 *
 * 盘点任务提交
 */
export function submitTask (data) {
  return request({
    url: `/storage-v2/check_task/check`,
    method: 'post',
    data: data
  })
}
/**
 *
 * 盘点任务提交-固定物资
 */
export function submitTaskFixed (data) {
  return request({
    url: `/storage-v2/check_task/check_fixed_assets`,
    method: 'post',
    data: data
  })
}
/**
 *
 * 盘点录入-部门数据
 */
export function getDepartmentTree () {
  // `/fpms/personnel/department/tree`,
  return request({
    url: `/storage-v2/department/tree`,
    method: 'get'
  })
}

/**
 *
 * 盘点录入-使用人
 */
// export function getDepartmentUse () {
//   return request({
//     url: `/fpms/personnel/staff/list`,
//     method: 'get'
//   })
// }

export function getDepartmentUse () {
  return request({
    url: `/storage-v2/staff/list`,
    method: 'get'
  })
}

/**
 *
 * 盘点录入-使用人
 */
 export function getStaffList (params) {
  return request({
    url: `/storage-v2/staff/list`,
    method: 'get',
    params
  })
}

