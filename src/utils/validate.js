import { Validator } from 'vee-validate'

// 验证电话号码
Validator.extend('mobile', {
  validate: value => /^1[3456789]\d{9}$/.test(value)
})

// 验证金额
Validator.extend('money', {
  validate: value => {
    const idx = value.indexOf('.')

    return idx < 0 || value.substring(idx).length <= 3
  }
})

// 验证邮箱
Validator.extend('email', {
  validate: value => {
    const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')

    return reg.test(value)
  }
})

export default Validator

// // 外部链接校验
// const isExternal = (path) => {
//   return /^(https?:|mailto:|tel:)/.test(path)
// }
// // url校验
// const validURL = (url) => {
//   const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
//   return reg.test(url)
// }
// // 小写字母校验
// const validLowerCase = (str) => {
//   const reg = /^[a-z]+$/
//   return reg.test(str)
// }
// // 大写字母校验
// const validUpperCase = (str) => {
//   const reg = /^[A-Z]+$/
//   return reg.test(str)
// }
// // 字母校验
// const validAlphabets = (str) => {
//   const reg = /^[A-Za-z]+$/
//   return reg.test(str)
// }
// // 邮箱校验
// const validEmail = (email) => {
//   // eslint-disable-next-line
//   const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return reg.test(email)
// }
// // 字符串类型校验
// const isString = (str) => {
//   return typeof str === 'string' || str instanceof String
// }
// // 数组校验
// const isArray = (arg) => {
//   if (typeof Array.isArray === 'undefined') {
//     return Object.prototype.toString.call(arg) === '[object Array]'
//   }
//   return Array.isArray(arg)
// }
