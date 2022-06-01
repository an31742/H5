import request from '@/utils/request'

// 我的申请

/**
 * 我的申请
 */

export function minipApplyList (params) {
  return request({
    url: `/minip-staff/{appId}/user/v2/apply/list`,
    // headers: { auth: 'group,login' },
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

export function minipApplyGet (params) {
  return request({
    url: `/minip-staff/{appId}/user/v2/apply/get`,
    // headers: { auth: 'group,login' },
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

// 新增物品放行
export function addGoodsPass (data) {
  return request({
    url: `/minip-staff/property/pass/add`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

// 物品放行编码
export function getPassNo (params) {
  return request({
    url: `/minip-staff/property/pass/no`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

// 获取物品放行订单详情
export function getPassDetail (params) {
  return request({
    url: `/minip-staff/property/pass/get`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

// 获取放行列表
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

// 撤销
export function setPassRevoke (params) {
  return request({
    url: `/minip-staff/property/pass/revoke`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

// 编辑
export function updatePass (data) {
  return request({
    url: `/minip-staff/property/pass/update`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

// 业主审核同意、拒绝
export function auditPass (params) {
  return request({
    url: `/minip-staff/property/pass/audit`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
