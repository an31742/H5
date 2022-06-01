import request from '@/utils/request'

/**
 * 省市区
 */
export function getRegionTree (params) {
  return request({
    url: '/pubsrv/region/tree',
    method: 'get',
    params: params
  })
}

/**
 * 员工查询列表
 *  name
 *  ids
 *  data_authority
 */
export function wfeWidgetStaffList (params) {
  return request({
    url: `/approval/widget/staff/list`,
    method: 'get',
    params
  })
}

/**
 * 关联部门
 *  data_authority
 */
export function wfeWidgetDepartmentList (params) {
  return request({
    url: `/approval/widget/department/tree`,
    method: 'get',
    params
  })
}

/**
 * 关联审批单
 *  type
 *  flow_tpl_id
 *  page
 *  page_size
 *  subject
 */
export function wfeWidgetFlowInstanceList (params) {
  return request({
    url: `/approval/widget/ref/flow/instance/list`,
    method: 'get',
    params
  })
}

/**
 * 根据经纬度获取具体地址
 *  location
 */
// todo 此接口每天有次数限制，后续看改方法还是扩充次数
export function pubsrvGeoLocation (params) {
  return request({
    url: `/pubsrv/geo/location`,
    method: 'get',
    params
  })
}

/**
 * 获取请假类型列表
 * http://192.168.235.7:8090/pages/viewpage.action?pageId=20449235
 * @param params
 * @returns {AxiosPromise}
 */
export function getWidgetVacationTypeList (params) {
  return request({
    url: `/approval/widget/staff/vacation/list`,
    method: 'get',
    params
  })
}

/**
 * 假期余额 - 某个员工 + 假期类别
 * http://192.168.235.7:8090/pages/viewpage.action?pageId=20449235
 * @param params
 * @returns {AxiosPromise}
 */
export function getWidgetVacationStaffInfo (params) {
  return request({
    url: `/approval/widget/staff/vacation/info`,
    method: 'get',
    params
  })
}

/**
 * 请假时长计算
 * @param params
 * @returns {AxiosPromise}
 */
export function getWidgetVacationDuration (params) {
  return request({
    url: `/approval/widget/leave/duration`,
    method: 'get',
    params
  })
}

/**
 * 获取员工排班列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getWidgetVacationStaffPlanList (params) {
  return request({
    url: `/approval/widget/staff/plan/list`,
    method: 'get',
    params
  })
}

/**
 * 加班时长计算
 * @param params
 * @returns {AxiosPromise}
 */
export function getWidgetExtraWorkDuration (params) {
  return request({
    url: `/approval/widget/extra/work/duration`,
    method: 'get',
    params: params
  })
}

/**
 * 获取仓库采购详情
 */
export function getWarehosePurchaseInfo (params) {
  return request({
    url: `/storage/myprocurement/procurement_get`,
    method: 'get',
    params: params
  })
}

/**
 * 获取项目信息
 * @param params
 * group_id
 */
export function getWidgetProjectInfo (params) {
  return request({
    url: `/approval/widget/estate/group/info`,
    method: 'get',
    params: params
  })
}

/**
 * 获取仓库采购详情
 */
export function getWarehosePutInInfo (params) {
  return request({
    url: `/approval/widget/staff/warehouse_in/get`,
    method: 'get',
    params: params
  })
}

/**
 * 获取房屋信息
 * @param params
 * room_id
 */
export function getWidgetHouseInfo (params) {
  return request({
    url: `/approval/widget/estate/room/info`,
    method: 'get',
    params: params
  })
}

/**
 * 获取仓库采购详情
 */
export function getWarehosePutOutInfo (params) {
  return request({
    url: `/approval/widget/staff/warehouse_out/get`,
    method: 'get',
    params: params
  })
}

/**
 * 可选择的审批模板列表全量
 * @param params
 * @returns {AxiosPromise}
 */
export function getProcedureTemplateListAll (params) {
  return request({
    url: `/approval/flowtpl/list/all`,
    method: 'get',
    params: params
  })
}

/**
 * 补卡审批获取员工距今几个月内所有异常考勤列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getStaffAttendanceAbnormalPlanList (params) {
  return request({
    url: `/approval/widget/attendance/abnormal/list`,
    method: 'get',
    params: params
  })
}
