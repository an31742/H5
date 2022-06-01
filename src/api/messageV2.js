import request from '@/utils/request'

export function minipNoticeList (data) {
  return request({
    url: `/minip-staff/{appId}/message/list`,
    method: 'post',
    data
  })
}

export function minipNoticeRead (data) {
  return request({
    url: `/minip-staff/{appId}/message/read`,
    method: 'post',
    data
  })
}

export function minipNoticeDelete (data) {
  return request({
    url: `/minip-staff/{appId}/message/delete`,
    method: 'post',
    data
  })
}

export function minipNoticeGet (params) {
  return request({
    url: `/minip-staff/{appId}/message/get`,
    method: 'get',
    params
  })
}

export function minipStaffMessageStatistics (params) {
  return request({
    url: `/minip-staff/{appId}/message/statistics`,
    method: 'get',
    params
  })
}
