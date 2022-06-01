<template>
  <div v-if="!loading" class="facility">
    <div class="facility-header">
      <p class="facility-back facility-flex">
        <svg-icon icon-class="arrow-left-back" style="font-size:14px;"></svg-icon>
        <span @click="$router.back()">返回</span>
      </p>
      <p><span class="facility-now">{{ facilityNow + 1 }}</span><span class="facility-total">/{{ facilityTotal }}</span></p>
    </div>
    <div v-if="taskInfo.checkin_scan_code && !hasCheckQrcode" class="facility-content">
      <div class="facility-content-header">
        <p class="facility-name">{{ deviceInfo.name }}</p>
        <p class="facility-location facility-flex">
          <svg-icon icon-class="location-blue" style="font-size:19px;"></svg-icon>
          <span class="facility-text">{{ deviceInfo.location_name }}</span>
        </p>
      </div>
      <div v-if="!recordPictures.length" class="default-wrap">
        <img class="facility-image-default" :src="require('@/assets/image/default_record.png')" />
      </div>
      <template v-else-if="recordPictures.length === 1">
        <div class="facility-image">
          <img :src="recordPictures[0]" />
        </div>
      </template>
      <template v-else>
        <div class="facility-image">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in recordPictures" :key="index">
              <img v-lazy="image" />
            </van-swipe-item>
          </van-swipe>
        </div>
      </template>
      <p v-if="taskInfo.enable_checkin && deviceInfo.qrcode_broken !== 1 " class="facility-tips facility-flex">
        <span class="facility-text">二维码损毁？</span>
        <span class="facility-light" @click="toLadingBill">去提单</span>
      </p>
    </div>
    <div v-if="taskInfo.checkin_photo && hasCheckQrcode" class="facility-content-p">
      <p class="facility-name-p">{{ deviceInfo.name }}</p>
      <!-- 模拟设备占位 -->
      <div class="facility-image-p">
        <img :src="require('@/assets/image/default_sequence.png')"/>
      </div>
    </div>
    <div class="facility-button">
      <!--未开启签到-->
      <van-button
        v-if="!taskInfo.checkin_scan_code && !taskInfo.checkin_photo"
        style="font-size:18px;height:40px;"
        round
        block
        type="primary"
        color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="goEdit"
      >
        处理
      </van-button>

      <!--开启签到-->
      <template v-else>
        <!--扫码签到-->
        <van-button
          v-if="taskInfo.checkin_scan_code && !hasCheckQrcode"
          style="font-size:18px;height:40px;"
          round
          block
          type="primary"
          color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          @click="buttonTap"
        >
          {{ taskInfo.enable_checkin && deviceInfo.qrcode_broken !== 1 ? '扫码签到' : '处理' }}
        </van-button>

        <!--拍照签到-->
        <upload
          v-if="taskInfo.checkin_photo && hasCheckQrcode"
          ref="upload"
          :max="1"
          :hideTips="true"
          uploadStyle="padding: 0"
          capture="camera"
          @change="(list) => { changeFiles(list) }"
          @loading="uploading"
        >
          <slot>
            <van-button
              style="font-size:18px;height:40px;"
              round
              block
              type="primary"
              color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
            >
              拍照签到
            </van-button>
          </slot>

          <template #preview-cover="{ item }">
            <van-button
              ref="aaa"
              style="font-size:18px;height:40px;"
              round
              block
              type="primary"
              color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
            >
              拍照签到
            </van-button>
          </template>
        </upload>
      </template>
    </div>
    <van-overlay :show="pageLoading">
      <div class="wrapper">
        <van-loading/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { minipDeviceTaskInfo, minipDeviceRecordGet } from '@/api/task'
import { WorkOrderSource, WorkOrderType } from '@/utils/const'
import { isApp } from '@/utils/index'
import upload from '@/views/components/upload_form'
import wx from 'weixin-js-sdk'

export default {
  name: 'PlanFacility',
  components: {
    upload
  },
  data () {
    return {
      recordId: '',
      deviceId: '',
      taskId: '',
      taskInfo: null,
      facilityNow: 0, // 当前设备
      facilityTotal: 0, // 设备总数
      deviceInfo: null,
      loading: true,
      hasCheckQrcode: false, // 是否已经扫码签到
      recordPictures: [],
      pageLoading: false
    }
  },
  mounted () {
    this.taskId = this.$route.query.id || ''
    this.recordId = this.$route.query.orderId || ''
    this.deviceId = this.$route.query.device_id || ''
    this.init()
  },
  methods: {
    init () {
      this.loadding = true
      // 任务详情
      let params = {
        id: this.taskId
      }
      if (this.recordId) {
        params = { work_order_record_id: this.recordId }
      }

      minipDeviceTaskInfo(params).then(res => {
        if (res.code === 200) {
          this.taskInfo = res.data || {}
          const { devices = [] } = this.taskInfo.eng_group || {}
          this.facilityNow = this.taskNowInd(devices)
          this.facilityTotal = devices.length
          this.hasCheckQrcode = this.taskInfo.checkin_scan_code !== 1
          this.recordGet()
        } else {
          this.loading = false
          this.$toast(res.msg)
        }
      })
    },
    // 当前设备下标
    taskNowInd (arr) {
      arr = arr || []
      let ind = arr.length - 1
      const ids = arr.map(ite => ite.id)

      if (this.deviceId) {
        return ids.indexOf(+this.deviceId)
      } else {
        this.deviceId = arr[arr.length - 1].id
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].commit_id) {
            this.deviceId = arr[i].id
            ind = i
            break
          }
        }
        return ind
      }
    },
    // 设备详情
    recordGet () {
      minipDeviceRecordGet({ id: this.deviceId }).then(res => {
        if (res.code === 200) {
          this.deviceInfo = res.data
          this.recordPictures = res.data.pictures ? res.data.pictures.split(',') : []
        } else {
          this.$toast(res.msg)
        }
        this.loading = false
      })
    },
    // 调用APP扫码
    facilityNativeScanQRcode (cb) {
      this.setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('scanQRcode', (data) => {
          console.log('scanQRcode', data)
          cb && cb(data)
        })
      })
    },
    // 底部按钮
    buttonTap () {
      if (this.taskInfo.enable_checkin && this.deviceInfo.qrcode_broken !== 1) {
        const qc = this.deviceInfo.qrcode
        if (isApp()) {
          this.facilityNativeScanQRcode((res) => {
            if (res.error) {
              this.$toast(res.error)
              return
            }

            setTimeout(() => {
              if (res && res.str.replace('-{device}', '') === qc) {
                this.scanSuccess()
              } else {
                this.$toast('请扫描本设备的二维码')
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
                if (res && res.resultStr.replace('-{device}', '') === qc) {
                  this.$toast('签到成功')
                  this.scanSuccess()
                } else {
                  this.$toast('请扫描本设备的二维码')
                }
              }, 1000)
            },
            error: () => {
              this.$toast('扫码失败')
            }
          })
        }
      } else {
        // 二维码损毁
        this.hasCheckQrcode = true
        // 如果未开启拍照签到，则直接跳转
        if (!this.taskInfo.checkin_photo) {
          this.goEdit()
        }
      }
    },
    // 图片上传状态
    uploading (flag) {
      if (flag) {
        this.pageLoading = true
      } else {
        setTimeout(() => {
          this.pageLoading = false
        }, 2000)
      }
    },
    // 图片上传
    changeFiles (list) {
      if (list[0] && list[0].url) {
        this.goEdit({ image: list[0].orgUrl })
      }
    },
    // 去提交
    goEdit (params = {}) {
      this.$router.replace({
        name: 'DevicePlanEdit',
        query: {
          ...params,
          id: this.taskId || this.taskInfo.id,
          device_id: +this.deviceId
        }
      })
    },
    // 去提单
    toLadingBill () {
      const source = WorkOrderSource.deviceError
      this.$router.push({
        name: 'WorkBrokenReport',
        query: {
          source: source, deviceId: this.deviceId, taskId: this.taskInfo.id, type: WorkOrderType.qrcode, groupId: this.taskInfo.belong_group_id
        }
      })
    },
    // 扫码成功
    scanSuccess () {
      this.$toast('扫码签到成功')
      this.hasCheckQrcode = true
      // 如果未开启拍照签到，则直接跳转
      if (!this.taskInfo.checkin_photo) {
        this.goEdit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.facility {
  background: #F6F8FA;
  ::v-deep .facility-button {
    .van-uploader {
      width: 100%;
    }
    .van-uploader__input-wrapper {
      width: 100%;
    }
  }
  &-header {
    background: #fff;
    padding: 10px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-flex {
    display: flex;
    align-items: center;
  }

  &-back, &-now, &-total {
    font-size: 15px;
    color: #333;
    line-height: 22px;
    font-weight: 400;
  }

  &-now {
    color: #6A98FF;
  }

  &-total {
    color: #999999;
  }

  &-content {
    min-height: calc(100vh - 126px);
    background: #fff;
    margin: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;

    &-header {
      max-width: 276px;
      text-align: center;
    }
  }
  &-content-p {
    min-height: calc(100vh - 126px);
    background: #fff;
    margin: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  &-name-p {
    font-size: 18px;
    color: #333;
    line-height: 25px;
    font-weight: 400;
    margin-bottom: 8px;
    position: absolute;
    top: 16px;
  }

  &-name {
    font-size: 18px;
    color: #333;
    line-height: 25px;
    font-weight: 400;
    margin-bottom: 8px;
  }

  &-location {
    /*margin-bottom: 24px;*/
    justify-content: center;
  }

  &-text, &-light {
    font-size: 14px;
    color: #999;
    line-height: 20px;
    font-weight: 400;
  }

  &-light {
    color: #E1AA6C;
  }

  &-image {
    width: 123px;
    height: 268px;

    img {
      width: 123px;
      height: 268px;
    }

    &-default {
      width: 215px;
      height: 268px;
      margin-left: 95px;
    }
  }
  &-image-p {
    width: 250px;
  }

  &-tips {
    margin-top: 26px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 16px); //兼容IOS < 11.2
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);//兼容IOS > 11.2
  }

  &-button {
    padding: 16px 37px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 16px); //兼容IOS < 11.2
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);//兼容IOS > 11.2
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .default-wrap {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
::v-deep {
  .van-uploader, .van-uploader__input-wrapper {
    width: 100%;
  }
  .van-uploader__preview {
    width: 100% !important;
    height: 40px !important;
    .van-uploader__mask, img, .van-uploader__preview-delete {
      display: none;
    }
  }
}
</style>
