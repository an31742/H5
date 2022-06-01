import moment from 'moment'

export default (_this, formModel, formObj, formRules) => {
  const clockTime = formObj.form.find(t => t.code === 'clock_time')

  const arg = {
    min: formModel._startTime,
    max: formModel._endTime
  }
  // 是传入值
  Object.entries(arg).forEach(([key, value]) => {
    if (value) {
      _this.$set(clockTime.props, key, moment(value))
    }
  })
  // 添加校验
  clockTime.props.rules = [
    {
      key: 'clock_time_range',
      validator: (val) => {
        if (moment(formModel.clock_time) < clockTime.props.min) {
          return false
        }
        if (moment(formModel.clock_time) > clockTime.props.max) {
          return false
        }
        return true
      },
      message: (val) => {
        return `打卡时间范围:${moment(clockTime.props.min).format('MM-DD HH:SS')}至${moment(clockTime.props.max).format('MM-DD HH:SS')}`
      },
      trigger: ['change', 'blur']
    }
  ]

  // // 模板的类型,根据模板类型加载 扩展业务逻辑
  _this.$watch('formModel.plan', (val) => {
    // 设置 开始时间 结束时间
    _this.$set(clockTime.props, 'min', moment(formModel._startTime))
    _this.$set(clockTime.props, 'max', moment(formModel._endTime))

    // 清空 补卡时间
    _this.$set(formModel, 'clock_time', null)
    _this.$set(formModel, 'clock_time_desc', null)
  })
}
