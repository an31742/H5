import request from '@/utils/request'

/**
 * 客户搜索
 */
export function gmanagerUserSearch (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/user/list`,
    method: 'get',
    params: params
  })
}

/**
 * 车位搜索
 */
export function minipParkingSearch (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/parking/list`,
    method: 'get',
    params: params
  })
}
/**
 * 车位搜索
 */
export function minipVehicleSearch (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/vehicle/list`,
    method: 'get',
    params: params
  })
}
/**
 * 拍照识别车牌
 */
export function miniplLicensePlate (data) {
  return request({
    url: `/minip-staff/three_part/baidu/license_plate`,
    method: 'post',
    data: data
  })
}
/**
 * 房屋搜索
 */
export function minipRoomSearch (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/room/list`,
    method: 'get',
    params: params
  })
}

// 物品放行列表
export function getPassList (params) {
  return request({
    url: `/minip-staff/property/pass/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
