export default [
  {
    url: '/minip-staff/29/schedule/plan/list',
    type: 'post',
    response: _ => {
      return {
        'code': 200,
        'msg': 'ok',
        'data': {
          'now_time': 1715000000,
          'list': [
            {
              'last_end_time': 1610000000, // 上一班次结束时间
              'start_time': 1620000000, // 开始上班时间
              'check_in_end_time': 1630000000, // 签到结束时间
              'split_time': 1640000000, // 上下班分割时间
              'check_out_start_time': 1650000000, // 签退开始时间
              'end_time': 1660000000, // 下班时间
              'next_split_time': 1670000000,
              'term_id': 30, // 班次编号
              'plan_id': 10, // 排班编号
              'start_clock_time': 1610000000, // 上班打卡时间
              'start_status': 1, // 从pubsrv/config/get中获取SCHEDULE_CHECK_STATUS  上班打卡状态
              'end_clock_time': 0, // 下班打卡时间
              'end_status': 6, // 从pubsrv/config/get中获取SCHEDULE_CHECK_STATUS    下班打卡状态
              'check_in': 1, // 是否需要签到 1需要 0不需要
              'check_out': 1 // 是否需要签退 1需要 0不需要
            },
            {
              'last_end_time': 1710000000, // 上一班次结束时间
              'start_time': 1720000000, // 开始上班时间
              'check_in_end_time': 1730000000, // 签到结束时间
              'split_time': 1740000000, // 上下班分割时间
              'check_out_start_time': 1750000000, // 签退开始时间
              'end_time': 1760000000, // 下班时间
              'next_split_time': 1770000000,
              'term_id': 30, // 班次编号
              'plan_id': 10, // 排班编号
              'start_clock_time': 0, // 上班打卡时间
              'end_clock_time': 0, // 下班打卡时间
              'start_status': 0, // 从pubsrv/config/get中获取SCHEDULE_CHECK_STATUS  上班打卡状态
              'end_status': 0, // 从pubsrv/config/get中获取SCHEDULE_CHECK_STATUS    下班打卡状态
              'check_in': 1, // 是否需要签到 1需要 0不需要
              'check_out': 1 // 是否需要签退 1需要 0不需要
            }
          ]
        },
        'time': '2020-09-18 15:59:56'
      }
    }
  },
  {
    url: '/minip-staff/29/group/distance',
    type: 'post',
    response: _ => {
      return {
        'code': 200,
        'msg': 'ok',
        'data': {
          'distance': 100, // 单位米，200米即超出打开范围
          'conf_distance': 200 // 配置的打卡范围
        },
        'time': '2020-09-18 15:59:56'
      }
    }
  },
  {
    url: '/minip-staff/29/schedule/clock/add',
    type: 'post',
    response: _ => {
      return {
        'code': 200,
        'msg': 'ok',
        'data': { },
        'time': '2020-09-18 15:59:56'
      }
    }
  }
]
