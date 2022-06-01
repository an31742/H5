<template>
  <van-button class="verify-btn" size="mini" type="info" :disabled="!!codeRestTime || btnDisabled" @click="btnClick">
    {{ codeRestTime ? `${codeRestTime}S` : '获取验证码' }}
  </van-button>
</template>
<script>

export default {
  name: 'VerifyCodeBtn',
  components: {},
  props: {
    btnMsg: {
      type: String,
      default: '获取验证码'
    },
    btnDisabled: {
      type: Boolean,
      default: () => false
    },
    restTime: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      codeRestTime: 0
    }
  },
  methods: {
    btnClick () {
      this.codeRestTime = this.restTime
      let timer = setInterval(() => {
        --this.codeRestTime
        if (!this.codeRestTime) {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
      this.$emit('sendVerifyCode')
    }
  }
}
</script>
<style lang="scss" scoped>
.verify-btn{
    padding: 0 5px;
    background: #fff;
    border: #fff;
    color: #1890ff;
    font-size: 0.373rem;
  }
</style>
