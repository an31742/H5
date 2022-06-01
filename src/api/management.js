import request from '@/utils/request'

/**
 * 客户详情
 */
export function gmanagerUserInfo (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/user/get`,
    method: 'get',
    params: params
  })
}

/**
 * 房屋详情 - 基础信息
 */
export function gmanagerRoomInfo (params) {
  return request({
    url: `/minip-staff/{appId}/estate/room/get`,
    method: 'get',
    params: params
  })
}

/**
 * 房屋详情 - 入住人员
 */
export function gmanagerRoomUser (params) {
  return request({
    url: `/minip-staff/{appId}/estate/room/user`,
    method: 'get',
    params: params
  })
}

/**
 * 车位详情
 */
export function gmanagerParkingInfo (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/parking/get`,
    method: 'get',
    params: params
  })
}

/**
 * 车辆详情
 */
export function gmanagerCarInfo (params) {
  return request({
    url: `/minip-staff/{appId}/gmanager/vehicle/get`,
    method: 'get',
    params: params
  })
}
