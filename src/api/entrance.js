import request from '@/utils/request'

export function miniSecretAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/secret/add`,
    method: 'post',
    data
  })
}

/**
 * 获取腾讯云COS上传信息
 */
export function getUploadToken (data) {
  return request({
    url: '/minip-staff/{appId}/secret/upload/picture/verify',
    method: 'post',
    data: data
  })
}
// 3.员工基本信息及密钥信息

export function miniSecretInfo (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/secret/info`,
    method: 'post',
    data
  })
}

// 6.修改员工密码
// http://{ip}:{port}/minip-staff/31/secret/change/password

export function miniSecretChangePassword (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/secret/change/password`,
    method: 'post',
    data
  })
}

export function miniSecretOperateStatistics (data) {
  return request({
    url: `/minip-staff/{appId}/secret/operate/statistics`,
    method: 'post',
    data
  })
}

export function miniSecretStaffCheck () {
  return request({
    url: `/minip-staff/{appId}/secret/staff/check`,
    method: 'get'
  })
}

// 判断门禁是否青岳
export function miniSecretGroupAccessCategory (params) {
  return request({
    url: `/minip-staff/{appId}/group/access/category`,
    method: 'get',
    params: params
  })
}

export function miniSecretOpen (data) {
  return request({
    url: `/minip-staff/{appId}/secret/open`,
    method: 'post',
    data
  })
}
