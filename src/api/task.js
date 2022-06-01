import request from '@/utils/request'

/* 工程相关 */
/**
 * 工程任务详情
 *  work_order_record_id  string  Y
 */
export function minipDeviceTaskInfo (params) {
  return request({
    url: `/minip-staff/{appId}/device/task/get`,
    method: 'get',
    params
  })
}

/**
 * 获取检查项
 *  id  int  Y
 *  project int Y 项目类型， 1-巡检项 2-保养项
 */
export function minipDeviceCheckListGet (params) {
  return request({
    url: `/minip-staff/{appId}/device/task/checklist/get`,
    method: 'get',
    params
  })
}

/**
 * 提交检查项
 *  task_id  int  Y
 *  device_id   int  Y
 *  checklist   array  Y
 */
export function minipDeviceCheckListCommit (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/device/task/checklist/commit`,
    method: 'post',
    data
  })
}

/**
 * 已提交检查项详情
 *  id  int  Y
 */
export function minipDeviceCheckListCommitGet (params) {
  return request({
    url: `/minip-staff/{appId}/device/task/checklist/commit/get`,
    method: 'get',
    params
  })
}

/**
 * 设备详情
 *  id  int  Y
 */
export function minipDeviceRecordGet (params) {
  return request({
    url: `/minip-staff/{appId}/device/record/get`,
    method: 'get',
    params
  })
}

/**
 * 工单关联维修日志
 *  device_id   int  Y
 *  commit_id   int  Y
 *  work_order_id   string  Y
 *  work_order_record_id   string  Y
 */
export function minipDeviceRepairAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/device/repair/add`,
    method: 'post',
    data
  })
}

/* 环境相关 */
/**
 * 环境任务详情
 *  work_order_record_id  string  Y
 */
export function minipCleaningTaskInfo (params) {
  return request({
    url: `/minip-staff/{appId}/cleaning/task/get`,
    method: 'get',
    params
  })
}

/**
 * 获取检查项
 *  id  int  Y
 */
export function minipCleaningCheckListGet (params) {
  return request({
    url: `/minip-staff/{appId}/cleaning/task/checklist/get`,
    method: 'get',
    params
  })
}

/**
 * 提交检查项
 *  task_id  int  Y
 *  location_point_id   int  Y
 *  checklist   array  Y
 *  checkin_images   string  N
 */
export function minipCleaningCheckListCommit (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/cleaning/task/checklist/commit`,
    method: 'post',
    data
  })
}

/**
 * 已提交检查项详情
 *  id  int  Y
 */
export function minipCleaningCheckListCommitGet (params) {
  return request({
    url: `/minip-staff/{appId}/cleaning/task/checklist/commit/get`,
    method: 'get',
    params
  })
}

/**
 * 工单关联维修日志
 *  location_point_id   int  Y
 *  commit_id   int  Y
 *  work_order_id   string  Y
 *  work_order_record_id   string  Y
 */
export function minipCleaningRepairAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/cleaning/repair/add`,
    method: 'post',
    data
  })
}

/* 秩序相关 */
/**
 * 秩序任务详情
 *  work_order_record_id  string  Y
 */
export function minipGuardianTaskInfo (params) {
  return request({
    url: `/minip-staff/{appId}/guardian/task/get`,
    method: 'get',
    params
  })
}

/**
 * 获取检查项
 *  id  int  Y
 */
export function minipGuardianCheckListGet (params) {
  return request({
    url: `/minip-staff/{appId}/guardian/task/checklist/get`,
    method: 'get',
    params
  })
}

/**
 * 提交检查项
 *  task_id  int  Y
 *  location_point_id   int  Y
 *  checklist   array  Y
 *  checkin_images   string  N
 */
export function minipGuardianCheckListCommit (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/guardian/task/checklist/commit`,
    method: 'post',
    data
  })
}

/**
 * 已提交检查项详情
 *  id  int  Y
 */
export function minipGuardianCheckListCommitGet (params) {
  return request({
    url: `/minip-staff/{appId}/guardian/task/checklist/commit/get`,
    method: 'get',
    params
  })
}

/**
 * 工单关联维修日志
 *  location_point_id   int  Y
 *  commit_id   int  Y
 *  work_order_id   string  Y
 *  work_order_record_id   string  Y
 */
export function minipGuardianRepairAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/guardian/repair/add`,
    method: 'post',
    data
  })
}

/* 二维码故障上报 */
/**
 * 上报设备二维码损毁
 *  id   int  Y   设备id
 */
export function minipDeviceRecordQrcodeReport (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/device/record/qrcode/report`,
    method: 'post',
    data
  })
}
/*  */
/**
 * 装修工单的taskInfo
 *  id   int  Y   设备id
 */
export function patrolTaskInfo (params) {
  return request({
    url: `/patrol/task/get`,
    method: 'get',
    params
  })
}

/* 品质相关 */
/**
 * 品质任务详情
 * work_order_record_id  string  Y
 */
export function minipQualityTaskInfo (params) {
  return request({
    url: `/minip-staff/{appId}/quality/task/get`,
    method: 'get',
    params
  })
}
/**
 * 装修工单的巡检项
 *  id   int  Y   设备id
 */
export function patrolChecklistInfo (params) {
  return request({
    url: `/patrol/task/checklist/get`,
    method: 'get',
    params
  })
}

/**
 * 获取检查项
 * id  string  Y
 */
export function minipQualityTaskCheckListGet (params) {
  return request({
    url: `/minip-staff/{appId}/quality/task/checklist/get`,
    method: 'get',
    params
  })
}
/**
 * 提交装修工单的巡检项
 *
 */
export function patrolChecklistCommit (data) {
  return request({
    url: `/patrol/task/checklist/commit`,
    method: 'post',
    data: data
  })
}
/**
 * 提交装修工单的巡检项
 *
 */
export function patrolChecklistCommitGet (params) {
  return request({
    url: `/patrol/task/checklist/commit/get`,
    method: 'get',
    params
  })
}

/**
 * 提交检查项
 * id  string  Y
 */
export function minipQualityTaskCheckListCommit (data) {
  return request({
    url: `/minip-staff/{appId}/quality/task/checklist/commit`,
    method: 'post',
    data
  })
}

/**
 * 查看检查项详情
 * id  string  Y
 */
export function minipQualityTaskCheckListCommitGet (params) {
  return request({
    url: `/minip-staff/{appId}/quality/task/checklist/commit/get`,
    method: 'get',
    params
  })
}

/**
 * 工单关联维修日志
 *  location_point_id   int  Y
 *  commit_id   int  Y
 *  work_order_id   string  Y
 *  work_order_record_id   string  Y
 */
export function minipQualityRepairAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/quality/repair/add`,
    method: 'post',
    data
  })
}
