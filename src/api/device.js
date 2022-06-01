import request from '@/utils/request'

/**
 * 根据二维码查询设备
 * @param params
 * qrcode str Y 设备二维码
 * @returns {AxiosPromise}
 */
export function getDeviceQrcode (params) {
  return request({
    url: `/minip-staff/{appId}/device/record/qrcode/get`,
    method: 'get',
    params
  })
}

/**
 * 获取设备日志列表
 * @param params
 * id int Y 设备id
 * project int Y 项目 1-巡检 2-保养
 * page int N 分页
 * page_size int N 分页条目数
 * @returns {AxiosPromise}
 */
export function getDeviceLog (params) {
  return request({
    url: `/minip-staff/{appId}/device/record/log`,
    method: 'get',
    params
  })
}

/**
 * 获取设备维修日志列表
 * @param params
 * id int Y 设备id
 * page int N 分页
 * page_size int N 分页条目数
 * @returns {AxiosPromise}
 */
export function getDeviceRepairLog (params) {
  return request({
    url: `/minip-staff/{appId}/device/record/repair/log`,
    method: 'get',
    params
  })
}
