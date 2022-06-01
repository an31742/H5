<template>
  <van-steps :active="active">
    <van-step v-for="(item, index) in steps" :key="index">{{ item.title }}</van-step>
  </van-steps>
</template>

<script>
export default {
  name: 'StepComponent',
  props: {
    startTime: {
      type: [Date, String],
      default: () => new Date()
    },
    totalHours: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      active: 1,
      steps: []
    }
  },
  created () {
    this.getSteps()
  },
  methods: {
    getSteps () {
      this.steps.push({ title: 0 })
      const now = new Date().getTime()
      const endTime = new Date(this.startTime).getTime() + this.totalHours * 60 * 60 * 1000
      if (endTime > now) { // 未超时
        const hours = (endTime - now) / 1000 / 60 / 60
        this.steps.push({ title: hours.toFixed(2) + '小时' })
      }
      this.steps.push({ title: this.totalHours + '小时' })
    }
  }
}
</script>
