import store from '@/store'
import { arr2obj, string2obj } from '@/utils/index'

// 报警等级
const level = {
  1: {
    label: '1级',
    color: '#FA5151'
  },
  2: {
    label: '2级',
    color: '#FF8931'
  },
  3: {
    label: '3级',
    color: '#FFC300'
  }
}

// 处理工单详情
const dealAppeal = (obj, key = 'detail') => {
  // 报警类型的工单转换
  if (obj.from_source !== 3) {
    return obj
  }
  const temp = string2obj(obj[key])
  const types = arr2obj(store.getters.appConfig.APPEAL_TYPE_VISION)

  const lev = level[temp.alarm_grade]
  obj[key] = `<span style="color: ${lev.color}">${lev.label}</span>    ${types[obj.appeal_type || obj.type]}`
  obj.alarm = temp

  return obj
}

// 格式化客诉单
const formatAppeal = (arr) => {
  return arr.map(item => {
    let pictures = []
    try {
      const list = item.dispatch_order.appeal_pictures || item.appeal_pictures
      pictures = list ? JSON.parse(list) : []
    } catch (e) {
      pictures = []
    }
    item.appeal_pictures = pictures

    if (item.dispatch_order) {
      item.dispatch_order = dealAppeal(item.dispatch_order, 'appeal_detail')
    } else if (item.from_source === 3) {
      item = dealAppeal(item, 'appeal_detail')
    }

    return item
  })
}

export {
  dealAppeal,
  formatAppeal
}
