import moment from 'moment'

export default (_this, formModel, formObj) => {
  const keys = ['start_time', 'end_time']

  keys.forEach(key => {
    const time = formObj.form.find(t => t.code === key)
    time.props.rules = [
      {
        validator: (val) => {
          if (!formModel.start_time || !formModel.end_time) {
            return true
          }
          return moment(formModel.start_time) < moment(formModel.end_time)
        },
        message: () => {
          return key === 'end_time' ? '结束时间不能早于等于开始时间' : '开始时间不能晚于等于结束时间'
        }
      }
    ]
  })

  const duration = formObj.form.find(t => t.code === 'duration')
  duration.props.rules = [
    {
      validator: () => {
        return formModel.duration * 1 > 0
      },
      message: '请假时长不能为0',
      trigger: 'change'
    },
    {
      validator: (val) => {
        if (formModel.usable_num > 0) {
          return formModel.duration * 1 <= formModel.usable_num
        }
        return true
      },
      message: (val) => {
        const unit = formModel.unit === 2 ? '小时' : '天'
        return `${formModel.leave_vacation_type_desc || ''}时长不能超过${formModel.usable_num}${unit} `
      }
    }
  ]

  // 模板的类型,根据模板类型加载 扩展业务逻辑
  _this.$watch('formModel.leave_vacation_type', (val) => {
    // 清空 开始时间 结束时间
    _this.$set(formModel, 'start_time', null)
    _this.$set(formModel, 'end_time', null)
    _this.$set(formModel, 'duration', null)
    _this.$set(formModel, 'duration_desc', null)

    const showTime = formModel.unit === 2
    keys.forEach(key => {
      const time = formObj.form.find(t => t.code === key)
      time.props.showTime = showTime
      // console.log(' showTime', showTime)
    })
    // 设置请假时长单位
    _this.$set(formModel, 'unit', formModel.unit)
  })
  // 选择实际申请人 情况后续
  _this.$watch('formModel.applyLauncher', (val) => {
    // 清空 开始时间 结束时间
    _this.$set(formModel, 'start_time', null)
    _this.$set(formModel, 'end_time', null)
    _this.$set(formModel, 'duration', null)
    _this.$set(formModel, 'duration_desc', null)
    _this.$set(formModel, 'leave_vacation_type', null)
    _this.$set(formModel, 'leave_vacation_type_desc', null)
  })

  /// 初始化 回填 设置时长
  const showTime = formModel.unit === 2
  keys.forEach(key => {
    const time = formObj.form.find(t => t.code === key)
    time.props.showTime = showTime
    // console.log(' showTime', showTime)
  })
}
