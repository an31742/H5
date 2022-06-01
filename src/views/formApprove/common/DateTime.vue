<template>
  <div>
    <van-field
      v-model="model[opt.code]"
      clickable
      :name="opt.code"
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
          v-model="dateTimeStr"
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
      calendarType="single"
      :defaultValue.sync="defaultValue"
      :minDate="minDate"
      :maxDate="maxDate"
      @confirm="selectDate"
    >
    </SelectDate>

    <!--选择时间弹层-->
    <van-popup v-model="popupTimeShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <SelectTime
        timeType="single"
        :timeSpace="timeSpace"
        :defaultValue.sync="defaultValue"
        :minTime="minTime"
        :maxTime="maxTime"
        @confirm="selectTime"
        @cancel="popupTimeShow=false"
      ></SelectTime>
    </van-popup>
  </div>
</template>

<script>
import SelectTime from './SelectTime'
import SelectDate from './SelectDate'
import mixin from '../mixin'
import moment from 'moment'
export default {
  name: 'DateTime',
  components: { SelectTime, SelectDate },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    minDateTime: { // 最小可选择的时间
      type: Date,
      default: () => null
    }
  },
  data () {
    return {
      dateStr: '',
      dateTimeStr: '',
      popupTimeShow: false,
      timeSpace: 1,
      defaultValue: null
    }
  },
  computed: {
    showTime () {
      // 是否显示 时间格式
      return this.opt.props.showTime
    },
    format () {
      if (this.showTime) {
        if (this.opt.props.showTimeFormat) {
          return this.opt.props.showTimeFormat
        }
        return 'YYYY-MM-DD HH:mm'
      }
      if (this.opt.props.format) {
        return this.opt.props.format
      }

      return 'YYYY-MM-DD'
    },
    minDate () {
      return moment(this.opt.props.min || new Date('1970-01-01')).toDate()
    },
    maxDate () {
      return moment(this.opt.props.max || new Date('2100-01-01')).toDate()
    },
    minTime () {
      if (this.opt.props.max) {
        const dt = moment(this.opt.props.min)
        if (dt.format('YYYY-MM-DD') === this.dateStr) {
          return dt.format('HH:mm')
        }
      }
      return '00:00'
    },
    maxTime () {
      if (this.opt.props.max) {
        const dt = moment(this.opt.props.max)
        if (dt.format('YYYY-MM-DD') === this.dateStr) {
          return dt.format('HH:mm')
        }
      }
      return '23:59'
    }
  },
  watch: {
    defaultValue (val) {
      this.dateTimeStr = val
    }
  },
  created () {
    // 存在 分钟间隔 00 15 30 45
    if (this.opt.props.minuteStep > 1) {
      this.timeSpace = this.opt.props.minuteStep
    }
    // 回填的情况
    if (this.model[this.opt.code + '_desc']) {
      this.defaultValue = this.model[this.opt.code + '_desc']
    } else if (this.opt.props.current) {
      // 指定当前时间
      const val = moment()
      // 存在 分钟 间隔 默认从 0开始
      if (this.showTime && this.timeSpace > 1) {
        val.minutes(0)
      }
      this.setValue(val)
      this.defaultValue = val.format(this.format)
    } else if (this.opt.value) {
      // 指定默认值的
      const val = moment(this.opt.value)
      this.setValue(val)
      this.defaultValue = val.format(this.format)
    }

    this.$watch(`model.${this.opt.code}`, (val) => {
      if (!val) {
        this.defaultValue = ''
        this.setValue(null)
      } else {
        const date = moment(val)
        // 存在 分钟 间隔 默认从 0开始
        if (this.showTime && this.timeSpace > 1) {
          date.minutes(0)
        }
        this.setValue(date)
        this.defaultValue = date.format(this.format)
      }
    })
  },
  methods: {
    // 选择日期弹框
    selectRelatedDate () {
      this.$refs.sd.show()
    },
    // 选择日期
    selectDate (res) {
      if (!res) { return }

      if (this.showTime) {
        // 显示时间选择
        this.dateStr = res.str
        this.popupTimeShow = true
        this.$set(this, 'popupTimeShow', true)
      } else {
        // 日期赋值
        this.dateTimeStr = res.str
        const val = moment(res.value).format(this.opt.props.valueFormat)
        this.setValue(val)
      }
    },
    // 选择时间
    selectTime (res) {
      if (!res) { return }
      this.$nextTick(() => {
        this.popupTimeShow = res.popupTimeShow
      })
      this.dateTimeStr = `${this.dateStr} ${res.str}`

      // 时间格式
      if (this.opt.props.showTime && this.opt.props.showTimeFormat) {
        this.dateTimeStr = moment(this.dateTimeStr).format(this.opt.props.showTimeFormat)
      }
      // 标准时间格式iso8601
      const val = moment(this.dateTimeStr)
      this.setValue(val)
    },
    // 设置值
    setValue (val) {
      const desc = val ? moment(val).format(this.format) : ''
      val = desc ? moment(desc) : null
      // 接口值指定格式化
      if (val &&
          !this.showTime &&
          this.opt.props.valueFormat) {
        val = moment(moment(val).format(this.opt.props.valueFormat))
      }

      this.$emit('change', val, desc)
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../common.less";
</style>
