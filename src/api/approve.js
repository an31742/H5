import request from '@/utils/request'

/**
 * 我的审批统计
 */
export function instanceListStatis (params) {
  return request({
    url: `/approval/flow/instance/list/statis`,
    method: 'get',
    params
  })
}

/**
 * 获取模板详情
 */
export function getProcedureTemplateDetail (params) {
  return request({
    url: `/approval/flowtpl/info`,
    method: 'get',
    params
  })
}

/**
 * 获取审批编号
 */
export function getProcedureInstanceNo (params) {
  return request({
    url: `/approval/flow/instance/no`,
    method: 'get',
    params
  })
}

/**
 * 获取审批模板轨迹
 */
export function getProcedureInstanceDiagram (params) {
  return request({
    url: `/approval/flow/instance/launch/tpl/info`,
    method: 'get',
    params
  })
}

/**
 * 申请提交/保存
 */
export function submitProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/flow/instance/launch`,
    method: 'post',
    data: data
  })
}

/**
 * 模板列表
 */
export function flowtplList (params) {
  return request({
    // url: `/approval/flowtpl/list`,
    url: `/approval/flowtpl/used/list`,
    method: 'get',
    params
  })
}

/**
 * 待我审批列表
 */
export function flowInstanceTodoList (params) {
  return request({
    url: `/approval/flow/instance/todo/list`,
    method: 'get',
    params
  })
}

/**
 * 抄送我的列表
 */
export function flowInstanceCCList (params) {
  return request({
    url: `/approval/flow/instance/cc/list`,
    method: 'get',
    params
  })
}

/**
 * 我已审批列表
 */
export function flowInstanceDoneList (params) {
  return request({
    url: `/approval/flow/instance/done/list`,
    method: 'get',
    params
  })
}

/**
 * 我申请的列表
 */
export function flowInstanceApplyList (params) {
  return request({
    url: `/approval/flow/instance/apply/list`,
    method: 'get',
    params
  })
}

/**
 * 详情接口
 */
export function getProcedureItemDetail (params) {
  return request({
    url: `/approval/flow/instance/detail`,
    method: 'get',
    params: params
  })
}
/**
 * 详情接口
 */
export function getProcedureItemDetailByNodeInstanceId (params) {
  return request({
    url: `/approval/task/detail`,
    method: 'get',
    params: params
  })
}

/**
 * 流转轨迹接口
 */
export function getProcedureItemLocus (params) {
  return request({
    url: `/approval/flow/instance/locus`,
    method: 'get',
    params: params
  })
}

/**
 * 编辑
 */
export function updateProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/update`,
    method: 'post',
    data: data
  })
}

/**
 * 结束
 * @param data
 * @returns {AxiosPromise}
 */
export function finishProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/finish`,
    method: 'post',
    data: data
  })
}

/**
 * 转办
 * @param data
 * @returns {AxiosPromise}
 */
export function transProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/trans`,
    method: 'post',
    data: data
  })
}

/**
 * 跳过
 * @param data
 * @returns {AxiosPromise}
 */
export function skipProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/skip`,
    method: 'post',
    data: data
  })
}

/**
 * 加签
 * @param data
 * @returns {AxiosPromise}
 */
export function countersignProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/countersign`,
    method: 'post',
    data: data
  })
}

/**
 * 抄送
 * @param data
 * @returns {AxiosPromise}
 */
export function ccProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/cc`,
    method: 'post',
    data: data
  })
}

/**
 * 评论
 * @param data
 * @returns {AxiosPromise}
 */
export function commentProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/comment`,
    method: 'post',
    data: data
  })
}

/**
 * 作废
 * @param data
 * @returns {AxiosPromise}
 */
export function obsoletetProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/obsolete`,
    method: 'post',
    data: data
  })
}

/**
 * 提单人撤回
 * @param data
 * @returns {AxiosPromise}
 */
export function failbackRequestProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/launcher/withdraw`,
    method: 'post',
    data: data
  })
}

/**
 * 审批人撤回
 * @param data
 * @returns {AxiosPromise}
 */
export function failbackApproverProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/approver/withdraw`,
    method: 'post',
    data: data
  })
}

/**
 * 拒绝目标
 * @param params
 * @returns {AxiosPromise}
 */
export function refuseTargetProcedureInstance (params) {
  return request({
    url: `/approval/action/refuse/target`,
    method: 'get',
    params: params
  })
}

/**
 * 拒绝
 * @param data
 * @returns {AxiosPromise}
 */
export function refuseProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/refuse`,
    method: 'post',
    data: data
  })
}

/**
 * 同意
 * @param data
 * @returns {AxiosPromise}
 */
export function agreeProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/agree`,
    method: 'post',
    data: data
  })
}

/**
 * 催办候选人
 * @param params
 * @returns {AxiosPromise}
 */
export function ergentCandidateProcedureInstance (params) {
  return request({
    url: `/approval/action/remind/candidates`,
    method: 'get',
    params: params
  })
}

/**
 * 催办
 * @param data
 * @returns {AxiosPromise}
 */
export function remindProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/remind`,
    method: 'post',
    data: data
  })
}

/**
 * 作废
 * @param data
 * @returns {AxiosPromise}
 */
export function obsoleteProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/obsolete`,
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteProcedureInstance (data) {
  data._loading = true
  return request({
    url: `/approval/action/delete`,
    method: 'post',
    data: data
  })
}

/**
 * 抄送我的消息 - 消息阅读
 * @param data
 * @returns {AxiosPromise}
 */
export function approvalFlowInstanceRead (data) {
  return request({
    url: `/approval/flow/instance/cc/read`,
    method: 'post',
    data: data
  })
}
