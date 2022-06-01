// 表单控件mixin
export default {
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
    // 表单控件readonly
    formReadonly (obj) {
      return obj.readonly === 1
    },
    // 表单控件defaultValue
    formDefaultValue (obj, def) {
      // 优先取model的值，然后去默认值value
      return (this.model && this.model[obj.code]) || obj.value || def || ''
    },
    // 表单控件rules
    formRules (obj, pre = '请输入') {
      return obj.required && !this.formReadonly(obj) ? [{ required: true, message: this.formLabel(obj, pre) }] : []
    },
    // 自定义弹出框的挂载节点，这里要放到body下，免得被外层覆盖
    getBodyContainer () {
      return window.document.body
    }
  }
}
