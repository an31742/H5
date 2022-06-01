import request from '@/utils/request'

/**
 * 用户查询
 *  room_id  int  N   房屋id
 *  user_name  string  N   姓名
 *  user_mobile  string  N   电话
 */
export function wfeUseSuggestList (params) {
  return request({
    url: `/wfe/user/suggest/list`,
    method: 'get',
    params
  })
}

/**
 * 房屋查询
 */
export function wfeEstateTree (params) {
  return request({
    url: `/wfe/estate/tree`,
    method: 'get',
    params: params
  })
}

/**
 * 服务分类接口
 *  entry_id  int  Y   入口id
 */
export function wfeInstanceServiceList (params) {
  return request({
    url: `/wfe/flow/instance/service/list`,
    method: 'get',
    params
  })
}

/**
 * 获取当前用户所能看到的所有服务分类
 */
export function wfeFlowInstanceServicesAll (params) {
  return request({
    url: `/wfe/flow/instance/services-all`,
    method: 'get',
    params
  })
}

/**
 * 服务表单
 *  biz_service_id  string  Y   服务id
 */
export function wfeFlowInstanceLaunchForm (params) {
  return request({
    url: `/wfe/flow/instance/launch/form`,
    method: 'get',
    params
  })
}

/**
 * 工单录入
 *  user_id  string  Y  用户id
 *  form  object  Y   表单数据
 *  room_id  int  N   房间id
 *  biz_service_id  string  Y   服务分类
 *  biz_subservice_id  string  Y   服务二级分类
 *  is_urgent  int  N   是否加急
 *  source  int  Y   WFE_FLOW_INSTANCE_SOURCE
 *  from  int  Y   WFE_FLOW_INSTANCE_FROM
 */
export function wfeFlowInstanceLaunch (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/launch`,
    method: 'post',
    data
  })
}
/**
 * 临客工单录入
 *
 */
export function wfeFlowInstanceLaunchTemporary (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/launch/temporary`,
    method: 'post',
    data
  })
}
// 转办工单
export function transferOrder (data) {
  return request({
    url: `/wfe/flow/instance/launch/transfer`,
    method: 'post',
    data: data
  })
}

/**
 * 待办列表
 *  biz_service_id  string  N   服务分类
 *  biz_node_code  string N   服务分类
 *  start_time  time N   开始时间
 *  end_time  time N   结束时间
 *  source  int N   来源
 *  is_overtime  int N   是否超时
 *  status  int N   状态
 *  page  int N   页码
 *  page_size  int N   每页条数
 */
export function wfeFlowInstanceTodoList (params) {
  return request({
    url: `/wfe/flow/instance/todo/list`,
    method: 'get',
    params
  })
}

/**
 * 待办列表-新加入下载离线工单需要的数据
 *  biz_service_id  string  N   服务分类
 *  biz_node_code  string N   服务分类
 *  start_time  time N   开始时间
 *  end_time  time N   结束时间
 *  source  int N   来源
 *  is_overtime  int N   是否超时
 *  status  int N   状态
 *  page  int N   页码
 *  page_size  int N   每页条数
 */
export function minipStaffFlowInstanceTodoList (params) {
  return request({
    url: `/minip-staff/flow/instance/todo/list`,
    method: 'get',
    params
  })
}

/**
 * 待办统计
 *  参数同待办列表
 */
export function wfeFlowInstanceTodoStatics (params) {
  return request({
    url: `/wfe/flow/instance/todo/statistics`,
    method: 'get',
    params
  })
}

/**
 * 待办详情
 *  node_instance_id  string  N   节点示例
 */
export function wfeFlowInstanceTodoInfo (params) {
  return request({
    url: `/wfe/flow/instance/todo/info`,
    method: 'get',
    params
  })
}

/**
 * 使用的节点列表
 */
export function wfeFlowInstanceUsedBizNodeList () {
  return request({
    url: `/wfe/flow/instance/used/biz-node-list`,
    method: 'get',
    params: {}
  })
}

/**
 * 工单列表
 *  biz_service_id  string  N   服务分类
 *  biz_node_code  string N   服务分类
 *  start_time  time N   开始时间
 *  end_time  time N   结束时间
 *  launcher  string N   提单人，员工为 B#{{ID}}，住户为C#{{ID}}
 *  source  int N   来源
 *  grid_id  int N   网格
 *  room_id  int N   房屋
 *  is_overtime  int N   1是 0否
 *  overtime_level  int N   超时等级
 *  status  int N   状态：1处理中 2已挂起 3已停止 4已完成
 *  page  int N   页码
 *  page_size  int N   每页条数
 */
export function wfeFlowInstanceList (params) {
  return request({
    url: `/wfe/flow/instance/list`,
    method: 'get',
    params
  })
}

/**
 * 提单人建议接口
 *  key  string  N   关键字
 */
export function wfeFlowInstanceLauncherSearch (params) {
  return request({
    url: `/wfe/flow/instance/launcher/search`,
    method: 'get',
    params
  })
}

/**
 * 工单统计
 *  参数同工单列表
 */
export function wfeFlowInstanceStatics (params) {
  return request({
    url: `/wfe/flow/instance/statistics`,
    method: 'get',
    params
  })
}

/**
 * 工单详情
 *  id  string  N
 */
export function wfeFlowInstanceGet (params) {
  return request({
    url: `/wfe/flow/instance/get`,
    method: 'get',
    params
  })
}

/**
 * 工单轨迹
 *  flow_instance_id  string  N
 */
export function wfeFlowInstanceLocus (params) {
  return request({
    url: `/wfe/flow/instance/locus`,
    method: 'get',
    params
  })
}

/**
 * 关单
 *  flow_instance_id  string  N
 *  remarks   string  N
 */
export function wfeFlowInstanceOperateClose (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/close`,
    method: 'post',
    data
  })
}

/**
 * 追记
 *  flow_instance_id  string  N
 *  node_instance_id  string  N
 *  content   string  N
 *  pictures   string  N
 */
export function wfeFlowInstanceOperateAddNotes (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/add-notes`,
    method: 'post',
    data
  })
}

/**
 * 督办
 *  flow_instance_id  string  Y
 *  node_instance_id  string  Y
 *  content   string  N
 */
export function wfeFlowInstanceOperateAddSupervise (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/add-supervise`,
    method: 'post',
    data
  })
}

/**
 * 加急
 *  flow_instance_id  string  Y
 *  reason   string  N
 */
export function wfeFlowInstanceOperateUrgent (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/urgent`,
    method: 'post',
    data
  })
}

/**
 * 解挂
 *  flow_instance_id  string  Y
 */
export function wfeFlowInstanceOperateHangRelease (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/hang-release`,
    method: 'post',
    data
  })
}

/**
 * 催单
 *  flow_instance_id  string  Y
 *  node_instance_id   string  Y
 */
export function wfeFlowInstanceOperateRemind (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/remind`,
    method: 'post',
    data
  })
}

/**
 * 挂起
 *  flow_instance_id  string  Y
 *  hang_expire   time  Y
 *  hang_reason   string  Y
 */
export function wfeFlowInstanceOperateHang (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/hang`,
    method: 'post',
    data
  })
}

/**
 * 转单
 *  flow_instance_id  string  Y
 *  node_instance_id  string  Y
 *  trans_to  string  Y
 *  reason  string  Y
 */
export function wfeFlowInstanceOperateTrans (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/trans`,
    method: 'post',
    data
  })
}

/**
 * 转单候选人
 *  node_instance_id  string  N
 */
export function wfeFlowInstanceOperateTransCandidates (params) {
  return request({
    url: `/wfe/flow/instance/operate/trans-candidates`,
    method: 'get',
    params
  })
}

/**
 * 抢单
 *  flow_instance_id  string  Y
 *  node_instance_id  string  Y
 */
export function wfeFlowInstanceOperateGrab (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/operate/grab`,
    method: 'post',
    data
  })
}

/**
 * 流转
 *  input  string  Y
 *  node_instance_id  string  Y
 */
export function wfeFlowInstanceHandleNext (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/handle/next`,
    method: 'post',
    data
  })
}

/**
 * 回退
 *  target_node_id  string  Y
 *  node_instance_id  string  Y
 */
export function wfeFlowInstanceHandleBack (data) {
  data._loading = true
  return request({
    url: `/wfe/flow/instance/handle/back`,
    method: 'post',
    data
  })
}

/**
 * 工单编辑接口
 * @param params
 * @returns {AxiosPromise}
 */
export function updateFlowInstance (params) {
  return request({
    url: `/wfe/flow/instance/operate/update-flow-instance`,
    method: 'post',
    params: params
  })
}

/**
 * 工单节点接口
 * @param params
 * @returns {AxiosPromise}
 */
export function updateNodeInstanceForm (params) {
  return request({
    url: `/wfe/flow/instance/operate/update-node-instance-form`,
    method: 'post',
    data: params
  })
}

/**
 * 获取工单服务子类接口
 * @param params
 * @returns {AxiosPromise}
 */
export function getSubservice (params) {
  return request({
    url: `/wfe/biz/open/biz-subservice-list`,
    method: 'get',
    params: params
  })
}

/**
 * 获取协办人列表数据
 * @param params
 * @returns {AxiosPromise}
 */
export function getAssistCandidateList (params) {
  return request({
    url: `/wfe/flow/instance/operate/co-candidates-search`,
    method: 'get',
    params: params
  })
}

/**
 * 查询协办人
 * @param params
 * @returns {AxiosPromise}
 */
export function getAssistCandidates (params) {
  return request({
    url: `/wfe/flow/instance/operate/co-candidates-get`,
    method: 'get',
    params: params
  })
}

/**
 * 设置协同办公人员
 * @param data
 * @returns {AxiosPromise}
 */
export function setAssistCandidate (data) {
  return request({
    url: `/wfe/flow/instance/operate/co-candidates-set`,
    method: 'post',
    data: data
  })
}

/**
 * 查询多个服务分类接口
 *  entry_ids  string  Y  入口id
 */
export function wfeInstanceServiceListMultiple (params) {
  return request({
    url: `/wfe/flow/instance/service/list-multiple`,
    method: 'get',
    params
  })
}

/**
 * 有偿工单类别列表
 * @param data
 * @returns {AxiosPromise}
 */
export function calssList (params) {
  return request({
    url: `/wfe/compensation/classification/list`,
    method: 'get',
    params
  })
}
/**
 * 有偿工单服务列表
 * @param data
 * @returns {AxiosPromise}
 */
export function serviceList (params) {
  return request({
    url: `/wfe/compensation/service-item/list`,
    method: 'get',
    params
  })
}

/**
 * 有偿工单材料列表
 * @param data
 * @returns {AxiosPromise}
 */
export function materialList (params) {
  return request({
    url: `/wfe/compensation/material/list`,
    method: 'get',
    params
  })
}
/**
 * 添加有偿工单明细
 * @param data
 * @returns {AxiosPromise}
 */
export function costAdd (data) {
  return request({
    url: `/wfe/compensation/cost-detail/add`,
    method: 'post',
    data: data
  })
}

/**
 * 获取有偿工单合同信息
 *  * @param data
 * @returns {AxiosPromise}
 */
export function contractGet (params) {
  console.log(params)
  return request({
    url: `/wfe/compensation/cost-detail/contract-get`,
    method: 'get',
    params
  })
}
/**
 * 获取明细表关联的材料/服务信息
 *  * @param data
 * @returns {AxiosPromise}
 */
export function relationshipGet (params) {
  console.log(params)
  return request({
    url: `/wfe/compensation/cost-detail/relationship-list`,
    method: 'get',
    params
  })
}
/**
 * 修改明细
 *  * @param data
 * @returns {AxiosPromise}
 */
export function updateHandleState (params) {
  console.log(params)
  return request({
    url: `/wfe/compensation/cost-detail/update-handle-state`,
    method: 'post',
    data: params
  })
}
// 删除明细
export function deleteHandleState (params) {
  console.log(params)
  return request({
    url: `/wfe/compensation/cost-detail/delete`,
    method: 'post',
    data: params
  })
}

/**
 * 有偿工单-创建订单
 *  * @param data
 * @returns {AxiosPromise}
 */
export function orderAdd (data) {
  return request({
    url: `/wfe/compensation/payment/order-add`,
    method: 'post',
    data: data
  })
}
