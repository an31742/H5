import request from '@/utils/request'

export function getFloorList (params) {
  return request({
    url: `/minip-staff/group/building/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

export function miniVisitorList (params) {
  return request({
    url: `/minip-staff/visitor/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

export function miniInviteVisitor (data) {
  return request({
    url: `/minip-staff/visitor/batch`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniUpdateVisitor (data) {
  return request({
    url: `/minip-staff/visitor/update`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniDeleteVisitor (data) {
  return request({
    url: `/minip-user/{appId}/visit/delete`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniAcceptInvite (data) {
  return request({
    url: `/minip-user/{appId}/visit/accept`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniOpenDoor (data) {
  return request({
    url: `/minip-user/{appId}/door/open`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniOpenVisit (data) {
  return request({
    url: `/minip-user/{appId}/visit/open`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function miniVisitInfo (data = {}) {
  return request({
    url: `/minip-user/{appId}/visit/info`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

// http://{ip}:{port}/minip-user/28/visit/unqy/open
// 2.业主端访客邀请（非青岳门禁小区）扫码请求
export function miniVisitIUnQYOpen (data = {}) {
  return request({
    url: `/minip-user/{appId}/visit/unqy/open`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

export function getWechatUser (params) {
  return request({
    url: `/minip-staff/visitor/wechat/user`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
