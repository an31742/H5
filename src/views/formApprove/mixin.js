// 表单控件mixin
import validateRules from '@/utils/rules'

export default {
  data () {
    return {
      formRulesReg: {
        number: '',
        letter: '',
        chinese: '',
        phone: '',
        nationalId: ''
      }
    }
  },
  methods: {
    // 表单控件label、placeholder
    formLabel (obj, pre = '') {
      const str = `${pre}${obj.name || ''}`

      return str.replace('选择选择', '选择').replace('输入输入', '输入').replace('上传上传', '上传')
    },
    // 表单控件required
    formRequired (obj) {
      return obj.required || false
    },
    // 表单控件extra
    formExtra (obj) {
      return obj.props && obj.props.extra || ''
    },
    // 表单控件readonly
    formReadonly (obj) {
      // return obj.readonly === 1
      return obj.visibility === 1
    },
    // 表单控件defaultValue
    formDefaultValue (obj, def) {
      // 优先取model的值，然后去默认值value
      return (this.model && this.model[obj.code]) ?? obj.value ?? def ?? ''
    },
    // 格式化输入（数字、字母、汉字、手机号、身份证，不限）
    fieldFormatter (str, obj) {
      if (!obj.props || !obj.props.validate || !str) {
        return str || ''
      }

      if (obj.props.validate === 'number') { // 数字
        str = str.replace(/[^0-9.]/g, '')
      }

      if (obj.props.validate === 'letter') { // 字母
        str = str.replace(/[^a-zA-Z]/g, '')
      }

      if (obj.props.validate === 'chinese') { // 汉字
        str = str.replace(/[^\u4e00-\u9fa5]/g, '')
      }

      if (obj.props.validate === 'phone') { // 手机号
        str = str.replace(/[^0-9]/g, '')
      }

      if (obj.props.validate === 'nationalId') { // 身份证
        str = str.replace(/[^0-9xX]/g, '')
      }

      if (obj.type === 'FormMoney') { // 金额最大、最小
        const maxNum = obj.props.unit === '万元' ? 999999999.97 : 9999999999999.97
        const minNum = obj.props.unit === '万元' ? -999999999.97 : -9999999999999.97

        str = Number(str).toFixed(2)
        str = Math.min(str, maxNum)
        str = Math.max(str, minNum)

        if (obj.props.max && str > obj.props.max) {
          this.$toast(`金额不能超过${obj.props.max}${obj.props.unit}`)
          str = obj.props.max
        }
        if (obj.props.min && str < obj.props.min) {
          this.$toast(`金额不能少于${obj.props.min}${obj.props.unit}`)
          str = obj.props.min
        }
      }

      return str
    },
    // 主动获取error message
    checkInput (str, obj) {
      if (!obj.props || !obj.props.validate || !str) {
        return ''
      }

      if (obj.props.validate === 'number') { // 数字
        if (/[^0-9.]/g.test(str)) {
          return '仅允许输入数字'
        }
      }

      if (obj.props.validate === 'letter') { // 字母
        if (/[^a-zA-Z]/g.test(str)) {
          return '仅允许输入英文字母'
        }
      }

      if (obj.props.validate === 'chinese') { // 汉字
        if (/[^\u4e00-\u9fa5]/g.test(str)) {
          return '仅允许输入汉字'
        }
      }

      if (obj.props.validate === 'phone') { // 手机号
        if (/[^0-9]/g.test(str)) {
          return '请输入11位手机号码'
        }
      }

      if (obj.props.validate === 'nationalId') { // 身份证
        if (/[^0-9xX]/g.test(str)) {
          return '请输入正确的身份证号码'
        }
      }

      return ''
      // if (obj.type === 'FormMoney') { // 金额最大、最小
      //   str = Number(str).toFixed(2)
      //   obj.props.max = Math.min(obj.props.max, 9999999999999.97)
      //   obj.props.min = Math.max(obj.props.min, -9999999999999.97)
      //   if (obj.props.max && str > obj.props.max) {
      //     return `最大金额限制为${obj.props.max}`
      //   }
      //   if (obj.props.min && str < obj.props.min) {
      //     return `最小金额限制为${obj.props.min}`
      //   }
      // }
    },
    // 表单控件最大字数
    formMaxLength (obj) {
      return obj.props && obj.props.max || null
    },
    // 表单控件最少字数
    formMinLength (obj) {
      return obj.props && obj.props.min || null
    },
    // 表单控件rules
    formRules (obj, pre = '请输入', hideError) {
      const arr = []

      // 禁用状态不做校验
      // if (this.formReadonly(obj)) {
      //   return arr
      // }

      // 必填
      if (obj.required) {
        // 这里是这样，由于van-form上有show-error-message，当未输入的时候，会标红placeholder，如果这里返回message，会重复，所以这里根据hideError来决定message是否返回空
        arr.push({ required: true, message: hideError ? '' : this.formLabel(obj, pre) })
      }

      // 手机号
      if (obj.props && obj.props.validate === 'phone') {
        arr.push({ validator: validateRules.mobile, message: '请输入正确的手机号' })
      }

      // 身份证号
      if (obj.props && obj.props.validate === 'nationalId') {
        arr.push({ validator: validateRules.nationalId, message: '请输入正确的身份证号' })
      }
      // 添加 自定义 rules
      if (obj.props && obj.props.rules) {
        arr.push(...obj.props.rules)
      }

      // 最少数字、最少选项、最少上传张数
      const minFields = ['FormInput', 'FormTextArea', 'FormCheckbox', 'FormUploadImage', 'FormUploadFile']
      if (this.formMinLength(obj) && minFields.indexOf(obj.type) > -1) {
        let msg = obj.type === 'FormCheckbox' ? `最少选择${this.formMinLength(obj)}项` : `最少输入${this.formMinLength(obj)}个字符`
        msg = obj.type === 'FormUploadImage' ? `最少需要上传${this.formMinLength(obj)}张图片` : msg
        msg = obj.type === 'FormUploadFile' ? `最少需要上传${this.formMinLength(obj)}个附件` : msg
        const isArray = obj.type === 'FormUploadImage' || obj.type === 'FormUploadFile'

        arr.push({ validator: (val) => val ? this.getRealLength(val, isArray) >= this.formMinLength(obj) : true, message: msg })
      }

      return arr
    },
    // 获取长度
    getRealLength (str, isArray) {
      if (!isArray) { return str.length }

      try {
        str = JSON.parse(str)
      } catch (e) {
        str = []
      }

      return str.length
    },
    // 自定义弹出框的挂载节点，这里要放到body下，免得被外层覆盖
    getBodyContainer () {
      return window.document.body
    },
    // 数组深拷贝
    copyArray (arr) {
      return JSON.parse(JSON.stringify(arr))
    }
  }
}
