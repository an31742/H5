<template>
  <van-picker
    title="选择时间"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
  />
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
    optProps: {
      type: Object,
      default: () => {
        return {
          particle: 15,
          range: 'all_day',
          overtime: 0
        }
      }
    },
    dateStr: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
    officeTimeConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  computed: {
    columns () {
      return this.getOptions()
    },
    date () {
      return moment(this.dateStr)
    },
    currentDate () {
      return this.date.format('YYYYMMDD')
    },
    workTimeList () {
      return this.officeTimeConfig[this.currentDate]
    },
    allWorktimeList () {
      let allWorktimeList = []
      for (let i = 0; i < this.workTimeList.length; i++) {
        const workTimeItem = this.workTimeList[i]
        const worktimeList = this.formatWorkTimeOption(workTimeItem)
        allWorktimeList = allWorktimeList.concat(worktimeList)
      }
      return allWorktimeList
    }
  },
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onChange () {},
    onConfirm (result) {
      if (result && !result.disabled) {
        const arr = result.text.split('~')
        const str = arr.join(' ~ ')
        this.$emit('confirm', { arr, str })
      }
    },

    getOptionDisabled (start) {
      // overtime决定了把时间往前推多久
      const current = moment().subtract(this.optProps.overtime || 0, 'minutes')
      const startHour = start.split(':')[0]
      const startMin = start.split(':')[1]

      if (moment({ years: this.date.year(), months: this.date.month(), date: this.date.date(), hour: startHour, minute: startMin }) > current) {
        return false
      } else {
        return true
      }
    },

    formatWorkTimeOption (worktimeArr) {
      const result = []

      const startHm = worktimeArr[0]
      const endHm = worktimeArr[1]

      let startTime = moment(`${this.date.format('YYYY-MM-DD')} ${startHm}`)
      const endTime = moment(`${this.date.format('YYYY-MM-DD')} ${endHm}`)

      let particle = 15
      if (this.optProps && this.optProps.particle) {
        particle = this.optProps.particle
      }

      while (startTime < endTime) {
        const tempStart = startTime.format('HH:mm')
        startTime = startTime.add(particle, 'minutes')
        const tempEnd = startTime < endTime ? startTime.format('HH:mm') : endTime.format('HH:mm')
        result.push({
          label: `${tempStart}~${tempEnd}`,
          start: tempStart,
          end: tempEnd
        })
      }
      return result
    },

    getOptions () {
      // 获取选项
      const options = []
      this.allWorktimeList.map((item, idx) => {
        options.push({
          text: item.label,
          disabled: this.getOptionDisabled(item.start)
        })
      })
      return options
    }
  }
}
</script>
