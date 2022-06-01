import request from '@/utils/request'

/**
 * 模糊查询“装修中”状态房屋
 */
export function questionApplyList (params) {
  return request({
    url: `/decoration-v2/question/apply/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

/**
 * 展示本人提报的问题列表
 */
export function historyApplyList (params) {
  return request({
    url: `/decoration-v2/question/oneself_history_apply/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}

/**
 * 问题快速选择列表
 */
export function questionQuickList (params) {
  return request({
    url: `/decoration-v2/question/quick_cfg`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
/**
 * 问题提报
 */
export function questionCreate (data) {
  return request({
    url: `/decoration-v2/question/create`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}

/**
 * 问题记录获取
 */
export function questionGet (data) {
  return request({
    url: `/decoration-v2/question/get`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}
/**
 * 资料补充列表
 */
export function applyList (params) {
  return request({
    url: `/decoration-v2/apply/list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
/**
 * 资料补充详情
 */
export function applyGet (params) {
  return request({
    url: `/decoration-v2/apply/get`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
/**
 * 资料补充详情
 */
export function cfgList (params) {
  return request({
    url: `/decoration-v2/cfg/cfg_list`,
    method: 'get',
    params: {
      ...params,
      isRequestCommon: true
    }
  })
}
/**
 * 资料补充详情
 */
export function cfgUpdate (data) {
  return request({
    url: `/decoration-v2/apply/cert/update`,
    method: 'post',
    data: {
      ...data,
      isRequestCommon: true
    }
  })
}
