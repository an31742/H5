<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="date-time">
    <!--开始日期-->
    <template>
      <DateTime v-if="opt.props.showTime" :model="model" :opt="startOpt" :defaultValue.sync="defaultStart" />
      <FormSelectDate v-else :model="model" :opt="startOpt" :defaultValue.sync="defaultStart" />
    </template>
    <!--结束日期-->
    <div class="twins-picker">
      <DateTime v-if="opt.props.showTime" :model="model" :opt="endOpt" :defaultValue.sync="defaultEnd" />
      <FormSelectDate v-else :model="model" :opt="endOpt" :defaultValue.sync="defaultEnd" />
    </div>
    <!--填写说明-->
    <p v-if="formExtra(opt)" class="form-tips">
      {{ formExtra(opt) }}
    </p>
  </div>
</template>

<script>
import FormSelectDate from './common/FormSelectDate'
import FormTextView from './detail/FormTextView'
import { deepClone } from '@/utils/index'
import DateTime from './common/DateTime'
import mixin from './mixin'

// todo 开始时间不能大于结束时间的校验
export default {
  name: 'FormRangePicker',
  components: { FormSelectDate, DateTime, FormTextView },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultStart: '',
      defaultEnd: '',
      desc: [],
      times: []
    }
  },
  created () {
    const ext = this.opt.props.showTime ? '时间' : '日期'
    const so = { code: `${this.opt.code}_start_time`, name: `开始${ext}` }
    const eo = { code: `${this.opt.code}_end_time`, name: `结束${ext}` }

    // 拆分俩组件
    this.startOpt = Object.assign(deepClone(this.opt), so)
    this.endOpt = Object.assign(deepClone(this.opt), eo)

    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const def = this.formDefaultValue(this.opt)

      this.defaultStart = def[0] || ''
      this.defaultEnd = def[1] || ''
    }

    this.setWatch()
  },
  methods: {
    // 监听两个字段值的改变，设置总的desc
    setWatch () {
      this.$watch(`model.${this.startOpt.code}`, (val) => {
        this.desc[0] = val
        this.times[0] = val
        this.$set(this.model, this.opt.code + '_desc', this.desc.join(' ~ '))
      })

      this.$watch(`model.${this.endOpt.code}`, (val) => {
        this.desc[1] = val
        this.times[1] = val
        this.$set(this.model, this.opt.code + '_desc', this.desc.join(' ~ '))
        this.$set(this.model, this.opt.code, this.times)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .twins-picker {
    margin-top: -12px;
  }
</style>
