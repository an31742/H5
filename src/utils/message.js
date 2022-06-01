// 消息类型
const typeObj = {
  1: '', // 简单消息
  2: '内部通知',
  3: '报修处理',
  4: '报修检查',
  5: '报修报警',
  6: '检查报警'
}

// 格式化展示消息
export function formatMessage (arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    item.typeName = typeObj[item.type]
    item.icon = `micon-${item.type}`
    result.push(item)
  }

  return result
}
