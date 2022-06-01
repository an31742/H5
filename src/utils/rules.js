// 输入校验规则

const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
const urlReg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
const pwdReg = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/
// const strongPwdReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,16}$/ // 强密码验证，8-16位，字符、数字、字母至少两种，不能有空格、火星文
const strongPwdReg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/ // 强密码验证，8-16位，字符、数字、字母至少两种，不能有空格、火星文

export default {
  mobile: val => /^1[3456789]\d{9}$/.test(val), // 手机号验证
  nationalId: val => /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(val), // 身份证号验证
  money: val => { // 金额验证
    const idx = val.indexOf('.')
    return idx < 0 || val.substring(idx).length <= 3
  },
  email: val => emailReg.test(val), // 邮箱验证
  password: val => pwdReg.test(val), // 密码验证
  link: val => /^(https?:|mailto:|tel:)/.test(val), // 外部连接
  url: val => urlReg.test(val), // url验证
  lower: val => /^[a-z]+$/.test(val), // 小写字母验证
  upper: val => /^[A-Z]+$/.test(val), // 大写字母验证
  alphabets: val => /^[A-Za-z]+$/.test(val), // 字母验证
  string: val => typeof val === 'string' || val instanceof String, // 字符串验证
  array: val => { // 数组验证
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(val) === '[object Array]'
    }

    return Array.isArray(val)
  },
  strongPassword: val => strongPwdReg.test(val)
}
