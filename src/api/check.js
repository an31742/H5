import request from '@/utils/request'

/**
 * 获取员工小区列表
 */
export function staffGroupList () {
  return request({
    url: `/minip-staff/{appId}/group/list`,
    method: 'post',
    data: {}
  })
}

/**
 * 获取考勤范围信息
 */
export function staffGroupDistance (data) {
  return request({
    url: `/minip-staff/{appId}/group/distance`,
    method: 'post',
    data: data
  })
}

/**
 * 获取员工某天排班情况
 */
export function staffSchedulePlanList (data) {
  return request({
    url: `/minip-staff/{appId}/schedule/clock/list`,
    method: 'post',
    data: data
  })
}

/**
 * 考勤打卡接口
 */
export function staffScheduleClockAdd (data) {
  return request({
    url: `/minip-staff/{appId}/schedule/clock/add`,
    method: 'post',
    data: data
  })
}

/**
 * 考勤打卡信息接口
 */
export function staffScheduleClockList (data) {
  return request({
    url: `/minip-staff/{appId}/schedule/plan/report`,
    method: 'post',
    data: data
  })
}

/**
 * 考勤统计接口
 */
export function staffScheduleReport (data) {
  return request({
    url: `/minip-staff/{appId}/schedule/report`,
    method: 'post',
    data: data
  })
}
