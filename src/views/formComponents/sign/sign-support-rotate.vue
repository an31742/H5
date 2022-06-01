<template>
  <div class="sign-wrap" :style="getStyle">
    <div class="btn-area">
      <!--<a class="mini-round-btn" @click="drawContext.unDo()">回退</a>-->
      <a class="mini-round-btn red" @click="clearCanvas">清空</a>
    </div>

    <div id="fw-draw-wrap">
      <canvas></canvas>
    </div>

    <div class="fw-btm-wrap btn-save">
      <van-button size="large round" type="primary" @click="saveImage">完成</van-button>
    </div>
  </div>
</template>

<script>
import Draw from './draw'
import COS from 'cos-js-sdk-v5'
import { getTecentUploadToken } from '@/api/common'

export default {
  name: 'SignComponents',
  data () {
    return {
      degree: 0,
      isCrop: false,
      canvasWrap: '',
      drawContext: null,
      orientationEvent: ''
    }
  },
  computed: {
    getStyle () {
      const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      // let length = (h - w) / 2
      let width = w
      let height = h

      switch (this.degree) {
        case -90:
          // length = -length
          width = h
          height = w
          break
        case 90:
          width = h
          height = w
          break
        default:
          // length = 0
      }

      // 重绘canvas
      // if (this.canvasWrap) {
      //   this.canvasWrap.removeChild(document.querySelector('canvas'))
      //   this.canvasWrap.appendChild(document.createElement('canvas'))
      //   this.$nextTick(() => {
      //     this.initCanvas()
      //   })
      // }

      return {
        width: `${width}px`,
        height: `${height}px`
        // transformOrigin: 'center center',
        // transform: `rotate(${this.degree}deg) translate(${length}px,${length}px)`
      }
    }
  },
  created () {
    // this.orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    // window.addEventListener(this.orientationEvent, this.handleOrientation, false)
    // this.$store.commit('common/setIgnoreLandscape', true)
  },
  beforeDestroy () {
    // this.$store.commit('common/setIgnoreLandscape', false)
    // window.removeEventListener(this.orientationEvent, this.handleOrientation)
  },
  mounted () {
    this.canvasWrap = document.querySelector('#fw-draw-wrap')
    this.$nextTick(() => {
      this.initCanvas()
    })
  },
  methods: {
    // // 监听屏幕方向
    // handleOrientation () {
    //   this.degree = window.orientation || 0
    // },

    // 初始化canvas
    initCanvas () {
      const opt = { parent: this.canvasWrap, strokeStyle: '#333', isCrop: this.isCrop }
      this.drawContext = new Draw(document.querySelector('canvas'), -this.degree, opt)
    },

    // 清空canvas
    clearCanvas () {
      this.drawContext.clear()
    },

    // 保存成图片
    saveImage () {
      if (this.drawContext.isBlank()) {
        this.$toast('请先签名')
        return
      }

      let img = this.drawContext.getPNGImage()
      img = this.drawContext.dataURLtoBlob(img)

      this.handleUpload(img)
    },

    // 上传图片
    handleUpload (file) {
      let cos = null
      const that = this
      const suffix = 'png'
      that.$store.commit('updateLoading', true)

      const startUpload = (res) => {
        cos.putObject({
          Bucket: res.bucket || 'fpms-1301854395',
          Region: res.region || 'ap-nanjing',
          Key: res.filekey,
          Body: file,
          onProgress: function (progress) {
            if (progress && progress.percent === 1) {
              that.$store.commit('updateLoading')
              const url = `${res.url}/${res.filekey}?imageMogr2/thumbnail/!50p`
              console.log('url', url)
              that.$emit('change', url)
            }
          }
        }, function (err) {
          if (err) {
            that.$store.commit('updateLoading')
            that.$toast('签名上传失败，请重试')
          }
        })
      }

      getTecentUploadToken({ suffix }).then(res => {
        res = res.data || {}
        cos = new COS({
          getAuthorization: (opt, callback) => {
            const data = {
              TmpSecretId: res.token.TmpSecretId,
              TmpSecretKey: res.token.TmpSecretKey,
              XCosSecurityToken: res.token.Token,
              StartTime: res['start_time'],
              ExpiredTime: res['expired_time']
            }
            callback(data)
          }
        })
        startUpload(res)
      }).catch(_ => {
        that.$store.commit('updateLoading')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .sign-wrap {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    .btn-area {
      text-align: center;
      height: 32px;
      padding: 16px;
      a:first-child {
        margin-right: 16px;
      }
    }
    #fw-draw-wrap {
      flex: 1;
    }
    canvas {
      cursor: crosshair;
      display: block;
    }
    .btn-save {
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }
</style>
