<template>
  <div>
    <van-field
      v-model="model[opt.code + ext]"
      clickable
      :name="opt.code + ext"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="dateName"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="selectRelatedDate"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择日期弹层-->
    <SelectDate
      ref="sd"
      :timeFormat="timeFormat"
      :calendarType="calendarType"
      :defaultValue="defaultValue"
      :minDate="new Date('1970-01-01')"
      @confirm="selectDate"
    >
    </SelectDate>
  </div>
</template>

<script>
import mixin from '../mixin'
import SelectDate from './SelectDate'
import moment from 'moment'

export default {
  name: 'FormSelectDate',
  components: { SelectDate },
  mixins: [mixin],
  props: {
    calendarType: {
      type: String,
      default: () => 'single'
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    timeFormat: {
      type: String,
      default: () => 'YYYY-MM-DD'
    },
    defaultValue: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      dateName: ''
    }
  },
  computed: {
    ext () {
      return this.calendarType === 'range' ? '_start_date' : ''
    }
  },
  methods: {
    // 选择日期弹框
    selectRelatedDate () {
      this.$refs.sd.show()
    },
    // 选择日期
    selectDate (res) {
      if (!res) { return }

      this.dateName = res.str
      // 日期范围
      if (res.arr && res.arr.length) {
        this.$set(this.model, this.opt.code + '_start_date', res.arr[0])
        this.$set(this.model, this.opt.code + '_end_date', res.arr[1])
        this.$set(this.model, this.opt.code + '_desc', this.dateName)
      } else {
        /// 特定值格式化
        if (this.opt.props.valueFormat) {
          res.value = moment(res.value).format(this.opt.props.valueFormat)
        }

        // 转化为标准时间格式 iso8601
        this.$set(this.model, this.opt.code, moment(res.value).format())
        this.$set(this.model, this.opt.code + '_desc', moment(res.value).format(this.timeFormat))
      }
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../common.less";
</style>
