<template>
  <div @click.stop>
    <van-field
      readonly
      class="select-time"
      label="计划通行日期"
      name="pass_time"
      placeholder="请选择"
      right-icon="arrow"
      input-align="right"
      :error="false"
      :value="value"
      @click="onSelect"
    >
      <template #input>
        <div>
          <span v-if="value">{{ value }}</span>
          <span v-else style="color: #CDCDCD;">请选择</span>
        </div>
      </template>
    </van-field>
    <van-calendar v-model="showCalendar" @confirm="onConfirm" />
  </div>
</template>

<script>
export default {
  name: 'SelectTime',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    passTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: 0,
      showCalendar: false
    }
  },
  watch: {
    passTime: {
      handler (val) {
        if (!val) return
        const date = new Date(val)
        this.value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      },
      immediate: true
    }
  },
  computed: {
    passTimeText () {
      if (!this.passTime) return
      const date = new Date(this.passTime)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  },
  methods: {
    onSelect () {
      !this.disabled && (this.showCalendar = true)
    },
    validator () {
      return !!this.value
    },
    onConfirm (date) {
      this.value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.changeShowStatus()
    },
    changeShowStatus () {
      this.showCalendar = !this.showCalendar
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-time {
    border-bottom: 1px solid #eeeeee;
  }
</style>
