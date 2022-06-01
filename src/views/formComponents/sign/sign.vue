<template>
  <div class="sign-wrap" :style="getStyle">
    <div class="btn-area">
      <a class="mini-round-btn red" @click="clearCanvas">清空</a>
    </div>

    <div id="fw-draw-wrap">
      <canvas></canvas>
    </div>

    <div class="btn-save">
      <a class="btn-item" @click="handleCancel">取消</a>
      <a class="btn-item confirm" @click="saveImage">完成</a>
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
      let width = w
      let height = h

      switch (this.degree) {
        case -90:
          width = h
          height = w
          break
        case 90:
          width = h
          height = w
          break
        default:
      }

      return {
        width: `${width}px`,
        height: `${height}px`
      }
    }
  },
  mounted () {
    /**
     * 由于这里目前做成了弹层，如果mounted里初始化的话，有可能还没有draw-wrap就初始化了，导致canvas的宽为0
     *  所有初始化挪到show方法里，这就需要在调用该组件的时候调用一下show方法（show方法里有判断，不会多次初始化）
     */
    // this.$nextTick(() => {
    //   this.initCanvas()
    // })
  },
  methods: {
    // 展示canvas
    show () {
      if (!this.drawContext) {
        this.$nextTick(() => {
          this.initCanvas()
        })
      } else {
        this.clearCanvas()
      }
    },

    // 初始化canvas
    initCanvas () {
      this.canvasWrap = document.querySelector('#fw-draw-wrap')
      const opt = { parent: this.canvasWrap, strokeStyle: '#333', isCrop: this.isCrop }
      this.drawContext = new Draw(document.querySelector('canvas'), -this.degree, opt)
    },

    // 清空canvas
    clearCanvas () {
      this.drawContext.clear()
    },

    // 取消签名
    handleCancel () {
      this.$emit('cancel')
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
      text-align: right;
      height: 32px;
      padding: 16px;
    }
    #fw-draw-wrap {
      flex: 1;
    }
    canvas {
      cursor: crosshair;
      display: block;
      z-index: 9999;
    }
    .btn-save {
      padding: 16px 0;
      text-align: center;
      .btn-item {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #E1AA6C;
        line-height: 25px;
        border-radius: 20px;
        border: 1px solid;
        padding: 7px 0;
        width: 141px;
        display: inline-block;
        &.confirm {
          background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
          color: #FFFFFF;
          margin-left: 18px;
        }
      }
    }
    .mini-round-btn {
      border-radius: 20px;
      border: 1px solid;
      font-size: 14px;
      font-weight: 400;
      color: #E1AA6C;
      line-height: 20px;
      padding: 6px 20px;
      display: inline-block;
      &.red {
        border-color: #FA5151;
        color: #FA5151;
        background: none;
      }
    }
  }
</style>
