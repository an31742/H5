// 项目中用到的一些常量
export const aMapKey = 'b996e5b6410e947540e55071b7248480'

// 表单校验错误信息
export const fieldsErrorMsg = {
  mobile: '请输入正确的手机号',
  code: '请输入正确的验证码',
  email: '请输入正确的邮箱',
  money: '请输入正确的金额（最多两位小数）'
}

// 员工端H5提交工单的入口分别对应的entry id
export const WorkOrderEntry = {
  takePlace: { label: '代客录单', value: 301 },
  selfReport: { label: '自查报事', value: 302 },
  safeGuard: { label: '工程报障', value: 303 },
  cleanGuard: { label: '环境报障', value: 304 },
  guardianGuard: { label: '秩序报障', value: 305 },
  qualityGuard: { label: '品质报障', value: 306 }
}

// 员工端APP提交工单的入口分别对应的entry id
export const AppWorkOrderEntry = {
  takePlace: { label: '代客录单', value: 701 },
  selfReport: { label: '自查报事', value: 702 },
  safeGuard: { label: '工程报障', value: 703 },
  cleanGuard: { label: '环境报障', value: 704 },
  guardianGuard: { label: '秩序报障', value: 705 },
  qualityGuard: { label: '品质报障', value: 706 }
}

// 工单来源
export const WorkOrderSource = {
  deviceCheck: 8, // 工程巡检故障上报
  deviceProvide: 9, // 工程保养故障上报
  cleanTask: 10, // 环境工作故障上报
  squenceTask: 11, // 秩序工作故障上报
  deviceError: 12, // 设备台账故障上报
  qualityTask: 22 // 品质整改故障上报
}

// 特殊工单类型
export const WorkOrderType = {
  device: 1, // 工程
  clean: 2, // 环境
  squence: 3, // 秩序
  qrcode: 4, // 二维码
  quality: 5 // 品质
}

// 基础类型工单   1：自查报事 2:代客录单  3：客户报单  8：工程巡检故障上报  9：工程保养故障上报  10:环境故障上报   11:秩序故障上报   12:设备台帐故障上报
export const BasicWorkTypes = [1, 2, 3, 8, 9, 10, 11, 12]
// 设备工单     4：工程巡检计划  5：工程保养计划
export const DeviceWorkTypes = [4, 5]
// 秩序工单    7:秩序工作计划
export const SequenceWorkTypes = [7]
// 环境工单     6：环境工作计划
export const CleanWorkTypes = [6]
// 装修工单 20:装修巡检计划
export const DecorationTypes = [20]
// 品质检查工单 17：物业联动 21：品质检查
export const QualityWorkTypes = [17, 21]
// 表单组件
export const WFE_FORM_PROPERTY_TYPE = [
  {
    label: '选择网格',
    value: 'FwGrid'
  },
  {
    label: '选择位置',
    value: 'FwPosition'
  },
  {
    label: '选择房屋',
    value: 'FwHouse'
  },
  {
    label: '选择车位',
    value: 'FwParking'
  },
  {
    label: '上传照片',
    value: 'FwUploadPhoto'
  },
  {
    label: '拍照',
    value: 'FwTakePhoto'
  },
  {
    label: '上传附件',
    value: 'FwUploadFile'
  },
  {
    label: '单行文本框',
    value: 'FwInput'
  },
  {
    label: '多行文本域',
    value: 'FwTextArea'
  },
  {
    label: '选择员工',
    value: 'FwStaff'
  },
  {
    label: '签字',
    value: 'FwSign'
  },
  {
    label: '选择日期',
    value: 'FwDate'
  },
  {
    label: '选择日期区间',
    value: 'FwDateRange'
  },
  {
    label: '选择时间',
    value: 'FwTime'
  },
  {
    label: '选择时间区间',
    value: 'FwTimeRange'
  },
  {
    label: '用户身份',
    value: 'FwUserRole'
  },
  {
    label: '星级评价',
    value: 'FwStarAppraise'
  },
  {
    label: '满意度评价',
    value: 'FwSatisfiedAppraise'
  },
  {
    label: '选择车辆',
    value: 'FwCarSelect'
  },
  {
    label: '领取仓库物料',
    value: 'FwGetMaterial'
  },
  {
    label: '上传视频',
    value: 'FwUploadVideo'
  }
]

// 审批流表单组件
export const WFE_FORM_PROVE_FORM = [
  {
    name: '文本框', // 属性名称
    code: '', // 属性编码
    type: 'FormInput', // 控件类型 文本框
    value: undefined, // 默认值
    required: true, // 是否必填
    props: {
      extra: '', // 填写提示
      min: 1,
      max: undefined,
      validate: ''
    }
  },
  {
    name: '文本域',
    code: '',
    type: 'FormTextArea',
    value: undefined,
    required: true,
    props: {
      extra: '', // 填写提示
      min: 1,
      max: 20,
      validate: ''
    }
  },
  {
    name: '单选框',
    code: '',
    type: 'FormRadioBox',
    value: undefined,
    required: true,
    props: {
      extra: '', // 填写提示
      options: []
    }
  },
  {
    name: '多选框',
    code: '',
    type: 'FormCheckbox',
    value: undefined,
    required: true,
    props: {
      extra: '',
      max: 1,
      min: 1,
      options: []
    }
  },
  {
    name: '下拉框',
    code: '',
    type: 'FormSelect',
    value: undefined,
    required: true,
    props: {
      extra: '',
      options: []
    }
  },
  {
    name: '金额',
    code: '',
    type: 'FormMoney',
    value: 0,
    required: true,
    props: {
      extra: '',
      min: undefined,
      max: undefined,
      unit: '元',
      showRMB: true
    }
  },
  {
    name: '省市区',
    code: '',
    type: 'FormLocation',
    value: undefined,
    required: true,
    props: {
      extra: '',
      current: true
    }
  },
  {
    name: '地理位置',
    code: '',
    type: 'FormPosition',
    value: undefined,
    required: true,
    props: {
      extra: '',
      dataSource: 1
    }
  },
  {
    name: '日期',
    code: '',
    type: 'FormDatetime',
    value: undefined,
    required: true,
    props: {
      extra: '',
      showTime: true,
      current: false
    }
  },
  {
    name: '日期区间',
    code: '',
    type: 'FormRangePicker',
    value: undefined,
    required: true,
    props: {
      extra: '',
      showTime: true
    }
  },
  {
    name: '图片',
    code: '',
    type: 'FormUploadImage',
    value: undefined,
    required: true,
    props: {
      min: 0,
      max: 5
    }
  },
  {
    name: '附件',
    code: '',
    type: 'FormUploadFile',
    value: undefined,
    required: true,
    props: {
      min: 0,
      max: 5
    }
  },
  {
    name: '选择审批单',
    code: '',
    type: 'FormProceduleSelect',
    value: undefined,
    required: true,
    props: {
      permission: []
    }
  },
  {
    name: '关联组织架构',
    code: '',
    type: 'FormLinkOrganize',
    value: undefined,
    required: true,
    props: {
      permission: '',
      current: true
    }
  },
  {
    name: '关联员工',
    code: '',
    type: 'FormLinkStaff',
    value: undefined,
    required: true,
    props: {
      permission: '',
      current: true
    }
  }
]

// 审批请假单位
export const VacationUnit = [
  // {
  //   value: 1,
  //   label: '分钟'
  // },
  {
    value: 2,
    label: '小时'
  },
  {
    value: 3,
    label: '天'
  }
]

// 首页快捷入口对应的外部链接
const domainExtra = process.env.VUE_APP_ENVIRONMENT === '-test' ? '.fw' : ''
const ishttps = document.location.protocol === 'https:'
export const outEntryLinks = {
  'Payment': `${ishttps ? 'https' : 'http'}://finance${process.env.VUE_APP_ENVIRONMENT}${domainExtra}.gmtech.top/app/`
}

// 上门回收需要的常量
export const homeReclaim = {
  // 估价单
  evaluation: 'evaluation',
  // 回收订单
  reclaim: 'reclaim',
  // 代客提单
  valet: 'valet',
  // 待估价
  STATUS_NO_EVALUATE: 'status_no_evaluate',
  // 已估价
  STATUS_EVALUATE: 'status_evaluate',
  // 估价单--已完成
  EVALUATION_STATUS_END: 'evaluation_status_end',
  // 估价单--已取消
  EVALUATION_STATUS_CANCEL: 'evaluation_status_CANCEL',
  // 待取件
  STATUS_NO_PICK_UP: '1', // status_no_pick_up
  // 待确认
  TO_BE_CONFIRMED: '3', // to_be_confirmed
  // 报价中
  IN_QUOTATION: '2', // 'in_quotation'
  // 待支付
  TO_BE_PAID: '4', // to_be_paid'
  // 已完成
  ORDER_END: '5', // 'order_end'
  // 已取消
  ORDER_CANCEL: '6', // 'order_cancel'
  // 代客提单--待估价
  STAFF_STATUS_NO_EVALUATE: 'staff_status_no',
  // 代客提单--已估价
  STAFF_STATUS_EVALUATE: 'staff_status',
  // 代客提单--已完成
  STAFF_EVALUATION_STATUS_END: 'staff_status_end',
  // 代客提单--已取消
  STAFF_EVALUATION_STATUS_CANCEL: 'staff_status_cancel'
}
// 默认icon\logo
export const defaultTheme = {
  favicon: 'aiforward_favicon.png',
  login_logo: 'aiforward_login_logo.png',
  pc_top_logo: 'aiforward_top_logo.svg',
  copyright: 'Copyright ©️ 锋物科技',
  staff_use_agreement: 'https://sso.gmtech.top/policy_2021_12_20/useagreement1205-2.html', // 员工用户协议
  user_use_agreement: 'https://sso.gmtech.top/policy_2021_12_20/useagreement1205-2.html', // 业主用户协议
  staff_protect_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policyprivacy1202-2.html', // 员工个人信息保护政策
  user_protect_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policyprivacy1202-1.html', // 业主个人信息保护政策
  staff_biometric_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policybiometrics1205-2.html', // 员工个人生物识别信息保护政策
  user_biometric_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policybiometrics1205-1.html', // 业主个人生物识别信息保护政策
  staff_minor_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policychildinfo1205-2.html', // 员工未成年人个人信息保护政策
  user_minor_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policychildinfo1205-1.html', // 业主未成年人个人信息保护政策
  staff_other_sensitive_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policysensinfo1205-2.html', // 员工其他个人敏感信息保护政策
  user_other_sensitive_agreement: 'https://sso.gmtech.top/policy_2021_12_20/policysensinfo1205-1.html' // 业主其他个人敏感信息保护政策
}
export const getIFrameUrlMap = () => {
  // 配置 映射的地址 使用主应用域名
  const host = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 'pms-test.fw.gmtech.top' : 'pms.gmtech.top' // document.domain

  // 业财
  // const finance = {
  //   youhuiguize: [`//${host}/finance/outer/discountsDetail`, `id=0`],
  //   shoufeibiaozhun: [`//${host}/finance/outer/ruleDetail`, `id=0`],
  //   tuikuanshenqing: [`//${host}/finance/outer/refundDetail`, `refund_order_id=0&refund_type=1`],
  //   jianmianguanli: [`//${host}/finance/outer/remissionDetail`, `id=0`],
  //   fapiaoshenqing: [`//${host}/finance/outer/invoiceDetail`, `invoiceId=0&projectId=0`],
  //   shoufeijihua: [`//${host}/finance/outer/planDetail`, `planId=0&projectId=0`]
  // }
  // // 租赁合
  // // 状态叫contractStatus
  // // 里面对应退租：retreat    续租：renewal。作废：abandon 新建 ：add  变更:change
  // const rent = {
  //   hetongxinzu: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=add`],
  //   hetongxuzu: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=renewal`],
  //   hetongbinageng: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=change`],
  //   hetongtuizu: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=retreat`],
  //   hetongzuofei: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=abandon`]
  // }

  // 仓库
  //   采购申请：       25
  // 领用申请:          26
  // 调拨登记：        27
  // 归还申请：        28
  // 固定资产报废： 29
  const store = {
    caigoushenqingv2: [`//${host}/storemanage/outer/procurement/detail`, `id=0`],
    lingyongshenqingv2: [`//${host}/storemanage/outer/receive/detail`, `id=0`],
    diaobodengjiv2: [`//${host}/storemanage/outer/transfer/detail`, `id=0`],
    guihuanshenqingv2: [`//${host}/storemanage/outer/return/detail`, `id=0`],
    gudingzichanbaofeiv2: [`//${host}/storemanage/outer/capitalscrap/detail`, `id=0`]
  }

  // 装修
  // const decorate = {
  //   zhuangxiuziliao: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=add`]
  // }
  // // 报废
  // const scrap = {
  //   baofeiguanli: [`//${host}/rent/outer/contract/detail`, `id=0&contractStatus=add`]
  // }
  return { ...store }
}
export const IFrameUrlMap = getIFrameUrlMap()
