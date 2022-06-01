import request from '@/utils/request'

/**
 * 网格列表
 */
export function wfeWidgetGridList (params) {
  return request({
    url: `/wfe/widget/grid/list`,
    method: 'get',
    params
  })
}

/**
 * 位置树状图
 */
export function commonLocationAll (params) {
  return request({
    url: `/fpms/common/location/all`,
    method: 'get',
    params
  })
}

/**
 * 选择房间
 *  user_id
 */
export function wfeWidgetRoomList (params) {
  return request({
    url: `/wfe/widget/room/list`,
    method: 'get',
    params
  })
}

/**
 * 选择车位
 *  user_id
 */
export function wfeWidgetParkingList (params) {
  return request({
    url: `/wfe/widget/parking/space/list`,
    method: 'get',
    params
  })
}

/**
 * 车辆列表
 *  user_id
 */
export function wfeWidgetVehicleList (params) {
  return request({
    url: `/wfe/widget/vehicle/list`,
    method: 'get',
    params
  })
}

/**
 * 员工查询列表
 *  name
 */
export function wfeWidgetStaffList (params) {
  return request({
    url: `/wfe/widget/staff/list`,
    method: 'get',
    params
  })
}

/**
 * 员工查询接口 去掉了获取角色
 */
export function getWidgetStaffListNoticeCandidate (params) {
  return request({
    url: `/wfe/widget/staff/list-notice-candidate`,
    method: 'get',
    params: params
  })
}

// device

/**
 * 设备 已提交检查项详情
 * http://192.168.235.7:8090/pages/viewpage.action?pageId=14732610
 * @param params
 */
export function getDeviceTaskCheckListCommit (params) {
  return request({
    url: `/minip-staff/{appId}/device/task/checklist/commit/get`,
    method: 'get',
    params: params
  })
}

/**
 * 环境 已提交检查项详情
 * @param params
 */
export function getCleanTaskCheckListCommit (params) {
  return request({
    url: `/minip-staff/{appId}/cleaning/task/checklist/commit/get`,
    method: 'get',
    params: params
  })
}

/**
 * 秩序 已提交检查项详情
 * @param params
 */
export function getSequenceTaskCheckListCommit (params) {
  return request({
    url: `/minip-staff/{appId}/guardian/task/checklist/commit/get`,
    method: 'get',
    params: params
  })
}
/**
 * 获取工作时间接口
 */
export function getWidgetCompanyInfo (params) {
  return request({
    url: `/wfe/widget/group/office/time`,
    method: 'get',
    params: params
  })
}
