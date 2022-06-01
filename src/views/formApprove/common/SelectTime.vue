<template>
  <van-datetime-picker
    v-model="currentTime"
    title="选择时间"
    type="time"
    :filter="filter"
    :formatter="formatter"
    :min-hour="minHour"
    :min-minute="minMinute"
    :max-hour="maxHour"
    :max-minute="maxMinute"
    @cancel="cancelSelect"
    @change="changeSelect"
    @confirm="selectTime"
  ></van-datetime-picker>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SelectTime',
  props: {
    timeSpace: {
      type: Number,
      default: () => 15
    },
    timeType: {
      type: String,
      default: () => 'single'
    },
    minTime: {
      type: String,
      default: () => '0:0'
    },
    maxTime: {
      type: String,
      default: () => '23:59'
    },
    defaultValue: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      currentTime: '',
      currentHighlight: this.minTime.split(':').map(t => parseInt(t))
    }
  },
  computed: {
    minHour () {
      const [h] = this.minTime.split(':')
      return parseInt(h)
    },
    minMinute () {
      const [curHour] = this.currentHighlight
      if (curHour === this.minHour) {
        return parseInt(this.minTime.split(':')[1])
      }
      return 0
    },
    maxHour () {
      const [h] = this.maxTime.split(':')
      return parseInt(h)
    },
    maxMinute () {
      const [curHour] = this.currentHighlight
      if (curHour === this.maxHour) {
        return parseInt(this.maxTime.split(':')[1])
      }
      return 59
    }
  },
  created () {
    // 填充默认值
    if (this.defaultValue) {
      this.currentTime = moment(this.defaultValue).format('HH:mm')
    }
  },
  methods: {
    // 时间格式化
    formatter (type, val) {
      if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }

      return val
    },
    // 时间选择筛选
    filter (type, options) {
      return type === 'minute' ? options.filter((option) => option % this.timeSpace === 0) : options
    },
    // 时间选择
    changeSelect (sel) {
      const arr = sel.getValues()

      this.currentHighlight = arr.map(item => parseInt(item))
    },
    // 取消选择
    cancelSelect () {
      this.$emit('cancel')
    },
    // 选择日期
    selectTime (time, popupTimeShow = false) {
      const str = `${time}`
      this.$emit('confirm', { str, popupTimeShow })
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "../common.less";
</style>
