<template>
  <van-datetime-picker
    title="选择时间"
    type="time"
    :filter="filter"
    :formatter="formatter"
    :min-hour="minHour"
    :min-minute="minMinute"
    @cancel="cancelSelect"
    @change="changeSelect"
    @confirm="selectTime"
  ></van-datetime-picker>
</template>

<script>
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
    }
  },
  data () {
    return {
      currentHighlight: [
        parseInt(this.minTime.split(':')[0]),
        parseInt(this.minTime.split(':')[1])
      ]
    }
  },
  computed: {
    minHour () {
      return parseInt(this.minTime.split(':')[0])
    },
    minMinute () {
      return this.currentHighlight[0] === parseInt(this.minTime.split(':')[0]) ? parseInt(this.minTime.split(':')[1]) : 0
    }
  },
  methods: {
    // 时间格式化
    formatter (type, val) {
      if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        if (this.timeType === 'range' && this.timeSpace > 1) {
          const last = +val + this.timeSpace
          val = `${val} ~ ${last === 60 ? 59 : last}`
        }

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
    selectTime (time) {
      if (this.timeType === 'range' && this.timeSpace > 1) {
        const hour = time.split(':')[0]
        let minute = +time.split(':')[1]
        let lastMinute = this.timeSpace + minute
        lastMinute = lastMinute === 60 ? 59 : lastMinute

        minute = minute < 10 ? '0' + minute : minute
        lastMinute = lastMinute < 10 ? '0' + lastMinute : lastMinute

        const arr = [`${hour}:${minute}:00`, `${hour}:${lastMinute}:00`]
        const str = arr.join(' ~ ')
        this.$emit('confirm', { arr, str })
      } else {
        const str = `${time}:00`
        this.$emit('confirm', { str })
      }
    }
  }
}
</script>
