<template>
  <div style="text-align: left;">
    <van-field
      v-model="model[opt.code]"
      clickable
      class="fw-field bdn"
      input-align="right"
      right-icon="https://fpms-1301854395.cos.ap-nanjing.myqcloud.com/pubsrv/2022414/d3cf2218-bbe0-11ec-b2fc-520afd044085.png"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :placeholder="formLabel(opt, '请输入')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请输入')"
      @input="handleInput"
      @click-right-icon="scanQrCode"
    >
    </van-field>
  </div>
</template>

<script>
import mixin from './mixin'
import wx from 'weixin-js-sdk'
import { isApp } from 'utils'
import { getDeviceQrcode } from '@/api/device'

export default {
  name: 'FwInpuQrcode',
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    handleInput (val) {
      this.$set(this.model, this.opt.code + '_desc', val)
    },
    // 扫码
    scanQrCode () {
      console.log(1211221)
      let that = this
      if (isApp()) {
        this.nativeScanQRcode((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }
          setTimeout(() => {
            if (res) {
              that.getDeviceInfo(res.str)
            } else {
              this.$toast('请扫描二维码')
            }
          }, 1000)
        })
      } else {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'],
          success: (res) => {
            // https://developers.weixin.qq.com/community/develop/doc/00040aa59e828087e59a70e2b51c00
            setTimeout(() => {
              if (res) {
                that.getDeviceInfo(res.resultStr)
              } else {
                this.$toast('请扫描二维码')
              }
            }, 1000)
          },
          error: () => {
            this.$toast('扫码失败')
          }
        })
      }
    },
    // 设备信息
    getDeviceInfo (qrcode) {
      getDeviceQrcode({
        qrcode: qrcode.replace('-{device}', '')
      }).then(res => {
        if (res.code === 200) {
          this.$set(this.model, this.opt.code, res.data.code)
          this.$set(this.model, this.opt.code + '_desc', res.data.code)

          this.$set(this.model, this.opt.originalCode + '_name', res.data.name)
          this.$set(this.model, this.opt.originalCode + '_name_desc', res.data.name)

          this.$set(this.model, this.opt.originalCode + '_location_name', res.data.location_name)
          this.$set(this.model, this.opt.originalCode + '_location_name_desc', res.data.location_name)
        } else {
          this.$toast(res.msg || '获取设备信息失败')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep {
    .van-field {
      .van-field__control {
        line-height: inherit !important;
      }
    }
  }
</style>
