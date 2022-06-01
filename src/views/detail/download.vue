<template>
  <div class="download-wrap">
    <img :src="require('assets/image/jumpView.png')" >
    <p style="paddingTop:20px;color:#DAAC82" @click="back">返回</p>
  </div>
</template>

<script>

export default {
  name: 'Download',
  data () {
    return {
      url: null
    }
  },
  created () {
    this.url = this.$route.query.url
    this.download()
  },

  methods: {
    is_weixin () {
      const ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    download () {
      const isWeixin = this.is_weixin()
      if (!isWeixin) {
        var downloadElement = document.createElement('a')
        downloadElement.href = this.url
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
      }
    },
    back () {
      history.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.download-wrap {
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: auto;

  p {
    margin-top: 20px;
    cursor: pointer;
    float: left;
    width: 100%;
  }

  img {
    width: 60%;
    float: right;
    margin-right: 22px;
  }

}
</style>
