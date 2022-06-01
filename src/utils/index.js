import defaultSettings from '../settings'

const title = defaultSettings.title || '业主端'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}
// 获取url参数，返回一个对象
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 对象深拷贝
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 重置对象
export function resetObject (obj) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = []
    } else {
      obj[key] = ''
    }
  }

  return obj
}

// 对象数组转字符串数组
export function objArray2StringArray (arr = [], key = 'name') {
  return arr.map(item => item[key])
}

// 获取页面title
export function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}

// 判断浏览器是否支持webp格式
export function supportWebp () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

// 去掉url中query参数
export function deleteQuery (to) {
  const path = to.path
  const query = to.query
  delete query.code
  delete query.state
  const arr = []
  for (const key in query) {
    arr.push(`${key}=${encodeURIComponent(query[key])}`)
  }

  return `${path}?${arr.join('&')}`
}

// 字符串转对象
export function string2obj (str) {
  if (!str) { return null }

  try {
    str = JSON.parse(str)
  } catch (e) {
    str = null
  }

  return str
}

// 数组转对象
export function arr2obj (arr = [], key = 'value', value = 'label') {
  const obj = {}
  arr.forEach(item => {
    obj[item[key]] = item[value]
  })

  return obj
}

// 是否是微信浏览器
export function isWeixin () {
  const ua = navigator.userAgent.toLowerCase()
  const match = ua.match(/MicroMessenger/i)

  return match && match[0] === 'micromessenger'
}

// 判断是否是APP
export function isApp () {
  const ua = navigator.userAgent

  return ua.indexOf('fwStaffApp') > -1
}

// 获取当前的版本号
export function getVersion () {
  const ua = navigator.userAgent
  const temp = ua.split('/')
  const str = temp[temp.length - 1].split('.').join('')
  if (isNaN(Number(str))) {
    return ''
  }
  return temp[temp.length - 1]
}

function toNum (str) {
  const a = str.toString()
  // 也可以这样写 var c=a.split(/\./);
  const c = a.split('.')
  const numPlace = ['', '0', '00', '000', '0000']
  const r = numPlace.reverse()
  for (let i = 0; i < c.length; i++) {
    const len = c[i].length
    c[i] = r[len] + c[i]
  }
  const res = c.join('')
  return res
}

// 是否显示下载相关页面(1.2.3之后的版本，包括1.2.3)
export function isShowDownload (oldVersion) {
  const nowVersion = getVersion()
  if (!nowVersion) {
    return false
  }
  const now = toNum(nowVersion)
  const old = toNum(oldVersion)
  console.log(now >= old)
  return now > old
}

export function isIosApp () {
  const ua = navigator.userAgent

  return ua.indexOf('fwStaffAppIos') > -1
}

// 通过UA判断是不是IOS
export function isIos () {
  const u = navigator.userAgent

  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

// 通过UA判断是不是安卓里的App
export function isAndroidApp () {
  const u = navigator.userAgent

  return u.indexOf('fwStaffAppAndriod') > -1
}

// 通过id获取名称
export function getNameByValue (arr, id, key = 'name') {
  const list = arr.filter(item => item.value === id)
  return list[0] ? list[0][key] : ''
}

// 调起拨打手机号功能
export function callPhone (phoneNumber) {
  window.location.href = `tel://${phoneNumber}`
}

// 手机号加密
export function phoneEncryption (phone) {
  if (!phone) return ''
  const reg = /(\d{3})\d{4}(\d{4})/
  return phone.replace(reg, '$1****$2')
}

// 高亮关键字
export function keywordsColorful (str, key) {
  const reg = new RegExp('(' + key + ')', 'g')

  return str.replace(reg, "<font style='color:#E1AA6C;'>$1</font>")
}

// 通过value获取label
export function getItemByValue (options = [], value, key = 'value') {
  const item = options.find(item => item[key] === value)

  return item ? item.label : ''
}

export function getItemByValueLabel (options, value) {
  if (!options) {
    return {}
  }
  const item = options.find(item => item.value === value)
  return item || {}
}

// 金额转汉字
export function convertCurrency (money) {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 9999999999999.98 // 最大值
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts

  if (money === '') {
    return ''
  }

  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }

  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }

  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }

  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }

  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }

  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }

  return chineseStr
}

// 改变title，由于IOS版微信下，页面加载完成后就不会再监听title改变事件，所以这里用模拟iframe的方法改变title
export function changeTitle (title) {
  const iframe = document.createElement('IFRAME')
  iframe.className = 'invisible'
  const body = document.body
  document.title = title

  setTimeout(() => {
    iframe.remove()
  }, 0)
  body.appendChild(iframe)
}

// 二维码开门 url 转json
export function mapOpenDoorUrl2Params (url) {
  const mapOpenDoor = { community_id: 'i',
    access_type: 't',
    access_device_mac: 'm',
    unlock_code: 'c',
    community_name: 'n'
  }
  const param = param2Obj(url)
  const mapOpenDoorParam = {}
  Object.entries(mapOpenDoor).map(([key, value]) => {
    mapOpenDoorParam[key] = param[value]
  })

  return mapOpenDoorParam
}

// 分 -> 元
export function fen2yuan (str) {
  let res = ''

  try {
    res = parseFloat(str / 100).toFixed(2)
  } catch (e) {}

  return res
}
export function isHttp (data) {
  return /^http.*/.test(data)
}
/**
 * 将元转成分
 * @param yuan
 * @returns {number}
 */
export function yuanToCent (yuan) {
  if (!yuan) {
    return 0
  }
  return Math.round(Number(yuan) * 100)
}

export function centToYuan (dataStr) {
  if (!dataStr) {
    return '0.00'
  }
  return '￥' + (Number(dataStr) / 100).toFixed(2)
}
export function centToYuan1 (dataStr) {
  if (!dataStr) {
    return 0.00
  }
  return (Number(dataStr) / 100).toFixed(2)
}
