<template>
  <van-overlay :show="visible" class="my-overlay">
    <div class="result tc">
      <svg-icon icon-class="done" />
      <p class="tc">{{ msg }}（{{ times }}s）</p>
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: 'Done',
  props: {
    count: {
      type: Number,
      default: 3
    },
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      times: 3,
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true
      this.countDown()
    },
    countDown () {
      if (this.times <= 0) {
        this.$emit('over')
        this.visible = false
        return
      }

      setTimeout(() => {
        this.times--
        this.countDown()
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  .result {
    background: transparent;
    .svg-icon { font-size: 76px;margin: 130px 0 33px; }
    p { font-size:18px;font-family:PingFangSC-Regular,PingFang SC;color:inherit; }
  }
</style>
