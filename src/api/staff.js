import request from '@/utils/request'

// 3.员工基本信息及密钥信息
// 1.管理员查询员工列表
// http://{ip}:{port}/minip-staff/31/group/staff/list

export function miniStaffList (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/group/staff/list`,
    method: 'post',
    data
  })
}
