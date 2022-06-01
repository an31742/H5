<template>
  <div>
    <van-form ref="form" validate-first scroll-to-error>
      <fc ref="fc" :model="formModel" :options.sync="options" />
    </van-form>
  </div>
</template>

<script>
import fc from './index'

// 注意：不能在van-from上加上 :show-error-message="false" ，因为有些校验需要提示具体的错误信息，比如'请输入正确的手机号'
export default {
  name: 'FromComponentsPreview',
  components: { fc },
  data () {
    return {
      formModel: {},
      options: []
    }
  },
  created () {
    window.addEventListener('message', this.handleMessage)
  },
  destroyed () {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    // 获取配置项
    handleMessage (e) {
      console.log('handleMessagehandleMessage', e.data.action)
      if (e.data && e.data.action && e.data.action === 'preview') {
        this.options = e.data.list
      }
    }
  }
}
</script>
