<template>
  <div class="remarkText">

    <iframe
      v-if="!visibility"
      :src="src"
      frameborder="0"
      width="100%"
      height="300"
      ref="iframe"
      @load="onLoad"
    >
    </iframe>
    <span v-else>
      更多审批详情，请到PC端后台“物业管理平台”查看
    </span>
  </div>
</template>

<script>
import { IFrameUrlMap as _UrlMap } from '@/utils/const'
export default {
  name: 'FormIFrame',
  components: {
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    },
    formRef: {
      type: Object,
      default () {
        return null
      }
    },
    formRules: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      src: '',
      count: 0,
      visibility: false // 是否展示iframe
    }
  },
  created () {
    if (this?.opt?.props?.key) {
      // eslint-disable-next-line prefer-const
      let [url, queryStr] = _UrlMap[ this.opt.props.key ] || []

      if (!url) {
        console.error('未找到映射key', this.opt.props.key)
        this.visibility = true
      } else {
        this.visibility = false
      }
      // 取frontFormLabels 中的数据
      if (this.model[this.opt.code]) {
        queryStr = this.model[this.opt.code]
      }
      // 临时添加pageType，用来区分审批详情页面嵌入iframe
      this.src = `${url}?${queryStr}&pageType=2`
    }
  },
  mounted () {
    if (this.src) {
      this.setIframeHeight()
    }
  },
  methods: {
    setIframeHeight (id) {
      try {
        const { scrollHeight, scrollWidth } = this.$refs.iframe.contentDocument?.querySelector('#app') || { scrollHeight: 0, scrollWidth: 0 }
        this.$refs.iframe.height = scrollHeight || 300 + 20
        this.$refs.iframe.width = scrollWidth || '100%'
      } catch (e) {
        console.error(e)
      }
      this.count++
      // 重复10次保证加载完成
      if (this.count < 10) {
        this._timer = setTimeout(() => {
          this.setIframeHeight()
        }, 500)
      }
    },

    onLoad () {
      this.setIframeHeight()
      const { scrollWidth: frameScrollFWidth
      // scrollHeight: frameScrollHeight
      } = this.$refs.iframe
      // console.log('onload this.$refs.iframe w+h', frameScrollFWidth, frameScrollHeight, this.src)
      this.$refs.iframe.width = frameScrollFWidth
      this.setIframeHeight()
    }
  },
  destroyed () {
    if (this._timer) {
      clearTimeout(this._timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.remarkText{
    margin: 10px;
    font-size: 14px;
    color: #666666;
    text-align: center;
}
</style>
